# Deploy ke VPS via Portainer — Sales CRM Onduline

Stack ini dibangun langsung di VPS dari repo Git ini (tidak perlu Docker
registry terpisah). Portainer melakukan `git clone` + `docker compose
build && up` setiap kali stack di-deploy atau di-redeploy.

## 1. File yang relevan

- `Dockerfile` — multi-stage build: `npm ci` → `prisma generate` → `vite
  build`, lalu image runtime yang menjalankan `server.ts` lewat `tsx`.
- `server.ts` — satu proses Express yang memuat semua `api/*.ts` (route
  Vercel-style) sebagai route biasa, plus menyajikan `dist/` (frontend
  hasil build Vite). Tidak dipakai oleh `vercel dev`/`vercel build` —
  hanya untuk image Docker ini.
- `docker-entrypoint.sh` — jalankan `npx prisma migrate deploy` dulu
  (menerapkan migration yang sudah ada di `prisma/migrations/`, aman
  untuk production), baru start server.
- `docker-compose.yml` — definisi stack `sales-crm-onduline`, satu
  service (`app`), port `3000` di-mapping ke host.

## 2. Environment variables yang harus diisi di Portainer

Saat membuat stack, isi bagian **Environment variables** dengan:

| Variabel | Sumber |
| --- | --- |
| `DATABASE_URL` | Connection string Neon (pooled) — sama seperti di `.env.local` repo ini |
| `DIRECT_URL` | Connection string Neon (direct/unpooled) — untuk `prisma migrate deploy` |
| `BLOB_READ_WRITE_TOKEN` | Token dari Vercel Blob store (Vercel project → Storage → Create Database → Blob). **Belum dibuat** — lihat catatan di bawah. |
| `APP_PORT` (opsional) | Port di host VPS yang di-map ke container (default `3000`) |

Jangan commit nilai-nilai ini ke Git — isi hanya lewat Portainer UI
(stack tersebut, bukan file `.env` di repo).

## 3. Bikin stack di Portainer

1. **Stacks → Add stack**
2. Nama: `sales-crm-onduline`
3. Build method: **Repository**
   - Repository URL: `https://github.com/pipi2303/Salesappv20.git`
   - Repository reference: `refs/heads/feature/unified-product-model`
   - Compose path: `docker-compose.yml`
   - Kalau repo private: isi **Authentication** dengan GitHub Personal
     Access Token (scope read-only ke repo ini)
4. Isi Environment variables (tabel di atas)
5. **GitOps updates** → aktifkan, pilih salah satu:
   - **Polling interval** (dipakai sekarang) — Portainer cek repo tiap
     interval (misal 5 menit) dan redeploy sendiri kalau ada commit
     baru. Tidak butuh GitHub Actions atau token dengan scope
     tambahan.
   - **Webhook** (opsional, instan) — kalau nanti mau redeploy langsung
     begitu push (bukan menunggu polling), buat ulang GitHub token
     dengan scope `workflow` ditambahkan, lalu file
     `.github/workflows/notify-portainer.yml` (sudah disiapkan, ada di
     riwayat git commit sebelumnya -- tinggal `git checkout` dari commit
     itu) bisa ditambahkan kembali dan disambungkan ke webhook URL yang
     Portainer tampilkan setelah stack dibuat.
6. **Deploy the stack**

## 4. Setelah deploy

- Cek log container di Portainer (`sales-crm-onduline` → Logs) untuk
  memastikan `prisma migrate deploy` sukses dan server listen di port
  3000.
- Akses lewat `http://<ip-vps>:3000` (atau domain, kalau sudah
  dikonfigurasi lewat reverse proxy Traefik/Nginx Proxy Manager yang
  sudah ada di Portainer — belum diatur di sini, tambahkan label/host
  rule terpisah sesuai reverse proxy yang dipakai).

## 5. ACTION NEEDED sebelum data check-in foto berfungsi

`BLOB_READ_WRITE_TOKEN` belum ada sama sekali (dicek: tidak ada di
`.env.local` maupun `.env`). Tanpa ini, endpoint check-in foto akan
gagal saat ada `photoDataUrl` di body request. Buat Blob store dulu di
project Vercel yang sama (Storage → Create Database → Blob), lalu
salin token-nya ke Portainer.
