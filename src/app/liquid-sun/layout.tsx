import "./liquidsun.css";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { LiquidsunNav } from "@/components/liquidsun/liquidsun-nav";
import { ContentProtection } from "@/components/liquidsun/liquidsun-effects";

// LiquidSun, Tony's tequila guide, ported from its Manus app (exported 2026-11-21) as a
// self-contained sub-site, same pattern as /soul-smoke: SiteChrome hides the main site's header
// and footer under /liquid-sun, and this is LiquidSun's own shell (App.tsx: the copy deterrent and
// Navigation). The app had no footer. The sound button (AudioController) sits on the pages that
// had it in the app, not on every page.
export default function LiquidsunLayout({ children }: LayoutProps<"/liquid-sun">) {
  return (
    <LiquidsunProviders>
      <ContentProtection />
      <LiquidsunNav />
      <main>{children}</main>
    </LiquidsunProviders>
  );
}
