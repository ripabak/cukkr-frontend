---
name: slicing-implementation
description: 'Implementasi slicing UI fase per fase untuk project cukkr-frontend. Gunakan skill ini untuk melanjutkan implementasi yang belum selesai dari track_pages_and_components.md, mengikuti deskripsi halaman dari ui-ux-pages-descriptions.md dan PNG referensi di ui-ux-pages-pngs/. One phase at a time, checklist setiap item selesai, update index.tsx untuk navigasi.'
argument-hint: 'Sebutkan fase yang ingin dikerjakan, atau kosongkan untuk lanjut ke fase berikutnya yang belum selesai.'
---

# Slicing Implementation

## Tujuan
Melanjutkan implementasi UI (slicing) secara konsisten dan terstruktur, fase demi fase, berdasarkan tracking di `docs/track_pages_and_components.md`.

## Aturan Utama
- **One phase at a time** — jangan mulai fase berikutnya sebelum fase aktif selesai dikerjakan.
- **Baca PNG hanya saat dibutuhkan** — jangan load semua gambar sekaligus. Baca hanya PNG untuk halaman/komponen yang sedang dikerjakan.
- **Checklist setiap item selesai** — segera update `[x]` di kolom `slicing_implemented` pada `docs/track_pages_and_components.md` setelah halaman/komponen selesai.
- **Update `app/index.tsx`** — setiap halaman baru yang selesai, tambahkan link navigasi ke `app/index.tsx` di bagian yang sesuai (buat section baru jika belum ada).
- **Komponen reusable boleh dikerjakan lebih dulu** — jika ada kebutuhan komponen shared sebelum halaman, kerjakan dulu, tapi tetap checklist di tracking.

## Prosedur

### Langkah 1 — Tentukan fase aktif
1. Baca `docs/track_pages_and_components.md`.
2. Cari fase pertama yang masih memiliki item dengan `slicing_implemented: []`.
3. Tampilkan ringkasan: nama fase, daftar halaman/komponen yang belum selesai.
4. Konfirmasi fase ke user (atau lanjut otomatis jika sudah eksplisit).

### Langkah 2 — Tentukan urutan pengerjaan dalam fase
Prioritaskan dalam urutan ini:
1. Komponen shared/reusable yang menjadi dependency halaman dalam fase ini.
2. Halaman yang dependensinya sudah tersedia.
3. Halaman dengan dependensi yang belum ada (buat komponen dulu).

### Langkah 3 — Implementasi satu item
Untuk setiap halaman atau komponen:
1. **Baca PNG referensi** dari kolom `lokasi_referensi_png` untuk item tersebut saja.
2. **Baca deskripsi halaman** dari `docs/ui-ux-pages-descriptions.md` jika tersedia.
3. **Periksa struktur yang sudah ada, buat jika belum** — cek file terkait di `src/features/` atau `src/components/`.
4. **Implementasikan** mengikuti pola yang sudah ada di proyek:
   - Komponen feature-specific → `src/features/<feature>/components/`
   - Screen → `src/features/<feature>/screens/`
   - Route → `app/<scope>/<page>.tsx` (tipis, hanya mount screen)
   - Komponen global reusable → `src/components/`
5. Gunakan theme file yang relevan (`auth-theme.ts`, `onboarding-theme.ts`, dst.) untuk warna dan spacing.

### Langkah 4 — Checklist dan update index
Setelah item selesai:
1. Update `docs/track_pages_and_components.md`: ubah `[]` → `[x]` di kolom `slicing_implemented`.
2. Jika halaman baru, tambahkan `Link` ke `app/index.tsx` di section fase yang sesuai.

### Langkah 5 — Lanjut atau berhenti
- Lanjutkan ke item berikutnya dalam fase yang sama.
- Setelah semua item dalam fase selesai, laporkan ringkasan ke user dan **berhenti** — jangan otomatis mulai fase berikutnya tanpa konfirmasi.

### Langkah 6 — Git commit
- Sebelum melakukan commit, pastikan check error dengan `npx tsc --noEmit` dan `npm run lint`. Lakukan perbaikan jika ada error.
- Tambahkan `git add` dan buat commit dengan pesan yang jelas, misalnya: `feat: implement slicing untuk <nama halaman/komponen>`. kemudian push ke branch origin dev.

## Referensi File
- Tracking: [docs/track_pages_and_components.md](../../../docs/track_pages_and_components.md)
- Deskripsi halaman: [docs/ui-ux-pages-descriptions.md](../../../docs/ui-ux-pages-descriptions.md)
- PNG referensi: `ui-ux-pages-pngs/` (baca per item, bukan semua sekaligus)
- Navigasi debug: [app/index.tsx](../../../app/index.tsx)
- Struktur proyek: [AGENTS.md](../../../AGENTS.md)

