"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, MapPin, ShoppingCart, Star, type LucideIcon } from "lucide-react";
import { usePresenceSwap } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/components/ActivityTicker.tsx (2026-11-21).
// NOTE (owner to decide): these items are the app's fixed sample lines ("seededActivities"), not
// real visitor activity, even though the bar says "Live". Ported as-is at the owner's request.
// framer-motion's AnimatePresence (y 15 -> 0 in, 0 -> -15 out, 0.4s each) became usePresenceSwap
// + tw-animate classes; the line still changes every 4 seconds.

type Activity = { id: number; icon: LucideIcon; text: string; time: string; color: string };

export const seededActivities: Activity[] = [
  { id: 1, icon: Star, text: "Someone in Austin rated Fortaleza Blanco ★★★★★", time: "2m ago", color: "size-3.5 shrink-0 text-amber-400" },
  { id: 2, icon: ShoppingCart, text: "Wild Common Still Strength purchased via Old Town", time: "5m ago", color: "size-3.5 shrink-0 text-emerald-400" },
  { id: 3, icon: Eye, text: "A visitor explored the Flavor Matrix from Tokyo", time: "8m ago", color: "size-3.5 shrink-0 text-blue-400" },
  { id: 4, icon: Heart, text: "Cascahuín Tahona added to 3 wishlists today", time: "12m ago", color: "size-3.5 shrink-0 text-rose-400" },
  { id: 5, icon: MapPin, text: "Someone completed the Pilgrimage map from CDMX", time: "15m ago", color: "size-3.5 shrink-0 text-purple-400" },
  { id: 6, icon: Star, text: "G4 Blanco rated 89 by the expert panel", time: "18m ago", color: "size-3.5 shrink-0 text-amber-400" },
  { id: 7, icon: ShoppingCart, text: "Tears of Llorona purchased via Sip Tequila", time: "22m ago", color: "size-3.5 shrink-0 text-emerald-400" },
  { id: 8, icon: Eye, text: "The Altar page viewed 47 times today", time: "25m ago", color: "size-3.5 shrink-0 text-blue-400" },
  { id: 9, icon: Heart, text: "Caballito Cerrero trending in the community", time: "30m ago", color: "size-3.5 shrink-0 text-rose-400" },
  { id: 10, icon: ShoppingCart, text: "Cimarrón Blanco purchased — best value pick", time: "35m ago", color: "size-3.5 shrink-0 text-emerald-400" },
  { id: 11, icon: Star, text: "Calle 23 Criollo scored 91 — highest in catalog", time: "40m ago", color: "size-3.5 shrink-0 text-amber-400" },
  { id: 12, icon: MapPin, text: "A visitor explored NOM 1123 distilleries", time: "45m ago", color: "size-3.5 shrink-0 text-purple-400" },
];

export function ActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { shown, leaving } = usePresenceSwap(currentIndex, 400);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % seededActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = seededActivities[shown];
  const Icon = current.icon;

  return (
    <div className="relative z-10 w-full overflow-hidden border-y border-white/5 bg-black/60 py-3 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-6 items-center gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <div className="size-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">Live</span>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div
              key={current.id}
              className={
                leaving
                  ? "flex animate-out items-center gap-2 duration-400 fade-out fill-mode-forwards slide-out-to-top-[15px]"
                  : "flex animate-in items-center gap-2 duration-400 fade-in fill-mode-both slide-in-from-bottom-[15px]"
              }
            >
              <Icon aria-hidden="true" className={current.color} />
              <span className="truncate text-sm font-light text-slate-300">{current.text}</span>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-slate-600">{current.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
