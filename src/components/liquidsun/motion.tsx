"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// The LiquidSun app animated with framer-motion, which this site doesn't use (CONTRIBUTING rule 5).
// These helpers recreate its three patterns with CSS (tw-animate-css `animate-in` utilities and the
// ls- keyframes in liquidsun.css), at the app's own timings:
// - `initial` + `animate` on mount: put the tw-animate classes straight on the element
//   (e.g. "animate-in fade-in slide-in-from-bottom-[50px] duration-1000 fill-mode-both").
// - `whileInView` (viewport once): <Reveal enter="..."> starts hidden and adds the same classes
//   the first time it scrolls into view (IntersectionObserver, with the app's -100px margin).
// - `AnimatePresence mode="wait"`: usePresenceSwap keeps the old content on screen with its exit
//   classes until the exit finishes, then shows the new content with its enter classes.
// All of them give way to "reduce motion" (usePrefersReducedMotion + liquidsun.css).

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(listener: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener?.("change", listener);
  return () => mq.removeEventListener?.("change", listener);
}

/** True when the visitor asked their system for less motion. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCED_QUERY).matches : false),
    () => false,
  );
}

/**
 * framer-motion's `whileInView` with `viewport={{ once: true }}`. `enter` is the full literal list of
 * tw-animate classes to add once visible; until then the element is transparent. `delay` (seconds)
 * is the per-item stagger the app computed at runtime (index * 0.1), the one inline style allowed.
 */
export function Reveal({
  as: Tag = "div",
  className,
  enter,
  delay,
  margin = "-100px",
  children,
}: {
  as?: "div" | "section" | "li";
  className?: string;
  enter: string;
  delay?: number;
  margin?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer (very old browser, tests): show the content right away.
      const t = setTimeout(() => setSeen(true), 0);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, margin]);

  const shown = seen || reduced;
  const style: CSSProperties | undefined = delay && shown ? { animationDelay: `${delay}s` } : undefined;
  return (
    <Tag
      ref={ref as never}
      data-revealed={shown ? "true" : "false"}
      className={cn(className, shown ? enter : "opacity-0")}
      style={style}
    >
      {children}
    </Tag>
  );
}

/**
 * framer-motion's `AnimatePresence mode="wait"` for one value: while `value` changes, the previous
 * value stays as `shown` with `leaving` true for `exitMs`, then `shown` becomes the new value.
 */
export function usePresenceSwap<T>(value: T, exitMs: number) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);
  const [target, setTarget] = useState(value);
  const wait = reduced ? 0 : exitMs;

  // A new value: remember it during render (no effect needed), the timer below swaps it in.
  if (!Object.is(value, target)) setTarget(value);

  useEffect(() => {
    if (Object.is(target, shown)) return;
    const t = setTimeout(() => setShown(target), wait);
    return () => clearTimeout(t);
  }, [target, shown, wait]);

  return { shown, leaving: !Object.is(target, shown) };
}
