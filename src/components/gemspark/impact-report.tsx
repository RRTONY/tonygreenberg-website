"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { getGemSparkCounts, type GemSparkCounts } from "@/app/gem-spark/actions";

// Ported from the GemSpark app's components/ImpactReport.tsx: long- and short-form read counts,
// refreshed every 30 seconds like its refetchInterval. Counts come from Supabase
// (gemspark_page_views) and started at zero on this site. While loading, the original's pulsing
// dash shows in place of each number.
const REFRESH_MS = 30000;

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toLocaleString();
}

export function ImpactReport() {
  const [counts, setCounts] = useState<GemSparkCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let live = true;
    const load = () =>
      getGemSparkCounts()
        .then((result) => {
          if (!live) return;
          if (result) setCounts(result);
          setIsLoading(false);
        })
        .catch(() => {
          if (live) setIsLoading(false);
        });
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="mx-auto mt-12 max-w-md rounded-xl bg-[#2C3E50] p-6 text-white shadow-lg md:mx-0 md:ml-auto">
      <div className="mb-4 flex items-center gap-3">
        <BarChart3 aria-hidden="true" className="size-5 text-[#D4E6F1]" />
        <span className="text-sm font-medium tracking-widest text-[#D4E6F1] uppercase">Impact Report</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-3xl font-light">
            {isLoading ? <span className="animate-pulse">—</span> : formatNumber(counts?.longForm ?? 0)}
          </div>
          <div className="mt-1 text-xs tracking-wider text-white/60 uppercase">Long-Form Reads</div>
        </div>
        <div>
          <div className="text-3xl font-light">
            {isLoading ? <span className="animate-pulse">—</span> : formatNumber(counts?.shortForm ?? 0)}
          </div>
          <div className="mt-1 text-xs tracking-wider text-white/60 uppercase">Short-Form Reads</div>
        </div>
      </div>
    </div>
  );
}
