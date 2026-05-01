# Git Smart Commit Skill

Otomatis melakukan git add, commit, dan push dengan intelligently grouping files berdasarkan konteks perubahan.

## Description

Skill ini menganalisis working tree changes, mengelompokkan file ke batch commit yang logis berdasarkan kategori (feat, fix, refactor, docs, test, chore), menampilkan rencana, meminta konfirmasi, kemudian eksekusi commit per batch dan push otomatis.

**Output:** Bersih git history dengan multiple semantic commits + ringkasan hasil.

## When to Use

✅ **Gunakan skill ini ketika:**

- Punya multiple changes di working tree yang belum di-commit
- Ingin membuat clean history dengan commits yang terpisah per konteks
- Perubahan mencakup fitur baru, bug fix, docs, refactor, dan chore
- Mau otomatis batch files tapi tetap bisa review rencana dulu

❌ **Jangan gunakan ketika:**

- Sudah tahu pasti ingin 1 commit besar (pakai `git add .` + `git commit` langsung)
- Hanya perubahan docs sedikit (langsung commit 1x)
- Ada conflicts atau perlu manual resolution

## Prerequisites

1. **Git initialized**: Repo sudah di-init dengan `.git` folder
2. **On a feature branch**: JANGAN di branch `main` atau `production` (safety check)
3. **Clean working tree** (optional): Ideal jika tidak ada pending stash
4. **Ref**: Baca `docs/git-workflow-commit-guide.md` untuk konteks dan kategori

## Workflow

### Step 1: Analisis Perubahan

1. Jalankan `git status` → dapatkan list modified files
2. Jalankan `git diff --stat` → dapatkan ringkasan perubahan
3. Abaikan files yang ada di `.gitignore` (node_modules, dist, etc.)

**Output:** List file + stat perubahan

---

### Step 2: Kategorisasi Otomatis

Untuk setiap file, assign kategori berdasarkan:

| File Pattern                                      | Kategori Default                                             |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `src/features/*/screens/*.tsx`                    | `feat`                                                       |
| `src/features/*/components/*.tsx`                 | `feat`                                                       |
| `src/features/*/services/*.ts`                    | `feat`                                                       |
| `src/features/*/*.test.ts`                        | `test`                                                       |
| `docs/**/*.md`                                    | `docs`                                                       |
| `package.json`, `tsconfig.json`, `.env*`          | `chore`                                                      |
| `*.tsx`, `*.ts` (update existing logic atau fix)  | `fix` (jika ada error handler / try-catch / validation baru) |
| `*.tsx`, `*.ts` (restructure tanpa ubah behavior) | `refactor`                                                   |
| `test/**`, `*.spec.ts`                            | `test`                                                       |
| Lainnya yang ambiguous                            | `chore`                                                      |

**Rule Ambiguous Files:** Auto-assign ke `chore` tanpa tanya

**Output:** Files grouped by category

---

### Step 3: Group ke Batch Commits

Logika grouping:

1. **One batch per category** (feat → 1 batch, fix → 1 batch, docs → 1 batch)
   - Exception: Jika category punya >10 files, split by scope (e.g., `feat(auth)` vs `feat(booking)`)

2. **Related files stay together**
   - Feature test file → gabung dengan feature file di batch yang sama
   - Related components di folder sama → 1 batch

3. **Unlock related changes**
   - `package.json` + `pnpm-lock.yaml` → 1 batch `chore(deps)`
   - Updated tracking doc → 1 batch `docs: update tracking`

**Output:** Batch list dengan files dan usulan commit message

---

### Step 4: Tampilkan Rencana

Format output rencana:

```
═══════════════════════════════════════
🔄 GIT SMART COMMIT - EXECUTION PLAN
═══════════════════════════════════════

📊 ANALISIS PERUBAHAN
├─ Total files: X
├─ Total additions: Y
├─ Total deletions: Z
└─ Current branch: [branch-name]

📦 BATCH COMMITS (Total: N)

[BATCH 1] ✨ feat(scope) - Deskripsi
├─ src/path/file1.tsx
├─ src/path/file2.tsx
└─ src/path/file2.test.ts
   Reason: Feature baru dengan unit tests

[BATCH 2] 📝 docs - Deskripsi
├─ docs/track_pages_and_components.md
└─ docs/project-conventions.md
   Reason: Update dokumentasi

[BATCH 3] 🔧 chore(deps) - Deskripsi
├─ package.json
└─ pnpm-lock.yaml
   Reason: Dependency update

═══════════════════════════════════════
✅ Confirm to proceed? (Y/N)
```

