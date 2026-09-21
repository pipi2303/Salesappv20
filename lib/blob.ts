// Photo storage for Task check-in ("foto toko bertanggal", Bab 8 gap 2).
// Uses Vercel Blob because this app is deployed on Vercel already --
// no new infrastructure account needed, just a Blob store attached to
// this Vercel project. See the ACTION NEEDED note in the commit this
// file was added in for what the user needs to set up.
//
// The frontend sends the photo as a base64 data URL inside a normal
// JSON body (matching every other route in this codebase, which all
// take/return JSON) rather than multipart/form-data -- avoids pulling
// in a form-parsing dependency for what is, for a check-in photo, a
// small enough payload.
import { put } from '@vercel/blob';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB after base64 decode -- the frontend downsizes/compresses before this, so a legitimate check-in photo should be well under this.

export class InvalidPhotoError extends Error {}

/**
 * Decodes a `data:image/...;base64,....` string and uploads it to Vercel
 * Blob, returning the public URL. Throws InvalidPhotoError on anything
 * that doesn't look like a small, real image data URL.
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
  const filename = `checkin-photos/${taskId}-${Date.now()}.${ext}`;

  const blob = await put(filename, buffer, {
    access: 'public',
    contentType: mime,
    addRandomSuffix: true,
  });
  return blob.url;
}
