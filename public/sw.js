// ──────────────────────────────────────────────
// Cukkr PWA Service Worker
// - Cache strategy: stale-while-revalidate (JS/CSS), cache-first (images/fonts)
// - Push notifications + notification click handling
// - CACHE_VERSION bumped on deploy forces new cache population
// ──────────────────────────────────────────────

const CACHE_VERSION = "cukkr-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/cukkr-logo-trans.png",
];

// ── Install: precache known static assets + skipWaiting ──
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] precache miss (non-fatal):", url, err.message);
          }),
        ),
      );
    }),
  );
});

// ── Activate: purge old cache versions ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Fetch: runtime caching ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Only handle http: and https: requests (Cache API rejects chrome-extension:, etc.)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Never cache API / auth requests
  if (url.pathname.startsWith("/api/")) return;

  // ── Stale-while-revalidate for JS & CSS ──
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ── Cache-first for images, fonts, and static assets ──
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "manifest" ||
    /\.(png|jpe?g|gif|svg|ico|woff2?|ttf|webmanifest)(\?|$)/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, cloned);
            });
          }
          return response;
        });
        return cached || networkFetch;
      }),
    );
    return;
  }

  // ── Network-first for navigation (HTML) ──
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, cloned);
          });
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
    );
  }
});

function staleWhileRevalidate(request) {
  return caches.open(CACHE_VERSION).then((cache) => {
    return cache.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      });
      return cached || fetchPromise;
    });
  });
}

// ──────────────────────────────────────────────
// Push Notification Handlers
// ──────────────────────────────────────────────

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
