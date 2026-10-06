"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-reads the server page every few seconds (legacy polled every 8s).
export function AutoRefresh({ seconds = 8 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
