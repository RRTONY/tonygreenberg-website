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
    void trackGemSparkView(page);
  }, [page]);

  return null;
}
