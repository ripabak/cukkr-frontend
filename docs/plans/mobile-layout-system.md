# Plan: Mobile Layout System

## Goal

Membangun sistem layout terpusat untuk cukkr-frontend dengan dua tujuan:

1. **Mobile-on-web**: Saat dibuka di browser desktop, app harus tetap tampil seperti layar ponsel — centered dalam frame 390 px, dark background di luar frame. Cukup satu komponen di root layout untuk mengaktifkan ini ke semua screen.
2. **Reusable screen shells**: Mengekstrak boilerplate `SafeAreaView → View → ScrollView` yang berulang di 14+ screen ke dua komponen shell — `ScreenShell` dan `FormShell` — sehingga setiap screen hanya perlu mendeklarasikan kontennya.

## Phases Overview

| Phase | Name                   | Type    | Scope summary                                                                 | Status             |
| ----- | ---------------------- | ------- | ----------------------------------------------------------------------------- | ------------------ |
| 1     | Core Layout Components | infra   | Buat MobileFrame + ScreenShell + FormShell; wire MobileFrame di `_layout.tsx` | ✅ done 2026-05-03 |
| 2     | Screen Migrations      | slicing | Migrate 14 screen ke ScreenShell (hapus wrapper boilerplate)                  | ✅ done 2026-05-03 |
| 3     | Docs Update            | infra   | Update conventions + tracking                                                 | ✅ done 2026-05-03 |

> Execute with `/eksekusi-plan-by-phase docs/plans/mobile-layout-system.md`
> To run a specific phase: `/eksekusi-plan-by-phase docs/plans/mobile-layout-system.md phase:2`

---

## Phase 1 — Core Layout Components

### Goal

Buat 3 komponen layout dan langsung wire `MobileFrame` di root. Tidak ada screen yang diubah di phase ini — hanya komponen baru + satu edit di `_layout.tsx`.

### Affected files

| File                             | Action | Notes                                     |
| -------------------------------- | ------ | ----------------------------------------- |
| `src/components/MobileFrame.tsx` | CREATE | Platform-conditional web viewport wrapper |
| `src/components/ScreenShell.tsx` | CREATE | Standard scrollable screen wrapper        |
| `src/components/FormShell.tsx`   | CREATE | Keyboard-aware scrollable screen wrapper  |
| `app/_layout.tsx`                | EDIT   | Wrap root view dalam MobileFrame          |

---

### Steps

#### Step 1.1 — Create MobileFrame

**File:** `src/components/MobileFrame.tsx`
**Action:** create

**Details:**

- Named export `MobileFrame`
- Props: `{ children: React.ReactNode }`
- Ketika `Platform.OS !== 'web'` → render `<View style={{ flex: 1 }}>{children}</View>` (passthrough)
- Ketika `Platform.OS === 'web'` → render centering wrapper:
  - Outer `View`: `flex: 1, backgroundColor: '#1A1A1A', alignItems: 'center'`
  - Inner `View`: `width: 390, flex: 1, overflow: 'hidden'`
- Konstanta `MOBILE_WIDTH = 390` di atas komponen

```tsx
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const MOBILE_WIDTH = 390;

interface Props {
  children: React.ReactNode;
}

export function MobileFrame({ children }: Props) {
  if (Platform.OS !== "web") {
    return <View style={styles.native}>{children}</View>;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
  },
  webOuter: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
  },
  webInner: {
    width: MOBILE_WIDTH,
    flex: 1,
    overflow: "hidden",
  },
});
```

---

#### Step 1.2 — Create ScreenShell

**File:** `src/components/ScreenShell.tsx`
**Action:** create

**Details:**

Komponen ini menggantikan boilerplate `SafeAreaView > View(outer) > ScrollView` yang ada di mayoritas screen.

**Props interface:**

