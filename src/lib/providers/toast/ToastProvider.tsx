import React, { useState, useCallback, useRef } from "react";
import { ToastContainer } from "./ToastContainer";
import { Toast, ToastContext } from "./ToastContext";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      const id = String(toastIdRef.current++);
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        const timeout = setTimeout(() => hideToast(id), duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [hideToast]
  );

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
