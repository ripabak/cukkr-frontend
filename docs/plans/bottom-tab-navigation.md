> **Status: DONE** — Executed on 2026-05-03

# Plan: Bottom Tab Navigation with Expo Router Tabs

## Goal

Menjadikan `BottomTabBar` benar-benar berfungsi sebagai navigasi menggunakan Expo Router's `<Tabs>` navigator, sambil mempertahankan tampilan pill floating yang sudah ada (style `#C6FF4D` active circle, rounded pill, shadow). Pendekatan: buat route group `app/(tabs)/` dengan custom `tabBar` prop yang merender komponen `BottomTabBar` yang sudah ada — tanpa mengubah stylenya sama sekali.

## Apakah bisa pakai Expo Tab Bar dengan style yang sama?

**Ya, bisa.** Expo Router `<Tabs>` mendukung prop `tabBar` yang menerima render function custom. Kita bisa inject `BottomTabBar` kita di sana, dan map state navigasi Expo ke props `activeTab` / `onTabPress`. Style tidak perlu diubah.

## Scope

- Phase: ui-functional
- Affected pages/components:
  - `app/(tabs)/_layout.tsx` (CREATE) — Tabs layout + custom tabBar renderer
  - `app/(tabs)/home.tsx` (CREATE) — thin tab screen
  - `app/(tabs)/stats.tsx` (CREATE) — thin tab screen (placeholder)
  - `app/(tabs)/schedule.tsx` (CREATE) — thin tab screen
  - `app/(tabs)/profile.tsx` (CREATE) — thin tab screen
  - `app/index.tsx` (EDIT) — update redirect ke `/home`
  - `src/components/BottomTabBar.tsx` (EDIT) — buat `onTabPress` optional
  - `src/features/home/screens/HomeDashboardScreen.tsx` (EDIT) — hapus BottomTabBar
  - `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx` (EDIT) — hapus BottomTabBar
  - `src/features/barbershop/screens/BarbershopSettingsScreen.tsx` (EDIT) — hapus BottomTabBar

## Analysis

### Keadaan saat ini

- `app/_layout.tsx` menggunakan `<Stack>` — tidak ada Tabs sama sekali.
- `BottomTabBar` adalah komponen manual yang di-render di setiap screen. `onTabPress` selalu `() => {}` (tidak berfungsi).
- 3 screen menggunakan `BottomTabBar`:
  - `HomeDashboardScreen` → `overlaySlot` (absolutely positioned, bottom: 24)
  - `ScheduleActiveBookingsScreen` → `footerSlot` (non-floating, pakai padding)
  - `BarbershopSettingsScreen` → `footerSlot` (non-floating, pakai padding)
- Dependency `@react-navigation/bottom-tabs` sudah ada di `package.json`.
- `app/index.tsx` redirect ke `/home-dashboard` (route lama).

### Tab mapping

| Tab key    | Expo route name | Screen Component                          |
| ---------- | --------------- | ----------------------------------------- |
| `home`     | `home`          | `HomeDashboardScreen`                     |
| `stats`    | `stats`         | Placeholder view (belum ada screen stats) |
| `schedule` | `schedule`      | `ScheduleActiveBookingsScreen`            |
| `profile`  | `profile`       | `BarbershopSettingsScreen`                |

### Catatan positioning

`BottomTabBar` dirancang floating (absolute, bottom: 24). Di Tabs layout, kita wrap custom `tabBar` dalam `View` dengan `position: 'absolute', bottom: 24, left: 20, right: 20`. Screen content tetap perlu `paddingBottom: 100` (sudah ada di HomeDashboard, perlu ditambah di Schedule dan BarbershopSettings).

## Files to create / edit

