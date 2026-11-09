import Link from "next/link";
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Clock, MapPin, Star, Users } from "lucide-react";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/HowToGetAllocated.tsx. Same copy, own header
// bar and layout. Static page, so a Server Component.

const keyConnections = [
  "Specialty mezcal bar staff (they often have importer connections)",
  "Independent liquor store buyers (they can request special bottles)",
  "Local mezcal tasting groups and clubs",
  "Importers who do tastings and events",
];

const unwrittenRules = [
  { rule: "Never show up unannounced.", detail: "Always arrange visits through a local contact or guide." },
  { rule: "Learn some Spanish.", detail: "Even basic phrases show respect. Hire a translator if needed." },
  { rule: "Don't haggle.", detail: "If they quote a price, pay it. These are artisans, not vendors." },
  { rule: "Ask before photographing.", detail: "Some producers prefer privacy. Always ask." },
  { rule: "Buy what they offer.", detail: "Don't demand specific bottles. Accept what they're willing to share." },
  { rule: "Stay in touch.", detail: "Send photos when you open their bottles. Share how it was received." },
];

const keyEvents = [
  {
    name: "Mezcal Week (Oaxaca)",
    when: "March annually",
    text: "Industry professionals, importers, and serious collectors gather. Best networking opportunity of the year.",
  },
  {
    name: "Feria del Mezcal",
    when: "July (Oaxaca City)",
    text: "Public festival with hundreds of producers. Good for discovery, less for deep connections.",
  },
  {
    name: "Tales of the Cocktail",
    when: "July (New Orleans)",
    text: "Major spirits industry event. Importers and brand ambassadors attend. Good US networking.",
  },
  {
    name: "Local Mezcal Tastings",
    when: "Ongoing (Major US cities)",
    text: "Importers regularly host tastings. Show up consistently. Ask smart questions.",
  },
];

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#8b4513] font-bold text-[#f5f0e8]">
        {n}
      </div>
      <h3 className="font-serif text-xl text-[#f5f0e8]">{title}</h3>
    </div>
  );
}

