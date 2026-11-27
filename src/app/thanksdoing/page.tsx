import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { ShareVideoButton } from "./share-video-button";

const videoPath = "/thanksdoing.mp4";

export const metadata: Metadata = seoMetadata({
  title: "Happy ThanksDOING",
  description:
    "Gratitude in action: Tony Greenberg's animated ThanksDOING greeting. Watch it, download the MP4, or share the video itself.",
  alternates: { canonical: "/thanksdoing" },
  openGraph: {
    ...defaultOpenGraph,
    type: "video.other",
    url: "/thanksdoing",
    title: "Happy ThanksDOING",
    description: "Gratitude in action.",
    videos: [{ url: videoPath, type: "video/mp4" }],
  },
  twitter: {
    ...defaultTwitter,
    title: "Happy ThanksDOING",
    description: "Gratitude in action.",
  },
});

export default function ThanksDoingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="mb-2 text-center font-heading text-3xl font-semibold sm:text-4xl">
        Happy ThanksDOING
      </h1>
      <p className="mb-5 text-center text-muted-foreground">
        Gratitude in action.
      </p>
      <video
        src={videoPath}
        controls
        playsInline
        preload="metadata"
        className="mx-auto max-h-[65vh] w-full rounded-lg bg-muted"
        aria-label="ThanksDOING animated greeting"
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={videoPath}
          download="ThanksDOING.mp4"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-medium hover:bg-muted"
        >
          <Download aria-hidden="true" className="size-5" /> Download MP4
        </a>
        <ShareVideoButton src={videoPath} />
      </div>
      <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
        Choose WhatsApp in your phone’s share menu to send the actual video, not
        a link. If file sharing is unavailable, download the MP4 and attach it in
        WhatsApp.
      </p>
      <div className="mt-6 text-center">
        <Link
          href="/blog/grateful-smuggest-sentiment-or-selfish-act"
          className="font-medium underline underline-offset-4"
        >
          Read my 2014 essay and 2026 update
        </Link>
      </div>
    </main>
  );
}
