# Plan: Home Dashboard — Dynamic Data & Component Extraction

## Goal

Semua nilai hardcoded di `HomeDashboardScreen` diangkat menjadi data/props yang bisa diganti, dan bagian-bagian UI besar dipecah menjadi komponen feature-local yang reusable. Hasilnya: screen hanya merakit komponen, bukan mendefinisikan UI secara inline.

## Scope

- Phase: ui-functional
- Affected pages/components:
  - `src/features/home/screens/HomeDashboardScreen.tsx` (edit besar)
  - `src/features/home/components/DashboardHeader.tsx` (create)
  - `src/features/home/components/DashboardGreeting.tsx` (create)
  - `src/features/home/components/WalkInPinCard.tsx` (create)
  - `src/features/home/components/DashboardMetrics.tsx` (create)
  - `src/features/home/components/DashboardShortcuts.tsx` (create)
  - `src/features/home/components/ActivityCard.tsx` (create — pindah dari screen)
  - `src/features/home/components/SectionHeader.tsx` (create)

## Analysis

Data hardcoded saat ini di `HomeDashboardScreen`:

| Nilai Hardcoded | Lokasi | Akan Dijadikan |
|---|---|---|
| `"Hendra Barbershop"` | `<WorkspacePill name=...>` | prop `workspaceName` |
| `"Good Morning,"` | teks greeting | dihitung dari `Date()` di screen |
| `"James Comberan"` | teks nama user | prop `userName` |
| `"345678"` | PIN value | prop `pin` |
| `"cukrr.com/hendra-barbershop"` | booking link | prop `bookingUrl` |
| `"5"`, `"2"`, `"2"`, `"2"`, `"3"` | metric values | prop `metrics` (object) |
| `RECENT_ACTIVITIES` mock array | hardcoded di file | prop `activities` |
| `ShortcutTile` list (Barbers/Customers/Services) | hardcoded inline | prop `shortcuts` array |

Komponen `ActivityCard` sudah ada di screen tapi belum dipindah ke file sendiri.

Pola project:
- Komponen feature-local → `src/features/home/components/`
- Selalu named export, `interface Props`, `StyleSheet.create`
- Dynamic inline style hanya untuk nilai dari props (warna, dll)

## Files to create / edit

| File | Action | Notes |
|---|---|---|
| `src/features/home/components/DashboardHeader.tsx` | create | WorkspacePill + notif bell |
| `src/features/home/components/DashboardGreeting.tsx` | create | Avatar placeholder + nama + greeting |
| `src/features/home/components/WalkInPinCard.tsx` | create | PIN, refresh button, booking URL pill |
| `src/features/home/components/DashboardMetrics.tsx` | create | Dua baris MetricCard |
| `src/features/home/components/DashboardShortcuts.tsx` | create | Row ShortcutTile dari array |
| `src/features/home/components/ActivityCard.tsx` | create | Dipindah dari screen |
| `src/features/home/components/SectionHeader.tsx` | create | Label kiri + "See more" button kanan |
| `src/features/home/screens/HomeDashboardScreen.tsx` | edit | Ganti semua inline UI dengan komponen baru + mock data terpusat |

## Execution steps

### Step 1 — Buat `ActivityCard.tsx`

**File:** `src/features/home/components/ActivityCard.tsx`  
**Action:** create

- Pindahkan type `RecentActivity` dan fungsi `ActivityCard` dari screen ke file ini
- Export keduanya: `export type { RecentActivity }` dan `export function ActivityCard`
- Tidak ada perubahan logic, hanya relokasi

```tsx
export type RecentActivity = {
  id: string;
  time: string;
  duration: string;
  name?: string;
  type: "in_progress" | "waiting";
};

interface Props {
  item: RecentActivity;
}

export function ActivityCard({ item }: Props) { ... }
```

---

### Step 2 — Buat `SectionHeader.tsx`

**File:** `src/features/home/components/SectionHeader.tsx`  
**Action:** create

- Props: `title: string`, `onSeeMore?: () => void`, `style?: ViewStyle`
- Row `justifyContent: "space-between"` dengan `Text` label kiri dan `TouchableOpacity` "See more" kanan
- Jika `onSeeMore` tidak diberikan, sembunyikan tombol "See more"

```tsx
interface Props {
  title: string;
  onSeeMore?: () => void;
  style?: ViewStyle;
}
```

---

### Step 3 — Buat `DashboardHeader.tsx`

**File:** `src/features/home/components/DashboardHeader.tsx`  
**Action:** create

- Props: `workspaceName: string`, `onNotifPress?: () => void`, `style?: ViewStyle`
- Render `<WorkspacePill name={workspaceName} />` di kiri dan lingkaran notif di kanan
- Pindahkan style `notifCircle` ke file ini

---

### Step 4 — Buat `DashboardGreeting.tsx`

**File:** `src/features/home/components/DashboardGreeting.tsx`  
**Action:** create

- Props: `userName: string`, `greeting: string`, `style?: ViewStyle`
- Render avatar placeholder (View abu-abu) + kolom `greeting` + `userName`
- `greeting` diterima sebagai prop (dihitung di screen)

