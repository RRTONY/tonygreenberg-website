import { useEffect, useRef, useCallback } from "react";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

/**
 * Auto-logout after 30 minutes of inactivity.
 * Resets the timer on mouse, keyboard, scroll, or touch events.
 * Calls the provided logout function and redirects to home when expired.
 */
export function useSessionTimeout(
  isAuthenticated: boolean,
  logout: () => Promise<void>
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await logoutRef.current();
      } catch {
        // ignore — cookie may already be expired server-side
      }
      window.location.href = "/";
    }, THIRTY_MINUTES_MS);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    const handler = () => resetTimer();

    // Start the timer immediately
    resetTimer();

    for (const event of events) {
      window.addEventListener(event, handler, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of events) {
        window.removeEventListener(event, handler);
      }
    };
  }, [isAuthenticated, resetTimer]);
}
