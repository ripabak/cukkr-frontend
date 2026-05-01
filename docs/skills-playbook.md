# Skills Playbook — cukkr-frontend

> Panduan cepat memilih dan menggunakan skill AI agent yang tersedia di repo ini.  
> **Scan time target: < 3 menit**

---

## Daftar Skill Aktif

Skill tersedia di dua lokasi:

- `.agents/skills/` — skill agent berbasis VSCode/GitHub Copilot
- `.claude/skills/` — skill berbasis Claude/Copilot dalam chat

Skill yang sama nama di dua folder = fungsionalitas identik, pilih sesuai agent yang dipakai.

---

## Tabel Skill per Tujuan Kerja

### 🗺️ Planning

| Skill           | Use When                                                  | Input Needed                                                               | Expected Output                                                       | Trigger                                                            |
| --------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `planning-task` | Sebelum eksekusi fitur apapun; ingin rencana konkret dulu | Deskripsi fitur/task dalam bahasa natural. Tambah "multi-phase" bila besar | File `docs/plans/<name>.md` berisi step-by-step rencana siap eksekusi | `/buat-plan <deskripsi>` atau `/buat-plan <deskripsi> multi-phase` |

---

### ▶️ Execution

| Skill                   | Use When                                                                     | Input Needed                              | Expected Output                                                                       | Trigger                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `execute-plan`          | Plan sudah ada di `docs/plans/`, ingin eksekusi semua step sekaligus         | Path ke file plan: `docs/plans/<name>.md` | Semua step dieksekusi, tracking diupdate, plan ditandai DONE                          | `/eksekusi-plan docs/plans/<name>.md`                                                                      |
| `execute-plan-by-phase` | Plan multi-phase, ingin eksekusi satu fase per waktu + konfirmasi antar fase | Path ke file plan + (opsional) `phase:N`  | Satu fase dieksekusi, tracking diupdate, lanjut ke fase berikutnya setelah konfirmasi | `/eksekusi-plan-by-phase docs/plans/<name>.md` atau `/eksekusi-plan-by-phase docs/plans/<name>.md phase:2` |

---

### 🎨 Slicing (UI Visual)

| Skill                    | Use When                                                           | Input Needed                                                         | Expected Output                                                              | Trigger                                            |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `slicing-implementation` | Ada halaman/komponen di tracking dengan `slicing_implemented = []` | Nama phase atau halaman target; PNG referensi di `ui-ux-pages-pngs/` | File screen `.tsx` dan komponen baru sesuai desain visual; tracking diupdate | Pakai via `execute-plan` setelah buat plan slicing |

---

### 🖱️ UI Functional (Interaktivitas tanpa API)

| Skill                          | Use When                                                              | Input Needed                      | Expected Output                                                                                      | Trigger                                    |
| ------------------------------ | --------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `ui-functional-implementation` | Halaman sudah di-slice (visual OK), tapi tombol/nav/modal belum wired | Nama halaman atau komponen target | Navigasi, modal, tab, toggle, form behavior terhubung ke state; mock data dirender; UI test opsional | `/ui-functional <deskripsi>` atau via plan |

---

### ⚙️ Functional / API Integration

| Skill                       | Use When                                                    | Input Needed                                            | Expected Output                                                                           | Trigger                                 |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------- |
| `functional-implementation` | UI sudah interaktif, siap dihubungkan ke API endpoint nyata | Nama halaman + endpoint API yang tersedia; auth context | State management, API calls, form validation, error handling terhubung; tracking diupdate | `/functional <deskripsi>` atau via plan |

---

### 🔀 Git Workflow

| Skill              | Use When                                                                          | Input Needed                               | Expected Output                                                                        | Trigger                            |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------- |
| `git-smart-commit` | Ada banyak perubahan belum di-commit; ingin semantic commits terpisah per konteks | Working tree dengan file-file belum staged | Plan commit ditampilkan → konfirmasi → N commits terpisah per kategori → push otomatis | `/git-commit` atau `/smart-commit` |

---

### 🎭 Design Analysis

| Skill                  | Use When                                                         | Input Needed                                    | Expected Output                                                                                                                         | Trigger                          |
| ---------------------- | ---------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `describe-figma-pages` | Ada desain baru (PNG/gambar) yang belum ada deskripsinya di docs | Gambar desain (lampirkan ke chat); nama halaman | Tabel deskripsi halaman → tambahan ke `docs/ui-ux-pages-descriptions.md`; komponen baru ke `docs/component-index.md`; tracking diupdate | `/describe-figma <nama-halaman>` |

---

## Alur Kerja yang Direkomendasikan

### Skenario A: Fitur Baru dari Desain

```
1. Punya PNG desain baru?
   → /describe-figma <nama-halaman>

2. Buat plan slicing:
   → /buat-plan "slice halaman <nama>"

3. Eksekusi:
   → /eksekusi-plan docs/plans/<name>.md

4. Tambah interaktivitas:
   → /buat-plan "ui functional halaman <nama>"
   → /eksekusi-plan docs/plans/<name>.md

5. Commit bersih:
   → /git-commit
```

