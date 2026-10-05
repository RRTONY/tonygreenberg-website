import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Ported from legacy client/src/pages/AkbarEssay.tsx ("Los Angeles Is
// Losing Its Memory — Akbar Cuisine Refuses to Forget"). Real essay prose
// ported in full, unchanged. Legacy was a heavily photographed piece — a
// hero food mosaic, 3 full-bleed breaks, a portrait of JC, a 2x2 grid, a
// 3-column strip, and a 6-image footer gallery. Those photos were rescued
// from the Manus `/api/img/` host into Sanity on 2026-09-28
// (docs/ai/manus-media-rescue.md) and are laid out here in legacy's order.
// One (slider-3) was already gone (HTTP 502), so the hero mosaic is four
// tiles instead of five, with the right column spanning both rows. Legacy's
// JS hover filters are Tailwind `hover:` utilities here.
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

const IMG_BASE = "https://cdn.sanity.io/images/a3q1cyqs/production/";
const IMG = {
  slider1: `${IMG_BASE}11df508e5dd862c78fcf286da1026a90cac376ec-1200x560.webp`,
  slider2: `${IMG_BASE}265f65e0ac2f23af40d82ce9fb642608cd8bfcd4-1200x560.webp`,
  slider4: `${IMG_BASE}acfdcf518ab571808d200b9063d6235737c39fc9-1200x560.webp`,
  slider5: `${IMG_BASE}881d64c4b25489cba252752082cc20439174c376-1200x560.webp`,
  gallery1: `${IMG_BASE}47afe8c0369d0cb90f5457656c2a91ca07e05075-700x467.webp`,
  gallery2: `${IMG_BASE}8c3b0c0b916d7a1ebf7ede95b4664c47e2f4f3fd-700x467.webp`,
  gallery3: `${IMG_BASE}aac28f3f3ee8ecc13fc3de1ff55ccbf212605f72-700x467.webp`,
  gallery4: `${IMG_BASE}d03df60ea77df6267d3463514ab8ef0f709a808a-700x467.webp`,
  gallery5: `${IMG_BASE}556625694f26f5f0fcbc39697608d34884356439-700x467.webp`,
  gallery6: `${IMG_BASE}5b7ee736693a758865a9fd9158351f85de6d184e-700x467.webp`,
  gallery7: `${IMG_BASE}6c718dd2363dd11d5116ed39ff24dc1ce70c5912-700x467.webp`,
  jc: `${IMG_BASE}d0097b1ef8cc09a7d98e097a8e12de31b7fa392a-1086x1448.webp`,
  insta1: `${IMG_BASE}87d25b7f8105576020be36279b302fec0582dc4c-601x550.webp`,
  insta2: `${IMG_BASE}b22734962b24d9f0b5c52281f9eae1fa72bfaa00-601x550.webp`,
  insta3: `${IMG_BASE}801b785c273d7eae18a6d497205061e4693e19b9-601x550.webp`,
  insta4: `${IMG_BASE}2745575c437dd5425ebd8600f8f53db4df0dea48-601x550.webp`,
  insta5: `${IMG_BASE}f5d792acd3a50ef6ccebc54f06fabf0c4fa22dd2-601x550.webp`,
  insta6: `${IMG_BASE}baf90ada5a5e2f0a0761951fcbef0c95956296d7-601x550.webp`,
  insta7: `${IMG_BASE}464b317b1768cea497a065b9138f7aab698c8ae0-601x550.webp`,
  insta9: `${IMG_BASE}c447d89121331b44db72d1944c858d0851db1a61-601x550.webp`,
  insta11: `${IMG_BASE}acf8d5b55d320ac08289926657ff43abcbb67d18-601x550.webp`,
};

// Legacy's hero grid areas, minus the lost slider-3 tile.
const HERO_TILES = [
  { src: IMG.slider1, area: "col-start-1 row-start-1" },
  { src: IMG.slider4, area: "col-start-1 row-start-2" },
  { src: IMG.slider2, area: "col-start-2 row-span-2 row-start-1" },
  { src: IMG.slider5, area: "col-start-3 row-span-2 row-start-1" },
];

const FOOD_GRID = [
  { src: IMG.gallery2, label: "The Kitchen" },
  { src: IMG.gallery3, label: "Tandoori Grill" },
  { src: IMG.gallery4, label: "The Bhartha" },
  { src: IMG.gallery5, label: "Memory Architecture" },
];

const FOOTER_GALLERY = [IMG.insta2, IMG.insta4, IMG.insta6, IMG.insta7, IMG.insta9, IMG.insta11];

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

function FullBleedImage({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-16 px-4 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-[#C9A84C]/12 bg-[#C9A84C]/4 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <div className="relative h-[clamp(320px,45vh,550px)] overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={caption ?? "Inside Akbar Cuisine of India, Venice, Los Angeles"}
            fill
            sizes="100vw"
            className="object-cover brightness-75 saturate-130 transition-[filter,scale] duration-700 hover:scale-103 hover:brightness-90 hover:saturate-150"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs tracking-wide text-[#9A9080]">{caption}</figcaption>
      )}
    </figure>
  );
}

function SquareStrip({ images, className }: { images: string[]; className: string }) {
  return (
    <div className={className}>
      {images.map((src) => (
        <div
          key={src}
          className="relative aspect-square overflow-hidden rounded-xl border border-[#C9A84C]/12 bg-[#C9A84C]/4 p-1 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
        >
          <div className="relative size-full overflow-hidden rounded-lg">
            <Image
              src={src}
              alt="A dish at Akbar Cuisine of India"
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover brightness-75 saturate-130 transition-[filter,scale] duration-500 hover:scale-103 hover:brightness-90 hover:saturate-150"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AkbarPage() {
  return (
    <div className="bg-[#0A0A0F] text-[#F4EDD8]">
      <div className="relative isolate flex min-h-[600px] flex-col items-center justify-end overflow-hidden px-6 pt-32 pb-16 text-center sm:h-screen sm:px-10">
        <div aria-hidden="true" className="absolute inset-0 -z-20 grid grid-cols-[1fr_1.2fr_1fr] grid-rows-2 gap-1 p-1">
          {HERO_TILES.map((tile) => (
            <div key={tile.src} className={`relative overflow-hidden ${tile.area}`}>
              <Image
                src={tile.src}
                alt=""
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 640px) 50vw, 40vw"
                className="object-cover brightness-65 saturate-130"
              />
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[8%] left-1/2 -z-10 h-[clamp(350px,60vh,600px)] w-[clamp(280px,50vw,500px)] -translate-x-1/2 rounded-t-[300px] border border-[#C9A84C]/20"
        />
        <div
          aria-hidden="true"
          className="absolute top-[10%] left-1/2 -z-10 h-[clamp(330px,56vh,560px)] w-[clamp(260px,46vw,460px)] -translate-x-1/2 rounded-t-[280px] border border-[#C9A84C]/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-[#0A0A0F]/30 via-[#0A0A0F]/50 to-[#0A0A0F]/95"
        />
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

      <FullBleedImage src={IMG.gallery1} caption="Akbar Cuisine of India · Washington Boulevard · Venice, Los Angeles" />

      <div className="article-body mx-auto max-w-2xl px-6 py-10 leading-[1.85] sm:px-10 [&>p]:mb-6">
        <h2 className="mb-6 font-heading text-2xl font-bold sm:text-3xl">The Nervous System</h2>
        <p>
          Restaurants do not actually run on food. They run on nervous systems. And at Akbar, the
          nervous system has a name: JC. He stands exactly where friction becomes hospitality —
          absorbing pressure from both sides before customers ever feel it. He remembers people
          the old way. Human memory. Not database memory.
        </p>
        <figure className="mx-auto my-10 max-w-105 overflow-hidden rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/8 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <Image
            src={IMG.jc}
            alt="JC — the soul of Akbar Cuisine"
            width={1086}
            height={1448}
            sizes="(max-width: 768px) 100vw, 420px"
            className="block h-auto w-full"
          />
          <figcaption className="px-4 py-3 text-center font-mono text-xs tracking-wide text-[#C9A84C] uppercase">
            JC — The Nervous System of Akbar
          </figcaption>
        </figure>
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
      </div>

      <div className="mx-auto my-12 grid max-w-225 gap-3 px-4 sm:grid-cols-2 sm:px-8">
        {FOOD_GRID.map((item) => (
          <div
            key={item.label}
            className="relative aspect-4/3 overflow-hidden rounded-2xl border border-[#C9A84C]/12 bg-[#C9A84C]/4 p-1 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
          >
            <div className="relative size-full overflow-hidden rounded-xl">
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 100vw, 450px"
                className="object-cover brightness-75 saturate-130 transition-[filter,scale] duration-500 hover:scale-103 hover:brightness-90 hover:saturate-150"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0A0A0F]/85 to-transparent px-4 pt-6 pb-3">
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-[#C9A84C] uppercase">{item.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="article-body mx-auto max-w-2xl px-6 py-10 leading-[1.85] sm:px-10 [&>p]:mb-6">
        <h2 className="mb-6 mb-6 font-heading text-2xl font-bold sm:text-3xl">
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
      </div>

      <FullBleedImage src={IMG.gallery6} />

      <div className="article-body mx-auto max-w-2xl px-6 py-10 leading-[1.85] sm:px-10 [&>p]:mb-6">
        <h2 className="mb-6 mb-6 font-heading text-2xl font-bold sm:text-3xl">
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

      <SquareStrip
        images={[IMG.insta1, IMG.insta3, IMG.insta5]}
        className="mx-auto my-16 grid max-w-250 grid-cols-3 gap-3 px-4 sm:px-8"
      />

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

      <FullBleedImage src={IMG.gallery7} />

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
        <p className="mb-8 font-heading text-xl text-[#D74B3F]">
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

      <SquareStrip images={FOOTER_GALLERY} className="mt-16 grid grid-cols-3 gap-2 px-2 sm:grid-cols-6 sm:px-6" />

      <div className="border-t border-[#C9A84C]/15 px-6 py-6 text-center">
        <Link href="/" className="inline-flex items-center font-mono text-sm tracking-wide text-[#C9A84C] min-h-11 md:min-h-6">
          ← Back to the Essays
        </Link>
      </div>
    </div>
  );
}
