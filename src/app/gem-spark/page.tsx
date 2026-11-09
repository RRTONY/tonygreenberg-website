import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDown, Sparkles, Trophy } from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa6";
import { getFeaturedSparks } from "@/app/gem-spark/actions";
import { FeaturedGemSpark } from "@/components/gemspark/featured-gem-spark";
import { ImpactReport } from "@/components/gemspark/impact-report";
import { PageViewTracker } from "@/components/gemspark/page-view-tracker";
import { ReadingProgressBar } from "@/components/gemspark/reading-progress-bar";
import { ShareYourSparkForm } from "@/components/gemspark/share-your-spark-form";
import { SparkleTitle } from "@/components/gemspark/sparkle-title";
import { VersionSwitcher } from "@/components/gemspark/version-switcher";
import { gemsparkImages, type GemSparkImage } from "@/lib/content/gemspark/images";
import { gemsparkMetadata } from "@/lib/content/gemspark/seo";
import { GemsparkJsonLd } from "@/components/gemspark/gemspark-json-ld";

// The GemSpark (long form), ported from the GemSpark app's client/src/pages/Home.tsx (Manus app
// "serensynch", exported 2026-11-10). Same copy, links and design. Mechanical changes only:
// - framer-motion is gone: the hero fades up with tw-animate-css, the scroll arrow uses
//   animate-bounce, and the sections that faded in on scroll simply render (Home's unused
//   useScroll opacity/scale values are dropped).
// - Images come from Sanity (gemsparkImages) through next/image.
// - Links to tonygreenberg.com open here, in the same tab ("High Hells" points at its blog address).
// - LinkedIn/Twitter icons are react-icons (lucide no longer ships brand icons).
// - The Featured GemSparks list is read on the server and refreshed every 5 minutes.
export const metadata = gemsparkMetadata({
  path: "/gem-spark",
  title: "The GemSpark | The Fusion Between Serendipity and Synchronicity",
  description:
    "A story about what happens when you stop sweeping up the glass and start looking at it. By Tony Greenberg.",
});

export const revalidate = 300;

