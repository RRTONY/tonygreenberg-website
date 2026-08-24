import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/AkbarEssay.tsx ("Los Angeles Is
// Losing Its Memory — Akbar Cuisine Refuses to Forget"). Real essay prose
// ported in full, unchanged. Legacy was a heavily photographed piece — a
// hero food mosaic, 3 full-bleed breaks, a portrait of JC, a 2x2 grid, a
// 3-column strip, and a 6-image footer gallery, ~20 images total, all on
// the now-fully-decommissioned Manus `/api/img/` host. None of them are
// recoverable (confirmed 404/503 across the board — see
// NEXTJS-MIGRATION-TODO.md's Phase 13 note). Rather than fabricate
// placeholder imagery for a photo essay about specific real photographs,
// this ports the prose as a clean long-form article and tracks the image
// gap explicitly instead of pretending it's not there.
//
// Kept the deliberately dark, fixed palette from legacy's one-off design
// (this essay, not the site's day-to-day chrome, so a permanent dark mood
// is the actual intent, not a toggle bug) but uses the site's existing
// loaded fonts (Playfair Display / DM Mono) rather than importing the
// three additional webfonts legacy pulled in via a bare <style> tag for a
// single page.
export const metadata: Metadata = {
  title: "Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget",
  description:
    "An essay on cultural memory, food, and what it means to preserve identity in a city that forgets.",
  alternates: { canonical: "/akbar" },
};

const WINE_PAIRINGS = [
  { wine: "Turley Old Vines Zinfandel", dish: "Tandoori Prawns", note: "Eighty-year-old vines from Paso Robles. The brambly dark fruit absorbs tandoori smoke the way old leather absorbs rain. Improbable. Transcendent." },
  { wine: "Pierre Gimonnet Grower Champagne", dish: "Garlic Naan", note: "Not Moët. Not Veuve. A farmer's champagne — chalky, precise, almost austere — against butter-drenched bread still radiating clay-oven heat. The collision is sacred." },
  { wine: "Brunello di Montalcino (Biondi-Santi)", dish: "Bhartha", note: "Smoky eggplant dragged through embers meets a wine that spent five years in Slavonian oak contemplating mortality. Both taste like patience rewarded." },
  { wine: "Restrained Oregon Pinot (Cristom)", dish: "Goan Fish Curry", note: "Willamette Valley earth and coconut-tamarind broth. The pinot's forest-floor minerality catches the curry's molasses-dark bass notes mid-fall." },
  { wine: "Albariño (Do Ferreiro)", dish: "Sea Bass Tikka", note: "Galician salt spray and charred fish flesh. The Atlantic meeting the Arabian Sea through glass." },
  { wine: "Vouvray Demi-Sec (Huet)", dish: "Vegetable Samosas", note: "Loire honeyed quince against cumin-spiked potato and pea. The sweetness doesn't compete — it genuflects before the spice." },
];

const REFRAMES = [
  { term: "Ritual over novelty.", def: "The Goan fish curry does not require a seasonal update. The menu has not changed because the menu does not need to change. It is a signal maintained across time." },
  { term: "Trust over stimulation.", def: "You do not discover Akbar. You are brought here by someone who trusts you enough to share it. The recommendation is the review." },
  { term: "Returning over arriving.", def: "The thousandth visit reveals what the first visit cannot. Emotional permanence is invisible to algorithms that only measure novelty." },
];

function MughalDivider() {
  return (
    <div className="my-12 flex items-center justify-center gap-4">
      <div className="h-px w-20 bg-linear-to-r from-transparent to-[#C9A84C]" />
      <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-70">
        <path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="none" stroke="#C9A84C" strokeWidth="0.7" />
      </svg>
      <div className="h-px w-20 bg-linear-to-l from-transparent to-[#C9A84C]" />
    </div>
  );
}

export default function AkbarPage() {
  return (
    <div className="bg-[#0A0A0F] text-[#F4EDD8]">
      <div className="px-6 py-20 text-center sm:px-10">
        <p className="mb-6 font-mono text-xs tracking-[0.2em] text-[#C9A84C] uppercase">
          A Field Report on Restoration Economics
        </p>
        <h1 className="mx-auto mb-6 max-w-3xl font-heading text-3xl leading-tight font-bold sm:text-5xl">
          Los Angeles Is Losing Its Memory — <span className="text-[#C8362A]">Akbar Cuisine</span>{" "}
          Refuses to Forget
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[#9A9080] italic">
          While Los Angeles optimizes itself into a content factory, one restaurant on Washington
          Boulevard still smells like coriander, old corks, warm naan, cardamom, smoke, and
          polished wood. It does not want your content. It wants your nervous system.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-8 text-center sm:px-10">
        <MughalDivider />
        <blockquote className="my-8 font-heading text-xl leading-relaxed font-normal">
          &quot;Every legendary restaurant eventually develops one mythological figure quietly
          holding the entire organism together while pretending they are merely doing their
          job.&quot;
        </blockquote>
        <p className="font-mono text-xs tracking-wide text-[#9A9080] uppercase">
          Tony Greenberg · May 2026 · 7 min read
        </p>
      </div>

      <div className="article-body mx-auto max-w-2xl px-6 py-10 leading-[1.85] sm:px-10 [&>p]:mb-6">
        <h2 className="mb-6 font-heading text-2xl font-bold sm:text-3xl">The Nervous System</h2>
        <p>
          Restaurants do not actually run on food. They run on nervous systems. And at Akbar, the
          nervous system has a name: JC. He stands exactly where friction becomes hospitality —
          absorbing pressure from both sides before customers ever feel it. He remembers people
          the old way. Human memory. Not database memory.
        </p>
        <p>
          He has quietly regulated the emotional weather of Akbar for decades. The timing of
          water arriving. The pacing between courses. The calm that radiates outward from his
          presence like heat from a clay oven. You do not notice what JC does until you eat
          somewhere he is not — and then you feel the absence like a missing frequency.
        </p>
        <p>
          The garlic naan arrives at the precise moment your conversation pauses. It tears with
          exactly the right resistance — layers of technique compressed into architecture. Steam
          rises carrying ghee and roasted garlic. The fish tikka is not protein. It is time made
          edible: hours of yogurt and spice marination penetrating deep into the flesh, then the
          violence of the tandoor transforming patience into char. The green chutney beside it
          tastes photosynthetic.
        </p>
        <p>
          The bhartha — velvet dragged through embers. Roasted eggplant collapsed into tomatoes
          and onions with a spice profile calibrated across generations. The tamarind carries
          molasses-dark bass notes. The rice absorbs sauce without surrendering structural
          integrity.
        </p>
        <p className="font-semibold text-[#C9A84C] italic">
          JC changes flavor indirectly — through timing, through calm, through the rhythm of a
          room held steady.
        </p>

        <h2 className="mt-14 mb-6 font-heading text-2xl font-bold sm:text-3xl">
          3.8 Stars and the Death of Memory
        </h2>
        <p>
          Akbar has a 3.8 on Google. Let that land. A place that has been holding this
          neighborhood together for decades — through recessions, through fires, through the
          complete cultural lobotomy of Venice — and the algorithm gives it the same score as a
          fast-casual poke bowl.
        </p>
        <p>
          Modern review systems reward stimulation instead of depth. They reward lighting,
          content engineering, visual seduction — the choreography of appearing interesting
          rather than the discipline of being nourishing. A restaurant that photographs well
          scores higher than one that feeds you well. A place optimized for the first visit
          outranks a place optimized for the thousandth.
        </p>
        <p>
          Akbar does not perform for cameras. The room smells faintly of decades — cardamom
          embedded in the walls, ghee vapor in the ceiling tiles, the particular warmth of a
          space that has held ten thousand conversations. This is not something you can rate on a
          five-point scale.
        </p>

        <div className="my-8 border-l-2 border-[#C9A84C] pl-6">
          {REFRAMES.map((item) => (
            <div key={item.term} className="mb-5 last:mb-0">
              <p className="mb-1 font-semibold text-[#C9A84C]">{item.term}</p>
              <p>{item.def}</p>
            </div>
          ))}
        </div>

        <p className="text-lg font-semibold text-[#C9A84C] italic">
          Places that survive long enough to become part of people&apos;s lives do not need five
          stars. They need witnesses.
        </p>

        <h2 className="mt-14 mb-6 font-heading text-2xl font-bold sm:text-3xl">
          The Night the eBay Deal Almost Killed Us
        </h2>
        <p>
          In 2004, I was running a technology company through one of those deals that either
          makes you or unmakes you. The eBay transaction. Months of legal architecture that would
          make a securities lawyer weep into his Macallan. The kind of stress that lives in your
          jaw at 3 AM and your lower back by noon.
        </p>
        <p className="font-semibold italic">Every Thursday night, without fail, we went to Akbar.</p>
        <p>
          Not because it was convenient. Because JC would see us walk in — shoulders up, jaws
          locked, cortisol radiating — and within four minutes the table would have water, warm
          naan, and a silence that said: you are safe here. Take your time.
        </p>
        <p>
          The Goan fish curry would arrive and the room would smell like coconut milk reducing
          over low heat, tamarind darkening at the edges, curry leaves releasing their last green
          breath into the steam. Somewhere between the second naan and the third glass of an
          improbable Turley Zin, the deal would stop feeling like it might kill us. The food was
          not peripheral to survival. It was infrastructure.
        </p>
        <blockquote className="my-8 border-l-4 border-[#E8821A] py-2 pl-6 font-heading text-lg">
          The deal closed. We survived. And JC never once asked what we did for a living. He just
          kept the room steady.
        </blockquote>
        <p>
          Twenty years later, the restaurant is still there. JC is still there. Still holding the
          organism together while pretending he is merely doing his job.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        <h2 className="mb-2 text-center font-heading text-2xl font-bold sm:text-3xl">
          The Liquid Treasure Chest
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-[#9A9080] italic">
          Forget the lazy &quot;pair spicy food with Riesling&quot; algorithm. These are
          improbable marriages — cult Zinfandels against tandoori smoke, grower Champagne with
          butter-soaked naan, Brunello contemplating mortality alongside bhartha.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WINE_PAIRINGS.map((pair) => (
            <div key={pair.wine} className="rounded-md border border-[#C9A84C]/15 bg-[#C9A84C]/5 p-6">
              <p className="mb-1 font-mono text-xs tracking-wide text-[#C9A84C] uppercase">
                {pair.wine}
              </p>
              <p className="mb-2 font-heading text-lg">with {pair.dish}</p>
              <p className="text-sm leading-relaxed text-[#9A9080]">{pair.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <div className="border-l-4 border-[#00C9B1] bg-[#00C9B1]/5 p-8">
          <h2 className="mb-4 font-heading text-xl font-bold sm:text-2xl">
            What Akbar Could Become
          </h2>
          <p className="mb-4 leading-relaxed">
            Imagine the spice blends packaged. Not mass-produced — numbered. Small-batch runs in
            hand-stamped tins. The Goan fish curry base as a concentrate. The tandoori marinade in
            glass jars with wax seals. A quarterly subscription: four spice architectures, a card
            explaining the lineage of each blend, a QR code linking to JC telling the story of how
            each dish entered the menu.
          </p>
          <p className="mb-4 leading-relaxed">
            This is not a franchise play. It is a preservation play. The knowledge inside Akbar&apos;s
            kitchen is irreplaceable — and currently exists only in the hands and memory of people
            who will not be here forever. Packaging is not commercialization. It is archiving.
          </p>
          <p className="leading-relaxed text-[#9A9080]">
            At ImpactSoul, we fund restoration infrastructure. Akbar is not a portfolio company.
            But it is proof of concept — evidence that businesses built on depth rather than
            extraction can survive for decades in a market that rewards the opposite.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
        <MughalDivider />
        <h2 className="mb-6 font-heading text-3xl font-bold sm:text-4xl">
          The Question That Remains
        </h2>
        <p className="mb-8 font-heading text-xl text-[#C8362A]">
          In a city that is losing its memory, who is holding yours?
        </p>
        <p className="mb-4 leading-relaxed">
          Not memory in the nostalgic sense. Memory in the cellular sense. The smell of cumin
          hitting hot oil. The sound of naan tearing. The specific silence of a room where no one
          is performing. The weight of a wine glass held by someone who has stopped checking their
          phone.
        </p>
        <p className="mb-4 leading-relaxed">
          JC will not remember your name the first time. He will remember it the second. By the
          third visit, you are no longer a customer. You are someone he is holding space for. That
          is the difference between a restaurant and a place.
        </p>
        <p className="mb-4 font-semibold text-[#C9A84C]">
          Akbar Cuisine of India. Washington Boulevard. Venice, Los Angeles. Still there. Still
          restoring. JC still at the door.
        </p>
        <p className="font-heading text-lg">The reservation is yours to make.</p>
      </div>

      <div className="border-t border-[#C9A84C]/15 px-6 py-6 text-center">
        <Link href="/" className="font-mono text-sm tracking-wide text-[#C9A84C]">
          ← Back to the Essays
        </Link>
      </div>
    </div>
  );
}
