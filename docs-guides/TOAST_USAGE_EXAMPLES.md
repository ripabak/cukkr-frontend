# Global Toast - Usage Examples

Toast global sudah setup di root level dan bisa diakses dari **feature apapun** langsung!

## 🔧 Basic Usage

### Minimal Example
```tsx
import { useToast } from "@/src/lib/providers";

export function MyComponent() {
  const toast = useToast();
  
  return (
    <Button onPress={() => toast.success("Done!")} />
  );
}
```

## 📲 Real-world Examples

### Example 1: Error Handling in screen with hooks
```tsx
export function LoginScreen() {
  const toast = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signIn, isPending } = useSignIn();

  const handleLogin = async () => {
    if (!identifier || !password) return;

    try {
      await signIn({ email: identifier, password });
      router.replace("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

}
```

### Example 2: Form Validation
```tsx
import { useToast } from "@/src/lib/providers";

export function FormScreen() {
  const toast = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email", 2000);
      return;
    }
    // submit form
    toast.success("Form submitted!");
  };

  return (
    <>
      <TextInput value={email} onChangeText={setEmail} />
      <Button onPress={handleSubmit} />
    </>
  );
}
```

### Example 3: Multi-step Process
```tsx
import { useToast } from "@/src/lib/providers";

export function UploadFlow() {
  const toast = useToast();

  const handleCompleteSetup = async (files: any) => {
    try {
      toast.info("Uploading...");
      
      // Step 1
      const logo = await uploadLogo(files.logo);
      toast.success("Logo uploaded!");
      
      // Step 2
      const service = await createService(files.service);
      toast.success("Service created!");
      
      // Step 3
      await inviteTeam(files.team);
      toast.success("Team invited! Setup complete!", 5000); // longer duration
    } catch (error) {
      toast.error(`Setup failed: ${getErrorMessage(error)}`, 5000);
    }
  };

  return <Button onPress={() => handleCompleteSetup({...})} />;
}
```

### Example 4: Network Request Status
```tsx
import { useToast } from "@/src/lib/providers";

export function DataFetch() {
  const toast = useToast();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);
        toast.success("Data loaded!");
      } catch (error) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  return <View>{/* render data */}</View>;
}
```

### Example 5: Copy to Clipboard
```tsx
import { useToast } from "@/src/lib/providers";
import * as Clipboard from "expo-clipboard";

export function ShareCode() {
  const toast = useToast();

  const handleCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return <Button onPress={() => handleCopy("code-to-copy")} />;
}
```

## 🎨 Toast Types

```tsx
const toast = useToast();

// Success - untuk aksi berhasil
toast.success("Profile updated!");          // Green
toast.success("File saved!", 2000);         // With custom duration

// Error - untuk error/failure
toast.error("Connection failed");           // Red
toast.error(getErrorMessage(error));        // Using error converter

// Warning - untuk peringatan tapi tidak fatal
toast.warning("This action cannot be undone", 4000);  // Orange

// Info - untuk informasi umum
toast.info("Processing...");                // Dark
toast.info("Tap to dismiss", 0);            // Never auto-dismiss
```

## 🧠 Smart Patterns

### Pattern 1: Error Converter Utility
```tsx
// Create reusable error handler
const handleApiError = (error: unknown, toast: ReturnType<typeof useToast>) => {
  toast.error(getErrorMessage(error), 4000);
};

// Use it everywhere
try {
  await api.call();
} catch (error) {
  handleApiError(error, toast);
}
```

### Pattern 2: Loading Toast
```tsx
const handleLongOperation = async () => {
  const loadingId = toast.info("Loading...", 0); // 0 = no auto-dismiss
  try {
    await longRunningTask();
    // Toast will be replaced by success
    toast.success("Complete!");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

// Note: Previous toast replaced automatically
```

### Pattern 3: Wrapper Function
```tsx
// Create service wrapper with automatic error handling
const withToast = async (
  promise: Promise<any>,
  successMsg: string,
  errorMsg?: string
) => {
  try {
    const result = await promise;
    toast.success(successMsg);
    return result;
  } catch (error) {
    toast.error(errorMsg || getErrorMessage(error));
    throw error;
  }
};

// Usage
const data = await withToast(
  api.getData(),
  "Data loaded!",
  "Failed to load data"
);
```

## 🚀 Integration Points

### In Screens
```tsx
import { useToast } from "@/src/lib/providers";

export function MyScreen() {
  const toast = useToast();
  // Use toast directly
}
```

### In Custom Hooks
```tsx
export function useMyHook() {
  const toast = useToast();
  
  return {
    doSomething: async () => {
      try {
        // Logic
        toast.success("Done!");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  };
}
```

### In Context/Providers
```tsx
export function MyProvider({ children }) {
  const toast = useToast();
  
  return (
    <MyContext.Provider value={{ toast }}>
      {children}
    </MyContext.Provider>
  );
}
```

## ❌ What NOT to do

```tsx
// ❌ Wrong: Can't use outside component
async function apiCall() {
  const toast = useToast(); // Error! Hooks only in components
}

// ✅ Right: Use in component
export function MyComponent() {
  const toast = useToast(); // OK
  const handleAction = async () => {
    try {
      await apiCall();
      toast.success("Done!");
    } catch {
      toast.error("Failed");
    }
  };
}
```

```tsx
// ❌ Wrong: Forgetting error handling
const handleSave = async () => {
  await barbershopService.updateSettings(data);
  toast.success("Saved!"); // What if it fails?
};

// ✅ Right: Always wrap with try-catch
const handleSave = async () => {
  try {
    await barbershopService.updateSettings(data);
    toast.success("Saved!");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
```

## 📱 Mobile-Specific Tips

### Handling Keyboard
```tsx
const handleSubmit = async () => {
  Keyboard.dismiss(); // Hide keyboard first
  try {
    await api.submit(data);
    toast.success("Submitted!"); // Now toast is visible
  } catch {
    toast.error("Failed");
  }
};
```

### Persisting Messages
```tsx
// For important messages, don't auto-dismiss
const handleCriticalAction = async () => {
  try {
    await criticalOperation();
    toast.success("Critical operation complete - tap to dismiss", 0);
  } catch {
    toast.error("Critical error - fix required", 0);
  }
};
```

### Different Durations
```tsx
// Quick confirmations (< 2s)
toast.success("Copied!", 1500);

// Normal feedback (3s default)
toast.warning("Please check your input");

// Important errors (> 4s)
toast.error("Connection lost. Please try again", 5000);

// Critical or complex messages (no auto-dismiss)
toast.info("Setup complete. Review settings and tap to continue", 0);
```

## 🔍 Debugging

```tsx
// Add logging for debugging
const handleDebug = async () => {
  const debugToast = (msg: string) => {
    console.log("Toast:", msg);
    toast.info(msg);
  };

  try {
    debugToast("Step 1: Fetching data...");
    const data = await fetch("/api/data");
    debugToast("Step 2: Processing data...");
    // ...
    debugToast("Complete!");
  } catch (error) {
    debugToast(`Error: ${getErrorMessage(error)}`);
  }
};
```

---

Ready to use! Buka file apapun, import `useToast`, dan langsung mulai pakai! 🚀
