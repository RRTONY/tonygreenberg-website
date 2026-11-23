import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/PriceTracker.tsx (2026-11-21). Same table, copy
// and classes; the trend arrows are part of the data text, as in the app.

export const unicornWatch = [
  { bottle: "Fortaleza Winter Blend 2023", msrp: "$150", secondary: "$450+", secondaryClass: "text-right text-red-400", trend: "↑ Rising", trendClass: "text-right text-red-400" },
  { bottle: "G4 Madera Lote 2", msrp: "$80", secondary: "$120", secondaryClass: "text-right text-amber-200", trend: "→ Stable", trendClass: "text-right text-green-400" },
  { bottle: "Caballito Cerrero Chato", msrp: "$90", secondary: "$110", secondaryClass: "text-right text-amber-200", trend: "→ Stable", trendClass: "text-right text-green-400" },
  { bottle: "Clase Azul Reposado", msrp: "$160", secondary: "$160", secondaryClass: "text-right text-slate-400", trend: "↓ Falling", trendClass: "text-right text-slate-500" },
];

export function PriceTracker() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.barrelCellar} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-5xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              Price Tracker
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              The market is wild. Don&apos;t get ripped off.
            </p>
          </header>

          <Card className="overflow-hidden border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle as="h2" className="font-serif text-2xl text-amber-300">
                Unicorn Watch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-500/20 hover:bg-transparent">
                    <TableHead className="text-amber-500/60">Bottle</TableHead>
                    <TableHead className="text-right text-amber-500/60">MSRP</TableHead>
                    <TableHead className="text-right text-amber-500/60">Secondary</TableHead>
                    <TableHead className="text-right text-amber-500/60">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unicornWatch.map((row) => (
                    <TableRow key={row.bottle} className="border-amber-500/10 hover:bg-amber-500/5">
                      <TableCell className="font-medium text-amber-100">{row.bottle}</TableCell>
                      <TableCell className="text-right text-slate-400">{row.msrp}</TableCell>
                      <TableCell className={row.secondaryClass}>{row.secondary}</TableCell>
                      <TableCell className={row.trendClass}>{row.trend}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
