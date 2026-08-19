import React, { useState, useCallback, useRef } from "react";
import { ToastContainer } from "./ToastContainer";
import { Toast, ToastContext, ShowToastOptions } from "./ToastContext";

/**
 * Holds the toast list. Timers + exit animations are owned by ToastContainer
 * so every dismiss path (auto-dismiss, X, tap) plays the slide-out first.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      const id = String(toastIdRef.current++);
      setToasts((prev) => [...prev, { id, type, title: message, duration }]);
      return id;
    },
    [],
  );

  const show = useCallback(
    (options: ShowToastOptions) => {
      const { type = "info", title, description, duration = 3000 } = options;
      const id = String(toastIdRef.current++);
      setToasts((prev) => [
        ...prev,
        { id, type, title, description, duration },
      ]);
      return id;
    },
    [],
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, show, showToast, hideToast, clearAll }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
