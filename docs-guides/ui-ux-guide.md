# Cukkr UI/UX Design Guide

## Prinsip Utama

> **Konsistensi bertingkat, bukan seragam.**  
> Setiap elemen punya porsi berdasarkan seberapa penting dan interaktif dia.

---

## 1. Spacing

Gunakan kelipatan 4px. Jarak antar elemen tidak boleh seragam — semakin tinggi hirarki, semakin longgar.

| Konteks | Nilai | Contoh |
|---|---|---|
| Top safe area ke konten pertama | `paddingTop: 24` | Date pill dari status bar |
| Antara section (heading → daftar) | `marginBottom: 16` | "Bookings" ke booking list |
| Antar card dalam satu daftar | `marginBottom: 16` | BookingCard ke BookingCard |
| Horizontal konten ke tepi | `paddingHorizontal: 20` | Semua konten screen |
| Gap horizontal antar chip | `gap: 10` | Day chip ke day chip |
| Bottom konten ke tab bar / bottom edge | `paddingBottom: 200` (scroll) atau `bottom: 20` (FAB) |

### Aturan

- **Jangan pernah** pakai spacing < 8px untuk pemisah antar elemen utama.
- **Jangan pernah** pakai spacing > 32px tanpa alasan visual yang jelas.
- **Napas atas** (safe area → konten) minimal 20px, ideal 24px.

---

## 2. Progressive Sizing

Ukuran interaktif meningkat sesuai peran dalam screen:

| Elemen | Ukuran | Rasio terhadap konteks |
|---|---|---|
| Date pill | `paddingVertical: 12, paddingHorizontal: 18` | Paling kecil, informasi |
| Day chip | `width: 66, height: 84` | Sedang, navigasi harian |
| Filter pill | `paddingVertical: 10, paddingHorizontal: 16` | Sedang, kontrol sekunder |
| BookingCard | `padding: 16` | Card standar |
| RequestCard | `padding: 16, width: 200` | Card horizontal scroll |
| FAB | `width: 60, height: 60` | Paling besar, aksi utama |

### Minimum tap target

Semua elemen interaktif harus minimal:
- **44×44pt** (Apple HIG minimum)
- Target utama (FAB, primary CTA): **56–60pt**

---

## 3. Typography Hierarchy

Gunakan `AppText` dengan `fontWeight` yang sesuai. Hirarki visual dibangun dari kombinasi **size + weight + color**.

| Peran | Size | Weight | Color | Letter-Spacing | Contoh |
|---|---|---|---|---|---|
| Screen heading | 32 | `700` | `text.primary` | `-0.8` | "Bookings" |
| Section heading | 22 | `700` | `text.primary` | `-0.5` | Section title |
| Sub-heading | 17 | `700` | `text.primary` | — | "Requests" |
| Body emphasis | 15–16 | `600` | `text.primary` | — | Nama customer, empty title |
| Body / label | 14–15 | `500`–`600` | `text.primary` | — | Filter label, date pill |
| Caption | 12–13 | `400`–`500` | `text.secondary` / `text.muted` | — | Barber name, duration |
| Count / badge | sama dg parent | `400`–`500` | `text.secondary` atau `text.muted` | — | "(3)" setelah heading |

### Aturan

- **Heading screen wajib** lebih besar 2× dari teks tersuram di screen yang sama.
  - Contoh: heading 32, caption 13. Perbedaan 2.5×.
- **Count** (angka dalam kurung setelah heading) harus lebih ringan:
  - Weight: `400`–`500` (bukan 700)
  - Color: `text.muted` atau `text.secondary`, bukan primary
- **Jangan** gunakan weight < `500` untuk teks yang bisa di-tap.
- **Line-height** untuk teks multi-baris yang lebarnya terbatas: `lineHeight: fontSize × 1.4` minimal (bulatkan ke integer genap).

---

## 4. Border Radius Grading

Setiap elemen punya "karakter rounded" sendiri:

| Level | Radius | Elemen |
|---|---|---|
| Subtle | 10–12 | Decline/Accept button, small icon circle |
| Soft | 16–20 | Day chip, BookingCard, RequestCard, calendar cell |
| Rounded | 24–30 | FAB, icon circle besar |
| Full | 999 | Pill (Date pill, filter pill) |

### Aturan

- **Jangan** seragamkan radius semua elemen ke satu nilai.
- Elemen yang lebih penting/menonjol → radius lebih besar.
- Elemen horizontal (pill) → `borderRadius: 999` (full capsule).
- Card dan chip yang sejajar dalam satu container harus **pakai radius yang sama**.
- Radius konsisten dalam satu tipe elemen di seluruh app:
  - Semua card: `20`
  - Semua pill: `999`
  - Semua chip: `20`
  - Semua FAB / action button: `30`

