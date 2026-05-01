# Git Workflow: Smart Commit Guide

Panduan untuk melakukan git add, commit, dan push dengan cara terstruktur dan dipilah per konteks perubahan.

---

## 📋 Tujuan

1. **Jangan gabungkan** semua perubahan ke satu commit besar
2. **Kelompokkan file** yang relevan ke commit terpisah berdasarkan jenis perubahan
3. **Tampilkan rencana** commit dulu sebelum eksekusi
4. **Buat history yang bersih** dan mudah untuk di-review dan di-track

---

## 🔄 Alur Kerja (Step by Step)

### 1. Analisis Perubahan

Periksa status git untuk melihat perubahan apa saja yang ada:

```bash
git status
git diff --stat
```

### 2. Kategori Perubahan (Conventional Commits)

Kelompokkan perubahan ke kategori berikut:

| Kategori     | Simbol | Deskripsi                              | Contoh File                             |
| ------------ | ------ | -------------------------------------- | --------------------------------------- |
| **feat**     | ✨     | Fitur baru                             | Feature implementations, new components |
| **fix**      | 🐛     | Perbaikan bug                          | Bug fixes, error handling               |
| **refactor** | ♻️     | Perubahan struktur tanpa ubah perilaku | Code restructuring, cleanup             |
| **docs**     | 📝     | Dokumentasi                            | .md files, comments, README             |
| **test**     | ✅     | Testing & test files                   | .test.ts, .spec.ts files                |
| **chore**    | 🔧     | Konfigurasi/tooling                    | config files, dependencies, build       |
| **style**    | 💄     | Format/styling tanpa ubah logika       | Prettier formatting, whitespace         |

### 3. Kelompokkan File ke Batch Commit

Untuk setiap batch, tentukan:

- **Daftar file** yang masuk batch
- **Alasan** kenapa file-file itu digabung
- **Usulan commit message** dengan format: `<type>(<scope>): <description>`

**Contoh format commit message:**

```
feat(home): add walk-in PIN functionality
fix(auth): handle token expiration on login
docs: update project structure guide
refactor(components): simplify Button component logic
test(booking): add calendar selection tests
chore(deps): upgrade React to v18
```

### 4. Identifikasi File yang Ambiguous

Jika ada file yang tidak jelas atau campur aduk, pisahkan sebagai:

- `⚠️ Butuh review manual` → tanyakan ke user sebelum commit
- `❌ Jangan ikut commit dulu` → simpan di stash untuk nanti

### 5. Minta Konfirmasi

Tampilkan rencana commit dan minta persetujuan sebelum eksekusi.

### 6. Eksekusi Commit

Untuk setiap batch:

```bash
# Add hanya file dalam batch tersebut
git add <file1> <file2> <file3>

# Commit dengan pesan yang jelas
git commit -m "type(scope): description"
```

### 7. Push ke Remote

Setelah semua batch selesai:

```bash
git push origin <branch-name>
```

### 8. Ringkasan Hasil

Tampilkan:

- ✅ Jumlah commit dibuat
- 📝 Commit message per commit
- 📂 File per commit
- 🌿 Branch dan remote tujuan push

---

## ✅ Aturan Penting

| Aturan                         | Penjelasan                                                       |
| ------------------------------ | ---------------------------------------------------------------- |
| ❌ **Jangan hard reset**       | Tidak boleh melakukan `git reset --hard` atau membuang perubahan |
| ❌ **Jangan amend**            | Tidak boleh amend commit kecuali diminta user                    |
| ✅ **Pisahkan dengan logis**   | Hindari mencampur perubahan yang tidak saling terkait            |
| ✅ **Commit kecil**            | Prioritaskan commit yang kecil, jelas, dan mudah direview        |
| ✅ **Format standar**          | Gunakan Conventional Commits untuk format message                |
| ✅ **Satu konteks per commit** | Jika bisa, 1 commit untuk 1 fitur atau 1 bug fix                 |

---

## 📊 Contoh Skenario

### Skenario 1: Feature + Docs + Chore

```
📁 Working Changes:
├── src/features/booking/BookingForm.tsx (feature)
├── src/features/booking/BookingForm.test.ts (feature)
├── docs/track_pages_and_components.md (docs)
└── package.json (chore - dependency update)

💡 Rencana Commit:
Batch 1: feat(booking) - Add booking form component
  ├── src/features/booking/BookingForm.tsx
  └── src/features/booking/BookingForm.test.ts

Batch 2: docs - Update component tracking
  └── docs/track_pages_and_components.md

Batch 3: chore(deps) - Update dependencies
  └── package.json
```

### Skenario 2: Bug Fix + Refactor (Pisah atau Gabung?)