---

### Step 5 — Buat `WalkInPinCard.tsx`

**File:** `src/features/home/components/WalkInPinCard.tsx`  
**Action:** create

- Props: `pin: string`, `bookingUrl: string`, `onRefreshPin?: () => void`, `onCopyUrl?: () => void`, `style?: ViewStyle`
- Render seluruh card PIN + refresh button + booking URL pill
- Pindahkan style `pinCard`, `pinTopRow`, dll ke file ini

---

### Step 6 — Buat `DashboardMetrics.tsx`

**File:** `src/features/home/components/DashboardMetrics.tsx`  
**Action:** create

- Definisikan type:

```tsx
export type DashboardMetricsData = {
  todaySchedule: number;
  walkIn: number;
  appointment: number;
  inProgress: number;
  waiting: number;
};
```

- Props: `metrics: DashboardMetricsData`, `style?: ViewStyle`
- Render dua baris `MetricCard` menggunakan nilai dari `metrics`

---

### Step 7 — Buat `DashboardShortcuts.tsx`

**File:** `src/features/home/components/DashboardShortcuts.tsx`  
**Action:** create

- Definisikan type:

```tsx
export type ShortcutItem = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};
```

- Props: `shortcuts: ShortcutItem[]`, `style?: ViewStyle`
- Render `<View style={styles.row}>` lalu `.map()` masing-masing `<ShortcutTile>`

---

### Step 8 — Refactor `HomeDashboardScreen.tsx`

**File:** `src/features/home/screens/HomeDashboardScreen.tsx`  
**Action:** edit

- Buat **mock data terpusat** di atas komponen screen:

```tsx
const MOCK_WORKSPACE_NAME = "Hendra Barbershop";
const MOCK_USER_NAME = "James Comberan";
const MOCK_PIN = "345678";
const MOCK_BOOKING_URL = "cukrr.com/hendra-barbershop";

const MOCK_METRICS: DashboardMetricsData = {
  todaySchedule: 5,
  walkIn: 2,
  appointment: 2,
  inProgress: 2,
  waiting: 3,
};

const MOCK_SHORTCUTS: ShortcutItem[] = [
  { label: "Barbers", icon: <Ionicons name="people" size={24} color="#1A1A1A" /> },
  { label: "Customers", icon: <Ionicons name="person" size={24} color="#1A1A1A" /> },
  { label: "Services", icon: <Ionicons name="cut" size={24} color="#1A1A1A" /> },
];

const MOCK_ACTIVITIES: RecentActivity[] = [
  { id: "1", time: "12m ago", duration: "30 mins", type: "in_progress", name: "Ethan James" },
  { id: "2", time: "12m ago", duration: "30 mins", name: "Ethan James", type: "waiting" },
];
```

- Hitung greeting berdasarkan waktu:

```tsx
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}
```

- Ganti semua inline UI di JSX dengan komponen baru:

```tsx
<DashboardHeader workspaceName={MOCK_WORKSPACE_NAME} onNotifPress={() => {}} />
<DashboardGreeting userName={MOCK_USER_NAME} greeting={getGreeting()} />
<WalkInPinCard pin={MOCK_PIN} bookingUrl={MOCK_BOOKING_URL} onRefreshPin={() => setShowPinModal(true)} />
<DashboardMetrics metrics={MOCK_METRICS} />
<DashboardShortcuts shortcuts={MOCK_SHORTCUTS} />
<SectionHeader title="Upcoming" onSeeMore={() => {}} />
{MOCK_ACTIVITIES.map((item) => <ActivityCard key={item.id} item={item} />)}
```

- Hapus semua style yang sudah dipindah ke masing-masing komponen
- Pertahankan `ConfirmationModal` dan state `showPinModal`

---

## Verification

- [ ] Screen tampil sama seperti sebelumnya (tidak ada visual regression)
- [ ] Greeting berubah sesuai waktu (pagi/siang/malam)
- [ ] Ganti nilai mock (nama, PIN, metrics) → langsung terefleksi di UI
- [ ] Tidak ada TypeScript errors (`npx tsc --noEmit`)
- [ ] Tidak ada lint warnings (`npx expo lint`)

## Tracking update

- Tracking file: `docs/track_pages_and_components.md`
- Section: Phase 2 — Components
- Tambahkan baris baru untuk: `activity-card`, `section-header`, `dashboard-header`, `dashboard-greeting`, `walk-in-pin-card`, `dashboard-metrics`, `dashboard-shortcuts`

## Notes

- Semua komponen baru adalah **feature-local** (`src/features/home/components/`) karena hanya dipakai di home dashboard
- Jika kelak komponen dipakai di fitur lain, pindahkan ke `src/components/`
- Nilai `MOCK_*` adalah placeholder — siap diganti dengan data dari Zustand store atau API response di fase selanjutnya
- `getGreeting()` bisa juga diletakkan di `src/features/home/utils/` jika ada utils lain yang ditambahkan nanti
