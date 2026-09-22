// Photo storage for Task check-in ("foto toko bertanggal", Bab 8 gap 2).
//
// Two backends, picked automatically:
// - Vercel Blob, when BLOB_READ_WRITE_TOKEN is set -- original behavior,
//   for a Vercel deployment (or any deployment that opts into it).
// - Local disk, otherwise -- default for the VPS/Portainer deployment
//   (see DEPLOY.md / docker-compose.yml's `checkin_photos` volume), no
//   external storage account needed. Files land under
//   CHECKIN_PHOTOS_DIR (default: <repo>/uploads/checkin-photos) and are
//   served back out by server.ts's `app.use('/uploads', ...)` -- this
//   path only works when server.ts is the one running (the VPS image);
//   it is not meant to be reached from a Vercel serverless function,
//   which is why the Vercel Blob branch stays the default there via
//   BLOB_READ_WRITE_TOKEN.
//
// The frontend sends the photo as a base64 data URL inside a normal
// JSON body (matching every other route in this codebase, which all
// take/return JSON) rather than multipart/form-data -- avoids pulling
// in a form-parsing dependency for what is, for a check-in photo, a
// small enough payload.
import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB after base64 decode -- the frontend downsizes/compresses before this, so a legitimate check-in photo should be well under this.

// Exported so server.ts can mount express.static on the exact same
// directory -- one source of truth, no risk of the two drifting apart.
export const LOCAL_UPLOAD_DIR = process.env.CHECKIN_PHOTOS_DIR
  ? path.resolve(process.env.CHECKIN_PHOTOS_DIR)
  : path.join(process.cwd(), 'uploads', 'checkin-photos');

export class InvalidPhotoError extends Error {}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

async function uploadToVercelBlob(buffer: Buffer, mime: string, filename: string): Promise<string> {
  const blob = await put(`checkin-photos/${filename}`, buffer, {
    access: 'public',
    contentType: mime,
    addRandomSuffix: true,
  });
  return blob.url;
}

async function uploadToLocalDisk(buffer: Buffer, filename: string): Promise<string> {
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, filename), buffer);
  // Relative URL, served by server.ts's express.static mount -- the
  // frontend just does <img src={checkInPhotoUrl}>, same as the
  // absolute Vercel Blob URL it gets in the other branch.
  return `/uploads/checkin-photos/${filename}`;
}

/**
 * Decodes a `data:image/...;base64,....` string and uploads it either to
 * Vercel Blob (if BLOB_READ_WRITE_TOKEN is set) or local disk, returning
 * a URL the frontend can use directly in an <img src>. Throws
 * InvalidPhotoError on anything that doesn't look like a small, real
 * image data URL.
 */
export async function uploadCheckInPhoto(dataUrl: string, taskId: string): Promise<string> {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new InvalidPhotoError('Format foto tidak valid. Harus data URL image/jpeg, image/png, atau image/webp.');
  }
  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.byteLength > MAX_PHOTO_BYTES) {
    throw new InvalidPhotoError(`Ukuran foto terlalu besar (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB, maksimum 5MB).`);
  }
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${taskId}-${Date.now()}-${randomSuffix()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return uploadToVercelBlob(buffer, mime, filename);
  }
  return uploadToLocalDisk(buffer, filename);
}
