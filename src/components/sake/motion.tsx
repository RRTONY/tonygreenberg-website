"use client";

import type { ComponentProps } from "react";
import { Reveal as SectionReveal } from "@/components/liquidsun/motion";

// The Sake app animated with framer-motion, which this site doesn't use (CONTRIBUTING rule 5).
// Same CSS recreation as LiquidSun and Aqueous (src/components/liquidsun/motion.tsx has the details):
// - `initial` + `animate` on mount: tw-animate classes on the element, e.g. the app's
//   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//   = "animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both".
//   A stagger (transition={{ delay: i * 0.06 }}) is the one allowed inline style, a computed
//   animationDelay, or <Reveal delay={i * 0.06}>.
// - `whileInView` + viewport={{ once: true }}: <Reveal enter="...">. The Sake app used framer's
//   default viewport margin (0px), so that's the default here; pass `margin` where it set one.
// - `AnimatePresence`: usePresenceSwap, or a plain conditional with enter classes when the app's
//   exit was only a quick fade.
// Unspecified framer durations (its default tween/spring settles in about half a second) use duration-500.
// Everything gives way to "reduce motion" (the helper + sake.css).

export { usePresenceSwap, usePrefersReducedMotion } from "@/components/liquidsun/motion";

export function Reveal({ margin = "0px", ...props }: ComponentProps<typeof SectionReveal>) {
  return <SectionReveal margin={margin} {...props} />;
}
