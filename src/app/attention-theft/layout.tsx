import { ManifestoNav } from "@/components/manifesto/manifesto-nav";
import { ManifestoFooter } from "@/components/manifesto/manifesto-footer";

// Ported from legacy client/src/pages/manifesto/ManifestoLayout.tsx — a
// standalone shell for the Attention Theft mega-page, same "self-contained
// sub-site" pattern as `app/brewsoul/layout.tsx`. Main-site chrome is
// suppressed for this path in `components/site-chrome.tsx`.
export default function AttentionTheftLayout({ children }: LayoutProps<"/attention-theft">) {
  return (
    <div className="min-h-screen bg-background text-crusade-ink">
      <ManifestoNav />
      <main>{children}</main>
      <ManifestoFooter />
    </div>
  );
}