| File                                                             | Action | Notes                                                                                                           |
| ---------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| `app/(tabs)/_layout.tsx`                                         | CREATE | Tabs navigator + custom tabBar renderer                                                                         |
| `app/(tabs)/home.tsx`                                            | CREATE | Thin — mount HomeDashboardScreen                                                                                |
| `app/(tabs)/stats.tsx`                                           | CREATE | Thin — placeholder StatsScreen inline                                                                           |
| `app/(tabs)/schedule.tsx`                                        | CREATE | Thin — mount ScheduleActiveBookingsScreen                                                                       |
| `app/(tabs)/profile.tsx`                                         | CREATE | Thin — mount BarbershopSettingsScreen                                                                           |
| `app/index.tsx`                                                  | EDIT   | Redirect ke `/home` bukan `/home-dashboard`                                                                     |
| `src/components/BottomTabBar.tsx`                                | EDIT   | `onTabPress` menjadi optional (`onTabPress?: (tab: Tab) => void`)                                               |
| `src/features/home/screens/HomeDashboardScreen.tsx`              | EDIT   | Hapus `overlaySlot` BottomTabBar + import + `tabBarWrapper` style                                               |
| `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx` | EDIT   | Hapus `footerSlot` BottomTabBar + import + `tabBarWrapper` style; tambah `paddingBottom: 100` ke scroll content |
| `src/features/barbershop/screens/BarbershopSettingsScreen.tsx`   | EDIT   | Hapus `footerSlot` BottomTabBar + import + `tabBarWrapper` style; tambah `paddingBottom: 100` ke scroll content |

## Execution Steps

### Step 1 — Update `BottomTabBar` props

**File:** `src/components/BottomTabBar.tsx`  
**Action:** edit

**Details:**

- Ubah `onTabPress: (tab: Tab) => void` → `onTabPress?: (tab: Tab) => void` (optional)
- Ubah `onPress={() => onTabPress(tab.key)}` → `onPress={() => onTabPress?.(tab.key)}`
- Tidak ada perubahan style apapun

### Step 2 — Create `app/(tabs)/_layout.tsx`

**File:** `app/(tabs)/_layout.tsx`  
**Action:** create

**Details:**

- Import `Tabs` dari `expo-router`
- Import `BottomTabBar` dari `@/src/components/BottomTabBar`
- Import `BottomTabBarProps` dari `@react-navigation/bottom-tabs`
- Import `View` dari `react-native`
- Buat type alias `Tab = "home" | "stats" | "schedule" | "profile"` (tidak perlu di-export)
- Buat map `ROUTE_TO_TAB: Record<string, Tab>` yang memetakan nama route ke Tab key
- Buat function `CustomTabBar({ state, navigation }: BottomTabBarProps)`:
  - Ambil `activeRoute = state.routes[state.index].name`
  - Compute `activeTab = ROUTE_TO_TAB[activeRoute] ?? "home"`
  - Return sebuah `View` dengan style `{ position: 'absolute', bottom: 24, left: 20, right: 20 }`
  - Di dalam View, render `<BottomTabBar activeTab={activeTab} onTabPress={(tab) => navigation.navigate(tab)} />`
- Export default `TabsLayout` yang return:
  ```tsx
  <Tabs
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tabs.Screen name="home" />
    <Tabs.Screen name="stats" />
    <Tabs.Screen name="schedule" />
    <Tabs.Screen name="profile" />
  </Tabs>
  ```

### Step 3 — Create `app/(tabs)/home.tsx`

**File:** `app/(tabs)/home.tsx`  
**Action:** create

**Details:**

- Import `HomeDashboardScreen` dari `@/src/features/home/screens/HomeDashboardScreen`
- Export default function `HomeTab` yang return `<HomeDashboardScreen />`

### Step 4 — Create `app/(tabs)/stats.tsx`

**File:** `app/(tabs)/stats.tsx`  
**Action:** create

**Details:**

- Buat placeholder screen sederhana (belum ada screen stats)
- Import `View`, `Text` dari `react-native`
- Import `AppTheme` dari `@/src/app-theme`
- Export default function `StatsTab` yang return view dengan `flex:1`, background `AppTheme.colors.bg`, teks "Stats (Coming Soon)" di tengah

### Step 5 — Create `app/(tabs)/schedule.tsx`

**File:** `app/(tabs)/schedule.tsx`  
**Action:** create

**Details:**

- Import `ScheduleActiveBookingsScreen` dari `@/src/features/schedule/screens/ScheduleActiveBookingsScreen`
- Export default function `ScheduleTab` yang return `<ScheduleActiveBookingsScreen />`

### Step 6 — Create `app/(tabs)/profile.tsx`

**File:** `app/(tabs)/profile.tsx`  
**Action:** create

**Details:**

- Import `BarbershopSettingsScreen` dari `@/src/features/barbershop/screens/BarbershopSettingsScreen`
- Export default function `ProfileTab` yang return `<BarbershopSettingsScreen />`

### Step 7 — Update `app/index.tsx`

**File:** `app/index.tsx`  
**Action:** edit

**Details:**

