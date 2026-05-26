import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Invalidates all booking-related queries on SSE event:
// - ["schedule-bookings"] → schedule list, requests, in-progress, byId
// - ["home"] → home dashboard summary and active bookings
const BOOKING_QUERY_KEYS = [["schedule-bookings"], ["home"]] as const;

export function useBookingRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let es: EventSource | null = null;

    const connect = () => {
      es = new EventSource("/api/bookings/events", { withCredentials: true });

      es.onmessage = (e) => {
        if (e.data === "booking_updated") {
          BOOKING_QUERY_KEYS.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
      };

      es.onerror = () => {
        // EventSource auto-reconnects after a few seconds — no manual retry needed
      };
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        connect();
        // Catch up any updates missed while tab was inactive
        BOOKING_QUERY_KEYS.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        es?.close();
        es = null;
      }
    };

    connect();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      es?.close();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [queryClient]);
}
