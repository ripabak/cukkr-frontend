# Plan: NativeWind Migration

## Goal

Migrasikan seluruh styling di project cukkr-frontend dari `StyleSheet.create` + `AppTheme` tokens ke NativeWind v4 (Tailwind CSS for React Native). Setelah migrasi, developer menulis `className="..."` di JSX alih-alih `style={styles.xxx}`, dengan token warna, spacing, dan radius dari AppTheme di-map ke Tailwind custom tokens di `tailwind.config.js`. AppTheme tetap ada sebagai sumber nilai token, tapi dipakai hanya di `tailwind.config.js` — bukan di komponen.

## Phases Overview

| Phase | Name                                      | Type    | Scope summary                                              | Status  |
| ----- | ----------------------------------------- | ------- | ---------------------------------------------------------- | ------- |
| 1     | Infrastructure Setup                      | infra   | Install NativeWind, buat config files, wiring              | ✓ done — 2026-05-03 |
| 2     | Tailwind Config + Conventions             | infra   | Map AppTheme ke tailwind.config.js, update docs            | ✓ done — 2026-05-03 |
| 3     | Shared Components — Atoms                 | slicing | Buttons, inputs, badges, pills, simple rows (~20 files)    | ✓ done — 2026-05-03 |
| 4     | Shared Components — Cards & Forms         | slicing | Cards, form components, booking-related (~20 files)        | pending |
| 5     | Shared Components — Modals & Menus        | slicing | Modals, menus, complex interactive components (~25 files)  | pending |
| 6     | Feature: Auth & Onboarding                | slicing | Auth components + screens, onboarding components + screens | pending |
| 7     | Feature: Home, Workspace, Barbershop      | slicing | Home, workspace, barbershop screens                        | pending |
| 8     | Feature: Profile, Schedule, Notifications | slicing | Profile, schedule, notifications screens                   | pending |
| 9     | Final Validation                          | infra   | TypeScript check, lint, update tracking docs               | ✓ done — 2026-05-09 |

> Execute with `/eksekusi-plan-by-phase docs/plans/nativewind-migration.md`
> To run a specific phase: `/eksekusi-plan-by-phase docs/plans/nativewind-migration.md phase:2`

---

## Phase 1 — Infrastructure Setup

### Goal

Install NativeWind v4, buat semua config files yang dibutuhkan (babel, metro, tailwind, global.css), dan wiring ke `app/_layout.tsx` dan `expo-env.d.ts`. Setelah phase ini selesai, project bisa compile dengan NativeWind enabled — tapi belum ada komponen yang dimigrasikan.

### Affected files

| File                  | Action | Notes                                         |
| --------------------- | ------ | --------------------------------------------- |
| `package.json`        | edit   | Tambah nativewind + tailwindcss ke deps       |
| `babel.config.js`     | CREATE | Expo default config + nativewind/babel plugin |
| `metro.config.js`     | CREATE | withNativeWind wrapper                        |
| `tailwind.config.js`  | CREATE | Skeleton config dengan content paths          |
| `global.css`          | CREATE | @tailwind directives                          |
| `app/_layout.tsx`     | edit   | Import global.css                             |
| `nativewind-env.d.ts` | CREATE | NativeWind TypeScript types                   |
| `tsconfig.json`       | edit   | Include nativewind-env.d.ts                   |

### Steps

#### Step 1.1 — Install dependencies

**Action:** Run in terminal

```bash
pnpm add nativewind@^4.1.23
pnpm add -D tailwindcss@3.4.17
```

> NativeWind v4 requires Tailwind CSS v3 (bukan v4). Jangan install tailwindcss v4.

#### Step 1.2 — Create `babel.config.js`

**File:** `babel.config.js`  
**Action:** CREATE  
**Details:**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: ["nativewind/babel"],
  };
};
```

> `jsxImportSource: "nativewind"` diperlukan agar `className` prop terdukung di semua JSX elements. `nativewind/babel` plugin melakukan transformasi style saat build.

#### Step 1.3 — Create `metro.config.js`

**File:** `metro.config.js`  
**Action:** CREATE  
**Details:**

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

#### Step 1.4 — Create `tailwind.config.js` (skeleton)

**File:** `tailwind.config.js`  
**Action:** CREATE  
**Details:**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> Theme extend akan diisi di Phase 2 dengan AppTheme token mapping.

#### Step 1.5 — Create `global.css`

**File:** `global.css`  
**Action:** CREATE  
**Details:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 1.6 — Update `app/_layout.tsx`

**File:** `app/_layout.tsx`  
**Action:** edit  
**Details:**

- Tambah `import "../global.css";` sebagai baris pertama file (sebelum semua import lain)

```tsx
import "../global.css";
import { DevNavFloat } from "@/src/components/DevNavFloat";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <DevNavFloat />
    </View>
  );
}
```

#### Step 1.7 — Create `nativewind-env.d.ts`

**File:** `nativewind-env.d.ts`  
**Action:** CREATE  
**Details:**

```ts
/// <reference types="nativewind/types" />
```

> File ini mengaktifkan `className` prop typing di semua RN core components.

#### Step 1.8 — Update `tsconfig.json`

**File:** `tsconfig.json`  
**Action:** edit  
**Details:**

- Tambah `"nativewind-env.d.ts"` ke array `include`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "types": ["jest"],
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "nativewind-env.d.ts"
  ]
}
```

### Verification

- [ ] `pnpm start` (atau `npx expo start`) berjalan tanpa error NativeWind di console
- [ ] `className="bg-red-500"` di `app/_layout.tsx` (sementara) tercompile tanpa TypeScript error
- [ ] Hapus test className setelah verifikasi
- [ ] `npx tsc --noEmit` lolos

### Tracking update

- Tidak ada perubahan tracking untuk phase ini (infra only)

---

## Phase 2 — Tailwind Config + Conventions Update

### Goal

Map semua AppTheme tokens ke custom Tailwind classes di `tailwind.config.js`, tambah `clsx` utility, dan update `docs/project-conventions.md` dengan NativeWind patterns. Setelah phase ini, kita punya class aliases seperti `bg-card`, `text-dark`, `px-lg`, `rounded-md` yang langsung sesuai dengan design system.

