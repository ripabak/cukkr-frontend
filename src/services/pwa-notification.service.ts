import { notificationsService } from "@/src/features/notifications/services/notifications.service";

const isWeb = () =>
  typeof window !== "undefined" && typeof navigator !== "undefined";

function isIos(): boolean {
  if (!isWeb()) return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (!isWeb()) return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export const pwaNotificationService = {
  async requestPermission(): Promise<{
    permission: NotificationPermission;
    subscription: ReturnType<PushSubscription["toJSON"]> | null;
  }> {
    if (
      !isWeb() ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      throw new Error("Push notifications are not supported in this browser.");
    }

    if (isIos() && !isStandalone()) {
      throw new Error(
        "To enable notifications on iOS, add this app to your Home Screen first.",
      );
    }

    if (Notification.permission === "denied") {
      return { permission: "denied", subscription: null };
    }

    const permission = await Notification.requestPermission();

    if (
      permission === "granted" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      const vapidKey = await notificationsService.getVapidPublicKey();
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const existingSub = await reg.pushManager.getSubscription();
      const sub =
        existingSub ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        }));
      return { permission: "granted", subscription: sub.toJSON() };
    }

    return { permission, subscription: null };
  },

  setBadge(count: number): void {
    if (!isWeb()) return;
    if ("setAppBadge" in navigator) {
      (
        navigator as Navigator & {
          setAppBadge: (count: number) => Promise<void>;
        }
      )
        .setAppBadge(count)
        .catch(() => {});
    }
  },

  clearBadge(): void {
    if (!isWeb()) return;
    if ("clearAppBadge" in navigator) {
      (navigator as Navigator & { clearAppBadge: () => Promise<void> })
        .clearAppBadge()
        .catch(() => {});
    }
  },
};
