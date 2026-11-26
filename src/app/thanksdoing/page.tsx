"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";

const videoPath = "/thanksdoing.mp4";

export default function ThanksDoingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(videoPath, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Video unavailable");
        return response.blob();
      })
      .then((blob) => setFile(new File([blob], "ThanksDOING.mp4", { type: "video/mp4" })))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function shareVideo() {
    if (!file || !navigator.canShare?.({ files: [file] })) {
      setMessage("Use Download MP4, then share the saved video from Files or Photos.");
      return;
    }
    try {
      await navigator.share({ files: [file] });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage("Use Download MP4, then share the saved video from Files or Photos.");
      }
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="mb-2 text-center font-heading text-3xl font-semibold sm:text-4xl">Happy ThanksDOING</h1>
      <p className="mb-5 text-center text-muted-foreground">Gratitude in action.</p>
      <video src={videoPath} controls playsInline preload="metadata" className="mx-auto max-h-[65vh] w-full rounded-lg bg-muted" aria-label="ThanksDOING animated greeting" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a href={videoPath} download="ThanksDOING.mp4" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-medium hover:bg-muted">
          <Download aria-hidden="true" className="size-5" /> Download MP4
        </a>
        <button type="button" onClick={shareVideo} disabled={!file} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">
          <Share2 aria-hidden="true" className="size-5" /> Share video
        </button>
      </div>
      <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">Choose WhatsApp in your phone’s share menu to send the actual video, not a link. If file sharing is unavailable, download the MP4 and attach it in WhatsApp.</p>
      {message && <p role="status" className="mt-3 text-center text-sm">{message}</p>}
      <div className="mt-6 text-center">
        <Link href="/blog/grateful-smuggest-sentiment-or-selfish-act" className="font-medium underline underline-offset-4">Read my 2014 essay and 2026 update</Link>
      </div>
    </main>
  );
}
