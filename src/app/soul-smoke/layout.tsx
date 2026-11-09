import "./soulsmoke.css";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { SoulsmokeNav } from "@/components/soulsmoke/soulsmoke-nav";
import { SoulsmokeEffects } from "@/components/soulsmoke/soulsmoke-effects";

// SoulSmoke, Tony's mezcal guide, ported from its Manus app (exported 2026-11-10) as a
// self-contained sub-site, same pattern as /brewsoul: SiteChrome hides the main site's
// header and footer under /soul-smoke, and this is SoulSmoke's own shell (App.tsx's
// AppContent: copy protection, smoke cursor, fire sound, Navigation). The app had no footer.
export default function SoulsmokeLayout({ children }: LayoutProps<"/soul-smoke">) {
  return (
    <SoulsmokeProviders>
      <SoulsmokeEffects />
      <SoulsmokeNav />
      <main>{children}</main>
    </SoulsmokeProviders>
  );
}
