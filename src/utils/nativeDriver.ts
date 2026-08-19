import { Platform } from "react-native";

/**
 * `useNativeDriver` is only supported on the native animated module. On web
 * (react-native-web) that module doesn't exist, so passing `true` logs
 * "Animated: useNativeDriver is not supported... Falling back to JS-based
 * animation" and falls back anyway. Gate it once so web stays silent while
 * native keeps the GPU-composited path.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== "web";
