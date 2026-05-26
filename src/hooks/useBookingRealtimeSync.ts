import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { app } from "@/src/lib/eden-app";

// Invalidates all booking-related queries on SSE event:
// - ["schedule-bookings"] → schedule list, requests, in-progress, byId (prefix match)
// - ["home"] → home dashboard summary and active bookings (prefix match)
const BOOKING_QUERY_KEYS = [["schedule-bookings"], ["home"]] as const;

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  BOOKING_QUERY_KEYS.forEach((queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  });
}

function abortableDelay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

export function useBookingRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let controller = new AbortController();

    async function subscribe(signal: AbortSignal) {
      while (!signal.aborted) {
        try {
          // Eden returns AsyncGenerator<{ data: string }> for SSE endpoints
          const { data, error } = await app.api.bookings.events.get({
            fetch: { signal },
          });

          if (error || !data) {
            if (!signal.aborted) await abortableDelay(3000, signal);
            continue;
          }

          for await (const chunk of data) {
            // Eden yields the SSE data field value directly as a string,
            // not wrapped in { data: string } despite the server-side type
            const value = typeof chunk === "string" ? chunk : (chunk as any)?.data;
            if (value === "booking_updated") {
              invalidateAll(queryClient);
            }
          }
        } catch (e) {
          if ((e as DOMException).name === "AbortError") return;
          if (!signal.aborted) await abortableDelay(3000, signal);
        }
      }
    }

    function restart() {
      controller.abort();
      controller = new AbortController();
      subscribe(controller.signal);
      invalidateAll(queryClient);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        restart();
      } else {
        controller.abort();
      }
    };

    subscribe(controller.signal);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      controller.abort();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [queryClient]);
}
