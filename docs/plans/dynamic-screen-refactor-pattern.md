# Plan: Dynamic Screen Refactor Pattern

## Goal

Menetapkan pola standar untuk mengubah **semua screen** dari hardcoded UI menjadi
dinamis dan berbasis komponen — sehingga data mudah diganti, dan screen hanya
merakit komponen, bukan mendefinisikan UI secara inline.

---

## Pola yang Harus Diterapkan ke Setiap Screen

### 1. Kumpulkan semua data hardcoded ke konstanta MOCK\_\*

Sebelum fungsi screen, buat blok mock data:

```tsx
// --- MOCK DATA ---
const MOCK_USER_NAME = "James Comberan";
const MOCK_PIN = "345678";

const MOCK_METRICS = { todaySchedule: 5, walkIn: 2 };

const MOCK_ITEMS: ItemType[] = [
  { id: "1", label: "..." },
];
```

**Aturan:**
- Satu konstanta per nilai skalar (`string`, `number`, `boolean`)
- Satu konstanta per array/objek data
- Beri prefix `MOCK_` agar mudah dicari saat wiring ke API nanti
- Taruh tepat di atas `export function ScreenName()`

---

### 2. Pecah UI besar menjadi komponen feature-local

Setiap blok UI yang:
- Lebih dari ~15 baris JSX, **atau**
- Punya data/state sendiri, **atau**
- Berulang (`.map()`)

→ Ekstrak ke `src/features/<feature>/components/NamaKomponen.tsx`

**Aturan penamaan:**
- Nama komponen deskriptif, bukan generik: `WalkInPinCard`, bukan `Card`
- Jika dipakai di 2+ fitur → pindah ke `src/components/`

**Template komponen:**

```tsx
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  // props spesifik
  style?: ViewStyle; // selalu opsional, selalu terakhir
}

export function NamaKomponen({ ..., style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
```

---

### 3. Screen hanya merakit komponen

Hasil akhir screen:

```tsx
export function ScreenName() {
  // state lokal (modal, toggle, dsb)
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView ...>
      <ScrollView ...>
        <KomponenA data={MOCK_A} />
        <KomponenB items={MOCK_ITEMS} />
        <KomponenC onPress={() => setShowModal(true)} />
      </ScrollView>
      <Modal visible={showModal} ... />
    </SafeAreaView>
  );
}
```

---

## Urutan Pengerjaan (per screen)

| Step | Tindakan |
|---|---|
| 1 | Baca screen target, identifikasi semua nilai hardcoded |
| 2 | Identifikasi blok UI yang layak jadi komponen (>15 baris / berulang) |
| 3 | Buat file komponen di `src/features/<feature>/components/` |
| 4 | Kumpulkan semua hardcode ke konstanta `MOCK_*` di atas screen |
| 5 | Ganti JSX screen dengan komponen baru + mock data |
| 6 | Hapus style yang sudah pindah ke komponen |
| 7 | Jalankan `npx tsc --noEmit` — pastikan tidak ada error |

---

## Daftar Screen yang Perlu Direfactor

Centang saat selesai:

### Phase 2 — App shell
- [ ] `src/features/home/screens/HomeDashboardScreen.tsx`
- [ ] `src/features/workspace/screens/SwitchBarbershopScreen.tsx`
- [ ] `src/features/workspace/screens/CreateBarbershopNameLogoScreen.tsx`
- [ ] `src/features/workspace/screens/CreateBarbershopInviteBarberEmptyScreen.tsx`
- [ ] `src/features/workspace/screens/CreateBarbershopInviteBarberFilledScreen.tsx`
- [ ] `src/features/workspace/screens/CreateBarbershopFirstServiceScreen.tsx`
- [ ] `src/features/workspace/screens/CreateBarbershopSuccessScreen.tsx`
- [ ] `src/features/barbershop/screens/BarbershopSettingsScreen.tsx`
- [ ] `src/features/barbershop/screens/EditBarbershopInfoScreen.tsx`
- [ ] `src/features/barbershop/screens/EditBookingUrlScreen.tsx`

### Phase 3+ — Schedule, Profile, Barbershop ops
- [ ] `src/features/schedule/screens/ScheduleActiveBookingsScreen.tsx`
- [ ] `src/features/schedule/screens/BookingDetailInProgressScreen.tsx`
- [ ] `src/features/schedule/screens/BookingDetailRequestScreen.tsx`
- [ ] `src/features/schedule/screens/NewAppointmentScreen.tsx`
- [ ] `src/features/schedule/screens/NewWalkInScreen.tsx`
- [ ] `src/features/profile/screens/UserProfileScreen.tsx`
- [ ] `src/features/barbershop/screens/BarbersManagementScreen.tsx`
- [ ] `src/features/barbershop/screens/ServicesManagementScreen.tsx`
- [ ] `src/features/barbershop/screens/CustomerManagementScreen.tsx`

---

## Verification (per screen)

- [ ] Visual tidak berubah
- [ ] Semua nilai data ada di konstanta `MOCK_*` — tidak ada string/number langsung di JSX
- [ ] Tidak ada TypeScript errors (`npx tsc --noEmit`)
- [ ] Tidak ada lint warnings (`npx expo lint`)

## Notes

- Pola ini adalah persiapan untuk fase API integration — saat wiring, tinggal ganti `MOCK_*` dengan data dari store/hook
- Komponen baru **tidak perlu** menulis ulang style yang sudah benar — cukup pindahkan
- Jangan over-extract: blok sederhana (<10 baris, tidak berulang) boleh tetap inline
