import { BrewSoulNav, BrewSoulFooter } from "@/components/brewsoul/brewsoul-nav";
import { CategoryBadge } from "@/components/brewsoul/category-badge";

// Ported from legacy client/src/pages/brewsoul/BrewSoulLayout.tsx — the
// shared shell for every /brewsoul/* route. The main site's SiteHeader/
// SiteFooter are suppressed for this subtree by SiteChrome in the root
// layout; this is BrewSoul's own nav/footer instead, matching legacy's
// standalone sub-site treatment.
export default function BrewSoulRootLayout({ children }: AppLayoutProps<"/brewsoul">) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2C1810]">
      <BrewSoulNav />
      <main className="pt-13">
        <CategoryBadge />
        {children}
      </main>
      <BrewSoulFooter />
    </div>
  );
}
