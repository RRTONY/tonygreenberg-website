import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/TheAgaves.tsx (2026-11-21): a "coming soon"
// placeholder in the app too, ported as it was (no stardust on this page in the app).
export function TheAgaves() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50">
      <EditorialBackdrop image={liquidsunImages.agaveFieldMoon} imageClassName="object-cover opacity-20 mix-blend-luminosity" stardust={false} />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-4 font-serif text-5xl text-amber-500">The Agaves</h1>
          <p className="text-xl text-slate-400">Botanical deep dive coming soon.</p>
        </div>
      </div>
    </div>
  );
}
