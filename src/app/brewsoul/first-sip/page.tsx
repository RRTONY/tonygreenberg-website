import type { Metadata } from "next";
import Link from "next/link";
import { NextSteps } from "@/components/brewsoul/next-steps";
import { FirstSipEmailCapture } from "@/components/brewsoul/first-sip-email-capture";
import { JourneyBar, MarkVisited } from "@/components/brewsoul/journey-bar";

// Ported from legacy client/src/pages/brewsoul/FirstSip.tsx — "The First
// Sip Is a Vote", BrewSoul's coffee manifesto and journey hub. Real
// content (the full essay, tool cards, related essays, citations, closing)
// unchanged. Simplifications: the canvas-based CoffeeDust decoration is
// dropped (same "not worth the JS cost" call made repeatedly elsewhere in
// this migration); the hero photo (`/api/img/brewsoul-orig_84eb4bc9.jpg`,
// same dead Manus proxy confirmed elsewhere) is dropped for a CSS
// gradient, and with it the scroll-linked parallax that had nothing left
// to move. The email-capture form's tRPC subscribe mutation doesn't exist
// yet — same mailto: fallback already used in newsletter-popup.tsx. All
// but the email form is static content, so this ships as a Server
// Component. Related-essay slugs and the 5 tool-card paths (prescription/
// health/pairings/economics/compare) are real — the tool paths are later
// Phase 6 routes not built yet, same forward-reference pattern as
// /find-my elsewhere in this migration.
export const metadata: Metadata = {
  title: "First Sip — BrewSoul",
  description: "Your first cup with BrewSoul: a guided introduction to specialty coffee.",
  alternates: { canonical: "/brewsoul/first-sip" },
};

const TOOLS = [
  {
    num: "01",
    icon: "💊",
    title: "Coffee Prescription",
    desc: "AI-powered, personalized recommendations based on your biology, sensitivity, habits, and goals. Start here if you want to know what coffee should be doing for you — and what it shouldn't.",
    cta: "Personalized analysis",
    path: "/brewsoul/prescription",
  },
  {
    num: "02",
    icon: "🔬",
    title: "Coffee & Health",
    desc: "Peer-reviewed research on caffeine metabolism, cortisol, sleep architecture, mycotoxin risk, and long-term health outcomes. The science behind the ritual.",
    cta: "Research library",
    path: "/brewsoul/health",
  },
  {
    num: "03",
    icon: "🍰",
    title: "Coffee Pairings",
    desc: "How food changes coffee's impact on your body and palate. Absorption rates, acidity interactions, nutrient synergies — where food meets pharmacology.",
    cta: "Pairing guide",
    path: "/brewsoul/pairings",
  },
  {
    num: "04",
    icon: "📉",
    title: "Coffee Economics",
    desc: "Where your dollar actually goes. Farmgate-to-shelf breakdowns, margin analysis, ad-spend-to-origin ratios, and the structural math the label never shows you.",
    cta: "Value chain breakdown",
    path: "/brewsoul/economics",
  },
  {
    num: "05",
    icon: "⚖️",
    title: "Compare Coffees",
    desc: "Side-by-side brand comparisons on sourcing transparency, certification rigor, pricing structure, contaminant testing, and value-to-farmer ratios. The Consumer Reports of coffee — without the ad revenue bias.",
    cta: "Head-to-head comparison engine",
    path: "/brewsoul/compare",
    full: true,
  },
];

const RELATED = [
  {
    title: "The Butcher's Daughter, the Carbon Toll, and the Cheese That Ate the Planet",
    slug: "/blog/the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
    tag: "Crusade",
  },
  {
    title: "Restaurants Beware of Vegans and Vegans Beware of Lying Restaurants",
    slug: "/blog/restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants",
    tag: "Crusade",
  },
  {
    title: "How to Alienate a Loyal Vegan Desperately Trying to Buy Your Product",
    slug: "/blog/how-to-alienate-a-loyal-vegan",
    tag: "Crusade",
  },
  {
    title: "Forever Chemicals in My Blood: What I Learned Testing for PFAS and Microplastics",
    slug: "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics",
    tag: "Field Report",
  },
  {
    title: "Return on Investment — Are You Going Green?",
    slug: "/blog/return-on-investment-going-green-going-green-2",
    tag: "Systems Map",
  },
  {
    title: '"Boiling the Human" — H+ Summit / Harvard-Kurzweil',
    slug: "/blog/boiling-the-human-summit-harvard-kurzweil",
    tag: "Reckoning",
  },
];