export default async function GemSparkPage() {
  const sparks = await getFeaturedSparks();

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-[#2C3E50] selection:bg-[#D4E6F1] selection:text-[#2C3E50]">
      <PageViewTracker page="long-form" />
      <GemsparkJsonLd
        version="full"
        headline="The GemSpark: The Fusion Between Serendipity and Synchronicity"
        description="A story about what happens when you stop sweeping up the glass and start looking at it. By Tony Greenberg."
      />
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      {/* Version Switcher */}
      <VersionSwitcher />

      {/* Hero Section - Clean, Subtle, Lets the Art Breathe */}
      <header className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center duration-1000 ease-out animate-in fade-in slide-in-from-bottom-5">
          <SparkleTitle>
            <h1 className="mb-6 font-serif text-6xl leading-[1.05] font-light tracking-tight text-[#2C3E50] italic md:text-8xl lg:text-9xl">
              The GemSpark
            </h1>
          </SparkleTitle>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed font-light text-balance text-[#5D6D7E] md:text-2xl lg:text-3xl">
            A new word for the moment chance and meaning collide.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base font-light text-balance text-[#7F8C8D] md:text-lg">
            Learn it. Use it. Notice one in the next five days. Come back and tell us what shifted.
          </p>

          <p className="mt-8 font-serif text-lg text-[#5D6D7E] italic md:text-xl">
            by{" "}
            <Link
              href="/"
              className="text-[#2C3E50] underline decoration-1 underline-offset-4 transition-colors hover:text-[#1A252F]"
            >
              Tony&nbsp;Greenberg
            </Link>
          </p>
        </div>

        <div className="absolute bottom-8 animate-bounce text-[#2C3E50]/30">
          <ArrowDown aria-hidden="true" className="size-7" />
        </div>
      </header>

      {/* David Fenton Art Piece - The Visual Star */}
      <section className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Image
              src={gemsparkImages.art.src}
              width={gemsparkImages.art.width}
              height={gemsparkImages.art.height}
              alt={gemsparkImages.art.alt}
              sizes="(min-width: 1152px) 1152px, 100vw"
              priority
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="mt-3 w-full pr-2 text-right">
            <p className="font-serif text-base text-[#5D6D7E] italic">
              Art by{" "}
              <a
                href="https://frenetk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2C3E50] underline decoration-1 underline-offset-4 transition-colors hover:text-[#1A252F]"
              >
                David&nbsp;Fenton
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <main className="max-w-5xl mx-auto px-6 pb-16 pt-8">
        
        {/* Introduction */}
        <Section>
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:mr-4 first-letter:float-left font-light text-2xl md:text-4xl leading-relaxed text-[#34495E] text-pretty">
            I made an offer that was irrational on purpose. Low enough to offend slightly. High enough to be interesting. The counter came back at irrational plus ten percent, which never happens. That&apos;s when I realized the whole day had been building toward something I hadn&apos;t seen coming.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            Here&apos;s what I&apos;ve learned over the years: we optimize for efficiency and we smooth out the wrinkles where the magic actually lives. The best days of my life have all started with a glitch. An interruption I almost ignored. This is a story about one of those days, and the framework it gave me. A framework you can use starting today.
          </p>
        </Section>

        <Divider />

        {/* Section 1: The Setup */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Setup</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            Nothing about the morning suggested it would matter. No intention. No seeking. Just the urge to move before the <a href="https://en.wikipedia.org/wiki/Default_mode_network" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">default mode network</a> boots up and starts paving over possibility with the predictable.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            The trail was <a href="https://www.alltrails.com/trail/us/california/los-leones-trail" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Los Leones</a>. The view stretched from the <a href="https://en.wikipedia.org/wiki/Pacific_Palisades,_Los_Angeles" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Pacific Palisades</a> all the way to <a href="https://downtownla.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Downtown LA</a>. The exact skyline where the day would end. I didn&apos;t know that yet. The geometry was already being plotted, and I was just the last one to know.
          </p>
        </Section>

        <ImageBlock
          image={gemsparkImages.trail}
          caption="The geometry was already being plotted."
        />

        {/* Section 2: The Signal */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Signal in the Noise</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            We stopped at the <a href="https://www.marvistafarmersmarket.org/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Mar Vista Farmers Market</a>. Not because we needed anything. Because the path seemed to want a pause. Curiosity was rewarded with <a href="https://completelypickled.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">fermented pineapple dill pickles</a>. A flavor combination that sounds like a mistake until you try it.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            The lesson wasn&apos;t about pickles. It was this: things don&apos;t have to make sense to be right. The best signals in life sound absurd at first. The trick is recognizing them before your pattern-matching software filters them out.
          </p>
        </Section>

        <ImageBlock
          image={gemsparkImages.pickles}
          caption="Things don't have to make sense to be right."
        />

        {/* Section 3: The Collision */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Collision</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            We drifted toward the <a href="https://www.laartshow.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">LA Art Show</a>. Rooms like that have moods. Most of it slides past politely. Then something grabs your sleeve.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            The piece was created using <a href="https://en.wikipedia.org/wiki/Dye-sublimation_printing" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">dye-sublimation on etched aluminum</a>. Photography and illustration transferred onto brushed metal through heat and pressure, yielding a holographic effect that shifts with light and viewing angle. It&apos;s rare. It&apos;s difficult. And I&apos;d seen it before.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            Twenty years ago, in Avondale, I bought a piece using this exact technique without understanding what it was. Now here was another. Same process, same medium. And I didn&apos;t even remember the first until I was negotiating the second. That&apos;s synchronicity. It doesn&apos;t announce itself. It waits for you to catch up.
          </p>
        </Section>

        <ImageBlock
          image={gemsparkImages.footDetail}
          caption="A subconscious hook, pulling back twenty years."
        />

        {/* Section 4: The Thread */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Thread</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            Then I saw the foot. A heel, deconstructed and reassembled in metal. It pulled me straight back to an article I wrote years ago, <Link href="/blog/high-hells-demise-of-powerful-femininity" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">&quot;High Hells&quot;</Link>, about the demise of powerful femininity through the metaphor of the heel. A conversation started years ago was finally getting a response.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            The artist, <a href="https://www.linkedin.com/in/dafenton" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">David Fenton</a> (founder of <a href="https://frenetk.com" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">FRENETK</a>), said something that landed harder than it sounded: &quot;There is nothing more drenched in unlimited possibility than this moment. And it&apos;s gone.&quot;
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            That&apos;s <a href="https://en.wikipedia.org/wiki/Flow_(psychology)" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">flow architecture</a> in a sentence. The peak experience is always a disappearing act. You can&apos;t hold it. You can only be ready for it.
          </p>
        </Section>

        {/* Section 5: The Deal */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Structural Decision</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            I wanted the piece. But I didn&apos;t want a standard transaction. I wanted a structural decision. A choice embedded in the architecture of how something operates, not an afterthought.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            I made the offer in Bitcoin. And I added a condition: 13% of the purchase price goes immediately to a charity of his choice. Why 13%? Because it breaks the pattern of 10%. It signals intention. It turns a purchase into a partnership.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            He accepted. Then he gave me something better than the art. A rule: &quot;Give it 100 days. Don&apos;t judge it before then. Let it live in your space. Let it change the room.&quot;
          </p>
        </Section>

        {/* Section 6: The Evening */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Convergence</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            That evening at <a href="https://www.thales-water.com/rafael-simon" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Rafael</a> and <a href="https://overeatingrecovery.com/about-julie/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Julie Simon&apos;s</a>, the room was alive with investors, healers, and participants in the evolving <a href="https://en.wikipedia.org/wiki/Psychedelic_therapy" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">mental health renaissance</a>.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            <a href="https://ravemehta.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Rave Mehta</a> was there. Composer, <a href="https://www.carnegiehall.org/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Carnegie Hall</a> performer, someone who understands water as a medium for connection. I told him about the day. The connection was immediate. We&apos;re now collaborating on bringing the most important natural spring in the world to market. A project designed to shift how we consume water while directly supporting indigenous tribal communities.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            And then one final gem: a therapist introduced <a href="https://acceleratedresolutiontherapy.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">ART (Accelerated Resolution Therapy)</a>. A specific key delivered for a specific lock I didn&apos;t know I was carrying.
          </p>
        </Section>

        <Divider />

        {/* The Framework */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">The Framework</h2>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            A walk. A wrong turn. A pickle. A piece of art. Music. Water. Healing. All in twelve hours. None of it planned.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            I needed a word for this. Not &quot;luck.&quot; Not &quot;coincidence.&quot; Something that captures the moment when a happy accident and a meaningful pattern collide, and you recognize it in real time.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-medium text-[#2C3E50] text-pretty">
            That word is <strong>GemSpark</strong>.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            A GemSpark is the fusion point where serendipity and synchronicity collide, and you finally recognize the pattern. It&apos;s not mystical. It&apos;s architectural. It&apos;s what happens when you build the conditions for noticing instead of optimizing for speed.
          </p>
          <p className="text-2xl md:text-3xl leading-relaxed font-light text-[#34495E] text-pretty">
            Once you have the word, you start seeing them everywhere. &quot;I had a GemSpark today.&quot; &quot;I almost missed one.&quot; &quot;That meeting was pure GemSpark.&quot; It becomes a lens. A daily practice. A way of moving through the world that turns noise into signal and accidents into architecture.
          </p>
        </Section>

        <Divider />

        {/* The 5-Day Challenge */}
        <Section>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#EAECEE]">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 bg-[#D4E6F1] rounded-full flex items-center justify-center">
                <Sparkles aria-hidden="true" className="size-6 text-[#2C3E50]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50]">The 5-Day GemSpark Challenge</h2>
            </div>
            
            <p className="text-xl md:text-2xl leading-relaxed font-light text-[#34495E] mb-8 text-pretty">
              You now have a word most people don&apos;t. Use it. Here&apos;s how:
            </p>
            
            <div className="space-y-6 mb-10">
              <ChallengeStep number={1} text="Notice one GemSpark in the next five days. A moment where chance and meaning collided. It can be small. A conversation that shouldn't have happened. A wrong turn that led somewhere right. A pattern you only saw looking backward." />
              <ChallengeStep number={2} text="Name it. Say it out loud or write it down. 'That was a GemSpark.' The act of naming rewires how your brain categorizes the experience. It moves from background noise to foreground signal." />
              <ChallengeStep number={3} text="Come back and tell us. Share your GemSpark below. Describe what happened, what you noticed, and what shifted when you named it." />
            </div>

            <div className="bg-[#F8F9F9] p-6 rounded-xl border border-[#EAECEE]">
              <div className="flex items-center gap-3 mb-3">
                <Trophy aria-hidden="true" className="size-6 text-[#D4AC0D]" />
                <h3 className="text-xl font-serif italic text-[#2C3E50]">The GemSpark Award</h3>
              </div>
              <p className="text-lg font-light text-[#34495E] leading-relaxed text-pretty">
                The most powerful GemSpark submitted in the next five days earns the inaugural <strong>GemSpark Award</strong>. Recognition as a Founding GemSpark Spotter, featured on this page, and a direct conversation with Tony about what you noticed and where it leads.
              </p>
            </div>
          </div>
        </Section>

        {/* Featured GemSparks - Social Proof */}
        <FeaturedGemSpark sparks={sparks} />

        {/* Glossary Section */}
        <Section>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2C3E50] mb-8">Glossary of Terms</h2>
          <dl className="space-y-6">
            <GlossaryItem 
              term="GemSpark" 
              definition="The fusion point where serendipity and synchronicity collide and you recognize the pattern. Use it: 'I had a GemSpark today.'" 
            />
            <GlossaryItem 
              term="Serendipity" 
              definition="The happy accident. Finding value where you weren't looking." 
            />
            <GlossaryItem 
              term="Synchronicity" 
              definition="The meaningful mirror. When the outside world rhymes with your inside world in a way that defies chance." 
            />
            <GlossaryItem 
              term="Flow Architecture" 
              definition="The intentional design of conditions that allow flow states to emerge. Not forcing peak experiences, but creating the structural conditions where they become more likely." 
            />
            <GlossaryItem 
              term="Structural Decision" 
              definition="A choice embedded in the architecture of how something operates, not an afterthought. Example: Building charity giving into every transaction rather than donating occasionally." 
            />
            <GlossaryItem 
              term="Default Mode Network" 
              definition="The brain's autopilot. The neural network that activates when you're not focused on the outside world. Quieting it opens space for presence." 
            />
          </dl>
        </Section>

        <Divider />

        {/* Call to Action - Share Your Spark */}
        <Section>
          <ShareYourSparkForm />
        </Section>

        {/* Author Bio */}
        <section aria-labelledby="author-bio-heading" className="mb-20 md:mb-28 rounded-2xl bg-white/70 border border-[#D5D8DC] px-6 py-8 md:px-10 md:py-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#5D6D7E] mb-3">About the author</p>
          <h2 id="author-bio-heading" className="font-serif italic text-3xl md:text-4xl text-[#2C3E50] mb-5">Tony Greenberg</h2>
          <p className="text-lg md:text-xl font-light text-[#34495E] leading-relaxed max-w-[70ch] text-pretty">
            Tony Greenberg is the author of <em>Boiling the Human</em> and the creator of <Link href="/humanos" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors font-normal">Human OS 2.0</Link>. His work explores how people recognize meaningful signals, adapt through disruption, and develop new language for what comes next. The GemSpark continues that work by naming the moment chance and meaning meet.
          </p>
          <Link href="/" className="inline-flex mt-6 text-lg font-medium text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">
            Explore Tony Greenberg’s work
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#D5D8DC] pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-serif italic text-2xl text-[#2C3E50] mb-2">The GemSpark</h3>
              <p className="text-[#5D6D7E] font-light">© {new Date().getFullYear()} Tony&nbsp;Greenberg</p>
            </div>
            
            <div className="flex gap-6">
              <SocialLink href="https://www.linkedin.com/in/tonygreenberg" icon={<FaLinkedin aria-hidden="true" className="size-6" />} label="LinkedIn" />
              <SocialLink href="https://twitter.com/tonygreenberg" icon={<FaTwitter aria-hidden="true" className="size-6" />} label="Twitter" />
            </div>
          </div>
          
          <ImpactReport />

          <div className="mt-12 text-center">
            <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" className="text-[#95A5A6] hover:text-[#2C3E50] transition-colors text-sm tracking-widest uppercase">
              impactsoul.is
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <section className="mb-20 md:mb-28">{children}</section>;
}

function ImageBlock({ image, caption }: { image: GemSparkImage; caption: string }) {
  return (
    <div className="mb-20 md:mb-28">
      <div className="overflow-hidden rounded-sm shadow-lg">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes="(min-width: 1024px) 976px, 100vw"
          className="h-auto w-full"
        />
      </div>
      <p className="mt-4 text-center font-serif text-lg text-[#7F8C8D] italic md:text-xl">{caption}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="mb-20 flex justify-center opacity-30 md:mb-28">
      <div className="h-20 w-px bg-[#2C3E50]" />
    </div>
  );
}

function GlossaryItem({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="border-l-2 border-[#D5D8DC] py-1 pl-6">
      <dt className="mb-2 font-serif text-xl text-[#2C3E50] italic">{term}</dt>
      <dd className="text-lg leading-relaxed font-light text-pretty text-[#5D6D7E]">{definition}</dd>
    </div>
  );
}

function ChallengeStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2C3E50] text-sm font-medium text-white">
        {number}
      </div>
      <p className="text-lg leading-relaxed font-light text-pretty text-[#34495E] md:text-xl">{text}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#95A5A6] transition-colors hover:text-[#2C3E50]"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
