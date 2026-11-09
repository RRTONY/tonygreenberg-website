import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MezcalLibrary.tsx (route /library). Same books,
// copy and layout. The hero's faint cross pattern was an inline-style SVG data URI; it is the
// same SVG drawn as an inline <pattern> so no style={} is needed.
// Headings use text-foreground instead of live's text-earth: on SoulSmoke's dark background the
// near-black text-earth headings were unreadable (CONTRIBUTING rule 20); Aficionado mode stays dark-on-light.

type Book = {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  year: number | string;
  publisher: string;
  description: string;
  whyItMatters: string;
  category: string;
  amazonUrl?: string;
  url?: string;
};

export const libraryBooks: Book[] = [
  {
    id: 1,
    title: "Finding Mezcal",
    subtitle: "A Journey into the Liquid Soul of Mexico",
    author: "Ron Cooper with Chantal Martineau",
    year: 2018,
    publisher: "Ten Speed Press",
    description:
      "The foundational text from the founder of Del Maguey—the person largely responsible for introducing artisanal mezcal to the world. Part memoir, part love letter to the mezcaleros of Oaxaca. Includes 40 cocktail recipes developed by world-class bartenders.",
    whyItMatters:
      "This is the origin story. Ron Cooper didn't just write about mezcal; he changed its trajectory. If you drink mezcal today, you're drinking his legacy.",
    category: "Essential",
    amazonUrl: "https://www.amazon.com/Finding-Mezcal-Journey-Liquid-Cocktails/dp/0399579001",
  },
  {
    id: 2,
    title: "Mezcal",
    subtitle: "The History, Craft & Cocktails of the World's Ultimate Artisanal Spirit",
    author: "Emma Janzen",
    year: 2017,
    publisher: "Voyageur Press",
    description:
      "The most comprehensive and beautifully photographed guide to mezcal. Three-time James Beard Award winner Emma Janzen covers history, production, regions, and includes original cocktail recipes.",
    whyItMatters:
      "The definitive encyclopedia. When you need to understand what sets mezcal apart from every other spirit on earth, this is where you start.",
    category: "Essential",
    amazonUrl: "https://www.amazon.com/Mezcal-History-Cocktails-Ultimate-Artisanal/dp/0760352615",
  },
  {
    id: 3,
    title: "Holy Smoke! It's Mezcal!",
    subtitle: "A Complete Guide from Agave to Zapotec",
    author: "John McEvoy",
    year: 2016,
    publisher: "Self-Published (2nd Edition)",
    description:
      "Goes deep while remaining accessible. McEvoy's passion comes through on every page. Explores the hand-crafted production process passed down through generations.",
    whyItMatters:
      "Written by someone who fell in love and never recovered. The enthusiasm is infectious. You'll finish this book wanting to book a flight to Oaxaca.",
    category: "Deep Dive",
    amazonUrl: "https://www.amazon.com/Holy-Smoke-Its-Mezcal-Complete/dp/0990328104",
  },
  {
    id: 4,
    title: "The Mezcal Experience",
    subtitle: "A Field Guide to the World's Best Mezcals and Agave Spirits",
    author: "Tom Bullock",
    year: 2017,
    publisher: "Jacqui Small",
    description:
      "A practical field guide covering the basics of mezcal production, tasting notes, and specific bottle recommendations. Perfect for those building their palate.",
    whyItMatters:
      "When you're standing in a mezcalería overwhelmed by choices, this is the book you wish you'd read. Practical, actionable, essential.",
    category: "Practical",
    amazonUrl: "https://www.amazon.com/Mezcal-Experience-Worlds-Mezcals-Spirits/dp/1911127152",
  },
  {
    id: 5,
    title: "Mezcal and Tequila Cocktails",
    subtitle: "Mixed Drinks for the Golden Age of Agave",
    author: "Robert Simonson",
    year: 2021,
    publisher: "Ten Speed Press",
    description:
      "From the acclaimed cocktail writer, 60+ recipes that showcase mezcal's versatility. Bridges traditional and contemporary drinking culture.",
    whyItMatters:
      "Mezcal isn't just for sipping neat. This book proves it belongs in the same conversation as whiskey and gin for cocktail innovation.",
    category: "Cocktails",
    amazonUrl: "https://www.amazon.com/Mezcal-Tequila-Cocktails-Drinks-Golden/dp/1984856987",
  },
  {
    id: 6,
    title: "¡Viva Mezcal!",
    subtitle: "Mixing, Sipping, and Other Adventures with Mexico's Original Handcrafted Spirit",
    author: "Lindsey Recepter & Jennifer Boudinot",
    year: 2018,
    publisher: "Chronicle Books",
    description:
      "A vibrant, accessible introduction with beautiful illustrations. Covers the culture, cocktails, and characters behind mezcal.",
    whyItMatters:
      "The gateway drug. If you're buying a book for someone who's mezcal-curious, this is the one. Approachable without being shallow.",
    category: "Introduction",
    amazonUrl: "https://www.amazon.com/Viva-Mezcal-Adventures-Mexicos-Handcrafted/dp/1452166919",
  },
  {
    id: 7,
    title: "Divided Spirits",
    subtitle: "Tequila, Mezcal, and the Politics of Production",
    author: "Sarah Bowen",
    year: 2015,
    publisher: "University of California Press",
    description:
      "The academic deep-dive. Explores the political economy of agave spirits, the tension between tradition and commercialization, and what 'authenticity' really means.",
    whyItMatters:
      "The uncomfortable questions. Who profits? Who loses? What does 'artisanal' actually mean when corporations get involved? Essential for the critical thinker.",
    category: "Academic",
    amazonUrl: "https://www.amazon.com/Divided-Spirits-Tequila-Mezcal-Production/dp/0520281764",
  },
  {
    id: 8,
    title: "The Home Bartender: Mezcal and Tequila",
    subtitle: "100+ Essential Cocktails for the Tequila Lover",
    author: "Shane Carley",
    year: 2024,
    publisher: "Cider Mill Press",
    description:
      "100+ cocktails with 4 ingredients or less. The practical guide for home enthusiasts who want to experiment without complexity.",
    whyItMatters:
      "You don't need a bar cart full of obscure ingredients. This book proves you can make exceptional drinks with what you have.",
    category: "Practical",
    amazonUrl: "https://www.amazon.com/Home-Bartender-Mezcal-Tequila-Essential/dp/1400344824",
  },
  {
    id: 9,
    title: "Agave Spirits",
    subtitle: "The Past, Present, and Future of Mezcals",
    author: "Gary Paul Nabhan & David Suro Piñera",
    year: 2023,
    publisher: "W.W. Norton",
    description:
      "A forward-looking examination of agave spirits, biodiversity, and sustainability. Essential for understanding the future of mezcal.",
    whyItMatters:
      "Climate change. Overharvesting. Industrial pressure. This book asks: will mezcal survive? And what can we do about it?",
    category: "Future",
    amazonUrl: "https://www.amazon.com/Agave-Spirits-Present-Future-Mezcals/dp/1324006080",
  },
  {
    id: 10,
    title: "Mezcalistas",
    subtitle: "The Essential Online Guide to Mezcal",
    author: "Susan Coss & Max Garrone",
    year: "Ongoing",
    publisher: "Mezcalistas.com",
    description:
      "The living, breathing online encyclopedia. Constantly updated with brand reviews, producer profiles, and industry news. The go-to digital resource.",
    whyItMatters:
      "Books capture a moment. Mezcalistas captures the movement. Bookmark it. Check it weekly. It's the pulse of the mezcal world.",
    category: "Digital",
    url: "https://www.mezcalistas.com",
  },
];

