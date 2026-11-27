import { Book, ExternalLink, Smartphone, Video } from "lucide-react";
import { Reveal } from "@/components/liquidsun/motion";

// Ported from the LiquidSun app's client/src/pages/Library.tsx (2026-11-21). Same resources and
// copy. Sections fade up as they scroll in (y 20, delay index * 0.1). Fixed from live (rule 20):
// each card's stretched link was absolutely positioned but the card wasn't `relative`, so on the
// app the last link covered the whole page; the card is `relative` now, so each link covers only
// its own card.

type Resource = { title: string; author: string; type: string; desc: string; link: string };

export const resources: { category: string; items: Resource[] }[] = [
  {
    category: "The Bible",
    items: [
      {
        title: "Tequila Matchmaker",
        author: "Grover & Scarlet Sanschagrin",
        type: "App / Database",
        desc: "The only source of truth. If it's not verified here, assume it's fake.",
        link: "https://tequilamatchmaker.com",
      },
    ],
  },
  {
    category: "Essential Reading",
    items: [
      {
        title: "Divided Spirits",
        author: "Sarah Bowen",
        type: "Book",
        desc: "The sociology of the mezcal/tequila divide. Understand the politics behind the label.",
        link: "#",
      },
      { title: "The Tequila Dictionary", author: "Eric Zandona", type: "Book", desc: "A comprehensive A-Z of the industry. No fluff, just facts.", link: "#" },
      {
        title: "How the Gringos Stole Tequila",
        author: "Chantal Martineau",
        type: "Book",
        desc: "Essential reading on the industry's corruption and the fight for authenticity.",
        link: "#",
      },
    ],
  },
  {
    category: "Watch & Learn",
    items: [
      {
        title: "Agave Road Trip",
        author: "Lou Bank & Chava Periban",
        type: "Podcast",
        desc: "Deep dives into the heritage and future of agave spirits.",
        link: "https://agaveroadtrip.com",
      },
      {
        title: "Tequila Reviews",
        author: "Long Island Lou",
        type: "Blog / Video",
        desc: "Honest, brutal, and necessary reviews from a veteran palate.",
        link: "https://longislandloutequila.com",
      },
    ],
  },
];

function TypeIcon({ type }: { type: string }) {
  if (type.includes("App")) return <Smartphone aria-hidden="true" className="size-5 text-primary" />;
  if (type.includes("Book")) return <Book aria-hidden="true" className="size-5 text-primary" />;
  return <Video aria-hidden="true" className="size-5 text-primary" />;
}

export function Library() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Library</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">Knowledge is the only additive we allow.</p>
        </div>

        <div className="space-y-16">
          {resources.map((section, i) => (
            <Reveal key={section.category} margin="0px" delay={i * 0.1} enter="animate-in fade-in fill-mode-both slide-in-from-bottom-5">
              <h2 className="mb-8 border-b border-border pb-4 font-display text-2xl text-foreground">{section.category}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.title} className="group relative rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon type={item.type} />
                        <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                      </div>
                      <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    <p className="mb-2 font-mono text-sm tracking-wider text-muted-foreground uppercase">{item.author}</p>
                    <p className="mb-4 leading-relaxed text-foreground/80">{item.desc}</p>

                    {item.link !== "#" && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="absolute inset-0">
                        <span className="sr-only">View {item.title}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