```
❌ JANGAN Gabung:
git add src/features/auth/loginService.ts    # fix bug
git add src/features/auth/authUtils.ts       # refactor code
git commit -m "fix: token expiration + refactor utils"

✅ LAKUKAN Pisah:
# Batch 1: Fix bug
git add src/features/auth/loginService.ts
git commit -m "fix(auth): handle token expiration"

# Batch 2: Refactor
git add src/features/auth/authUtils.ts
git commit -m "refactor(auth): simplify utility functions"
```

### Skenario 3: Multiple Features (Harus Pisah)

```
❌ JANGAN:
Feature A + Feature B dalam 1 commit
"feat: add walk-in PIN and customer management"

✅ LAKUKAN:
# Commit 1
"feat(home): add walk-in PIN functionality"

# Commit 2
"feat(customers): add customer management screen"
```

---

## 🚀 Quick Command Reference

### Check Status

```bash
git status                    # Lihat perubahan
git diff --stat              # Ringkasan perubahan per file
git diff <file>              # Detail perubahan di 1 file
```

### Staging (Add)

```bash
git add <file1> <file2>      # Add file spesifik
git add src/features/        # Add folder spesifik
git add .                    # Add semua (hindari!)
```

### Commit

```bash
git commit -m "type(scope): description"
```

### Push

```bash
git push origin <branch>     # Push ke branch aktif
git push -u origin <branch>  # Push ke branch baru + set upstream
```

### Undo/Fix

```bash
git reset HEAD <file>        # Unstage file (tidak delete perubahan)
git restore <file>           # Discard perubahan di file (hati-hati!)
git stash                    # Simpan perubahan sementara
git stash pop               # Ambil perubahan dari stash
```

---

## 📝 Template: Rencana Commit

Gunakan template ini sebelum mulai commit:

```markdown
## Rencana Commit untuk Branch: [branch-name]

### Analisis Perubahan

Total files changed: X
Total additions: Y
Total deletions: Z

### Batch 1: [TYPE] - [JUDUL]

**Files:**

- src/path/file1.tsx
- src/path/file2.tsx

**Alasan Penggabungan:** [Deskripsi]

**Commit Message:** `type(scope): description`

---

### Batch 2: [TYPE] - [JUDUL]

**Files:**

- docs/file.md

**Alasan Penggabungan:** [Deskripsi]

**Commit Message:** `type(scope): description`

---

### ⚠️ Butuh Review Manual

- [ ] File X - Reason

### ❌ Jangan Commit (Stash)

- [ ] File Y - Reason

---

### Konfirmasi?

- [ ] Setuju dengan rencana di atas
- [ ] Lanjut eksekusi commit

**Total Commit yang akan dibuat:** N
**Branch tujuan:** origin/[branch-name]
```

---

## 💡 Tips & Best Practices

### 1. Commit Messaging Format

```
<type>(<scope>): <description>

<body (optional)>

<footer (optional)>

Contoh lengkap:
feat(home): add walk-in PIN reset functionality

- Added ConfirmationModal integration
- Connected to API endpoint
- Added success/error handling

Closes #123
```

### 2. Kapan Commit?

- ✅ Setelah fitur/fix selesai & tested
- ✅ Sebelum ganti branch
- ❌ Jangan commit work-in-progress (WIP) ke main branch

### 3. Jumlah File per Commit

- 🎯 Optimal: 1-5 file per commit
- 📊 Maksimal: Tidak boleh >10 file (kecuali dependency updates)
- 🔍 Minimal: Minimal 1 file yang bermakna

### 4. Testing Sebelum Push

```bash
# Pastikan build bersih
npm run build
npm run lint

# Pastikan tests pass (jika ada)
npm run test

# Baru push
git push
```

### 5. Jangan Lakukan

- ❌ `git push --force` (kecuali benar-benar perlu)
- ❌ Commit langsung ke `main` branch
- ❌ Campurkan unrelated changes
- ❌ Commit dengan message yang tidak deskriptif seperti "fix", "update", "changes"

---

## 🔗 Linked Docs

- [Project Structure](./project-structure.md)
- [Project Conventions](./project-conventions.md)
- [Track Pages & Components](./track_pages_and_components.md)

---

## 📌 Cara Menggunakan Guide Ini

### Opsi 1: Manual Review

1. Baca alur kerja di atas
2. Jalankan git commands sesuai kategori
3. Ikuti template rencana commit

### Opsi 2: Minta AI/Agent (Recommended)

Gunakan prompt ini saat minta bantuan:

```
Tolong bantu saya melakukan git add, commit, dan push dengan cara yang terstruktur.

Gunakan panduan: docs/git-workflow-commit-guide.md

Langkah:
1. Analisis perubahan saat ini
2. Kelompokkan ke batch commit logis
3. Tampilkan rencana + alasan sebelum eksekusi
4. Minta konfirmasi saya
5. Jalankan commit per batch
6. Push ke remote
7. Tampilkan ringkasan

Jangan lakukan hard reset atau buang perubahan.
```

---

**Last Updated:** May 2, 2026  
**Version:** 1.0
