import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Source_Sans_3 } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RootProviders } from "@/components/root-providers";
import { getWebsiteJsonLd, getPersonJsonLd } from "@/lib/structured-data";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tony Greenberg",
    template: "%s | Tony Greenberg",
  },
  description:
    "Essays, frameworks, and tools from Tony Greenberg — CEO of RampRate, Founder of ImpactSoul.",
  openGraph: {
    type: "website",
    siteName: "Tony Greenberg",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ThinkTony",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [websiteJsonLd, personJsonLd] = await Promise.all([getWebsiteJsonLd(), getPersonJsonLd()]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmMono.variable} ${sourceSans3.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: a browser extension (ClickUp, seen in the
          wild here) injects a class onto <body> before React hydrates —
          this is a client-only DOM mutation from outside the app, not a
          real server/client markup mismatch, so it's safe to suppress here
          specifically (unlike suppressing it broadly across the tree). */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <RootProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-9999 focus:rounded focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to main content
          </a>
          <SiteChrome>
            <SiteHeader />
          </SiteChrome>
          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>
          <SiteChrome>
            <SiteFooter />
          </SiteChrome>
        </RootProviders>
      </body>
    </html>
  );
}