const COUPLETS = [
  { a: "Profit is not bad.", b: "Hidden profit is corrosive." },
  { a: "Distribution is necessary.", b: "Ethical distribution is transformative." },
  {
    a: "Advertising is not evil.",
    b: "But if the ad budget outruns the origin premium, your dollar walked down the wrong branch.",
  },
];

const DEMANDS = [
  "Harvest date",
  "Farmgate price paid",
  "Export price",
  "Premium above commodity reference",
  "% of retail retained in origin country",
  "Moisture control protocols",
  "Third-party quality verification",
  "Contaminant testing approach",
];

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-r-lg border-l-[3px] border-[#C5A23C] bg-[#C5A23C]/6 px-8 py-6">
      <p className="font-heading text-lg font-semibold text-[#5A4A20] italic">{children}</p>
    </div>
  );
}

export default function FirstSipPage() {
  return (
    <div>
      <MarkVisited stepId="first-sip" />
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-b from-[#2C1810] via-[#3D2B1F] to-[#FAFAF7]">
        <div className="relative z-10 max-w-2xl px-6 text-center">
          <div className="mb-4 font-mono text-xs tracking-[0.3em] text-[#D4B96A] uppercase">
            Your Start Page for Coffee
          </div>
          <h1 className="mb-5 font-heading text-4xl font-black text-[#F5F0E6] sm:text-6xl">
            The First Sip
            <br />
            Is a <em className="text-[#D4B96A] italic">Vote</em>
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base leading-relaxed text-[#F5F0E6]/85">
            A manifesto on coffee, capital, and consciousness — and your guided entry point into the tools,
            economics, health science, and comparisons that live inside this site.
          </p>
          <div className="font-mono text-xs text-[#D4B96A]/70">
            By Tony Greenberg <span className="mx-2 opacity-40">·</span> Only Time Buys Trust
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6] px-6 py-16">
        <article className="mx-auto max-w-2xl text-[#2C1810]">
          <p className="mb-5 text-[1.05rem] leading-loose">
            There are revolutions that start with marches in the streets. And there are revolutions that begin in
            kitchens — in the quiet moment when a hand reaches for a cup.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Before markets open. Before the news scroll begins. Before anyone decides what to be outraged about
            today.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose font-semibold">
            Two billion people perform the same ritual. They lift a cup.
          </p>
          <p className="mb-10 text-[1.05rem] leading-loose">
            Coffee is the most universal ceremony of modern civilization. Presidents drink it. Artists drink it.
            Entrepreneurs drink it. Bus drivers drink it. Entire economies lean on it. And yet it remains
            astonishingly misunderstood — especially by the people who consume it every day.
          </p>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">
            The Arithmetic Behind the Label
          </h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Coffee is a $100-plus-billion global industry. Roughly 170 to 180 million 60-kilogram bags of beans are
            produced annually. Millions of smallholder farmers depend on it for survival. Entire national identities
            are intertwined with it.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            And still, most consumers know only the poetry on the label — never the arithmetic behind the price. If
            you want to see that arithmetic laid bare, the{" "}
            <Link href="/brewsoul/economics" className="font-semibold text-[#8B6914] underline underline-offset-3">
              Coffee Economics
            </Link>{" "}
            tool on this site breaks down exactly where your dollar goes — farmgate to shelf — for every brand
            we&apos;ve analyzed.
          </p>

          <Pullquote>
            The system captures value closest to the cup and pushes risk and volatility closest to the soil.
          </Pullquote>

          <p className="mb-5 text-[1.05rem] leading-loose">
            In past commodity crises, producing countries&apos; share of final retail value has been documented at
            single digits — sometimes below ten percent. Less than ten cents of every dollar you spend ends up with
            the people who grew the beans. The rest flows into roasting, marketing, branding, rent, equipment, and
            giant advertising budgets.
          </p>
          <p className="mb-10 text-[1.05rem] leading-loose">
            No one actor is malicious. But the structure is asymmetrical. A $7 latte in Los Angeles may contain well
            under a dollar&apos;s worth of green coffee. That is not a conspiracy — it is a system, and the system
            was knowingly designed that way.
          </p>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">
            Voices from the Soil
          </h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Tadesse Meskela spent decades on the ground with farmers in Ethiopia, organizing cooperatives and
            fighting for fairer prices. He helped build unions that returned millions of dollars directly to farming
            communities — funding schools, water systems, and clinics. His work proved something fundamental: when
            farmers get fairer shares, everyone benefits.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            But farming is still hard. Reports from rural supply chains in Uganda and Rwanda show that more than a
            third of coffee growers reported no profit for the previous season. Nearly half had no savings to handle
            emergencies. Financial vulnerability is not an abstract number — it is a lived reality for families
            whose work fuels your morning brew.
          </p>
          <p className="mb-10 text-[1.05rem] leading-loose">
            And climate change is tightening the vise. Arabica thrives in a narrow range of temperatures and
            rainfall. When those patterns shift, farmers are forced into expensive irrigation or lose harvests
            entirely — while the global price system bounces around benchmarks that have little to do with the true
            cost of living, planting, and harvesting.
          </p>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">
            The Language Problem
          </h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Most stories on Instagram and marketing pages speak in flavors and adjectives — notes of jasmine, dark
            chocolate, &quot;ethical sourcing,&quot; &quot;direct trade,&quot; &quot;regenerative.&quot; These words
            are seductive. They make us feel good.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            But most of them are unregulated branding terms. &quot;Direct trade&quot; sounds righteous. It often is.
            But it lacks an independent certification framework, so its meaning varies from producer to producer,
            roaster to roaster. Even established certification systems like Fair Trade and Rainforest Alliance are
            not magic. They provide stability and price floors, but they often fail to capture the full economic
            reality for farmers — and sometimes pay premiums that never fully reach the farm.
          </p>
          <p className="mb-10 text-[1.05rem] leading-loose">
            This is where the{" "}
            <Link href="/brewsoul/compare" className="font-semibold text-[#8B6914] underline underline-offset-3">
              Compare Coffees
            </Link>{" "}
            tool earns its place. It puts brands side by side not on flavor poetry, but on sourcing transparency,
            pricing structure, and certification rigor — the data behind the label.
          </p>

          <Pullquote>
            Good intentions collide with structural complexity. It does not mean coffee is evil. It means coffee
            deserves deeper respect — which includes real transparency.
          </Pullquote>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">
            The Conversation Inside Your Body
          </h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Caffeine is one of the most widely consumed psychoactive compounds on Earth. It blocks adenosine
            receptors, delays fatigue, sharpens focus, and for many people, awakens mood and productivity.
            Epidemiological research often shows neutral or even positive associations with moderate consumption —
            reduced risk of certain diseases, improved cognitive outcomes in long-term cohorts.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            But it also elevates cortisol, disrupts sleep architecture, increases heart rate, and raises anxiety in
            susceptible individuals. The &quot;morning fog&quot; we treat with caffeine is often the residue of
            yesterday&apos;s dependency.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            Dave Asprey argues the real problem is not coffee itself but the quality of what&apos;s in the cup —
            pointing to mold exposure, poor storage, and mycotoxins. Critics say the risk levels vary and can be
            overstated. Both sides agree: transparency and quality control matter. Without them, consumers are
            drinking poetry without seeing the spreadsheet.
          </p>
          <p className="mb-10 text-[1.05rem] leading-loose">
            That&apos;s what the{" "}
            <Link href="/brewsoul/health" className="font-semibold text-[#8B6914] underline underline-offset-3">
              Coffee &amp; Health
            </Link>{" "}
            section is built for — peer-reviewed research on caffeine metabolism, cortisol impact, sleep disruption,
            and real contaminant risks, organized so you can decide based on your biology, not someone&apos;s
            branding budget. And if you want a personalized read on how coffee interacts with your body and habits,
            the{" "}
            <Link href="/brewsoul/prescription" className="font-semibold text-[#8B6914] underline underline-offset-3">
              Coffee Prescription
            </Link>{" "}
            tool will walk you through it.
          </p>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">Why This Exists</h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            We are not here to abolish coffee. We are here to outgrow extractive capitalism — starting with the
            first sip of the day.
          </p>
          <p className="mb-8 text-[1.05rem] leading-loose">
            If you pay $22 or $25 for a bag, then &quot;extraordinary&quot; must mean something measurable — not
            just a pretty word on a label. If the majority of your money funds Instagram ads rather than farm
            resilience, you are not drinking craft — you are subsidizing artistry without accountability.
          </p>

          <div className="my-8 flex flex-col gap-4">
            {COUPLETS.map((c) => (
              <div
                key={c.a}
                className="flex flex-col gap-1 rounded-lg border border-[#C5A23C]/15 bg-[#FAFAF7]/70 px-6 py-4 backdrop-blur-sm"
              >
                <span className="font-semibold text-[#2C1810]">{c.a}</span>
                <span className="text-[#6B5B4F] italic">{c.b}</span>
              </div>
            ))}
          </div>

          <p className="mb-8 text-[1.05rem] leading-loose">
            Coffee can be the most regenerative daily transaction on Earth — if we make it so. Two billion daily
            sips. Two billion opportunities to choose transparency over mystique. Two billion chances to reward soil
            health, fair pricing, and supply chain integrity.
          </p>

          <div className="my-8 rounded-xl border border-[#C5A23C]/20 bg-[#FAFAF7]/80 px-8 py-6 backdrop-blur-md">
            <h3 className="mb-4 font-mono text-xs tracking-[0.2em] text-[#C5A23C] uppercase">
              What Every Bag Should Disclose
            </h3>
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {DEMANDS.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="text-sm text-[#C5A23C]">→</span>
                  <span className="text-[0.92rem]">{d}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-10 text-[1.05rem] leading-loose">
            This is not purity cultism. It is visibility. Because opaque systems favor extraction. Transparent
            systems favor regeneration.
          </p>

          <h2 className="mb-4 border-b-2 border-[#C5A23C]/30 pb-2 font-heading text-2xl font-bold">
            Alignment, Not Abstinence
          </h2>
          <p className="mb-5 text-[1.05rem] leading-loose">
            If coffee supports you, use it intentionally. If it disrupts your sleep or nervous system, respect that
            too. And if you want to understand how what you eat alongside coffee changes the experience entirely —
            absorption, acidity, nutrient interaction — the{" "}
            <Link href="/brewsoul/pairings" className="font-semibold text-[#8B6914] underline underline-offset-3">
              Coffee Pairings
            </Link>{" "}
            guide is where food meets pharmacology.
          </p>
          <p className="mb-5 text-[1.05rem] leading-loose">
            This is not a manifesto about abstinence or indulgence. This is about alignment — between your spend and
            fairness, between your biology and choice, between story and spreadsheet.
          </p>

          <Pullquote>
            Extractive systems thrive on unconscious repetition. Regenerative systems begin with intentional
            gestures.
          </Pullquote>
        </article>
      </section>

      {/* Journey map — five tools */}
      <section className="bg-linear-to-b from-[#F5F0E6] via-[#E8DCC8] to-[#F0E8D8] px-6 py-16 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.3em] text-[#C5A23C] uppercase">
              Your Coffee Journey Starts Here
            </div>
            <h2 className="mb-3 font-heading text-3xl font-bold text-[#2C1810]">Five Tools. One Mission.</h2>
            <p className="mx-auto max-w-lg text-[#6B5B4F]">
              This essay is the why. Below are the how — five interactive tools built to replace marketing poetry
              with measurable transparency.
            </p>
          </div>

          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {TOOLS.map((tool) => (
              <Link
                key={tool.num}
                href={tool.path}
                className={`rounded-xl border border-[#C5A23C]/15 bg-[#FAFAF7]/70 p-7 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#C5A23C]/35 hover:bg-[#FAFAF7]/90 hover:shadow-lg ${
                  tool.full ? "sm:col-span-full" : ""
                }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs tracking-wide text-[#C5A23C]">{tool.num}</span>
                  <span className="text-xl">{tool.icon}</span>
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold text-[#2C1810]">{tool.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#6B5B4F]">{tool.desc}</p>
                <div className="font-mono text-[0.72rem] font-semibold text-[#8B6914]">{tool.cta} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related essays */}
      <section className="bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6] px-6 py-14 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.3em] text-[#C5A23C] uppercase">Related Reading</div>
            <h2 className="mb-2 font-heading text-2xl font-bold text-[#2C1810]">The Deeper Dives</h2>
            <p className="text-[0.95rem] text-[#6B5B4F]">Context, crusades, and accountability from across the archive.</p>
          </div>

          <div className="flex flex-col">
            {RELATED.map((essay, i) => (
              <Link
                key={essay.slug}
                href={essay.slug}
                className={`flex items-center gap-4 py-4 text-[#6B5B4F] ${i < RELATED.length - 1 ? "border-b border-[#6F4E37]/10" : ""}`}
              >
                <span className="shrink-0 text-xs text-[#C5A23C]">✦</span>
                <span className="flex-1 font-medium text-[0.95rem] text-[#2C1810]">{essay.title}</span>
                <span className="shrink-0 rounded-sm border border-[#6F4E37]/12 px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-wide text-[#6B5B4F] uppercase">
                  {essay.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative bg-linear-to-b from-[#3D2B1F] to-[#2C1810] px-6 py-20 pb-12">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-2 text-[1.05rem] leading-loose font-light text-[#F5F0E6]/70">
            Tomorrow morning, you will lift a cup. So will two billion other people.
          </p>
          <p className="mb-2 text-[1.05rem] leading-loose font-light text-[#F5F0E6]/70">
            The revolution will not be televised. It will be brewed.
          </p>
          <p className="mb-6 text-[1.05rem] leading-loose font-light text-[#F5F0E6]/70">And it begins with a quiet question:</p>
          <p className="mb-2 font-heading text-3xl font-black text-[#D4B96A] sm:text-4xl">Who gets paid when I wake up?</p>
          <p className="mt-6 font-mono text-sm font-bold tracking-[0.2em] text-[#F5F0E6] uppercase">Choose well.</p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl border-t border-[#C5A23C]/15 pt-8">
          <h3 className="mb-4 font-mono text-[0.68rem] font-bold tracking-[0.15em] text-[#F5F0E6]/50 uppercase">
            Sources
          </h3>
          {[
            "[1] Farmer wellbeing index — profitability challenges across coffee-growing regions in Uganda and Rwanda.",
            "[2] Fair Trade engagement and limitations — premium distribution gaps in coffee economics.",
            "[3] Tadesse Meskela — Ethiopian coffee cooperative work, documented in Black Gold.",
            "[4] Dave Asprey — mycotoxin risk and quality control, The Bulletproof Diet.",
          ].map((c) => (
            <p key={c} className="mb-1.5 text-[0.82rem] leading-relaxed font-light text-[#F5F0E6]/50">
              {c}
            </p>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6] px-6 pt-12 pb-4">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-2 font-mono text-xs tracking-[0.25em] text-[#C5A23C] uppercase">Stay Informed</p>
          <p className="mb-4 text-[#2C1810]">Get coffee intelligence, crusade updates, and new tool releases delivered weekly.</p>
          <FirstSipEmailCapture />
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-linear-to-b from-[#FAFAF7] via-[#F0E8D8] to-[#F5F0E6] px-6 py-8 pb-16">
        <div className="mx-auto max-w-3xl">
          <NextSteps
            title="Start Your Journey"
            steps={[
              { label: "Coffee Prescription", path: "/brewsoul/prescription", description: "Get your personalized coffee analysis" },
              { label: "Compare Coffees", path: "/brewsoul/compare", description: "Side-by-side brand transparency" },
              { label: "Browse the Catalog", path: "/brewsoul/browse", description: "Explore every coffee we've reviewed" },
            ]}
          />
        </div>
      </section>
      <JourneyBar />
      <div className="h-20" />
    </div>
  );
}
