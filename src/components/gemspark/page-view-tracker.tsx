"use client";

import { useEffect, useRef } from "react";
import { trackGemSparkView, type GemSparkPage } from "@/app/gem-spark/actions";

// The GemSpark app's hooks/usePageTracking.ts as a component: records one read of this version
// when the page opens (the Spanish short version counts as "short-form", as it did there). The
// server keeps one per browser per 30 minutes and stores no IP or user agent.
export function PageViewTracker({ page }: { page: GemSparkPage }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    // A missed count is fine; an unhandled rejection on a dropped connection isn't.
    trackGemSparkView(page).catch(() => {});
  }, [page]);

  return null;
}