### Affected files

| File                          | Action | Notes                                          |
| ----------------------------- | ------ | ---------------------------------------------- |
| `tailwind.config.js`          | edit   | Isi theme.extend dengan AppTheme token mapping |
| `docs/project-conventions.md` | edit   | Update StyleSheet section → NativeWind section |

### Steps

#### Step 2.1 — Populate `tailwind.config.js` with AppTheme tokens

**File:** `tailwind.config.js`  
**Action:** edit  
**Details:**

Replace the skeleton with the full token mapping:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // AppTheme.colors mapping
        bg: "#EEEEE0",
        card: "#FFFFFF",
        dark: "#1A1A1A",
        gray: "#666666",
        "light-gray": "#B0ADA0",
        accent: "#C6FF4D",
        border: "#E0DDD0",
        danger: "#E53E3E",
        "danger-bg": "#FFE4E4",
        "info-row-bg": "#D9E8A0",
        blue: "#2196F3",
        orange: "#FF9800",
      },
      spacing: {
        // AppTheme.spacing mapping (nilai dalam angka → Tailwind memakai px implisit)
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      borderRadius: {
        // AppTheme.borderRadius mapping
        sm: 6,
        md: 12,
        lg: 16,
        xl: 24,
        full: 999,
      },
      fontSize: {
        // AppTheme.typography mapping
        heading: [28, { fontWeight: "700" }],
        subheading: [20, { fontWeight: "700" }],
        body: [14, { fontWeight: "400" }],
        caption: [12, { fontWeight: "400" }],
        label: [13, { fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
```

**Class alias reference table** (untuk dipakai saat migrasi komponen):

| AppTheme token                | Tailwind class examples          |
| ----------------------------- | -------------------------------- |
| `AppTheme.colors.bg`          | `bg-bg`                          |
| `AppTheme.colors.card`        | `bg-card`                        |
| `AppTheme.colors.dark`        | `bg-dark`, `text-dark`           |
| `AppTheme.colors.gray`        | `text-gray`                      |
| `AppTheme.colors.lightGray`   | `text-light-gray`                |
| `AppTheme.colors.accent`      | `bg-accent`                      |
| `AppTheme.colors.border`      | `border-border`                  |
| `AppTheme.colors.danger`      | `text-danger`                    |
| `AppTheme.colors.dangerBg`    | `bg-danger-bg`                   |
| `AppTheme.colors.infoRowBg`   | `bg-info-row-bg`                 |
| `AppTheme.spacing.xs`         | `p-xs`, `px-xs`, `py-xs`, `m-xs` |
| `AppTheme.spacing.sm`         | `p-sm`, `px-sm`, etc.            |
| `AppTheme.spacing.md`         | `p-md`, `px-md`, etc.            |
| `AppTheme.spacing.lg`         | `p-lg`, `px-lg`, etc.            |
| `AppTheme.spacing.xl`         | `p-xl`, `px-xl`, etc.            |
| `AppTheme.spacing.xxl`        | `p-xxl`, `px-xxl`, etc.          |
| `AppTheme.spacing.xxxl`       | `p-xxxl`, `px-xxxl`, etc.        |
| `AppTheme.borderRadius.sm`    | `rounded-sm`                     |
| `AppTheme.borderRadius.md`    | `rounded-md`                     |
| `AppTheme.borderRadius.lg`    | `rounded-lg`                     |
| `AppTheme.borderRadius.xl`    | `rounded-xl`                     |
| `AppTheme.borderRadius.full`  | `rounded-full`                   |
| `AppTheme.typography.heading` | `text-heading`                   |
| `AppTheme.typography.body`    | `text-body`                      |

#### Step 2.2 — Update `docs/project-conventions.md`

**File:** `docs/project-conventions.md`  
**Action:** edit  
**Details:**

- Ganti section **3. Component Patterns → StyleSheet** dengan NativeWind pattern
- Tambah section baru **NativeWind Class Naming**

Ganti:

```tsx
// ✅ Always use StyleSheet.create — never inline style objects in JSX
const styles = StyleSheet.create({
  container: { ... },
});

// ❌ Avoid
<View style={{ flex: 1, backgroundColor: '#fff' }}>
```

Dengan:

```tsx
// ✅ Always use className — never StyleSheet.create
<View className="flex-1 bg-card px-lg rounded-lg" />

// ✅ Compose conditional classes
<View className={`flex-1 ${isActive ? 'bg-accent' : 'bg-card'}`} />

// ✅ Dynamic values (tidak bisa dinyatakan sebagai class) → gunakan style inline
<View style={{ backgroundColor: dynamicColor }} />

// ❌ Jangan pakai StyleSheet.create lagi
const styles = StyleSheet.create({ container: { ... } }); // ❌
```

Tambah tabel class aliases (salin dari Step 2.1).

Tambah konvensi:

- Import `AppTheme` hanya boleh di `tailwind.config.js` dan `src/app-theme.ts` — bukan di komponen
- Komponen menerima `className?: string` untuk override, bukan `style?: ViewStyle`
- Untuk nilai benar-benar dinamis (dari props), gunakan `style={{ ... }}` inline
- Gunakan `clsx` dari package `clsx` untuk conditional className composition

### Verification

- [ ] `tailwind.config.js` meng-export theme yang valid
- [ ] `bg-accent` tercompile menjadi `backgroundColor: '#C6FF4D'` ketika dipakai di komponen

### Tracking update

- Tidak ada baris tracking yang berubah (infra/docs only)

---

## Phase 3 — Shared Components: Atoms

### Goal

Migrasikan ~20 komponen atom/primitive di `src/components/` — buttons, inputs, badges, sederhana rows, pills, dan utility components.

### Migration pattern per file

Untuk setiap file di phase ini:

1. Hapus `StyleSheet` dari import `react-native`
2. Hapus blok `const styles = StyleSheet.create({...})` di bawah
3. Ganti `style={styles.xxx}` → `className="..."`
4. Ganti `style={[styles.a, styles.b]}` → `className="...combined classes..."`
5. Ganti `style={[styles.a, condition && styles.b]}` → `className={condition ? 'a-classes b-classes' : 'a-classes'}`
6. Pertahankan `style={{ dynamicValue }}` hanya untuk nilai yang berasal dari props
7. Update prop `style?: ViewStyle` → `className?: string` di interface; terapkan dengan `className={...}` di root element
8. Jika komponen import `AppTheme` — hapus import tersebut setelah semua token terggantikan

### Affected files

| File                                      | Action | Notes                                  |
| ----------------------------------------- | ------ | -------------------------------------- |
| `src/components/PrimaryButton.tsx`        | edit   | Button atom                            |
| `src/components/SecondaryButton.tsx`      | edit   | Button atom                            |
| `src/components/DangerButton.tsx`         | edit   | Button atom                            |
| `src/components/GradientButton.tsx`       | edit   | Button atom (dark olive bg simulation) |
| `src/components/IconActionButton.tsx`     | edit   | Icon + action button                   |
| `src/components/FloatingActionButton.tsx` | edit   | FAB                                    |
| `src/components/StickyCta.tsx`            | edit   | Sticky bottom CTA                      |
| `src/components/StatusBadge.tsx`          | edit   | Badge atom                             |
| `src/components/StatusPill.tsx`           | edit   | Pill atom                              |
| `src/components/TextInputField.tsx`       | edit   | Text input                             |
| `src/components/MultilineInputField.tsx`  | edit   | Multiline input                        |
| `src/components/PrefixedInputField.tsx`   | edit   | Prefixed input                         |
| `src/components/SearchInput.tsx`          | edit   | Search bar                             |
| `src/components/HelperCopy.tsx`           | edit   | Helper text                            |
| `src/components/SuccessState.tsx`         | edit   | Success state                          |
| `src/components/WizardProgress.tsx`       | edit   | Progress bar steps                     |
| `src/components/ImageUploadBox.tsx`       | edit   | Upload placeholder                     |
| `src/components/InviteRow.tsx`            | edit   | Invite row                             |
| `src/components/LogoutRow.tsx`            | edit   | Logout row                             |
| `src/components/ToggleSwitch.tsx`         | edit   | Toggle switch                          |

### Steps

#### Step 3.1 — Migrate `PrimaryButton.tsx`

**File:** `src/components/PrimaryButton.tsx`  
**Action:** edit  
**Details:**

- Hapus `StyleSheet` dari imports
- Hapus `const styles = StyleSheet.create({...})`
- `container`: `className="min-h-[56px] rounded-full bg-dark justify-center items-center px-lg"`
- Pressed state: gunakan `style={({ pressed }) => pressed ? { opacity: 0.86 } : {}}` di Pressable (NativeWind belum mendukung dynamic `pressed` state via className di Pressable)
- `label`: `className="text-[#C6FF4D] text-[15px] font-semibold"`
- `disabled` state: tambah `opacity-50` ke className ketika `disabled === true`
- Prop `className?: string` untuk override

#### Step 3.2 — Migrate `SecondaryButton.tsx`

**File:** `src/components/SecondaryButton.tsx`  
**Action:** edit  
**Details:**

- `container`: `className="min-h-[56px] rounded-full bg-card border border-border justify-center items-center px-lg"`
- `label`: `className="text-dark text-[15px] font-semibold"`

#### Step 3.3 — Migrate `DangerButton.tsx`

**File:** `src/components/DangerButton.tsx`  
**Action:** edit  
**Details:**

- `container`: `className="min-h-[56px] rounded-full bg-danger-bg justify-center items-center px-lg"`
- `label`: `className="text-danger text-[15px] font-semibold"`

#### Step 3.4 — Migrate `GradientButton.tsx`

**File:** `src/components/GradientButton.tsx`  
**Action:** edit  
**Details:**

- Background adalah dark olive (#2D3E1C) yang diapprox dengan `bg-[#2D3E1C]` (NativeWind mendukung arbitrary values)
- `container`: `className="min-h-[56px] rounded-full bg-[#2D3E1C] justify-center items-center px-lg"`

#### Step 3.5 — Migrate `IconActionButton.tsx`

**File:** `src/components/IconActionButton.tsx`  
**Action:** edit  
**Details:**

- Root: `className="items-center justify-center"`
- Sesuaikan dengan layout yang ada

#### Step 3.6 — Migrate `FloatingActionButton.tsx`

**File:** `src/components/FloatingActionButton.tsx`  
**Action:** edit  
**Details:**

- Root: `className="absolute bottom-xl right-xl w-14 h-14 rounded-full bg-dark items-center justify-center shadow-md"`

#### Step 3.7 — Migrate `StickyCta.tsx`

**File:** `src/components/StickyCta.tsx`  
**Action:** edit  
**Details:**

- Container: `className="px-lg pb-xl pt-md bg-card border-t border-border"`

#### Step 3.8 — Migrate `StatusBadge.tsx`

**File:** `src/components/StatusBadge.tsx`  
**Action:** edit  
**Details:**

- Status colors bersifat dynamic dari props — gunakan `style={{ backgroundColor: color }}` untuk dynamic colors
- Shape: `className="px-sm py-xs rounded-full"`

#### Step 3.9 — Migrate `StatusPill.tsx`

**File:** `src/components/StatusPill.tsx`  
**Action:** edit  
**Details:**

- Sama seperti StatusBadge, warna dynamic → `style={{ backgroundColor }}` dipertahankan
- Shape dan padding → className

#### Step 3.10 — Migrate `TextInputField.tsx`

**File:** `src/components/TextInputField.tsx`  
**Action:** edit  
**Details:**

- Label: `className="text-label text-dark mb-xs"`
- Container/pill: `className="bg-card border border-border rounded-full px-lg h-14 flex-row items-center"`
- Input text: `className="flex-1 text-body text-dark"`
- Placeholder color → tetap gunakan `placeholderTextColor` prop di TextInput (tidak bisa via className)

#### Step 3.11 — Migrate `MultilineInputField.tsx`

**File:** `src/components/MultilineInputField.tsx`  
**Action:** edit  
**Details:**

- Container: `className="bg-card border border-border rounded-lg p-lg"`
- Minimum height → `style={{ minHeight: 100 }}` (arbitrary) atau `className="min-h-[100px]"`
- `textAlignVertical: 'top'` → `style={{ textAlignVertical: 'top' }}` (tidak ada Tailwind class untuk ini di RN)

#### Step 3.12 — Migrate `PrefixedInputField.tsx`

**File:** `src/components/PrefixedInputField.tsx`  
**Action:** edit  
**Details:**

- Container: `className="bg-card border border-border rounded-full px-lg h-14 flex-row items-center"`
- Prefix text: `className="text-body text-gray mr-xs"`
- Divider: `className="w-px h-5 bg-border mx-sm"`

#### Step 3.13 — Migrate `SearchInput.tsx`

**File:** `src/components/SearchInput.tsx`  
**Action:** edit  
**Details:**

- Container: `className="bg-card border border-border rounded-full px-lg h-12 flex-row items-center gap-sm"`

#### Step 3.14 — Migrate `HelperCopy.tsx`

**File:** `src/components/HelperCopy.tsx`  
**Action:** edit  
**Details:**

- Container: `className="mt-xs px-lg"`
- Line text: `className="text-caption text-gray mb-xs"`
- Error line: `className="text-caption text-danger mb-xs"`

#### Step 3.15 — Migrate `SuccessState.tsx`

**File:** `src/components/SuccessState.tsx`  
**Action:** edit  
**Details:**

- Container: `className="flex-1 items-center justify-center px-lg"`
- Title: `className="text-heading text-dark text-center mb-sm"`
- Subtitle: `className="text-body text-gray text-center"`

#### Step 3.16 — Migrate `WizardProgress.tsx`

**File:** `src/components/WizardProgress.tsx`  
**Action:** edit  
**Details:**

- Container: `className="flex-row gap-sm px-lg py-md"`
- Active bar: `className="flex-1 h-1 bg-dark rounded-full"`
- Inactive bar: `className="flex-1 h-1 bg-border rounded-full"`
- Dynamic active/inactive berdasarkan currentStep prop → conditional className

#### Step 3.17 — Migrate `ImageUploadBox.tsx`

**File:** `src/components/ImageUploadBox.tsx`  
**Action:** edit  
**Details:**

- Container: `className="border-2 border-dashed border-border rounded-lg items-center justify-center p-xl"`
- Text: `className="text-label text-light-gray mt-sm"`

#### Step 3.18 — Migrate `InviteRow.tsx`

**File:** `src/components/InviteRow.tsx`  
**Action:** edit  
**Details:**

- Container: `className="flex-row items-center py-md px-lg bg-card"`
- Bullet: `className="w-2 h-2 rounded-full bg-dark mr-sm"`
- Email text: `className="flex-1 text-body text-dark"`
- Remove button: `className="w-8 h-8 rounded-full border border-danger items-center justify-center"`

#### Step 3.19 — Migrate `LogoutRow.tsx`

**File:** `src/components/LogoutRow.tsx`  
**Action:** edit  
**Details:**

- Container: `className="flex-row items-center py-md px-lg"`
- Text: `className="text-body text-danger flex-1"`

#### Step 3.20 — Migrate `ToggleSwitch.tsx`

**File:** `src/components/ToggleSwitch.tsx`  
**Action:** edit  
**Details:**

- Track: dynamic color berdasarkan `value` prop → `style={{ backgroundColor: value ? '#C6FF4D' : '#E0DDD0' }}`
- Thumb: `className="w-6 h-6 rounded-full bg-card shadow"`

### Verification

- [ ] Semua 20 komponen tercompile tanpa error
- [ ] `npx tsc --noEmit` tidak ada error baru
- [ ] Visual check: jalankan dev server, masuk ke DevNav, cek halaman yang memakai komponen ini

### Tracking update

- Section: Shared components
- Tidak ada perubahan kolom status — ini hanya refactor styling, bukan perubahan fungsionalitas

---

## Phase 4 — Shared Components: Cards & Form Components ✓ done — 2026-05-03

### Goal

Migrasikan ~20 komponen cards, rows, dan form-related components.

### Affected files

| File                                    | Action | Notes               |
| --------------------------------------- | ------ | ------------------- |
| `src/components/MetricCard.tsx`         | edit   | KPI card            |
| `src/components/ShortcutTile.tsx`       | edit   | Quick access tile   |
| `src/components/WorkspacePill.tsx`      | edit   | Workspace selector  |
| `src/components/DateSelectorPill.tsx`   | edit   | Date selector       |
| `src/components/InfoRow.tsx`            | edit   | Label-value row     |
| `src/components/OperationRow.tsx`       | edit   | Chevron row         |
| `src/components/SelectionRow.tsx`       | edit   | Avatar/text row     |
| `src/components/ToggleRow.tsx`          | edit   | Row with toggle     |
| `src/components/ComputedSummaryRow.tsx` | edit   | Summary row         |
| `src/components/HistoryBookingRow.tsx`  | edit   | Booking history row |
| `src/components/BookingCard.tsx`        | edit   | Booking card        |
| `src/components/BookingDetailCard.tsx`  | edit   | Booking detail card |
| `src/components/CustomerCard.tsx`       | edit   | Customer card       |
| `src/components/MemberCard.tsx`         | edit   | Member card         |
| `src/components/ServiceCard.tsx`        | edit   | Service card        |
| `src/components/ServiceForm.tsx`        | edit   | Service form        |
| `src/components/BookingForm.tsx`        | edit   | Booking form        |
| `src/components/NotificationCard.tsx`   | edit   | Notification card   |
| `src/components/StatCard.tsx`           | edit   | Stat card           |
| `src/components/ChartCard.tsx`          | edit   | Chart card          |
| `src/components/ProfileSummaryCard.tsx` | edit   | Profile summary     |

### Steps

#### Step 4.1 — Migrate each file per migration pattern

Untuk setiap file di atas, terapkan **migration pattern** dari Phase 3:

1. Remove `StyleSheet` from imports
2. Remove `StyleSheet.create({...})` block
3. Convert `style={styles.xxx}` → `className="..."`
4. Keep `style={{ dynamicValue }}` for props-dependent values
5. Remove `AppTheme` import jika tidak ada sisa penggunaannya

**MetricCard** key classes:

- Container: `className="bg-card rounded-lg p-lg"`
- Accent border (optional): `style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}` (dynamic → inline)
- Title: `className="text-label text-gray mb-xs"`
- Value: `className="text-subheading text-dark"`

**ShortcutTile** key classes:

- Container: `className="items-center"`
- Icon circle: `className="w-12 h-12 rounded-full bg-[#F0F0E8] items-center justify-center mb-xs"`
- Label: `className="text-caption text-dark text-center"`

**WorkspacePill** key classes:

- Container: `className="flex-row items-center bg-card rounded-full px-md py-xs gap-xs"`
- Text: `className="text-label text-dark"`

**InfoRow** key classes:

- Container: `className="flex-row items-center py-md px-lg"` + conditional `border-b border-border` when not isLast
- Label: `className="text-label text-dark flex-1"`
- Value: `className="text-body text-gray"`
- Chevron: Ionicons icon, no className needed

**ServiceCard** key classes:

- Container: `className="bg-card rounded-lg p-lg mb-sm"`
- Name: `className="text-label text-dark mb-xs"`
- Price: `className="text-body text-gray"`

**ProfileSummaryCard** key classes:

- Container: `className="bg-info-row-bg rounded-lg p-lg"`

### Verification

- [x] Semua 21 komponen tercompile
- [x] `npx tsc --noEmit` clean
- [ ] Visual check di DevNav: home, barbershop settings, schedule pages

### Tracking update

- Section: Shared components
- Refactor only, tidak ada status column yang berubah

---

## Phase 5 — Shared Components: Modals, Menus & Complex Widgets ✓ done — 2026-05-06

### Goal

Migrasikan sisa ~24 komponen yang lebih kompleks: modals, menus, tab selectors, interactive widgets, dan dev utilities.

### Affected files

| File                                        | Action | Notes                   |
| ------------------------------------------- | ------ | ----------------------- |
| `src/components/ConfirmationModal.tsx`      | edit   | Two-action modal        |
| `src/components/AlertModal.tsx`             | edit   | Single-action modal     |
| `src/components/SwipeConfirmationModal.tsx` | edit   | Swipe modal             |
| `src/components/CalendarModal.tsx`          | edit   | Calendar picker modal   |
| `src/components/TimePickerModal.tsx`        | edit   | Time picker modal       |
| `src/components/SortMenu.tsx`               | edit   | Sort dropdown           |
| `src/components/StatusFilterMenu.tsx`       | edit   | Status filter dropdown  |
| `src/components/OverflowMenu.tsx`           | edit   | Overflow action menu    |
| `src/components/SegmentedTabs.tsx`          | edit   | Tab selector            |
| `src/components/BookingTypeToggle.tsx`      | edit   | Toggle for booking type |
| `src/components/SelectionToolbar.tsx`       | edit   | Selection toolbar       |
| `src/components/SelectionFooter.tsx`        | edit   | Selection footer bar    |
| `src/components/InlineDecisionButtons.tsx`  | edit   | Inline yes/no buttons   |
| `src/components/DualActionFooter.tsx`       | edit   | Footer with two actions |
| `src/components/DayChipRow.tsx`             | edit   | Day chip selector row   |
| `src/components/DayHoursRow.tsx`            | edit   | Day hours config row    |
| `src/components/BottomTabBar.tsx`           | edit   | App bottom tab bar      |
| `src/components/ScreenHeader.tsx`           | edit   | Page header             |
| `src/components/EditFieldHeader.tsx`        | edit   | Field edit header       |
| `src/components/MessageThread.tsx`          | edit   | Message thread display  |
| `src/components/MessageComposer.tsx`        | edit   | Message input bar       |
| `src/components/ServiceSelectionCard.tsx`   | edit   | Service selection card  |
| `src/components/SelectorInput.tsx`          | edit   | Dropdown-like selector  |
| `src/components/DevNavFloat.tsx`            | edit   | Dev-only nav float      |
| `src/components/MobileFrame.tsx`            | edit   | Dev-only mobile frame   |

### Steps

#### Step 5.1 — Migrate modal components

Untuk `ConfirmationModal`, `AlertModal`, `SwipeConfirmationModal`:

- Overlay: `className="flex-1 bg-black/50 items-center justify-center px-lg"`
- Card: `className="w-full bg-card rounded-xl p-xxl"`
- Title: `className="text-subheading text-dark text-center mb-sm"`
- Description: `className="text-body text-gray text-center mb-xl"`
- Button row: `className="flex-row gap-sm"`

#### Step 5.2 — Migrate complex picker modals

Untuk `CalendarModal` dan `TimePickerModal`:

- Banyak dynamic values untuk highlight cells → pertahankan `style={{ backgroundColor }}` untuk dynamic colors
- Structural/layout classes → className

#### Step 5.3 — Migrate menu components

Untuk `SortMenu`, `StatusFilterMenu`, `OverflowMenu`:

- Overlay/backdrop: `className="absolute inset-0"` (atau `StyleSheet.absoluteFill` equivalent)
- Menu card: `className="absolute right-lg top-12 bg-card rounded-lg shadow-md min-w-[180px]"`
- Menu item: `className="px-lg py-md border-b border-border"`
- Active item: conditional `className={isActive ? 'bg-accent/10' : ''}`

#### Step 5.4 — Migrate BottomTabBar

**File:** `src/components/BottomTabBar.tsx`  
**Details:**

- Container: `className="flex-row bg-card border-t border-border px-lg"`
- Tab item: `className="flex-1 items-center justify-center py-sm"`
- Active circle: `className="w-10 h-10 rounded-full bg-accent items-center justify-center"`
- Label: conditional active/inactive className

#### Step 5.5 — Migrate ScreenHeader

**File:** `src/components/ScreenHeader.tsx`  
**Details:**

- Container: `className="flex-row items-center px-xl py-md"`
- Icon button: `className="w-9 h-9 rounded-full border border-border items-center justify-center"`
- Title: `className="flex-1 text-center text-[17px] font-bold text-dark"`

#### Step 5.6 — Migrate remaining complex components

Terapkan migration pattern untuk semua file lain di daftar. Prinsip yang sama: structural → className, dynamic values → inline style.

### Verification

- [ ] Semua 25 komponen tercompile
- [ ] `npx tsc --noEmit` clean
- [ ] Jalankan dev server, cek BottomTabBar, ScreenHeader, modal dialogs via DevNav

### Tracking update

- Section: Shared components
- Refactor only

---

## Phase 6 — Feature: Auth & Onboarding ✓ done — 2026-05-06

### Goal

Migrasikan semua feature-specific components dan screens di auth dan onboarding features. Hapus import `AppTheme`/`authTheme`/`onboardingTheme` di komponen setelah semua nilai ter-replace dengan className.

### Affected files

| File                                                                | Action | Notes                  |
| ------------------------------------------------------------------- | ------ | ---------------------- |
| `src/features/auth/components/AuthButton.tsx`                       | edit   | Auth button            |
| `src/features/auth/components/AuthTextField.tsx`                    | edit   | Auth text field        |
| `src/features/auth/components/AuthScreenShell.tsx`                  | edit   | Auth layout wrapper    |
| `src/features/auth/components/AuthFooterPrompt.tsx`                 | edit   | Footer prompt          |
| `src/features/auth/components/OtpCodeInput.tsx`                     | edit   | OTP input              |
| `src/features/auth/screens/LoginScreen.tsx`                         | edit   | Login screen           |
| `src/features/auth/screens/RegisterScreen.tsx`                      | edit   | Register screen        |
| `src/features/auth/screens/ForgotPasswordScreen.tsx`                | edit   | Forgot password screen |
| `src/features/auth/screens/VerifyOtpScreen.tsx`                     | edit   | Verify OTP screen      |
| `src/features/auth/screens/VerifyAccountScreen.tsx`                 | edit   | Verify account screen  |
| `src/features/auth/screens/CreatePasswordScreen.tsx`                | edit   | Create password screen |
| `src/features/onboarding/components/BrandSplash.tsx`                | edit   | Brand splash           |
| `src/features/onboarding/components/OnboardingButton.tsx`           | edit   | Onboarding button      |
| `src/features/onboarding/components/OnboardingCard.tsx`             | edit   | Onboarding card        |
| `src/features/onboarding/components/OnboardingContainer.tsx`        | edit   | Onboarding container   |
| `src/features/onboarding/components/OnboardingIndicator.tsx`        | edit   | Progress dots          |
| `src/features/onboarding/screens/OnboardingSplashScreen.tsx`        | edit   | Splash screen          |
| `src/features/onboarding/screens/OnboardingEasyBookingScreen.tsx`   | edit   | Easy booking slide     |
| `src/features/onboarding/screens/OnboardingRunBarbershopScreen.tsx` | edit   | Run barbershop slide   |
| `src/features/onboarding/screens/OnboardingCustomerHappyScreen.tsx` | edit   | Customer happy slide   |

### Steps

#### Step 6.1 — Migrate auth components

Terapkan migration pattern. Khusus untuk `AuthButton.tsx`:

- `authTheme.colors.accent` → `bg-accent`
- `authTheme.colors.cardBackground` → `bg-card`
- `authTheme.radius.pill` → `rounded-full`
- `authTheme.spacing.lg` → `px-lg`
- Hapus import `authTheme` setelah semua ter-replace

Untuk `AuthScreenShell.tsx`:

- Background: `className="flex-1 bg-bg"`
- Card: `className="bg-card rounded-xl p-xxl mx-lg"`

#### Step 6.2 — Migrate auth screens

Screens menggunakan `SafeAreaView` + `ScrollView` wrapper. Migration:

- `SafeAreaView`: Tidak bisa langsung pakai className — gunakan `style={{ flex: 1, backgroundColor: '#EEEEE0' }}` ATAU tambahkan NativeWind-compatible SafeAreaView
- Semua internal layout elements → className
- Spacing helpers → className

> **Note:** `SafeAreaView` dari `react-native` tidak mendukung `className` secara native. Gunakan pattern:
> `<SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>` untuk SafeAreaView,
> atau import dari `react-native-safe-area-context` yang mendukung className via NativeWind.

#### Step 6.3 — Migrate onboarding components & screens

- `BrandSplash`: `className="flex-1 items-center justify-center bg-[#F5F4E8]"`
- `OnboardingContainer`: `className="flex-1 bg-bg"`
- `OnboardingCard`: `className="bg-card rounded-xl overflow-hidden"` + dynamic height
- `OnboardingIndicator`: active dot → `className="w-6 h-2 rounded-full bg-dark"`, inactive → `className="w-2 h-2 rounded-full bg-border"`
- `OnboardingButton`: reuse PrimaryButton/SecondaryButton className pattern

### Verification

- [ ] Semua 20 file tercompile
- [ ] `npx tsc --noEmit` clean
- [ ] Visual check: buka onboarding splash, swipe semua slides, buka login/register/forgot-password
- [ ] `npx expo lint` tidak ada warning baru

### Tracking update

- Section: Phase 1 (Auth & Onboarding)
- Tidak ada kolom status yang berubah (ini styling refactor)

---

## Phase 7 — Feature: Home, Workspace & Barbershop ✓ done — 2026-05-07

### Goal

Migrasikan screen files di features home, workspace, dan barbershop.

### Affected files

| File                                                                          | Action | Notes               |
| ----------------------------------------------------------------------------- | ------ | ------------------- |
| `src/features/home/screens/HomeDashboardScreen.tsx`                           | edit   | Home dashboard      |
| `src/features/workspace/screens/SwitchBarbershopScreen.tsx`                   | edit   | Switch workspace    |
| `src/features/workspace/screens/CreateBarbershopNameLogoScreen.tsx`           | edit   | Create step 0       |
| `src/features/workspace/screens/CreateBarbershopInviteBarberEmptyScreen.tsx`  | edit   | Create step 1a      |
| `src/features/workspace/screens/CreateBarbershopInviteBarberFilledScreen.tsx` | edit   | Create step 1b      |
| `src/features/workspace/screens/CreateBarbershopFirstServiceScreen.tsx`       | edit   | Create step 2       |
| `src/features/workspace/screens/CreateBarbershopSuccessScreen.tsx`            | edit   | Create success      |
| `src/features/barbershop/screens/BarbershopSettingsScreen.tsx`                | edit   | Barbershop settings |
| `src/features/barbershop/screens/EditBarbershopInfoScreen.tsx`                | edit   | Edit info fields    |
| `src/features/barbershop/screens/EditBookingUrlScreen.tsx`                    | edit   | Edit booking URL    |
| `src/features/barbershop/screens/ServicesManagementScreen.tsx`                | edit   | Services list       |
| `src/features/barbershop/screens/AddOrEditServiceScreen.tsx`                  | edit   | Add/edit service    |
| `src/features/barbershop/screens/ServiceDetailScreen.tsx`                     | edit   | Service detail      |
| `src/features/barbershop/screens/BarbershopManagementScreen.tsx`              | edit   | Barber management   |
| `src/features/barbershop/screens/InviteBarberScreen.tsx`                      | edit   | Invite barber       |
| `src/features/barbershop/screens/CustomerManagementScreen.tsx`                | edit   | Customer management |
| `src/features/barbershop/screens/CustomerDetailScreen.tsx`                    | edit   | Customer detail     |
| `src/features/barbershop/screens/OpenHoursScreen.tsx`                         | edit   | Open hours          |
| `src/features/barbershop/screens/SendMessagesToCustomersScreen.tsx`           | edit   | Send messages       |

### Steps

#### Step 7.1 — Migrate Home screen

**File:** `src/features/home/screens/HomeDashboardScreen.tsx`  
**Details:**

- Screen root: `<SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>` (SafeAreaView keeps style prop)
- All inner Views, Text, ScrollView elements → className
- Metric cards section, shortcut tiles → className
- Modal state remains as-is (tidak perubahan fungsionalitas)

#### Step 7.2 — Migrate Workspace screens

Terapkan migration pattern ke semua 6 workspace screens. Screen wrappers:

- `SafeAreaView` → tetap `style={{ flex: 1, backgroundColor: '#EEEEE0' }}`
- Internal layout → className
- WizardProgress component sudah dimigrasikan di Phase 3, tinggal composing className

#### Step 7.3 — Migrate Barbershop screens

Terapkan migration pattern ke semua 11 barbershop screens. Perhatian:

- `CustomerDetailScreen` punya tab panel (3 tab views) → SegmentedTabs sudah dimigrasikan
- `OpenHoursScreen` punya DayHoursRow iteration → DayHoursRow sudah dimigrasikan

### Verification

- [ ] Semua 19 file tercompile
- [ ] `npx tsc --noEmit` clean
- [ ] Visual check: buka home, barbershop settings, customer management
- [ ] `npx expo lint` clean

### Tracking update

- Section: Phase 2 (App shell & workspace) — refactor only, status tidak berubah

---

## Phase 8 — Feature: Profile, Schedule & Notifications ✓ done — 2026-05-07

### Goal

Migrasikan sisa screens: profile, schedule (10 screens), dan notifications.

### Affected files

| File                                                              | Action | Notes                      |
| ----------------------------------------------------------------- | ------ | -------------------------- |
| `src/features/profile/screens/UserProfileScreen.tsx`              | edit   | User profile               |
| `src/features/profile/screens/EditUserProfileFieldsScreen.tsx`    | edit   | Edit profile fields        |
| `src/features/profile/screens/VerifyContactScreen.tsx`            | edit   | Verify contact             |
| `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx`  | edit   | Active bookings            |
| `src/features/schedule/screens/BookingDetailRequestScreen.tsx`    | edit   | Booking detail request     |
| `src/features/schedule/screens/BookingDetailWaitingScreen.tsx`    | edit   | Booking detail waiting     |
| `src/features/schedule/screens/BookingDetailInProgressScreen.tsx` | edit   | Booking detail in-progress |
| `src/features/schedule/screens/BookingDetailResultScreen.tsx`     | edit   | Booking detail result      |
| `src/features/schedule/screens/HistoryBookingsScreen.tsx`         | edit   | History bookings           |
| `src/features/schedule/screens/NewAppointmentScreen.tsx`          | edit   | New appointment            |
| `src/features/schedule/screens/NewWalkInScreen.tsx`               | edit   | New walk-in                |
| `src/features/schedule/screens/SelectBarberScreen.tsx`            | edit   | Select barber              |
| `src/features/schedule/screens/SelectServicesScreen.tsx`          | edit   | Select services            |
| `src/features/notifications/screens/NotificationsListScreen.tsx`  | edit   | Notifications list         |

### Steps

#### Step 8.1 — Migrate Profile screens

Terapkan migration pattern ke 3 profile screens. `VerifyContactScreen` menggunakan `OtpCodeInput` yang sudah dimigrasikan di Phase 6.

#### Step 8.2 — Migrate Schedule screens

Terapkan migration pattern ke 10 schedule screens. Perhatian:

- `ScheduleActiveBookingsScreen` menggunakan `DateSelectorPill` (dimigrasikan Phase 3) dan `BookingCard` (dimigrasikan Phase 4)
- Booking detail screens menggunakan `BookingDetailCard`, `SwipeConfirmationModal` yang sudah dimigrasikan
- `NewAppointmentScreen` dan `NewWalkInScreen` menggunakan `BookingForm` (dimigrasikan Phase 4)

#### Step 8.3 — Migrate Notifications screen

Terapkan migration pattern ke `NotificationsListScreen`. Menggunakan `NotificationCard` yang sudah dimigrasikan di Phase 4.

### Verification

- [ ] Semua 14 file tercompile
- [ ] `npx tsc --noEmit` clean
- [ ] Visual check: buka profile, schedule active bookings, booking detail, notifications
- [ ] `npx expo lint` clean

### Tracking update

- Section: Phase 3 (Schedule & Profile) — refactor only

---

## Phase 9 — Final Validation & Docs Update ✓ done — 2026-05-09

### Goal

Full validation run: TypeScript check, linting, visual smoke test di semua pages via DevNav. Update `docs/track_pages_and_components.md` dengan catatan migrasi selesai. Hapus semua sisa `AppTheme` imports di komponen (hanya boleh ada di `tailwind.config.js`).

### Affected files

| File                                 | Action | Notes                                                                                          |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------- |
| `docs/project-conventions.md`        | edit   | Finalize NativeWind patterns, remove old StyleSheet rules                                      |
| `docs/track_pages_and_components.md` | edit   | Tambah implementation_notes: "Migrated to NativeWind"                                          |
| `src/app-theme.ts`                   | edit   | Tambah comment: "Values sourced into tailwind.config.js; do not import directly in components" |

### Steps

#### Step 9.1 — Audit remaining AppTheme imports

**Action:** Run grep

```bash
grep -r "import.*AppTheme\|import.*appTheme\|import.*authTheme\|import.*onboardingTheme" src/
```

- Setiap file yang masih mengimport theme → periksa apakah nilainya masih digunakan
- Jika hanya dipakai untuk style values → hapus import, ganti dengan className atau arbitrary value
- Jika dipakai untuk non-styling purposes → boleh dipertahankan

#### Step 9.2 — Audit remaining StyleSheet.create

**Action:** Run grep

```bash
grep -r "StyleSheet.create" src/
```

- Setiap sisa penggunaan → migrate ke className

#### Step 9.3 — Full TypeScript check

```bash
npx tsc --noEmit
```

Fix semua error yang muncul.

#### Step 9.4 — Lint check

```bash
npx expo lint
```

Fix semua warning baru yang muncul.

#### Step 9.5 — Update `src/app-theme.ts`

Tambah comment di atas export:

```ts
/**
 * Design tokens for cukkr-frontend.
 * These values are sourced into tailwind.config.js as custom tokens.
 * Do NOT import this file directly in components — use Tailwind className instead.
 * Exception: tailwind.config.js reads this file to generate class aliases.
 */
```

#### Step 9.6 — Update `docs/project-conventions.md`

- Section 3 sudah diupdate di Phase 2, tapi finalkan:
  - Hapus semua referensi ke `StyleSheet.create`
  - Tambah section **Dynamic Style Exceptions** (kapan boleh pakai `style={}`)
  - Tambah section **SafeAreaView Exception** (`SafeAreaView` dari `react-native` tetap pakai `style` prop)

### Verification

- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx expo lint` → 0 new warnings
- [ ] `grep -r "StyleSheet.create" src/` → 0 results
- [ ] `grep -r "import.*AppTheme" src/components/` → 0 results
- [ ] `grep -r "import.*AppTheme" src/features/` → 0 results
- [ ] Smoke test di seluruh DevNav pages: visual tidak ada regresi

### Tracking update

- Tambah note di setiap row di `track_pages_and_components.md`: styling refactored to NativeWind

---

## Notes

### Cross-phase constraints

1. **Phase 1 harus selesai sebelum phase lain** — tanpa infrastruktur, `className` prop akan menyebabkan TypeScript error
2. **Phase 2 harus selesai sebelum Phase 3+** — tanpa custom tokens (`bg-accent`, `text-dark`, dll), komponen harus pakai arbitrary values `bg-[#C6FF4D]` yang kurang readable
3. **Shared components (Phase 3-5) harus selesai sebelum Feature screens (Phase 6-8)** — screen files memakai shared components, jadi shared components harus sudah di-migrate dulu agar tidak ada campuran StyleSheet + NativeWind
4. **Phase 8 boleh paralel dengan Phase 7** — keduanya hanya feature screens, tidak saling bergantung

### NativeWind v4 gotchas

1. **`SafeAreaView`**: `react-native`'s `SafeAreaView` tidak mendukung `className` — gunakan `style={{ flex: 1, backgroundColor }}` atau import dari `react-native-safe-area-context`
2. **Pressable dynamic styles**: `style={({ pressed }) => pressed ? styles.pressed : null}` perlu dikonversi ke `style={({ pressed }) => pressed ? { opacity: 0.86 } : {}}`
3. **NativeWind v4 requires Tailwind v3** — jangan install `tailwindcss@4`
4. **New Architecture** (`newArchEnabled: true`) → NativeWind v4 fully supports ini
5. **Arbitrary values**: NativeWind v4 mendukung `bg-[#HEX]`, `w-[120px]`, dll
6. **`textAlignVertical`**: tidak ada Tailwind class → tetap pakai `style={{ textAlignVertical: 'top' }}`
7. **`placeholderTextColor`**: TextInput prop, bukan style → tidak berubah
8. **Shadow**: NativeWind v4 mendukung `shadow-md` dll tapi behavior di iOS vs Android berbeda

### Token naming decisions

- `AppTheme.colors.lightGray` → `text-light-gray` (kebab-case di Tailwind)
- `AppTheme.colors.dangerBg` → `bg-danger-bg`
- `AppTheme.colors.infoRowBg` → `bg-info-row-bg`

### AppTheme retention

`src/app-theme.ts` tidak dihapus — nilainya tetap digunakan di `tailwind.config.js` untuk generate custom classes. Di masa depan, kita bisa import langsung dari app-theme.ts di tailwind.config.js untuk satu sumber kebenaran.

### clsx installation (optional)

Jika banyak conditional className logic, install `clsx`:

```bash
pnpm add clsx
```

Gunakan: `className={clsx('base-class', condition && 'conditional-class')}`
