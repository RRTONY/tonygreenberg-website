import "./sake.css";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeNav } from "@/components/sake/sake-nav";
import { SakeBottomNav } from "@/components/sake/sake-bottom-nav";
import { SakeFooter } from "@/components/sake/sake-footer";
import { ContentProtection } from "@/components/sake/content-protection";

// Sake for Sake's Sake, Tony's sake guide, ported from its Manus app (exported 2026-11-26) as a
// self-contained sub-site, same pattern as /aqueous and /liquid-sun: SiteChrome hides the main site's
// header and footer under /sake, and this is the app's own shell (App.tsx: ContentProtection,
// Navigation, the page, BottomNav; every app page ended with GlobalFooter, rendered once here).
// Notes: docs/ai/project_sake_port.md.
export default function SakeLayout({ children }: LayoutProps<"/sake">) {
  return (
    <SakeProviders>
      <ContentProtection />
      <SakeNav />
      {/* The root layout already wraps every page in <main id="main-content">, so no second <main> here. */}
      <div>{children}</div>
      <SakeFooter />
      <SakeBottomNav />
    </SakeProviders>
  );
}