---

### Step 5: Minta Konfirmasi

Tampilkan rencana dan tanya user:

```
Proceed dengan rencana di atas? (Y/N)
```

**Decision:**

- **Y/Yes** → Lanjut ke Step 6
- **N/No** → Batalkan, tidak ada perubahan

---

### Step 6: Eksekusi Commits

Untuk setiap batch secara sequential:

```bash
# Batch 1
git add <file1> <file2> <file3>
git commit -m "feat(scope): description"

# Batch 2
git add <file1> <file2>
git commit -m "docs: description"

# (lanjut batch berikutnya)
```

**Error Handling:**

- Jika `git add` gagal → stop & report error
- Jika `git commit` gagal → stop & report error
- Jika perubahan conflict → abort semua, inform user

---

### Step 7: Push ke Remote

Setelah semua commit sukses:

```bash
git push origin <current-branch>
```

**Error Handling:**

- Jika push gagal (network) → report error, tapi commits sudah lokal
- Jika branch tidak ada di remote → auto set upstream dengan `-u` flag

---

### Step 8: Ringkas Hasil

Tampilkan summary:

```
═══════════════════════════════════════
✅ GIT SMART COMMIT - SUCCESS
═══════════════════════════════════════

📊 HASIL EKSEKUSI
├─ Total commits: N
├─ Branch: [branch-name]
├─ Remote: origin

📝 COMMIT LOG
│
├─ [1] ✨ feat(scope): description
│   └─ 3 files changed, 100+ additions
│
├─ [2] 📝 docs: description
│   └─ 2 files changed, 50+ additions
│
└─ [3] 🔧 chore(deps): description
    └─ 2 files changed, 1000+ additions (lock file)

🌿 PUSHED TO
└─ origin/[branch-name]

═══════════════════════════════════════
💡 Next: Test build with `npm run build`
```

---

## Success Criteria

✅ **Skill berhasil jika:**

1. Semua batch commit berhasil dibuat dengan kategori yang tepat
2. Setiap commit punya message yang descriptive (Conventional Commits)
3. Tidak ada file yang tercampur antar batch (kecuali intentional related files)
4. Push berhasil ke remote branch
5. User dapat melihat commit log yang bersih di git history

---

## Example Usage Prompts

### Prompt 1: Basic Usage (Recommended)

```
Tolong bantu saya melakukan git add, commit, dan push dengan cara yang terstruktur.
Gunakan skill: git-smart-commit
```

### Prompt 2: With Context

```
Saya punya perubahan di home feature (feat), update docs, dan dependency update (chore).
Tolong batch commit ini dengan rapi, tampilkan rencana, then execute dan push.
```

### Prompt 3: Specific Branch

```
Git smart commit untuk branch `feature/walk-in-pin`, lalu push ke origin.
```

---

## Troubleshooting

### Error: "Current branch is main"

**Cause:** Skill safety check menolak commit di main branch  
**Fix:** Checkout ke feature branch dulu: `git checkout -b feature/your-feature`

### Error: "git add failed"

**Cause:** File tidak ada / permission issue / gitignored  
**Fix:** Review `git status`, pastikan file di-track

### Error: "push failed"

**Cause:** Network issue / branch belum ada di remote / access denied  
**Fix:** Check `git remote -v` dan `git branch -vv`

---

## Related Skills

- **`execute-plan`**: General execution dari plan file
- **`planning-task`**: Untuk membuat rencana sebelum execution
- **`agent-customization`**: Untuk customize behavior skill ini

---

## Limitations & Notes

⚠️ **Limitations:**

- Tidak bisa handle merge conflicts (abort jika ada)
- Auto-categorization based on file patterns (tidak parse commit intent)
- Ambiguous files auto-assign ke `chore` (tidak tanya user)
- Tidak bisa commit ke multiple branches (hanya current branch)

💡 **Notes:**

- File patterns bisa di-customize per project
- Category defaults bisa override via skill config
- Semua changes di-commit (tidak bisa selective per hunk)

---

**Version:** 1.0  
**Last Updated:** May 2, 2026  
**Ref:** `docs/git-workflow-commit-guide.md`
