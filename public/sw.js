function getNotifOptions(data) {
  const isBooking = data.referenceType === "booking";

  const title = data.title || "Cukkr";

  let body = data.body || "";
  if (data.customerName) {
    if (data.type === "walk_in_arrival") {
      body = `${data.customerName} has arrived and is waiting.`;
    } else if (data.type === "appointment_requested") {
      body = `${data.customerName} requested an appointment.`;
    }
  }

  return {
    body,
    icon: "/web-app-manifest-192x192.png",
    badge: "/favicon-96x96.png",
    vibrate: isBooking ? [300, 100, 300, 100, 300] : [200],
    requireInteraction: isBooking,
    tag: data.notificationId || data.type || "cukkr",
    renotify: true,
    actions: isBooking
      ? [
          { action: "view", title: "View" },
          { action: "dismiss", title: "Dismiss" },
        ]
      : [],
    data,
    title,
  };
}

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const options = getNotifOptions(data);
  const { title, ...rest } = options;
  event.waitUntil(
    self.registration.showNotification(title, rest).then(() => {
      // Increment OS badge when notification arrives (works even when app is closed).
      // useUnreadNotificationsCount will sync the exact count once the app is opened.
      if ("setAppBadge" in navigator) {
        navigator.setAppBadge(1).catch(() => null);
      }
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notifData = event.notification.data || {};
  let url;
  if (notifData.referenceType === "booking" && notifData.referenceId) {
    const params = new URLSearchParams();
    params.set("id", notifData.referenceId);
    if (notifData.organizationId) {
      params.set("orgId", notifData.organizationId);
    }
    if (notifData.title) {
      params.set("orgName", notifData.title);
    }
    url = self.location.origin + "/d/booking-detail?" + params.toString();
  } else {
    url = self.location.origin + "/";
  }

  if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
