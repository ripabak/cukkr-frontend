const isWeb = () =>
    typeof window !== 'undefined' && typeof navigator !== 'undefined';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
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
        subscription: ReturnType<PushSubscription['toJSON']> | null;
    }> {
        if (!isWeb() || !('Notification' in window)) {
            return { permission: 'default' as NotificationPermission, subscription: null };
        }

        if (Notification.permission === 'denied') {
            return { permission: 'denied', subscription: null };
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted' && 'serviceWorker' in navigator) {
            try {
                const reg = await navigator.serviceWorker.register('/sw.js');
                const vapidKey = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY ?? '';
                const existingSub = await reg.pushManager.getSubscription();
                const sub =
                    existingSub ??
                    (await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(vapidKey),
                    }));
                return { permission: 'granted', subscription: sub.toJSON() };
            } catch {
                return { permission: 'granted', subscription: null };
            }
        }

        return { permission, subscription: null };
    },

    setBadge(count: number): void {
        if (!isWeb()) return;
        if ('setAppBadge' in navigator) {
            (navigator as Navigator & { setAppBadge: (count: number) => Promise<void> })
                .setAppBadge(count)
                .catch(() => {});
        }
    },

    clearBadge(): void {
        if (!isWeb()) return;
        if ('clearAppBadge' in navigator) {
            (navigator as Navigator & { clearAppBadge: () => Promise<void> })
                .clearAppBadge()
                .catch(() => {});
        }
    },
};
