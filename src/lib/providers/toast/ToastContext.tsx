import React, { createContext } from "react";

/** Semantic toast kinds — each maps to a color + icon. */
export type ToastType = "neutral" | "success" | "info" | "warning" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  /** Bold title line. */
  title: string;
  /** Optional short supporting line under the title. */
  description?: string;
  /** Auto-dismiss ms. `0` = sticky until dismissed via the X / tap / clearAll. */
  duration?: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  /** Full control: explicit kind + title + optional description. */
  show: (options: ShowToastOptions) => string;
  /** Legacy helper kept for quick call sites: (message, type, duration). */
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
}
