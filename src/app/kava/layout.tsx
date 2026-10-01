import { KavaNav, KavaFooter } from "@/components/kava/kava-nav";

// Ported from legacy client/src/pages/kava/KavaLayout.tsx — the shared
// shell for every /kava/* route. The main site's SiteHeader/SiteFooter
// are suppressed for this subtree by SiteChrome in the root layout, same
// pattern as /brewsoul and /attention-theft.
// The 52px top offset matches live, where the Kava pages sit inside the
// route shell's own nav offset (measured 2026-10-02).
export default function KavaRootLayout({ children }: LayoutProps<"/kava">) {
  return (
    <div className="min-h-screen bg-kava-sand pt-13 text-kava-ink">
      <KavaNav />
      <main>{children}</main>
      <KavaFooter />
    </div>
  );
}
