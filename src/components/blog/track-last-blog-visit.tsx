"use client";

import { useEffect } from "react";
import { writeVisitorState } from "@/lib/visitor-state-client";

// Stores the real post slug/title through the server-side visitor-state
// boundary. The browser receives only an HttpOnly visitor identifier; the
// banner obtains the actual reading state from the managed database.
export function TrackLastBlogVisit({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    void writeVisitorState("reading", { slug, title }).catch(() => undefined);
  }, [slug, title]);

  return null;
}
