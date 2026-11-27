"use client";

import { useEffect, useState } from "react";
import { Loader2, Share2 } from "lucide-react";

const FALLBACK =
  "Use Download MP4, then share the saved video from Files or Photos.";

// Shares the video FILE itself (WhatsApp / Messages receive the MP4, not a
// link). iOS only opens the share sheet from a tap, so the file is fetched
// ahead of time and the tap just hands it over.
export function ShareVideoButton({ src }: { src: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Video unavailable");
        return response.blob();
      })
      .then((blob) =>
        setFile(new File([blob], "ThanksDOING.mp4", { type: "video/mp4" })),
      )
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setFailed(true);
        }
      });
    return () => controller.abort();
  }, [src]);

  async function shareVideo() {
    if (!file || !navigator.canShare?.({ files: [file] })) {
      setMessage(FALLBACK);
      return;
    }
    try {
      await navigator.share({ files: [file] });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage(FALLBACK);
      }
    }
  }

  const loading = !file && !failed;
  return (
    <>
      <button
        type="button"
        onClick={shareVideo}
        disabled={loading}
        aria-busy={loading}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60"
      >
        {loading ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <Share2 aria-hidden="true" className="size-5" />
        )}
        Share video
      </button>
      {(message || failed) && (
        <p role="status" className="text-center text-sm sm:col-span-2">
          {message || FALLBACK}
        </p>
      )}
    </>
  );
}
