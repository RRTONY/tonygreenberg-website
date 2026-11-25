import Link from "next/link";
import { CircleAlert, House } from "lucide-react";
import { sk } from "@/lib/content/sake/nav";

// The Sake app's NotFound (client/src/pages/NotFound.tsx): "404 / Page Not Found / Sorry, the page
// you are looking for doesn't exist. It may have been moved or deleted." with a Go Home button.
// The app left this page in the Manus template's light slate-and-blue look; here it uses the
// section's own colors so it doesn't flash white inside the dark guide (rule 20). Any notFound()
// or unknown path under /sake renders it inside the Sake layout. A not-found file can't export
// metadata; Next.js adds the noindex robots tag to 404s itself.
export default function SakeNotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card px-6 py-8 text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse" />
            <CircleAlert aria-hidden="true" className="relative size-16 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl! font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl! font-semibold text-(--sk-fg-soft) mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist.
          <br />
          It may have been moved or deleted.
        </p>
        <Link
          href={sk("/")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
        >
          <House aria-hidden="true" className="size-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
