import "./aqueous.css";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { AqueousNav } from "@/components/aqueous/aqueous-nav";
import { AqueousFooter } from "@/components/aqueous/aqueous-footer";
import { ContentProtection } from "@/components/aqueous/content-protection";
import { ReferralClaimModal } from "@/components/aqueous/referral-claim-modal";

// Aqueous, Tony's water guide, ported from its Manus app (aqwaterqpr-wvzsc3ph.manus.space, exported
// 2026-11-24) as a self-contained sub-site, same pattern as /liquid-sun and /soul-smoke: SiteChrome
// hides the main site's header and footer under /aqueous, and this is Aqueous's own shell (App.tsx:
// ContentProtection, the referral claim modal, and the Navigation + Footer every page rendered).
// Notes: docs/ai/project_aqueous_port.md.
export default function AqueousLayout({ children }: LayoutProps<"/aqueous">) {
  return (
    <AqueousProviders>
      <ContentProtection />
      <ReferralClaimModal />
      <AqueousNav />
      <main>{children}</main>
      <AqueousFooter />
    </AqueousProviders>
  );
}
