import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { app } from "@/src/lib/eden-app";

// Invalidates all booking-related queries on SSE event:
// - ["schedule-bookings"] → schedule list, requests, in-progress, byId
// - ["home"] → home dashboard summary and active bookings
const BOOKING_QUERY_KEYS = [["schedule-bookings"], ["home"]] as const;

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
          const { data, error } = await app.api.bookings.events.get({
            fetch: { signal },
          });

          if (error || !data) {
            if (!signal.aborted) await abortableDelay(3000, signal);
            continue;
          }

          for await (const chunk of data as unknown as AsyncIterable<string>) {
            if (chunk === "booking_updated") {
              BOOKING_QUERY_KEYS.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
              });
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
      BOOKING_QUERY_KEYS.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
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
