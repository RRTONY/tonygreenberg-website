import Image from "next/image";
import Link from "next/link";
import { Sparkles, Trophy } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { ImpactReport } from "@/components/gemspark/impact-report";
import { NewsletterPopup } from "@/components/gemspark/newsletter-popup";
import { PageViewTracker } from "@/components/gemspark/page-view-tracker";
import { ReadingProgressBar } from "@/components/gemspark/reading-progress-bar";
import { VersionSwitcher } from "@/components/gemspark/version-switcher";
import { gemsparkImages } from "@/lib/content/gemspark/images";
import { gemsparkMetadata } from "@/lib/content/gemspark/seo";
import { GemsparkJsonLd } from "@/components/gemspark/gemspark-json-ld";

// The GemSpark, short version, ported from the GemSpark app's client/src/pages/ShortForm.tsx (Manus
// app "serensynch", exported 2026-11-10). Same copy, links and design.
// Mechanical changes only: images come from Sanity through next/image; links to tonygreenberg.com
// open here; "Submit your GemSpark" goes to the long form (/gem-spark, the app's home); the
// LinkedIn icon is react-icons (lucide no longer ships brand icons). The article's
// "prose prose-lg prose-slate" classes are dropped: the app never loaded the typography plugin, so
// live rendered them as plain text styles, which is what this shows.
export const metadata = gemsparkMetadata({
  path: "/gem-spark/short",
  title: "The GemSpark (Short Version)",
  description: "A new word for the moment chance and meaning collide.",
  languages: { en: "/gem-spark/short", es: "/gem-spark/es/short" },
});

