import { KavaNav, KavaFooter } from "@/components/kava/kava-nav";

// Ported from legacy client/src/pages/kava/KavaLayout.tsx — the shared
// shell for every /kava/* route. The main site's SiteHeader/SiteFooter
// are suppressed for this subtree by SiteChrome in the root layout, same
// pattern as /brewsoul and /attention-theft.
export default function KavaRootLayout({ children }: AppLayoutProps<"/kava">) {
  return (
    <div className="min-h-screen bg-kava-sand text-kava-ink">
      <KavaNav />
      <main>{children}</main>
      <KavaFooter />
    </div>
  );
}
