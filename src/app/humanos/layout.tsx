import { HumanosNav } from "@/components/humanos/humanos-nav";
import { HumanosFooter } from "@/components/humanos/humanos-footer";

// Ported from legacy client/src/pages/humanos/HumanosLayout.tsx — the
// shared shell for every /humanos/* route: dark nav, light body, dark
// footer. Same "self-contained sub-site, main SiteHeader/SiteFooter
// suppressed by SiteChrome" pattern as /brewsoul, /kava, and
// /attention-theft — see this migration's report for the SiteChrome
// prefix that still needs adding.
export default function HumanosRootLayout({ children }: AppLayoutProps<"/humanos">) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <HumanosNav />
      <main>{children}</main>
      <HumanosFooter />
    </div>
  );
}
