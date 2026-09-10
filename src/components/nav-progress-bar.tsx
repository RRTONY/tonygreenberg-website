"use client";

import { useEffect, useRef, useState } from "react";

// A top-of-page progress bar for route transitions, in the spirit of
// nprogress/YouTube's loading bar — but zero dependencies. Built on the
// Navigation API (`window.navigation`), which is the modern, standards-based
// replacement for the router events the Pages Router used to expose (App
// Router doesn't have an equivalent). Where the Navigation API isn't
// supported yet, this simply renders nothing — progressive enhancement,
// never a broken experience.
export function NavProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const creepInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("navigation" in window)) return;
    const nav = (window as unknown as { navigation: EventTarget }).navigation;

    // The Navigation API dispatches these events synchronously, sometimes
    // inside a phase where React forbids scheduling updates (it triggers a
    // "useInsertionEffect must not schedule updates" warning otherwise) —
    // queueMicrotask defers the state updates to the next microtask so they
    // land outside that window without adding a visible delay.
    const start = () => {
      queueMicrotask(() => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        if (creepInterval.current) clearInterval(creepInterval.current);
        setVisible(true);
        setProgress(15);
        // Creep toward 85% while the navigation is in flight, without ever
        // reaching 100% until it actually completes.
        creepInterval.current = setInterval(() => {
          setProgress((p) => (p < 85 ? p + (85 - p) * 0.1 : p));
        }, 200);
      });
    };

    const finish = () => {
      queueMicrotask(() => {
        if (creepInterval.current) clearInterval(creepInterval.current);
        setProgress(100);
        hideTimeout.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 200);
      });
    };

    nav.addEventListener("navigate", start);
    nav.addEventListener("navigatesuccess", finish);
    nav.addEventListener("navigateerror", finish);

    return () => {
      nav.removeEventListener("navigate", start);
      nav.removeEventListener("navigatesuccess", finish);
      nav.removeEventListener("navigateerror", finish);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      if (creepInterval.current) clearInterval(creepInterval.current);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 z-9998 h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light shadow-[0_0_8px_var(--brand-gold-light)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
