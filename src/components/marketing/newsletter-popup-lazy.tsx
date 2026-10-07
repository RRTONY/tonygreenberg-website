"use client";

import dynamic from "next/dynamic";

// The newsletter pop-up shows after 3 minutes at the earliest, so its code loads after the page
// is up instead of in the first load (Lighthouse, 2026-10-08).
export const NewsletterPopupLazy = dynamic(
  () => import("@/components/marketing/newsletter-popup").then((m) => m.NewsletterPopup),
  { ssr: false },
);