const categoryColors: Record<string, string> = {
  Essential: "rounded-full bg-terracotta px-3 py-1 font-mono text-xs tracking-wider text-white",
  "Deep Dive": "rounded-full bg-indigo px-3 py-1 font-mono text-xs tracking-wider text-white",
  Practical: "rounded-full bg-sage px-3 py-1 font-mono text-xs tracking-wider text-white",
  Cocktails: "rounded-full bg-coral px-3 py-1 font-mono text-xs tracking-wider text-white",
  Introduction: "rounded-full bg-ochre px-3 py-1 font-mono text-xs tracking-wider text-earth",
  Academic: "rounded-full bg-earth px-3 py-1 font-mono text-xs tracking-wider text-white",
  Future: "rounded-full bg-sage px-3 py-1 font-mono text-xs tracking-wider text-white",
  Digital: "rounded-full bg-terracotta px-3 py-1 font-mono text-xs tracking-wider text-white",
};

export function MezcalLibrary() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 opacity-10">
          <svg aria-hidden="true" className="absolute inset-0 size-full">
            <defs>
              <pattern id="ss-library-crosses" width="60" height="60" patternUnits="userSpaceOnUse">
                <g fill="#000000" fillOpacity="0.4">
                  <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ss-library-crosses)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2">
            <BookOpen aria-hidden="true" className="size-5 text-terracotta" />
            <span className="font-mono text-sm tracking-wider text-terracotta">THE LIBRARY</span>
          </div>

          <h1 className="mb-6 font-display text-5xl text-foreground md:text-7xl">
            The Essential
            <br />
            <span className="text-terracotta">Mezcal Reading List</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Ten books that will transform how you understand, appreciate, and drink mezcal. From foundational texts to
            future visions.
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-8">
            {libraryBooks.map((book, index) => (
              <article
                key={book.id}
                className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all duration-500 hover:border-terracotta/30 hover:shadow-xl"
              >
                <div className="flex flex-col gap-8 lg:flex-row">
                  {/* Number & Category */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                    <span className="font-display text-6xl text-terracotta/20 transition-colors group-hover:text-terracotta/40 lg:text-8xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={categoryColors[book.category]}>{book.category.toUpperCase()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="font-display text-2xl text-foreground transition-colors group-hover:text-terracotta md:text-3xl">
                        {book.title}
                      </h2>
                      {book.subtitle && <p className="mt-1 text-lg text-muted-foreground italic">{book.subtitle}</p>}
                    </div>

                    <div className="flex flex-wrap gap-4 font-mono text-sm text-muted-foreground">
                      <span>{book.author}</span>
                      <span>•</span>
                      <span>
                        {book.publisher}, {book.year}
                      </span>
                    </div>

                    <p className="leading-relaxed text-foreground/80">{book.description}</p>

                    <div className="rounded-lg border-l-4 border-terracotta bg-terracotta/5 p-4">
                      <p className="mb-1 text-sm font-medium text-terracotta">Why It Matters</p>
                      <p className="text-foreground/90 italic">{book.whyItMatters}</p>
                    </div>

                    {/* Link */}
                    <div className="pt-4">
                      <a
                        href={book.amazonUrl || book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-medium text-terracotta transition-colors hover:text-coral"
                      >
                        {book.category === "Digital" ? "Visit Website" : "Find This Book"}
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-earth px-4 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-display text-3xl md:text-4xl">Ready to Experience Mezcal?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80">
            Knowledge is the first sip. Now find the bottles that will transform your understanding.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/scent-finder")}
              className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-8 py-4 font-medium text-white transition-colors hover:bg-coral"
            >
              Find Your Agave by Scent
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/us-hunt")}
              className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 font-medium text-white transition-colors hover:border-white"
            >
              Explore US Bottles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
