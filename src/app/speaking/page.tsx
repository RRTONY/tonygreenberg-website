import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";

// Ported from legacy client/src/pages/Speaking.tsx. Real content kept as-is.

export const metadata: Metadata = {
  title: "Speaking and Conversations",
  description:
    "Keynotes, firesides, offsites, and working sessions with Tony Greenberg on trust, capital, technology, and the human operating system.",
  keywords: [
    "Tony Greenberg speaker",
    "keynote speaker",
    "trust infrastructure",
    "impact futurist",
    "technology speaker",
    "capital and impact",
  ],
  alternates: { canonical: "/speaking" },
};

const TOPICS = [
  {
    number: "01",
    title: "Trust is infrastructure",
    copy: "Every market, platform, and relationship is a trust system in disguise. Tony follows the seams where that system breaks, then asks the useful question: what would make it worthy of the people inside it?",
    color: "#8B6914",
  },
  {
    number: "02",
    title: "Capital has a job to do",
    copy: "Capital is not neutral. It can make extraction more efficient or make repair possible. This is a conversation about what happens when the people moving money decide to care where it lands.",
    color: "#4A1D5E",
  },
  {
    number: "03",
    title: "The human operating system",
    copy: "Technology keeps accelerating. The nervous system running the technology has not received the same upgrade. Tony connects attention, incentives, identity, and the daily choices that decide whether a system helps or hollows us out.",
    color: "#276B6B",
  },
  {
    number: "04",
    title: "What comes after the broken thing",
    copy: "The point is not to complain more elegantly. The point is to name the hidden mechanism, build a better one, and leave the room with somewhere specific to begin.",
    color: "#A86616",
  },
];

const FORMATS = [
  { title: "Keynote", copy: "A clear provocation with a practical way through it." },
  { title: "Fireside", copy: "An honest conversation that can follow the interesting thread." },
  {
    title: "Executive offsite",
    copy: "A room built for strategic friction, not another slide deck.",
  },
  {
    title: "Workshop",
    copy: "A working session for teams ready to examine the system they are inside.",
  },
];

const ROOMS = ["Davos", "Harvard H+ Summit", "UCLA", "Paris Blockchain Week"];

export default function SpeakingPage() {
  return (
    <div>
      <section className="bg-[#0A0A10] px-6 py-20 text-[#F5F0E0] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/about"
            className="font-mono text-xs tracking-wide text-brand-gold-light uppercase"
          >
            <BackIcon aria-hidden="true" /> The Story
          </Link>
          <p className="mt-9 mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold-light uppercase">
            Speaking and Conversations
          </p>
          <h1 className="mb-6 max-w-3xl font-heading text-4xl leading-tight font-normal sm:text-6xl">
            A room changes when someone names what everyone can already feel.
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#F5F0E0]/75">
            Tony Greenberg speaks about trust, capital, technology, and the human systems beneath
            them. The work is not a polished keynote about disruption. It is a live search for the
            lever that makes a broken system behave differently.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {ROOMS.map((room) => (
              <span
                key={room}
                className="rounded-full border border-brand-gold-light/30 px-3 py-1.5 font-mono text-xs tracking-wide text-[#F5F0E0]/80 uppercase"
              >
                {room}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
              What the room gets
            </p>
            <h2 className="mb-4 font-heading text-3xl leading-tight font-normal text-foreground sm:text-4xl">
              A serious point of view, with a pulse.
            </h2>
            <p className="leading-relaxed text-foreground/70">
              Tony has spent twenty five years inside the intermediary layer between buyers and
              sellers, managing more than $10 billion in transactions. He has also built ventures
              around regeneration, cultural value, and the inconvenient fact that human beings are
              not spreadsheets. The conversation moves between those worlds because the underlying
              question is the same: what is this system actually rewarding?
            </p>
          </div>
          <div className="grid gap-3.5">
            {TOPICS.map((topic) => (
              <article
                key={topic.number}
                className="rounded-md border border-border bg-card p-5"
                style={{ borderLeft: `4px solid ${topic.color}` }}
              >
                <p className="mb-1 font-mono text-xs tracking-wide" style={{ color: topic.color }}>
                  {topic.number}
                </p>
                <h3 className="mb-1.5 font-heading text-xl font-semibold text-foreground">
                  {topic.title}
                </h3>
                <p className="text-foreground/70">{topic.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className="border-y border-border bg-muted/40 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Formats
          </p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {FORMATS.map((format) => (
              <div
                key={format.title}
                className="rounded-md border border-border bg-background/70 p-5"
              >
                <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground">
                  {format.title}
                </h3>
                <p className="text-foreground/70">{format.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          The First Question
        </p>
        <h2 className="mb-4 font-heading text-3xl leading-tight font-normal text-foreground sm:text-5xl">
          What is the room trying to make possible?
        </h2>
        <p className="mb-6 leading-relaxed text-foreground/70">
          Send the audience, the moment, and the question the room cannot quite ask itself. If there
          is a fit, Tony will help shape the conversation from there.
        </p>
        <a
          href="mailto:tony@tonygreenberg.com?subject=Speaking%20Invitation"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-brand-gold-light px-5 font-mono text-xs tracking-wide text-background uppercase"
        >
          Start a conversation <ForwardIcon aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