export default function GemSparkShortPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-[#2C3E50] selection:bg-[#D4E6F1] selection:text-[#2C3E50]">
      <PageViewTracker page="short-form" />
      <GemsparkJsonLd
        version="short"
        headline="The GemSpark (Short Version)"
        description="A new word for the moment chance and meaning collide."
      />
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      {/* Version Switcher */}
      <VersionSwitcher />

      {/* Newsletter Popup - 30 second delay OR 50% scroll */}
      <NewsletterPopup delaySeconds={30} scrollTriggerPercent={50} enableTimeDelay={true} enableScrollTrigger={true} />

      <main className="max-w-2xl mx-auto px-6 py-12 pt-20">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif italic font-light text-[#2C3E50] mb-4 leading-tight">
            The GemSpark
          </h1>
          <p className="text-lg text-[#5D6D7E] font-light">
            A new word for the moment chance and meaning collide.
          </p>
          <p className="text-md font-serif italic text-[#5D6D7E] mt-2">
            by <Link href="/" className="text-[#5D6D7E] hover:text-[#2C3E50] transition-colors">Tony&nbsp;Greenberg</Link>
          </p>
        </header>

        {/* Content - LinkedIn Style */}
        <article className="max-w-none font-light leading-relaxed [&_p]:mb-5 text-pretty">
          <p className="font-medium text-xl text-[#2C3E50]">I made an offer that was irrational on purpose.</p>
          
          <p>Low enough to offend slightly. High enough to be interesting.</p>
          
          <p>The counter came back at irrational plus ten percent, which never happens.</p>
          
          <p>That&apos;s when I realized the whole day had been building toward something I hadn&apos;t seen coming.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>Here&apos;s what I&apos;ve learned: we optimize for efficiency and smooth out the wrinkles where the magic actually lives. The best days start with a glitch. An interruption you almost ignored.</p>
          
          <p>It started 12 hours earlier. No intention other than to move before the <a href="https://en.wikipedia.org/wiki/Default_mode_network" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">default mode network</a> boots up and paves over possibility with the predictable.</p>
          
          <p>I hit the <a href="https://www.alltrails.com/trail/us/california/los-leones-trail" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Los Leones</a> trail. The view stretched from the <a href="https://en.wikipedia.org/wiki/Pacific_Palisades,_Los_Angeles" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Pacific Palisades</a> to <a href="https://downtownla.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Downtown LA</a>. The exact skyline where the day would end. I didn&apos;t know that yet. The geometry was already being plotted.</p>
          
          <div className="my-8 rounded-sm overflow-hidden shadow-md">
            <Image
              src={gemsparkImages.trail.src}
              width={gemsparkImages.trail.width}
              height={gemsparkImages.trail.height}
              alt="Los Leones Trail"
              sizes="(min-width: 672px) 624px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <p>We stopped at the <a href="https://www.marvistafarmersmarket.org/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Mar Vista Farmers Market</a>. Not because we needed anything. Because the path wanted a pause.</p>
          
          <p>Curiosity was rewarded with <a href="https://completelypickled.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">fermented pineapple dill pickles</a>. A flavor that sounds like a mistake until you try it. The lesson: things don&apos;t have to make sense to be right.</p>
          
          <p>Then we drifted toward the <a href="https://www.laartshow.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">LA Art Show</a>. Most of it slides past politely. Then something grabs your sleeve.</p>
          
          <div className="my-8 rounded-sm overflow-hidden shadow-md">
            <Image
              src={gemsparkImages.art.src}
              width={gemsparkImages.art.width}
              height={gemsparkImages.art.height}
              alt="Art by David Fenton"
              sizes="(min-width: 672px) 624px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <p>The piece was <a href="https://en.wikipedia.org/wiki/Dye-sublimation_printing" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">dye-sublimation on etched aluminum</a>. A rare, difficult technique that gives the image a holographic, metallic depth. It shifts with light. It&apos;s alive.</p>
          
          <p>And I&apos;d seen it before.</p>
          
          <p>Twenty years ago, in Avondale, I bought a piece using this exact technique without understanding what it was. Now here was another. Same process, same medium. And I didn&apos;t remember the first until I was negotiating the second.</p>
          
          <p>That&apos;s synchronicity. It doesn&apos;t announce itself. It waits for you to catch up.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>I wanted the piece. But I didn&apos;t want a standard transaction. I wanted a <strong>structural decision</strong>.</p>
          
          <p>I made the offer in <a href="https://en.wikipedia.org/wiki/Bitcoin" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Bitcoin</a>. And I added a condition: 13% of the purchase price goes immediately to a charity of his choice.</p>
          
          <p>Why 13%? Because it breaks the pattern of 10%. It signals intention. It turns a purchase into a partnership.</p>
          
          <p><a href="https://www.linkedin.com/in/dafenton" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">David Fenton</a> accepted.</p>
          
          <p>Then he gave me something better than the art. A rule: &quot;Give it 100 days. Don&apos;t judge it before then. Let it live in your space. Let it change the room.&quot;</p>
          
          <p>That&apos;s <strong><a href="https://en.wikipedia.org/wiki/Flow_(psychology)" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">flow architecture</a></strong> in a sentence. The peak experience is always a disappearing act. You can&apos;t hold it. You can only be ready for it.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>A walk. A wrong turn. A pickle. A piece of art. Music. Water. Healing. All in twelve hours. None of it planned.</p>
          
          <p>I needed a word for this. Not &quot;luck.&quot; Not &quot;coincidence.&quot; Something that captures the moment when a happy accident and a meaningful pattern collide, and you recognize it in real time.</p>
          
          <p className="text-xl font-medium text-[#2C3E50]">That word is <strong>GemSpark</strong>.</p>
          
          <p>A GemSpark is the fusion point where serendipity and synchronicity collide, and you finally recognize the pattern. It&apos;s not mystical. It&apos;s architectural. It&apos;s what happens when you build the conditions for noticing instead of optimizing for speed.</p>
          
          <p>Once you have the word, you start seeing them everywhere. &quot;I had a GemSpark today.&quot; &quot;I almost missed one.&quot; &quot;That meeting was pure GemSpark.&quot; It becomes a lens. A daily practice. A way of moving through the world that turns noise into signal.</p>
        </article>

        {/* 5-Day Challenge CTA */}
        <div className="mt-12 bg-white p-8 rounded-2xl border border-[#EAECEE] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles aria-hidden="true" className="size-6 text-[#2C3E50]" />
            <h3 className="font-serif italic text-xl text-[#2C3E50]">The 5-Day GemSpark Challenge</h3>
          </div>
          <p className="text-[#34495E] font-light mb-4 leading-relaxed text-pretty">
            You now have a word most people don&apos;t. Use it in the next five days. Notice one GemSpark. Name it out loud. Then come back and tell us what shifted.
          </p>
          <div className="bg-[#F8F9F9] p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy aria-hidden="true" className="size-5 text-[#D4AC0D]" />
              <span className="font-medium text-[#2C3E50]">The GemSpark Award</span>
            </div>
            <p className="text-sm text-[#5D6D7E] leading-relaxed">
              The most powerful GemSpark submitted in the next five days earns the inaugural GemSpark Award. Recognition as a Founding GemSpark Spotter, featured on this page, and a direct conversation with Tony.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/gem-spark" className="inline-flex items-center gap-2 bg-[#2C3E50] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#1A252F] transition-colors">
              <Sparkles aria-hidden="true" className="size-5" />
              Submit your GemSpark here
            </Link>
            <a 
              href="https://www.linkedin.com/in/tonygreenberg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2C3E50] font-medium hover:text-[#1A252F] transition-colors border border-[#D5D8DC] px-5 py-3 rounded-xl"
            >
              <FaLinkedin aria-hidden="true" className="size-5" />
              Or share on LinkedIn
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#D5D8DC] pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif italic text-2xl text-[#2C3E50] mb-2">The GemSpark</h3>
              <p className="text-[#5D6D7E] font-light">© {new Date().getFullYear()} <Link href="/" className="text-[#5D6D7E] hover:text-[#2C3E50] transition-colors">Tony&nbsp;Greenberg</Link></p>
            </div>
            
            <ImpactReport />
          </div>
        </footer>

      </main>
    </div>
  );
}
