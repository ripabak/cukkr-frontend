import { useToastContext } from "./ToastContext";
import type { ToastType, ShowToastOptions } from "./ToastContext";

/**
 * Typed toast helpers.
 *
 * Backward-compatible call shapes (all still work):
 *   toast.success("Saved")                      → title only
 *   toast.success("Saved", 2500)                → title + duration
 *   toast.success("Saved", "Your note is in")   → title + description
 *   toast.success("Saved", "Your note is in", 3000)
 *
 * New structured form:
 *   toast.show({ type: "warning", title: "Careful", description: "…" })
 */
export function useToast() {
  const { show, showToast, clearAll } = useToastContext();

  const helper =
    (type: ToastType) =>
    (
      title: string,
      description?: string | number,
      duration?: number,
    ): string => {
      // (message, number) → treats the number as the duration (legacy calls).
      if (typeof description === "number") {
        return showToast(title, type, description);
      }
      return showToast(title, type, duration);
    };

  return {
    show,
    neutral: helper("neutral"),
    success: helper("success"),
    info: helper("info"),
    warning: helper("warning"),
    error: helper("error"),
    clearAll,
  };
}
