import { CircleAlert, Lock, TrendingUp } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/TradeBoard.tsx (2026-11-21). In the app this was
// a static showcase: three sample listings, market movers and a BOLO alert, with "Bid" and
// "Set Alert" buttons that did nothing and no server feature behind them (unlike SoulSmoke's real
// board). Ported as it was; the buttons stay inert on purpose (owner decision: keep, wire up, or
// drop). The BOLO text's literal **asterisks** are the app's copy. "Market Open" pulses as in the app.

export const listings = [
  { initial: "F", name: "Fortaleza Lote 42-A", meta: "Verified Seller • Ships from CA", price: "$450.00", lastSold: "Last sold: $425" },
  { initial: "G", name: "G4 Madera Lote 1", meta: "Verified Seller • Ships from TX", price: "$280.00", lastSold: "Last sold: $310" },
  { initial: "C", name: "Caballito Cerrero Chato", meta: "Verified Seller • Ships from NY", price: "$195.00", lastSold: "Last sold: $180" },
];

export const movers = [
  { name: "Cascahuín Tahona", change: "+12%", className: "font-mono text-green-400" },
  { name: "Calle 23 Criollo", change: "+8%", className: "font-mono text-green-400" },
  { name: "Don Julio 1942", change: "-5%", className: "font-mono text-red-400" },
];

export function TradeBoard() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.barrelCellar} imageClassName="object-cover opacity-20 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 font-mono text-xs tracking-widest text-amber-400 uppercase">
              <Lock aria-hidden="true" className="size-3" /> Members Only Access
            </div>
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Trade Board
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              Where the liquid gold moves in silence. Private allocations, cellar swaps, and the secondary market pulse.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl text-amber-100">Live Allocations</h2>
                <Badge className="animate-pulse border-amber-500/30 text-amber-400">
                  <span className="mr-2 size-2 rounded-full bg-green-500" /> Market Open
                </Badge>
              </div>

              <div className="space-y-4">
                {listings.map((l) => (
                  <Card
                    key={l.name}
                    className="group border-amber-500/10 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:border-amber-500/30"
                  >
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-900/20 font-serif text-xl text-amber-500">
                          {l.initial}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-amber-100 transition-colors group-hover:text-amber-400">{l.name}</h3>
                          <p className="font-mono text-xs text-slate-400">{l.meta}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg text-amber-400">{l.price}</p>
                        <p className="text-xs text-slate-500">{l.lastSold}</p>
                      </div>
                      {/* Inert, as on the app. */}
                      <Button type="button" size="sm" className="bg-amber-600 font-bold text-slate-950 hover:bg-amber-500">
                        Bid
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Card className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="flex items-center gap-2 font-serif text-xl text-amber-200">
                    <TrendingUp aria-hidden="true" className="size-5 text-green-500" /> Market Movers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {movers.map((m) => (
                    <div key={m.name} className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-300">{m.name}</span>
                      <span className={m.className}>{m.change}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-amber-900/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle as="h2" className="flex items-center gap-2 font-serif text-xl text-amber-200">
                    <CircleAlert aria-hidden="true" className="size-5 text-amber-500" /> BOLO Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-slate-300">
                    Reports of **Fortaleza Winter Blend 2024** hitting shelves in Southern California. Check your local Total Wine inventory
                    immediately.
                  </p>
                  {/* Inert, as on the app. */}
                  <Button type="button" variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                    Set Alert
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