---

### Skenario B: Lanjut Halaman yang Belum Selesai

```
1. Buka docs/track_pages_and_components.md
2. Cari baris dengan slicing_implemented = [] atau ui_functional_implemented = []
3. Pilih skill sesuai kolom yang kosong:
   - slicing_implemented = []  → slicing-implementation
   - functioning tapi belum    → ui-functional-implementation
   - api belum                 → functional-implementation
4. Buat plan:
   → /buat-plan "lanjut <phase/nama halaman>"
5. Eksekusi:
   → /eksekusi-plan atau /eksekusi-plan-by-phase
```

---

### Skenario C: Bug Fix / Refactor Kecil

```
1. Buat plan (bahkan untuk fix kecil, biar ada trace):
   → /buat-plan "fix <deskripsi masalah>"
2. Eksekusi:
   → /eksekusi-plan docs/plans/<name>.md
3. Commit:
   → /git-commit
```

---

### Skenario D: Multi-Phase Feature Besar

```
1. /buat-plan "<deskripsi fitur besar>" multi-phase
2. Review plan yang dibuat di docs/plans/
3. Eksekusi fase per fase:
   → /eksekusi-plan-by-phase docs/plans/<name>.md
   → Konfirmasi di setiap fase
4. Setelah semua fase selesai:
   → /git-commit
```

---

## Common Pitfalls

### 1. TypeScript Error pada `href` Link

**Gejala:** `Argument of type '"/path"' is not assignable`  
**Solusi:** Jalankan `npx expo start` lalu Ctrl+C untuk regenerate tipe route otomatis.

### 2. Lupa Update `docs/track_pages_and_components.md`

**Gejala:** Halaman sudah selesai tapi tracking masih `[]`  
**Solusi:** Setiap skill eksekusi sudah punya step "Tracking update" di plan. Pastikan step itu tidak dilewat.

### 3. Komponen Baru Tidak Tercatat di `docs/component-index.md`

**Gejala:** Developer lain re-create komponen yang sudah ada  
**Solusi:** Setiap komponen baru wajib ditambah ke `component-index.md` saat dibuat.

### 4. Inline Style Bukan StyleSheet

**Gejala:** Lint warning atau performa render kurang optimal  
**Solusi:** Selalu pakai `StyleSheet.create({})`. Pengecualian hanya untuk nilai dinamis dari props.

### 5. Hard-coded Warna / Spacing

**Gejala:** Magic number `#fff`, `16`, `8` di code  
**Solusi:** Pakai token dari `AppTheme.colors`, `AppTheme.spacing`, `AppTheme.borderRadius`.

### 6. Export Default di `src/`

**Gejala:** Komponen pakai `export default` di dalam `src/`  
**Solusi:** Semua komponen/screen di `src/` pakai named export. Hanya `app/` yang pakai `export default`.

### 7. Business Logic di File Route `app/`

**Gejala:** State, useEffect, atau logic di `app/(scope)/page.tsx`  
**Solusi:** File route harus tipis — hanya import dan mount screen dari `src/features/`.

### 8. Git Push ke Main Tanpa Review

**Gejala:** Langsung push ke `main` atau `production`  
**Solusi:** Selalu kerja di feature branch. `git-smart-commit` punya safety check ini.

---

## Status Plan yang Ada

| Plan File                                         | Status      | Keterangan                                              |
| ------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `docs/plans/onboarding-once.md`                   | pending     | Logika onboarding hanya tampil sekali via Zustand store |
| `docs/plans/home-dashboard-dynamic-components.md` | pending     | Home dashboard dengan data dinamis                      |
| `docs/plans/dev-nav-float-extract.md`             | done        | DevNavFloat sudah diimplementasikan                     |
| `docs/plans/dynamic-screen-refactor-pattern.md`   | —           | Pattern refactor layar dinamis                          |
| `docs/plans/daily-summary-and-skills-recap.md`    | in-progress | Dokumen ini                                             |

---

## Referensi Cepat

| Dokumen                              | Tujuan                                            |
| ------------------------------------ | ------------------------------------------------- |
| `docs/project-conventions.md`        | Aturan kode, theme tokens, naming, screen pattern |
| `docs/track_pages_and_components.md` | Status implementasi semua halaman & komponen      |
| `docs/ui-ux-pages-descriptions.md`   | Deskripsi UI/UX tiap halaman dari desain          |
| `docs/component-index.md`            | Indeks komponen per kategori                      |
| `docs/git-workflow-commit-guide.md`  | Panduan semantic commit detail                    |
| `docs/daily-notes/YYYY-MM-DD.md`     | Catatan harian per sesi kerja                     |
| `AGENTS.md`                          | Struktur folder, aturan penempatan file           |

---

_Terakhir diperbarui: 2026-05-02_