- Ganti `href="/home-dashboard"` → `href="/home"` pada Redirect
- Route `/home` sekarang resolve ke `app/(tabs)/home.tsx`

### Step 8 — Remove BottomTabBar from `HomeDashboardScreen`

**File:** `src/features/home/screens/HomeDashboardScreen.tsx`  
**Action:** edit

**Details:**

- Hapus import `BottomTabBar` dari `@/src/components/BottomTabBar`
- Hapus prop `overlaySlot` beserta `<View style={styles.tabBarWrapper}><BottomTabBar .../></View>` dari `<ScreenShell>`
- Hapus style `tabBarWrapper` dari `StyleSheet.create({...})`
- `scrollContentPadding: { paddingBottom: 100 }` TETAP ada (dibutuhkan agar content tidak tertutup tabBar floating)

### Step 9 — Remove BottomTabBar from `ScheduleActiveBookingsScreen`

**File:** `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx`  
**Action:** edit

**Details:**

- Hapus import `BottomTabBar` dari `@/src/components/BottomTabBar`
- Hapus prop `footerSlot` beserta `<View style={styles.tabBarWrapper}><BottomTabBar .../></View>` dari `<ScreenShell>`
- Hapus style `tabBarWrapper` dari `StyleSheet.create({...})`
- Tambahkan `contentStyle={styles.scrollContentPadding}` ke `<ScreenShell>` (jika belum ada)
- Tambahkan style `scrollContentPadding: { paddingBottom: 100 }` di StyleSheet

### Step 10 — Remove BottomTabBar from `BarbershopSettingsScreen`

**File:** `src/features/barbershop/screens/BarbershopSettingsScreen.tsx`  
**Action:** edit

**Details:**

- Hapus import `BottomTabBar` dari `@/src/components/BottomTabBar`
- Hapus prop `footerSlot` beserta `<View style={styles.tabBarWrapper}><BottomTabBar .../></View>` dari `<ScreenShell>`
- Hapus style `tabBarWrapper` dari `StyleSheet.create({...})`
- Tambahkan `contentStyle={styles.scrollContentPadding}` ke `<ScreenShell>` (jika belum ada)
- Tambahkan style `scrollContentPadding: { paddingBottom: 100 }` di StyleSheet

## Verification

- [ ] Buka app → seharusnya load di tab Home (home-dashboard)
- [ ] Tekan icon calendar → navigasi ke Schedule (schedule-active-bookings)
- [ ] Tekan icon person → navigasi ke Profile/Barbershop Settings
- [ ] Tekan icon home → kembali ke Home
- [ ] Active tab menampilkan circle `#C6FF4D` yang benar
- [ ] BottomTabBar floating di atas konten (tidak menempel di bawah)
- [ ] Konten di screen tidak tertutup tab bar (ada padding bottom)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint warnings (`npx expo lint`)

## Tracking update

- Tracking file: `docs/track_pages_and_components.md`
- Section: Phase 2 — App shell and workspace setup
- Row: `bottom-tab-bar` → kolom `functioning_api_implemented` → update dari `[]` ke `[x]`
- Implementation notes: tambah catatan "Navigation wired via Expo Router Tabs; custom tabBar renderer in `app/(tabs)/_layout.tsx`"

## Notes

1. **Route `app/(home)/home-dashboard.tsx` tetap ada** — tidak dihapus. Dibutuhkan jika ada screen lain yang push ke `/home-dashboard` (deep link, dev-nav, dll). Tapi `index.tsx` sekarang redirect ke `/home` (tabs group) bukan `/home-dashboard`.

2. **`stats` tab adalah placeholder** — belum ada screen stats di codebase. Stub sederhana sudah cukup untuk saat ini.

3. **Absolute positioning tabBar di web** — `MobileFrame` sudah membatasi viewport ke 390px, jadi `position: absolute` akan bekerja dalam frame tersebut.

4. **`BottomTabBarProps` type** — berasal dari `@react-navigation/bottom-tabs` yang sudah ada di `package.json`. Tidak perlu install apapun.

5. **`navigation.navigate(tab)` vs `router.push()`** — di dalam custom `tabBar`, gunakan `navigation.navigate()` yang diterima dari `BottomTabBarProps`. Jangan gunakan `useRouter()` karena akan memush ke stack baru (bukan tab switch).

6. **Screens yang di-push dari tabs (misal booking-detail)** — screens non-tab tetap diakses via Stack navigator (bukan tabs), tidak ada perubahan untuk mereka.