```ts
interface Props {
  children: React.ReactNode;
  /** Sticky element rendered ABOVE the ScrollView (e.g. ScreenHeader, custom topBar) */
  headerSlot?: React.ReactNode;
  /** Sticky element rendered BELOW the ScrollView (e.g. BottomTabBar, StickyCta) */
  footerSlot?: React.ReactNode;
  /** Absolutely-positioned overlays (SortMenu, StatusFilterMenu, OverflowMenu that are NOT React Native Modal) */
  overlaySlot?: React.ReactNode;
  /** SafeAreaView background color — default: AppTheme.colors.bg ('#EEEEE0') */
  backgroundColor?: string;
  /** Additional style for scrollContent (e.g. override paddingBottom) */
  contentStyle?: ViewStyle;
  /** Override SafeAreaView root style — always last */
  style?: ViewStyle;
  /** Safe area edges to apply — default: all. Pass ['top'] to exclude bottom. */
  edges?: ("top" | "bottom" | "left" | "right")[];
}
```

**Structure:**

```tsx
<SafeAreaView
  style={[styles.safeArea, { backgroundColor }, style]}
  edges={edges}
>
  {headerSlot}
  <ScrollView
    style={styles.scroll}
    contentContainerStyle={[styles.scrollContent, contentStyle]}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
    {children}
  </ScrollView>
  {footerSlot}
  {overlaySlot}
</SafeAreaView>
```

**Default styles:**

```ts
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: AppTheme.spacing.xl, // 20
    paddingBottom: 40,
  },
});
```

**Imports needed:**

```ts
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import AppTheme from "@/src/app-theme";
```

---

#### Step 1.3 — Create FormShell

**File:** `src/components/FormShell.tsx`
**Action:** create

**Details:**

Sama dengan `ScreenShell` tapi ScrollView dibungkus `KeyboardAvoidingView`. Gunakan untuk screen yang punya input teks (TextInput, dll).

**Props:** identik dengan `ScreenShell`

**Structure:**

```tsx
<SafeAreaView
  style={[styles.safeArea, { backgroundColor }, style]}
  edges={edges}
>
  {headerSlot}
  <KeyboardAvoidingView
    style={styles.keyboardView}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
  {footerSlot}
  {overlaySlot}
</SafeAreaView>
```

**Imports needed:**

```ts
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTheme from "@/src/app-theme";
```

---

#### Step 1.4 — Wire MobileFrame in root layout

**File:** `app/_layout.tsx`
**Action:** edit

**Details:**

- Import `MobileFrame` dari `@/src/components/MobileFrame`
- Bungkus seluruh konten (termasuk `<Stack>` dan `<DevNavFloat>`) dalam `<MobileFrame>`

```tsx
// BEFORE
export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <DevNavFloat />
    </View>
  );
}

// AFTER
export default function RootLayout() {
  return (
    <MobileFrame>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <DevNavFloat />
      </View>
    </MobileFrame>
  );
}
```

---

### Verification

- [ ] Buka di mobile / simulator — tidak ada visual change
- [ ] Buka di browser desktop (`npx expo start --web`) — app tampil di center dengan lebar 390px, dark bg di kiri/kanan
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint errors: `npx expo lint`

### Tracking update

- Section: `Miscellaneous / Infrastructure`
- Add 3 rows: `MobileFrame`, `ScreenShell`, `FormShell`

---

## Phase 2 — Screen Migrations

### Goal

Migrate semua screen ScrollView-based ke `ScreenShell`. Setiap screen hanya perlu:

1. Import `ScreenShell` dan hapus import `SafeAreaView`, `ScrollView` (dan `View` jika tidak dipakai lagi)
2. Ganti wrapper dengan `<ScreenShell [props]>`
3. Hapus style-style wrapper yang sudah tidak dipakai (`safeArea`, `outer`, `scrollView`, `scrollContent`)

### Layout Migration Map

Setiap baris menjelaskan slot yang digunakan dan warna background:

