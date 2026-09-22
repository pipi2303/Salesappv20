# Deploy ke VPS via Portainer — Sales CRM Onduline

Stack ini dideploy lewat `.github/workflows/deploy.yml`: setiap push ke
`main`, GitHub Actions build image dari `Dockerfile` di repo ini, push
image itu ke GHCR (`ghcr.io/pipi2303/salesappv20:latest`), lalu PUT isi
`docker-compose.yml` langsung ke Portainer Stacks API dengan
`RepullImageAndRedeploy: true`. Karena itu Portainer **menarik (pull)**
image dari GHCR di setiap deploy — dia TIDAK `git clone` + build sendiri
dari repo ini. `docker-compose.yml` harus mengacu ke image GHCR itu
(bukan punya blok `build:`), kalau tidak Portainer akan mencoba pull
nama image apa adanya dari Docker Hub dan gagal dengan error semacam
`pull access denied ... repository does not exist`.

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
  service (`app`), port `3000` di-mapping ke host, plus volume
  `checkin_photos` untuk foto check-in (lihat bagian 5).

## 2. Environment variables yang harus diisi di Portainer

Saat membuat stack, isi bagian **Environment variables** dengan:

| Variabel | Sumber |
| --- | --- |
| `DATABASE_URL` | Connection string Neon (pooled) — sama seperti di `.env.local` repo ini |
| `DIRECT_URL` | Connection string Neon (direct/unpooled) — untuk `prisma migrate deploy` |
| `BLOB_READ_WRITE_TOKEN` (opsional) | Kosongkan untuk pakai storage lokal di VPS (default, lihat bagian 5). Isi hanya kalau memang mau foto check-in disimpan di Vercel Blob. |
| `APP_PORT` (opsional) | Port di host VPS yang di-map ke container (default `3000`) |

Jangan commit nilai-nilai ini ke Git — isi hanya lewat Portainer UI
(stack tersebut, bukan file `.env` di repo).

## 3. Bikin stack di Portainer

1. **Stacks → Add stack**
2. Nama: `sales-crm-onduline` (harus sama persis — dipakai sebagai
   `PORTAINER_STACK_ID`/nama container)
3. Build method: **Web editor** (bukan Repository) — cukup tempel isi
   `docker-compose.yml` dari repo ini apa adanya, karena kontennya
   di-PUT ulang otomatis oleh `deploy.yml` setiap push ke `main`.
4. Isi Environment variables (tabel di atas)
5. Kalau image GHCR-nya **private**, tambahkan registry credential di
   Portainer (**Registries → Add registry**, isi GitHub username +
   Personal Access Token scope `read:packages`) supaya Portainer bisa
   `docker login ghcr.io` saat pull. Alternatif lebih simpel: ubah
   visibility package `salesappv20` di GitHub (Packages → Package
   settings → Change visibility) jadi **Public**.
6. **Deploy the stack**
7. Di GitHub repo, isi secrets **Settings → Secrets and variables →
   Actions**: `PORTAINER_URL`, `PORTAINER_TOKEN` (API key Portainer),
   `PORTAINER_STACK_ID`, `PORTAINER_ENDPOINT_ID` — dipakai oleh
   `deploy.yml` untuk redeploy stack ini di setiap push.

## 4. Setelah deploy

- Cek tab **Actions** di GitHub repo ini untuk lihat apakah workflow
  `Sales CRM CI/CD` sukses (build + push GHCR + panggil Portainer API).
- Cek log container di Portainer (`sales-crm-onduline` → Logs) untuk
  memastikan image ke-pull, `prisma migrate deploy` sukses, dan server
  listen di port 3000.
- Akses lewat `http://<ip-vps>:3000` (atau domain, kalau sudah
  dikonfigurasi lewat reverse proxy Traefik/Nginx Proxy Manager yang
  sudah ada di Portainer — belum diatur di sini, tambahkan label/host
  rule terpisah sesuai reverse proxy yang dipakai).

## 5. Foto check-in toko (Bab 8 gap 2)

Defaultnya (tanpa `BLOB_READ_WRITE_TOKEN`) foto check-in disimpan di
disk VPS sendiri, lewat volume Docker `checkin_photos` yang di-mount ke
`/app/uploads/checkin-photos` di dalam container — sudah otomatis
dibuat oleh `docker-compose.yml`, tidak perlu setup tambahan. Foto tetap
ada meskipun stack di-redeploy (`docker compose build && up`), karena
volume-nya terpisah dari container image. Kalau container-nya dihapus
total (bukan sekadar redeploy) dan tidak ada volume itu lagi, foto lama
ikut hilang — untuk backup, cukup backup volume `checkin_photos` di
VPS seperti volume Docker lainnya.

Kalau sebaliknya ingin pakai Vercel Blob (misal aplikasi ini juga masih
dideploy ke Vercel dan ingin satu tempat penyimpanan foto yang sama),
isi `BLOB_READ_WRITE_TOKEN` di Environment variables Portainer — buat
tokennya di project Vercel (Storage → Create Database → Blob). Kalau
variabel ini diisi, `lib/blob.ts` otomatis pakai Vercel Blob dan
mengabaikan storage lokal.
