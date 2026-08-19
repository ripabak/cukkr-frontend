# Global Toast - Usage Examples

Toast global sudah setup di root level dan bisa diakses dari **feature apapun** langsung.

## Visual & Jenis

Toast adalah kartu **putih** dengan:

- **Icon bulat** — icon solid putih di dalam lingkaran berwarna sesuai jenis toast
- **Title** (tebal)
- **Description** singkat (opsional, 2 baris maks)
- **Tombol X** untuk menutup (atau ketuk kartunya, atau auto-dismiss)

| Jenis | Warna | Icon |
|---|---|---|
| `neutral` | Abu-abu | `notifications` |
| `success` | Hijau | `checkmark-circle` |
| `info` | Biru | `information-circle` |
| `warning` | Oranye | `alert-circle` |
| `error` | Merah | `close-circle` |

## 🔧 Basic Usage

```tsx
import { useToast } from "@/src/lib/providers";

export function MyComponent() {
  const toast = useToast();

  return (
    <Button onPress={() => toast.success("Berhasil disimpan")} />
  );
}
```

Semua bentuk berikut tetap didukung:

```tsx
const toast = useToast();

toast.success("Selesai");                       // title saja
toast.success("Selesai", 2500);                 // title + durasi
toast.success("Selesai", "Catatan tersimpan");  // title + description
toast.success("Selesai", "Catatan tersimpan", 3000);

// Bentuk terstruktur penuh:
toast.show({ type: "warning", title: "Hati-hati", description: "Aksi ini tidak bisa dibatalkan" });

// Jenis lain:
toast.neutral("Info umum");
toast.info("Memproses...", 0);        // 0 = sticky, hanya bisa ditutup manual
toast.warning("Periksa kembali input");
toast.error("Koneksi gagal");
toast.error(getErrorMessage(error));  // pakai error converter
```

`duration` satuan **milidetik**. Default 3000. `0` = tidak auto-dismiss (sticky).

## 📲 Real-world Examples

### Example 1: Error Handling di screen dengan hooks

```tsx
export function LoginScreen() {
  const toast = useToast();
  const { mutateAsync: signIn, isPending } = useSignIn();

  const handleLogin = async () => {
    if (!identifier || !password) return;

    try {
      await signIn({ email: identifier, password });
      router.replace("/");
    } catch (error) {
      toast.show({
        type: "error",
        title: "Gagal masuk",
        description: getErrorMessage(error),
      });
    }
  };
}
```

### Example 2: Form Validation

```tsx
const toast = useToast();

const handleSubmit = () => {
  if (!email.includes("@")) {
    toast.warning("Cek kembali email", "Format email belum valid", 2000);
    return;
  }
  toast.success("Form terkirim");
};
```

### Example 3: Progress status (loading → sukses)

```tsx
const handleLongOperation = async () => {
  try {
    toast.info("Mengunggah...", 0); // sticky info
    await longRunningTask();
    toast.success("Berhasil", "Semua langkah selesai");
  } catch (error) {
    toast.error("Gagal", getErrorMessage(error));
  }
};
```

### Example 4: Copy to Clipboard

```tsx
const handleCopy = async (text: string) => {
  try {
    await Clipboard.setStringAsync(text);
    toast.success("Disalin ke clipboard");
  } catch {
    toast.error("Gagal menyalin");
  }
};
```

## 🧠 Smart Patterns

### Pattern 1: Error Converter Utility

```tsx
const handleApiError = (error: unknown, toast: ReturnType<typeof useToast>) => {
  toast.show({ type: "error", title: "Terjadi kesalahan", description: getErrorMessage(error) });
};

try {
  await api.call();
} catch (error) {
  handleApiError(error, toast);
}
```

### Pattern 2: Wrapper Function

```tsx
const withToast = async (
  promise: Promise<unknown>,
  successTitle: string,
  successDesc?: string,
) => {
  try {
    const result = await promise;
    toast.success(successTitle, successDesc);
    return result;
  } catch (error) {
    toast.error("Gagal", getErrorMessage(error));
    throw error;
  }
};
```

## 💡 Best Practice

- **Title** = ringkas, satu baris (mis. "Berhasil disimpan", "Gagal masuk").
- **Description** = detail pendek maks 2 baris (pesan error asli, konteks).
- **Error** selalu pakai `getErrorMessage(error)` di description, bukan menampilkan objek error mentah.
- Durasi singkat (< 2s) untuk konfirmasi cepat; `0` untuk pesan penting yang harus dibaca dulu.
- Toast di-closing via X, sentuh kartu mana saja, atau auto-dismiss.

## ❌ What NOT to do

```tsx
// ❌ Salah: tidak pakai try-catch — kalau gagal tidak ada feedback
const handleSave = async () => {
  await service.update(data);
  toast.success("Tersimpan");
};

// ✅ Benar:
const handleSave = async () => {
  try {
    await service.update(data);
    toast.success("Tersimpan");
  } catch (error) {
    toast.error("Gagal menyimpan", getErrorMessage(error));
  }
};
```

---

Ready to use! Buka file apapun, import `useToast`, dan langsung pakai! 🚀
