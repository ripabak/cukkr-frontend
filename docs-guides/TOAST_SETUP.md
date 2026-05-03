# Global Toast System Setup

## ✅ Status: Ready to Use

Toast system sudah di-setup di root level dan siap digunakan dari feature manapun.

## 📦 Architecture

```
src/lib/providers/toast/
├── ToastContext.tsx      # State management
├── ToastContainer.tsx    # Display component
├── useToast.ts          # Hook
└── index.ts
```

## 🔧 Root Setup

**File**: `app/_layout.tsx`

```tsx
import { ToastProvider, ToastContainer } from "@/src/lib/providers";

export default function RootLayout() {
  return (
    <ToastProvider>
      <MobileFrame>
        {/* App content */}
        <ToastContainer /> {/* Toast renders here */}
      </MobileFrame>
    </ToastProvider>
  );
}
```

## 🚀 Usage

Import dan gunakan di component manapun:

```tsx
import { useToast } from "@/src/lib/providers";

export function MyComponent() {
  const toast = useToast();
  
  toast.success("Success!");    // 🟢 Green
  toast.error("Error!");        // 🔴 Red
  toast.warning("Warning!");    // 🟠 Orange
  toast.info("Info!");          // ⚫ Dark
}
```

## 📋 Features

✅ Global access from anywhere  
✅ Auto-dismiss with custom duration  
✅ Tap to dismiss manually  
✅ Smooth animations  
✅ 4 toast types  
✅ Error message conversion  

## 📚 Documentation

See `TOAST_USAGE_EXAMPLES.md` for detailed implementation patterns and examples.

## 🔗 Error Utilities

**File**: `@src/lib/utils/error-handler.ts`

```tsx
import { getErrorMessage, getErrorDuration } from "@/src/lib/utils";

// Convert any error to string
const msg = getErrorMessage(error);

// Get recommended duration
const duration = getErrorDuration("long");  // 4000ms
```

## ⏱️ Duration Examples

```tsx
const toast = useToast();

// Quick confirmations (2s)
toast.success("Done!", 2000);

// Default (3s)
toast.error("Failed!");

// Long messages (4s)
toast.warning("Important", 4000);

// Manual dismiss (0 = no auto-dismiss)
toast.info("Tap to dismiss", 0);
```

## 🎯 Common Pattern

```tsx
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils";

export function MyScreen() {
  const toast = useToast();

  const handleAction = async () => {
    try {
      await someApiCall();
      toast.success("Done!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return <Button onPress={handleAction} />;
}
```

## 🎨 Customization

Edit `src/lib/providers/toast/ToastContainer.tsx` to customize:
- Colors: `getBackgroundColor()`
- Icons: `getIcon()`
- Position: `styles.root`
- Animation: `Animated.timing`

---

**Status**: ✅ Production Ready  
**Setup File**: `app/_layout.tsx`  
**Provider Location**: `src/lib/providers/toast/`
