import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/components/liquidsun/ui";
import { EditorialBackdrop } from "@/components/liquidsun/pages/editorial-backdrop";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/TheGatekeepers.tsx (2026-11-21). Same copy and
// classes; the Profiteers' grayscale-until-hover is as in the app.

export const prophets = [
  {
    name: "Grover & Scarlet Sanschagrin",
    role: "Tequila Matchmaker",
    text: 'The undisputed guardians of truth. They built the database that exposed the diffuser industry. If it\'s not "Additive Free Confirmed" by them, question it.',
  },
  {
    name: "Lucas Assis",
    role: "The Bartender",
    text: "The frontline warrior. He takes the chemistry of additives and explains it to the masses on TikTok. Fearless in calling out celebrity brands.",
  },
  {
    name: "Khrys Maxwell",
    role: "The Encyclopedia",
    text: "A walking library of NOMs and production methods. He knows where the bodies are buried (and where the diffusers are hidden).",
  },
];

export function TheGatekeepers() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <EditorialBackdrop image={liquidsunImages.candleCellar} imageClassName="object-cover opacity-30 mix-blend-luminosity" />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <header className="mb-16 space-y-6 text-center">
            <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
              The Gatekeepers
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light tracking-wide text-amber-200/80 md:text-2xl">
              There are those who protect the spirit, and those who sell it out. Choose your teachers wisely.
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-amber-500/20" />
                <h2 className="font-serif text-3xl text-amber-400 drop-shadow-md">The Prophets</h2>
                <Separator className="flex-1 bg-amber-500/20" />
              </div>

              {prophets.map((p) => (
                <Card key={p.name} className="border-amber-500/10 bg-slate-900/40 backdrop-blur-sm transition-colors duration-300 hover:bg-slate-900/60">
                  <CardHeader>
                    <CardTitle as="h3" className="font-serif text-2xl text-amber-300">
                      {p.name}
                    </CardTitle>
                    <p className="font-mono text-xs tracking-widest text-amber-500/60 uppercase">{p.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-slate-300">{p.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-red-900/20" />
                <h2 className="font-serif text-3xl text-red-400 drop-shadow-md">The Profiteers</h2>
                <Separator className="flex-1 bg-red-900/20" />
              </div>

              <Card className="border-red-900/20 bg-red-950/10 grayscale backdrop-blur-sm transition-colors duration-300 hover:bg-red-950/20 hover:grayscale-0">
                <CardHeader>
                  <CardTitle as="h3" className="font-serif text-2xl text-red-300">
                    The Celebrity Shill
                  </CardTitle>
                  <p className="font-mono text-xs tracking-widest text-red-500/60 uppercase">Marketing &gt; Product</p>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-slate-400">
                    They don&apos;t drink it. They don&apos;t know how it&apos;s made. They just want to sell you a lifestyle bottle filled with
                    vanilla extract.
                    <br />
                    <span className="text-sm text-red-400/80 italic">See: 818, Teremana, Casamigos.</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-900/20 bg-red-950/10 grayscale backdrop-blur-sm transition-colors duration-300 hover:bg-red-950/20 hover:grayscale-0">
                <CardHeader>
                  <CardTitle as="h3" className="font-serif text-2xl text-red-300">
                    The &quot;Smooth&quot; Peddler
                  </CardTitle>
                  <p className="font-mono text-xs tracking-widest text-red-500/60 uppercase">The Additive Apologist</p>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-slate-400">
                    Influencers who describe every tequila as &quot;smooth&quot; and &quot;sweet&quot; because they are paid to ignore the
                    chemical burn of the diffuser.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
