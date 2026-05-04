> **Status: DONE** — Executed on 2026-05-02

# Plan: Onboarding Tampil Sekali Saja

## Goal

Halaman onboarding (splash → easy-booking → run-barbershop → customer-happy) hanya ditampilkan satu kali saat pertama kali user membuka aplikasi. Setelah user menekan "Get Started" di slide terakhir, flag `hasSeenOnboarding` disimpan secara persisten menggunakan Zustand + AsyncStorage. Pada pembukaan berikutnya, `app/index.tsx` langsung redirect ke `/login` (atau nantinya ke dashboard jika sudah auth).

## Scope

- Phase: **ui-functional**
- Affected pages/components:
  - `app/index.tsx` — logika redirect awal
  - `src/features/onboarding/screens/OnboardingCustomerHappyScreen.tsx` — set flag sebelum navigate
  - `src/features/onboarding/stores/onboardingStore.ts` — **CREATE** Zustand persist store

## Analysis

### State saat ini

- `app/index.tsx` selalu redirect ke `/onboarding-splash` tanpa pengecekan apapun.
- `OnboardingCustomerHappyScreen` pada tombol "Get Started" langsung memanggil `router.replace("/login")` tanpa menyimpan state.
- Tidak ada Zustand maupun `@react-native-async-storage/async-storage` di `package.json`.
- Belum ada store apapun di `src/features/onboarding/`.

### Pola yang dipakai

- Store Zustand dengan `persist` middleware + `createJSONStorage(() => AsyncStorage)`.
- Tambahkan field `_hasHydrated` di store untuk mendeteksi kapan AsyncStorage selesai dibaca, sehingga `index.tsx` tidak redirect prematur sebelum data terbaca.
- `index.tsx` mengembalikan `null` (layar kosong) saat belum hydrated, lalu redirect begitu hydration selesai.

## Files to create / edit

| File                                                                | Action     | Notes                                                             |
| ------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| `package.json`                                                      | edit       | Tambah `zustand` dan `@react-native-async-storage/async-storage`  |
| `src/features/onboarding/stores/onboardingStore.ts`                 | **create** | Zustand persist store dengan `hasSeenOnboarding` + `_hasHydrated` |
| `app/index.tsx`                                                     | edit       | Baca store, redirect ke `/onboarding-splash` atau `/login`        |
| `src/features/onboarding/screens/OnboardingCustomerHappyScreen.tsx` | edit       | Panggil `markOnboardingSeen()` sebelum `router.replace("/login")` |
| `docs/track_pages_and_components.md`                                | edit       | Tambah baris onboarding store di bagian infra/miscellaneous       |

## Execution steps

### Step 1 — Install dependencies

**File:** `package.json` (via terminal)  
**Action:** install  
**Details:**

- Jalankan: `pnpm add zustand @react-native-async-storage/async-storage`
- Kedua package ini belum ada di `package.json`.

---

### Step 2 — Buat Zustand onboarding store

**File:** `src/features/onboarding/stores/onboardingStore.ts`  
**Action:** create  
**Details:**

- Buat store dengan type `OnboardingState`:
  ```ts
  type OnboardingState = {
    hasSeenOnboarding: boolean;
    _hasHydrated: boolean;
    markOnboardingSeen: () => void;
    setHasHydrated: (val: boolean) => void;
  };
  ```
- Gunakan `create<OnboardingState>()(persist(...))` dari `zustand` dan `zustand/middleware`.
- `storage`: `createJSONStorage(() => AsyncStorage)` dari `@react-native-async-storage/async-storage`.
- `name`: `'cukkr-onboarding'` (key di AsyncStorage).
- `onRehydrateStorage`: callback yang memanggil `state?.setHasHydrated(true)` setelah hydration selesai.
- Initial state: `hasSeenOnboarding: false`, `_hasHydrated: false`.
- Hanya `hasSeenOnboarding` yang di-persist (gunakan `partialize` untuk exclude `_hasHydrated`).

Contoh implementasi:

```ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingState = {
  hasSeenOnboarding: boolean;
  _hasHydrated: boolean;
  markOnboardingSeen: () => void;
  setHasHydrated: (val: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      _hasHydrated: false,
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: "cukkr-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
```

---

### Step 3 — Update `app/index.tsx`

**File:** `app/index.tsx`  
**Action:** edit  
**Details:**

- Import `useOnboardingStore` dari `@/src/features/onboarding/stores/onboardingStore`.
- Baca `hasSeenOnboarding` dan `_hasHydrated` dari store.
- Jika `!_hasHydrated` → return `null` (tunggu AsyncStorage selesai dibaca).
- Jika `_hasHydrated && hasSeenOnboarding` → `<Redirect href="/login" />`.
- Jika `_hasHydrated && !hasSeenOnboarding` → `<Redirect href="/onboarding-splash" />`.

```tsx
import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { Redirect } from "expo-router";

export default function Index() {
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const hasHydrated = useOnboardingStore((s) => s._hasHydrated);

  if (!hasHydrated) return null;

  return (
    <Redirect href={hasSeenOnboarding ? "/login" : "/onboarding-splash"} />
  );
}
```

---

### Step 4 — Update `OnboardingCustomerHappyScreen.tsx`

**File:** `src/features/onboarding/screens/OnboardingCustomerHappyScreen.tsx`  
**Action:** edit  
**Details:**

- Import `useOnboardingStore` dari `@/src/features/onboarding/stores/onboardingStore`.
- Di dalam komponen, ambil `markOnboardingSeen` dari store.
- Di handler tombol "Get Started", panggil `markOnboardingSeen()` **sebelum** `router.replace("/login")`.

```tsx
const markOnboardingSeen = useOnboardingStore((s) => s.markOnboardingSeen);

// ...
onPress={() => {
  markOnboardingSeen();
  router.replace("/login");
}}
```

---

### Step 5 — Update `docs/track_pages_and_components.md`

**File:** `docs/track_pages_and_components.md`  
**Action:** edit  
**Details:**

- Tambah section baru "Infrastructure / Global Stores" (atau ke Phase 1 sebagai baris komponen baru).
- Tambah baris untuk `onboarding-store`:

| nama_komponen    | dependency                                         | kegunaan                                       | slicing_implemented | functioning_api_implemented | lokasi                                            | lokasi_referensi_png | implementation_notes                                                                                |
| ---------------- | -------------------------------------------------- | ---------------------------------------------- | ------------------- | --------------------------- | ------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| onboarding-store | zustand, @react-native-async-storage/async-storage | Persist flag hasSeenOnboarding ke AsyncStorage | [x]                 | [x]                         | src/features/onboarding/stores/onboardingStore.ts | -                    | Zustand persist store; \_hasHydrated digunakan index.tsx untuk menunggu AsyncStorage selesai dibaca |

## Verification

- [ ] Install sukses: `zustand` dan `@react-native-async-storage/async-storage` muncul di `package.json`
- [ ] Buka app pertama kali (atau reset AsyncStorage) → onboarding splash tampil
- [ ] Tekan "Get Started" di slide terakhir → masuk ke login
- [ ] Restart app → langsung masuk ke login (skip onboarding)
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint warnings: `npx expo lint`

## Tracking update

- Tracking file: `docs/track_pages_and_components.md`
- Section: Phase 1 — Components (atau tambah section baru "Infrastructure")
- Row baru: `onboarding-store`

## Notes

- `_hasHydrated` **tidak** di-persist ke AsyncStorage (dikecualikan via `partialize`). Setiap cold start selalu mulai `false` sampai AsyncStorage terbaca.
- Saat `index.tsx` return `null`, layar akan kosong sebentar. Ini acceptable karena AsyncStorage sangat cepat, tapi jika ingin lebih halus bisa diganti dengan splash screen native via `expo-splash-screen`.
- Di masa depan ketika auth sudah diintegrasikan, kondisi redirect di `index.tsx` akan perlu diperluas: check token auth juga, tidak hanya `hasSeenOnboarding`.
- Jangan lupa jalankan `npx expo start` setelah install untuk generate ulang expo type jika ada error href link.