---

## 5. Shadow Gradation

Semakin tinggi elemen di layar atau semakin penting secara interaktif, semakin tebal bayangannya.

| Level | Box Shadow | Elevation (Android) | Contoh |
|---|---|---|---|
| Halus | `0px 2px 8px rgba(0,0,0,0.05)` | `2` | Day chip unselected, date pill, filter pill |
| Sedang | `0px 2px 8px rgba(0,0,0,0.05)` | `2` | BookingCard, RequestCard |
| Tebal | `0px 6px 20px rgba(255,200,30,0.45)` | `6` | FAB (kuning) |
| Menu | `0px 4px 12px rgba(0,0,0,0.08)` | `8` | Dropdown, filter menu |
| Modal | sesuai platform | sesuai platform | CalendarModal, full overlay |

### Aturan

- **Jangan** pakai shadow pada teks.
- **Jangan** pakai shadow lebih tebal dari `0px 6px ...` untuk elemen biasa.
- **FAB wajib** punya shadow paling tebal karena dia elemen paling "depan".
- **Card** cukup shadow halus (`0px 2px 8px rgba(0,0,0,0.05)`).
- **Selected chip** bisa pakai shadow berwarna (sesuai warna brand) untuk efek menonjol: `0px 4px 12px rgba(255,200,30,0.35)`.

---

## 6. Color Usage

Gunakan warna sesuai peran, bukan selera.

| Token | Lokasi |
|---|---|
| `bg.cream` | Screen background khusus (schedule, dsb) |
| `bg.default` | Card, pill, chip, FAB (saat bukan brand) |
| `bg.surface` | Section background di dalam screen putih |
| `brand.primary` | Selected chip, FAB, Accept button, filter selected, toggle ON |
| `text.primary` | Heading, body, label interaktif |
| `text.secondary` | Caption, hint, subtext |
| `text.muted` | Count badge, placeholder, teks tersuram |
| `border.light` | Border halus pada card, chip, pill |
| `border.default` | Border lebih tegas (input, decline button) |

### Aturan

- **Brand color = aksen**. Jangan dominasi layar dengan kuning.
- **Bg.cream** hanya untuk screen yang butuh nuansa hangat (schedule, booking). Screen lain tetap `bg.default`.
- Card di atas bg.cream tetap putih (`bg.default`), bukan transparan.
- Text di atas bg brand → `text.primary`, bukan putih.

---

## 7. Empty State

Ketika data kosong, jangan cuma teks.

| Elemen | Size / Style |
|---|---|
| Image | `width: 220, height: 220, borderRadius: 110` (lingkaran) |
| Title | `fontSize: 18, fontWeight: 600, color: text.primary` |
| Subtitle | `fontSize: 15, fontWeight: 400, color: text.secondary, lineHeight: 22` |
| Layout | `alignItems: center, marginTop: 40` |

Subtitle harus memberikan **aksi yang bisa dilakukan user** (bukan cuma "no data").

---

## 8. FAB (Floating Action Button)

| Properti | Standar |
|---|---|
| Size | `60×60` |
| Border radius | `30` |
| Position | `right: 20, bottom: 20` |
| Background | `brand.primary` |
| Shadow | `0px 6px 20px rgba(255,200,30,0.45)` |
| Elevation | `6` |
| Icon size | `28` |
| Z-index | `40` (di atas konten, di bawah overlay) |

FAB harus menjadi satu-satunya elemen dengan shadow berwarna brand.

---

## 9. Aturan Cross-screen

Aturan yang berlaku di **semua screen**:

1. **Safe area top** selalu beri padding ≥ 20px dari status bar ke elemen pertama.
2. **Horizontal padding** konsisten 20px di semua screen.
3. **Minimum tap target** 44×44pt untuk semua touchable.
4. **Shadow jangan berlebihan** — 3 level (halus/sedang/tebal) cukup untuk seluruh app.
5. **Jangan hardcode hex** — selalu pakai token dari `src/theme/colors.ts`.
6. **Teks multi-baris** wajib punya `lineHeight`.
7. **Empty state** wajib ada di setiap list screen yang bisa kosong.
8. **Semua font via AppText** — jangan pakai `Text` dari react-native.
9. **Border radius konsisten** — lihat tabel di section 4.
10. **Spacing konsisten** — lihat tabel di section 1.
