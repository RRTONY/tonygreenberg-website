import { ManifestoNav } from "@/components/manifesto/manifesto-nav";
import { ManifestoFooter } from "@/components/manifesto/manifesto-footer";
import { pageFontVariables } from "@/lib/fonts/page-fonts";

// Ported from legacy client/src/pages/manifesto/ManifestoLayout.tsx — a
// standalone shell for the Attention Theft mega-page, same "self-contained
// sub-site" pattern as `app/brewsoul/layout.tsx`. Main-site chrome is
// suppressed for this path in `components/site-chrome.tsx`. Live sets every heading
// here in Fraunces (measured 2026-10-09), so font-heading points at it for this
// section, same as app/kava/layout.tsx.
export default function AttentionTheftLayout({ children }: LayoutProps<"/attention-theft">) {
  return (
    <div className={`${pageFontVariables} min-h-screen bg-background text-crusade-ink [--font-display:var(--font-fraunces-face),Georgia,serif]`}>
      <ManifestoNav />
      <main>{children}</main>
      <ManifestoFooter />
    </div>
  );
}