export function HowToGetAllocated() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8]">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#8b4513]/20 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={ss("/")} className="font-serif text-2xl tracking-wider text-[#d4a574]">
            MEZCAL
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href={ss("/quadrant")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Quadrant
            </Link>
            <Link href={ss("/producers")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Producers
            </Link>
            <Link href={ss("/taste-quiz")} className="text-[#a0a0a0] transition-colors hover:text-[#d4a574]">
              Find Your Mezcal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-b from-[#2a1810] to-[#1a1a1a] px-6 pt-24 pb-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex items-center gap-2 text-lg font-medium text-[#d4a574] hover:text-[#f5f0e8]"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            Back to Home
          </Link>
          <h1 className="mb-6 font-serif text-4xl md:text-5xl">
            How to Get <span className="text-[#d4a574]">Allocated</span>
          </h1>
          <p className="text-xl leading-relaxed text-[#a0a0a0]">
            The best mezcals aren&apos;t sold—they&apos;re shared. Here&apos;s how to build the relationships that
            unlock bottles most people will never taste.
          </p>
        </div>
      </section>

      {/* Reality Check */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[#8b4513]/30 bg-[#2a1810] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle aria-hidden="true" className="mt-1 size-6 shrink-0 text-amber-500" />
              <div>
                <h2 className="mb-3 font-serif text-xl text-[#d4a574]">The Hard Truth</h2>
                <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                  Most of the bottles in our &quot;Grail&quot; quadrant cannot be purchased through normal channels.
                  They&apos;re made in lots of 20-200 bottles. The producers don&apos;t have websites. They don&apos;t
                  have distribution deals. They sell to people they know and trust.
                </p>
                <p className="leading-relaxed text-[#c0c0c0]">
                  This isn&apos;t gatekeeping—it&apos;s reality. When you make 50 bottles of something, you can&apos;t
                  sell to strangers. You share with family, friends, and the rare outsiders who&apos;ve earned a place
                  at the table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Path */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-serif text-3xl text-[#d4a574]">The Path to Allocation</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-6 md:p-8">
              <StepHeader n={1} title="Start with What's Available" />
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                Before chasing unicorns, master what you can actually buy. Producers like Del Maguey, Vago, and El
                Jolgorio have US distribution. Learn these bottles deeply. Understand the differences between agaves,
                regions, and production methods.
              </p>
              <p className="text-sm text-[#a0a0a0] italic">Timeline: 6-12 months of serious exploration</p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-6 md:p-8">
              <StepHeader n={2} title="Build Your Network at Home" />
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                Find the mezcal bars, the specialty retailers, the importers in your area. Become a regular. Ask
                questions. Show genuine interest. The people who work in mezcal know each other—and they remember
                customers who care.
              </p>
              <div className="mt-4 rounded-lg bg-[#1a1a1a] p-4">
                <h4 className="mb-2 font-medium text-[#d4a574]">Key Connections to Make:</h4>
                <ul className="space-y-2 text-sm text-[#a0a0a0]">
                  {keyConnections.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle aria-hidden="true" className="size-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-sm text-[#a0a0a0] italic">
                Timeline: Ongoing, but meaningful connections take 1-2 years
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-6 md:p-8">
              <StepHeader n={3} title="Go to Oaxaca" />
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                This is non-negotiable. If you want access to the best mezcal, you need to visit the source. Not as a
                tourist—as a student. Go with humility, curiosity, and respect.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[#1a1a1a] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#d4a574]">
                    <Calendar aria-hidden="true" className="size-4" />
                    <span className="font-medium">Best Times to Visit</span>
                  </div>
                  <ul className="space-y-1 text-sm text-[#a0a0a0]">
                    <li>• Mezcal Week (March) - Industry event</li>
                    <li>• Day of the Dead (Nov) - Cultural immersion</li>
                    <li>• Dry season (Oct-May) - Easier travel</li>
                    <li>• Harvest season varies by agave</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[#1a1a1a] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#d4a574]">
                    <MapPin aria-hidden="true" className="size-4" />
                    <span className="font-medium">Key Regions</span>
                  </div>
                  <ul className="space-y-1 text-sm text-[#a0a0a0]">
                    <li>• Santiago Matatlán - &quot;World Capital&quot;</li>
                    <li>• Santa Catarina Minas - Real Minero</li>
                    <li>• San Baltazar Guelavila - Fane Kantsini</li>
                    <li>• Miahuatlán - Wild agave country</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#a0a0a0] italic">
                Timeline: Plan for at least 1-2 weeks, ideally multiple trips
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-6 md:p-8">
              <StepHeader n={4} title="Visit Palenques with Respect" />
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                When you visit a producer, you&apos;re entering their home. Their livelihood. Their family&apos;s
                legacy. Act accordingly.
              </p>
              <div className="mt-4 rounded-lg bg-[#1a1a1a] p-4">
                <h4 className="mb-3 font-medium text-[#d4a574]">The Unwritten Rules:</h4>
                <ul className="space-y-3 text-sm text-[#a0a0a0]">
                  {unwrittenRules.map((item) => (
                    <li key={item.rule} className="flex items-start gap-2">
                      <CheckCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong className="text-[#f5f0e8]">{item.rule}</strong> {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-6 md:p-8">
              <StepHeader n={5} title="Play the Long Game" />
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                Allocation isn&apos;t transactional. It&apos;s relational. The producers who make the best mezcal have
                been doing this for generations. They think in decades, not quarters.
              </p>
              <p className="mb-4 leading-relaxed text-[#c0c0c0]">
                Return to the same palenques. Remember birthdays. Send holiday greetings. Introduce them to other
                serious collectors. Become part of their extended network.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#d4a574]">
                <Clock aria-hidden="true" className="size-5 shrink-0" />
                <span className="font-medium">Expect this to take 3-5 years for meaningful access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Events */}
      <section className="bg-[#2a2a2a]/50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl text-[#d4a574]">
            <Calendar aria-hidden="true" className="size-6" />
            Key Events &amp; Opportunities
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {keyEvents.map((event) => (
              <div key={event.name} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-5">
                <h3 className="mb-2 font-medium text-[#f5f0e8]">{event.name}</h3>
                <p className="mb-2 text-sm text-[#a0a0a0]">{event.when}</p>
                <p className="text-sm text-[#c0c0c0]">{event.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#d4a574]">
            <Star aria-hidden="true" className="size-5" />
            <span className="text-sm tracking-widest uppercase">Remember</span>
          </div>
          <h2 className="mb-6 font-serif text-2xl md:text-3xl">The journey is the point.</h2>
          <p className="mb-8 text-lg leading-relaxed text-[#a0a0a0]">
            The best mezcal collectors aren&apos;t in it for the bottles—they&apos;re in it for the relationships, the
            stories, the connection to a living tradition. If you approach this as a transaction, you&apos;ll fail. If
            you approach it as a pilgrimage, you&apos;ll find what you&apos;re looking for.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ss("/producers")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8b4513] px-8 py-3 font-medium text-[#f5f0e8] transition-colors hover:bg-[#a0522d]"
            >
              <Users aria-hidden="true" className="size-4" />
              Meet the Producers
            </Link>
            <Link
              href={ss("/quadrant")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8b4513] px-8 py-3 font-medium text-[#d4a574] transition-colors hover:bg-[#8b4513]/20"
            >
              Explore the Quadrant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
