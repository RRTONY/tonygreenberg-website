import { HumanosNav } from "@/components/humanos/humanos-nav";
import { HumanosFooter } from "@/components/humanos/humanos-footer";
import { pageFontVariables } from "@/lib/fonts/page-fonts";

// Ported from legacy client/src/pages/humanos/HumanosLayout.tsx — the
// shared shell for every /humanos/* route: dark nav, light body, dark
// footer. Same "self-contained sub-site, main SiteHeader/SiteFooter
// suppressed by SiteChrome" pattern as /brewsoul, /kava, and
// /attention-theft — see this migration's report for the SiteChrome
// prefix that still needs adding.
// Live sets every HumanOS heading in Space Grotesk 700 (measured
// 2026-10-07), so this subtree points --font-display (what font-heading
// resolves to) at the Space Grotesk face.
export default function HumanosRootLayout({ children }: LayoutProps<"/humanos">) {
  return (
    <div
      className={`${pageFontVariables} min-h-screen bg-neutral-50 text-neutral-900 [--font-display:var(--font-space-grotesk),ui-sans-serif,system-ui,sans-serif]`}
    >
      <HumanosNav />
      <main>{children}</main>
      <HumanosFooter />
    </div>
  );
}