| Screen                                   | headerSlot             | footerSlot                              | overlaySlot                                                         | backgroundColor   | Special notes                                                                                       |
| ---------------------------------------- | ---------------------- | --------------------------------------- | ------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| HomeDashboardScreen                      | —                      | `<BottomTabBar activeTab="home" />`     | —                                                                   | default (#EEEEE0) | TopRow + greetingRow are inside scroll                                                              |
| BarbershopSettingsScreen                 | —                      | `<BottomTabBar activeTab="profile" />`  | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll; paddingBottom: 40 (was 120)                                             |
| BarbershopManagementScreen               | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll                                                                          |
| ServicesManagementScreen                 | `<ScreenHeader ... />` | —                                       | `sortMenuVisible && <SortMenu .../>`                                | default (#EEEEE0) | SortMenu is NOT a React Native Modal; must be in overlaySlot                                        |
| HistoryBookingsScreen                    | `<ScreenHeader ... />` | —                                       | overlays for statusMenu + sortMenu                                  | default (#EEEEE0) | Both SortMenu + StatusFilterMenu in overlaySlot                                                     |
| UserProfileScreen                        | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll; fix SafeAreaView import (react-native → react-native-safe-area-context) |
| CreateBarbershopNameLogoScreen           | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll                                                                          |
| CreateBarbershopInviteBarberEmptyScreen  | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll                                                                          |
| CreateBarbershopInviteBarberFilledScreen | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll                                                                          |
| CreateBarbershopFirstServiceScreen       | —                      | —                                       | —                                                                   | default (#EEEEE0) | ScreenHeader inside scroll                                                                          |
| CreateBarbershopSuccessScreen            | —                      | —                                       | —                                                                   | default (#EEEEE0) | No ScreenHeader                                                                                     |
| ScheduleActiveBookingsScreen             | `topBar + DayChipRow`  | `<BottomTabBar activeTab="schedule" />` | `StatusFilterMenu`                                                  | `'#F5F4E8'`       | Most complex migration; CalendarModal uses RN Modal (inside children is fine)                       |
| NewAppointmentScreen                     | `<ScreenHeader ... />` | —                                       | CalendarModal + TimePickerModal (use RN Modal → inside children ok) | `'#F5F4E8'`       | Use FormShell (has TextInput fields)                                                                |
| NewWalkInScreen                          | `<ScreenHeader ... />` | —                                       | —                                                                   | `'#F5F4E8'`       | Use FormShell                                                                                       |

**Screens NOT migrated in this phase (intentionally skipped):**

- `CustomerManagementScreen` — dynamic `backgroundColor` switching (selection mode); complex SelectionToolbar + FloatingActionButton; migrate separately
- `SwitchBarbershopScreen` — does not use ScrollView (flex column with spacers + pinned CTA)
- `SelectBarberScreen` — uses FlatList, not ScrollView; SafeAreaView from react-native (wrong — fix separately)
- `SelectServicesScreen` — uses FlatList / similar
- `BookingDetailInProgress/Waiting/Request/Result` — unique sticky-nav + BookingDetailCard + StickyCta pattern; do NOT migrate

---

### Steps

**General migration pattern per screen:**

```tsx
// REMOVE these imports
import { SafeAreaView } from 'react-native-safe-area-context'; // (or react-native)
import { ScrollView, View, ... } from 'react-native';          // remove unused ones

// ADD this import
import { ScreenShell } from '@/src/components/ScreenShell';

// BEFORE
return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.outer}>
      {/* optional: sticky header */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* content */}
      </ScrollView>
      {/* optional: sticky footer */}
    </View>
  </SafeAreaView>
);

// AFTER
return (
  <ScreenShell headerSlot={...} footerSlot={...} overlaySlot={...} backgroundColor="...">
    {/* same content */}
  </ScreenShell>
);

// REMOVE from StyleSheet: safeArea, outer, scrollView, scrollContent
```

---

#### Step 2.1 — Migrate HomeDashboardScreen

**File:** `src/features/home/screens/HomeDashboardScreen.tsx`
**Action:** edit

- Import `ScreenShell` from `@/src/components/ScreenShell`; remove `SafeAreaView`, `ScrollView` imports (keep `View` for inner UI elements)
- Replace `<SafeAreaView><View style={styles.outer}><ScrollView...>...</ScrollView><BottomTabBar/></View></SafeAreaView>` with `<ScreenShell footerSlot={<BottomTabBar activeTab="home" onTabPress={() => {}} />}>`
- Remove styles: `safeArea`, `outer`, `scrollView`, `scrollContent`
- `ConfirmationModal` already uses RN Modal → place it inside `children` (before `</ScreenShell>`)

---

#### Step 2.2 — Migrate BarbershopSettingsScreen

**File:** `src/features/barbershop/screens/BarbershopSettingsScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView` (keep `View`, `Text`)
- Replace wrapper with `<ScreenShell footerSlot={<BottomTabBar activeTab="profile" onTabPress={() => {}} />}>`
- `tabBarWrapper` style no longer needed (BottomTabBar is now in footerSlot directly)
- Remove styles: `safeArea`, `outer`, `scrollView`, `scrollContent`, `tabBarWrapper`
- `paddingBottom` on scrollContent was 120 — with ScreenShell default of 40 this is fine (BottomTabBar is outside scroll now)

---

#### Step 2.3 — Migrate BarbershopManagementScreen

**File:** `src/features/barbershop/screens/BarbershopManagementScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView`
- Replace with `<ScreenShell>` (no slots needed — ScreenHeader is inside children)
- `ConfirmationModal` uses RN Modal → place inside `children` at bottom
- Remove styles: `safeArea`, `scrollView`, `scrollContent`

---

#### Step 2.4 — Migrate ServicesManagementScreen

**File:** `src/features/barbershop/screens/ServicesManagementScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView`
- `ScreenHeader` is currently OUTSIDE ScrollView → put in `headerSlot`
- `SortMenu` is NOT a React Native Modal (renders backdrop + view inline) → put in `overlaySlot`:
  ```tsx
  overlaySlot={
    sortMenuVisible ? (
      <View style={styles.menuOverlay}>
        <SortMenu
          visible
          selected={selectedSort}
          onSelect={setSelectedSort}
          onClose={() => setSortMenuVisible(false)}
          options={MOCK_SORT_OPTIONS}
        />
      </View>
    ) : null
  }
  ```
- Remove styles: `safeArea`, `outer`, `scrollView`, `scrollContent`

---

#### Step 2.5 — Migrate HistoryBookingsScreen

**File:** `src/features/schedule/screens/HistoryBookingsScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView`
- `ScreenHeader` is outside ScrollView → put in `headerSlot`
- `StatusFilterMenu` and `SortMenu` are inline overlays → put in `overlaySlot`:
  ```tsx
  overlaySlot={
    <>
      {statusMenuVisible && (
        <View style={styles.menuOverlay}>
          <StatusFilterMenu ... />
        </View>
      )}
      {sortMenuVisible && (
        <View style={styles.menuOverlay}>
          <SortMenu ... />
        </View>
      )}
    </>
  }
  ```
- `CalendarModal` uses RN Modal → inside children
- `backgroundColor` = `'#F5F4E8'` (or check actual value in current file)
- Remove styles: `safeArea`, `outer`, `scrollView`, `scrollContent`

---

#### Step 2.6 — Migrate UserProfileScreen

**File:** `src/features/profile/screens/UserProfileScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView` (note: currently imported from `react-native` — this is a wrong import that will be fixed by switching to ScreenShell), remove `ScrollView`
- Replace with `<ScreenShell>` (no slots — ScreenHeader inside children)
- All modals (`ConfirmationModal`, `AlertModal`) use RN Modal → keep inside children
- Remove styles: `safeArea` (or equivalent root style), `scrollView`, `scrollContent`

---

#### Step 2.7 — Migrate CreateBarbershopNameLogoScreen

**File:** `src/features/workspace/screens/CreateBarbershopNameLogoScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView`
- Replace wrapper with `<ScreenShell>`
- Remove boilerplate styles

---

#### Step 2.8 — Migrate CreateBarbershopInviteBarberEmptyScreen

**File:** `src/features/workspace/screens/CreateBarbershopInviteBarberEmptyScreen.tsx`
**Action:** edit

- Same pattern as Step 2.7

---

#### Step 2.9 — Migrate CreateBarbershopInviteBarberFilledScreen

**File:** `src/features/workspace/screens/CreateBarbershopInviteBarberFilledScreen.tsx`
**Action:** edit

- Same pattern as Step 2.7

---

#### Step 2.10 — Migrate CreateBarbershopFirstServiceScreen

**File:** `src/features/workspace/screens/CreateBarbershopFirstServiceScreen.tsx`
**Action:** edit

- Same pattern as Step 2.7

---

#### Step 2.11 — Migrate CreateBarbershopSuccessScreen

**File:** `src/features/workspace/screens/CreateBarbershopSuccessScreen.tsx`
**Action:** edit

- Same pattern as Step 2.7 (no ScreenHeader — just content in children)

---

#### Step 2.12 — Migrate ScheduleActiveBookingsScreen _(most complex)_

**File:** `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx`
**Action:** edit

- Import `ScreenShell`; remove `SafeAreaView`, `ScrollView`
- `backgroundColor="#F5F4E8"`
- `headerSlot` = the sticky topBar + DayChipRow:
  ```tsx
  headerSlot={
    <>
      <View style={styles.topBar}>
        {/* DateSelectorPill + action buttons */}
      </View>
      <View style={styles.dayChipsWrapper}>
        <DayChipRow ... />
      </View>
    </>
  }
  ```
- `footerSlot` = `<View style={styles.tabBarWrapper}><BottomTabBar activeTab="schedule" onTabPress={() => {}} /></View>`
- `overlaySlot` = `StatusFilterMenu` (not RN Modal):
  ```tsx
  overlaySlot={
    filterMenuVisible ? (
      <View style={styles.menuOverlay}>
        <StatusFilterMenu ... />
      </View>
    ) : null
  }
  ```
- `CalendarModal` uses RN Modal → inside children
- Remove styles: `safeArea`, `outer`, `scrollView`, `scrollContent`, `tabBarWrapper` (keep topBar, dayChipsWrapper, and other content styles)

---

#### Step 2.13 — Migrate NewAppointmentScreen _(FormShell)_

**File:** `src/features/schedule/screens/NewAppointmentScreen.tsx`
**Action:** edit

- Import `FormShell` (not `ScreenShell` — has TextInput fields)
- `ScreenHeader` (with `BookingTypeToggle` in rightAction) is outside ScrollView → `headerSlot`
- `backgroundColor="#F5F4E8"`
- `CalendarModal` and `TimePickerModal` use RN Modal → inside children
- Replace wrapper; remove boilerplate styles

---

#### Step 2.14 — Migrate NewWalkInScreen _(FormShell)_

**File:** `src/features/schedule/screens/NewWalkInScreen.tsx`
**Action:** edit

- Same pattern as Step 2.13 (FormShell, ScreenHeader in headerSlot, backgroundColor="#F5F4E8")

---

### Verification

- [ ] Ogni screen visuallment identik dengan sebelum migrasi (spot check 5 screens)
- [ ] `ScreenShell` + `FormShell` tidak error
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint errors: `npx expo lint`

### Tracking update

- Section: Miscellaneous / Infrastructure
- Tambah note di `MobileFrame`, `ScreenShell`, `FormShell` rows bahwa migrations Phase 2 telah selesai

---

## Phase 3 — Docs Update

### Goal

Update project conventions dan tracking agar pattern baru terdokumentasi.

### Affected files

| File                                 | Action | Notes                             |
| ------------------------------------ | ------ | --------------------------------- |
| `docs/project-conventions.md`        | EDIT   | Tambah Section: Layout Components |
| `docs/track_pages_and_components.md` | EDIT   | Tambah 3 rows di Miscellaneous    |

### Steps

#### Step 3.1 — Update project-conventions.md

**File:** `docs/project-conventions.md`
**Action:** edit

Tambah section baru setelah **Section 4. Screen Patterns**:

````markdown
## 4a. Layout Components

### MobileFrame — Web viewport constraint

Wrap the root layout once. All screens automatically render in a centered 390px frame on web.

```tsx
// app/_layout.tsx — already done
<MobileFrame>
  <View style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: false }} />
  </View>
</MobileFrame>
```
````

### ScreenShell — Standard scrollable screen

Use for any screen that is primarily a scrollable list/form without text inputs.

```tsx
<ScreenShell
  headerSlot={<ScreenHeader onBack={() => router.back()} />}  // sticky, outside scroll
  footerSlot={<BottomTabBar activeTab="home" />}              // sticky, outside scroll
  overlaySlot={sortVisible ? <SortMenu ... /> : null}         // absolute overlays (not RN Modal)
  backgroundColor="#F5F4E8"                                    // optional, default: AppTheme.colors.bg
  contentStyle={{ paddingBottom: 24 }}                        // optional scrollContent override
>
  {/* scrollable content */}
</ScreenShell>
```

**When to use `overlaySlot`:** For `SortMenu`, `StatusFilterMenu`, `OverflowMenu` — these render a backdrop + absolute-positioned view directly in the component tree (not React Native Modal). They MUST be outside ScrollView.

**React Native Modal-based components** (`ConfirmationModal`, `AlertModal`, `CalendarModal`, `TimePickerModal`, `SwipeConfirmationModal`) can go anywhere in children — they render above everything via the native Modal API.

### FormShell — Keyboard-aware scrollable screen

Identical API to `ScreenShell` but wraps the ScrollView in `KeyboardAvoidingView`. Use whenever the screen has `TextInput` fields.

```tsx
<FormShell headerSlot={<ScreenHeader ... />}>
  <TextInputField label="Name" value={name} onChangeText={setName} />
  ...
</FormShell>
```

```

---

#### Step 3.2 — Update track_pages_and_components.md

**File:** `docs/track_pages_and_components.md`
**Action:** edit

Tambah 3 baris ke tabel Miscellaneous / Infrastructure:

| nama_item | kegunaan | slicing_implemented | ui_functional_implemented | functioning_api_implemented | lokasi | implementation_notes |
|-----------|---------|---------------------|---------------------------|-----------------------------|--------|---------------------|
| MobileFrame | Platform-conditional wrapper — on web, centers app in 390px frame with dark bg; on native, passthrough View | [x] | [x] | N/A | src/components/MobileFrame.tsx | Applied in app/_layout.tsx; affects all screens on web automatically |
| ScreenShell | Standard scrollable screen wrapper replacing `SafeAreaView > View > ScrollView` boilerplate; supports headerSlot, footerSlot, overlaySlot | [x] | [x] | N/A | src/components/ScreenShell.tsx | Use for screens without keyboard inputs; use FormShell for input screens |
| FormShell | Keyboard-aware variant of ScreenShell — adds KeyboardAvoidingView around ScrollView | [x] | [x] | N/A | src/components/FormShell.tsx | Use whenever screen has TextInput fields |

---

### Verification

- [ ] `docs/project-conventions.md` Section 4a is readable and accurate
- [ ] `docs/track_pages_and_components.md` has 3 new Miscellaneous rows

---

## Notes

### Design decisions

1. **`MobileFrame` is a passthrough on native** — No performance overhead. On native, renders as a plain `<View style={{ flex: 1 }}>`.

2. **`overflow: 'hidden'` on webInner** — Prevents content from bleeding outside the 390px frame. React Native Web supports this style property.

3. **`overlaySlot` for inline menus** — `SortMenu`, `StatusFilterMenu`, `OverflowMenu` are NOT React Native `<Modal>` components — they render a backdrop View that fills the screen via `StyleSheet.absoluteFill`. Placing them inside a ScrollView clips them at the scroll boundary. The `overlaySlot` renders outside the ScrollView but inside SafeAreaView.

4. **React Native Modal-based components in `children` is fine** — `ConfirmationModal`, `AlertModal`, `CalendarModal`, `TimePickerModal`, `SwipeConfirmationModal` all use `<Modal>` from `react-native`, which renders above the entire app tree regardless of where it appears in JSX. No need for special slot.

5. **`edges` prop on ScreenShell** — Passes to `SafeAreaView` from `react-native-safe-area-context`. Some screens (e.g. `CustomerManagementScreen`) use `edges={['top']}`. Default is all edges.

6. **FormShell default paddingBottom: 40** — With `KeyboardAvoidingView`, the bottom inset is managed by the keyboard. The paddingBottom on scrollContent is for visual breathing room only.

### Screens intentionally NOT migrated in Phase 2

| Screen | Reason |
|--------|--------|
| `CustomerManagementScreen` | Dynamic background color, complex SelectionToolbar mode switching |
| `SwitchBarbershopScreen` | No ScrollView — uses flex column with spacers + pinned CTA |
| `SelectBarberScreen` | FlatList based; also uses `SafeAreaView` from `react-native` (wrong import) |
| `SelectServicesScreen` | FlatList / custom list pattern |
| `BookingDetail*Screen` (all 4) | Unique pattern: sticky nav header + `BookingDetailCard` + `StickyCta`; already works well |

### `SafeAreaView` import correction

`UserProfileScreen` and `SelectBarberScreen` currently import `SafeAreaView` from `react-native` instead of `react-native-safe-area-context`. The Phase 2 migration of `UserProfileScreen` fixes this automatically (ScreenShell uses the correct import internally). `SelectBarberScreen` should be fixed separately.
```
