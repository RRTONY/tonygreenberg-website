"use client";

import dynamic from "next/dynamic";

// Toast messages are used by only a couple of forms; load the toaster after
// the page is up instead of in every page's first load (Lighthouse, 2026-10-08).
export const LazyToaster = dynamic(() => import("@/components/ui/sonner").then((m) => m.Toaster), { ssr: false });
