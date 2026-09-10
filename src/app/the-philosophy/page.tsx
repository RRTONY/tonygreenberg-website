import type { Metadata } from "next";

// Ported from legacy client/src/pages/ThePhilosophy.tsx. Real content,
// unchanged — Tony's "Diode of Perception" passage and its full "What This
// Means" interpretation. The 4 "Instruments" links (Psychedelic Readiness
// Index, Facilitator Index, Medicine Sequencing, Three Friends Gate) don't
// exist yet in this migration — rendered as a "Coming Soon" badge instead
// of a broken link, matching the pattern used on /impact-dashboard's
// SoulScore links. Revisit and re-link each as its destination is built.
export const metadata: Metadata = {
  title: "The Philosophy — The Diode of Perception",
  description:
    "The philosophical foundation of every readiness instrument on this site — Tony Greenberg's passage on perception, intention, and the sharpening of will.",
  alternates: { canonical: "/the-philosophy" },
};

const PASSAGE = [
  {
    text: "The diode of perception tethering movement to bone accelerates the other fundamental processes of life.",
    italic: false,
  },
  {
    text: "Beyond hunger, what you think of as necessity or craving is automatically fulfilled in the quickening of the senses — as spirit reaches in to taste the body.",
    italic: true,
  },
  {
    text: "Things of the past and future, things that you touch for pleasure — the pleasure is what electrical current you offer that thing.",
    italic: false,
  },
  {
    text: "If it is a living body — animal or human — it knows your love as you embrace its presence with your energetic breath: the waves of awareness stemming from that which you control your body from spirit.",
    italic: true,
  },
  {
    text: "The sharpening of will takes place as the simplicity of life — the places where your awareness cannot escape the body to forget itself in idle pastures, but remains alive in the sensation of time slowing across the curve of heartbeat weaving breath.",
    italic: false,
  },
];

const WHAT_THIS_MEANS = [
  {
    heading: "You are the instrument",
    body: 'Every readiness assessment on this site begins with the same premise: the medicine does not change you. It reveals the condition of the instrument — which is you. The diode of perception is that instrument. Before any ceremony, any protocol, any facilitator conversation, the question is not "what will this do to me?" It is "what is the current state of the thing being played?"',
  },
  {
    heading: "Readiness is not a checklist",
    body: "Most people approach psychedelic preparation like a pre-flight safety card — boxes to tick, warnings to acknowledge, then buckle up. That misses the point entirely. Readiness is the quality of your attention. It is whether spirit can move through bone without getting lost. The Psychedelic Readiness Index and the Facilitator Index exist to map that quality, not to gatekeep it.",
  },
  {
    heading: "The electrical current is your intention",
    body: '"The pleasure is what electrical current you offer that thing." Intention is not a wish. It is a charge. What you bring into a ceremony — the quality of your desire, the honesty of your grief, the clarity of your question — is the voltage that determines what the experience can do. A weak or dishonest intention produces a weak or confused result. A clean one produces a clean one.',
  },
  {
    heading: "Time slowing is the signal",
    body: "When time slows across the curve of heartbeat weaving breath, you are no longer in ordinary consciousness. You are in the space where integration actually happens — where the nervous system can rewire, where old patterns can be seen from outside, where the body and spirit negotiate a new agreement. That space is not created by the medicine. The medicine reveals whether you were already capable of entering it.",
  },
  {
    heading: "Why this matters for facilitation",
    body: "A facilitator who has not felt time slow in their own body cannot hold space for someone else entering that state. This is the philosophical foundation of the Facilitator Index: 108 questions designed to surface whether a practitioner has genuinely inhabited the territory they are guiding others through — or whether they are navigating from a map they have never walked.",
  },
];

const INSTRUMENTS = [
  {
    label: "Psychedelic Readiness Index",
    desc: "38 medicines. 50+ questions. Your readiness profile.",
  },
  {
    label: "Facilitator Index",
    desc: "108-item assessment for practitioners and seekers evaluating fit.",
  },
  { label: "Medicine Sequencing", desc: "The spectrum ladder — don't skip rungs." },
  { label: "Three Friends Gate", desc: "Permission from the people who know you best." },
];

export default function ThePhilosophyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A0C14] via-[#0F0A1A] to-[#0D1008] pb-24 font-heading text-[#F4F0E8]">
      <div className="relative border-b border-[#c9a84c]/12 px-6 py-24 text-center">
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(107,33,168,0.18) 0%, transparent 70%)",
          }}
        />
        <p className="mb-6 font-mono text-[0.6rem] tracking-[0.3em] text-[#c9a84c] uppercase">
          Tony Greenberg
        </p>
        <h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tight text-[#F4F0E8] sm:text-5xl">
          The Diode of Perception
        </h1>
        <p className="mx-auto max-w-md font-mono text-sm tracking-wide text-[#F4F0E8]/45">
          The philosophical foundation of every readiness instrument on this site.
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-16">
        {PASSAGE.map((para, i) => (
          <p
            key={i}
            className={`mb-7 text-lg leading-loose sm:text-xl ${para.italic ? "italic" : ""}`}
            style={{ color: `rgba(244,240,232,${0.95 - i * 0.04})` }}
          >
            {i === 0 && (
              <span className="float-left mt-1 mr-1 text-5xl leading-[0.85] font-extrabold text-[#c9a84c]">
                T
              </span>
            )}
            {i === 0 ? para.text.slice(1) : para.text}
          </p>
        ))}

        <div className="mt-2 border-t border-[#c9a84c]/15 pt-6 text-right font-mono text-xs tracking-wide text-[#F4F0E8]/35 uppercase">
          — Tony Greenberg
        </div>
      </div>

      <div className="mx-auto my-16 h-px max-w-2xl bg-linear-to-r from-transparent via-[#c9a84c]/25 to-transparent" />

      <div className="mx-auto max-w-2xl px-6">
        <p className="mb-3 font-mono text-[0.6rem] tracking-[0.28em] text-[#c9a84c] uppercase">
          Interpretation
        </p>
        <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-[#F4F0E8] sm:text-4xl">
          What This Means
        </h2>

        {WHAT_THIS_MEANS.map((item) => (
          <div key={item.heading} className="mb-11 border-l-2 border-[#c9a84c]/30 pl-5">
            <h3 className="mb-2 text-lg font-bold text-[#c9a84c]">{item.heading}</h3>
            <p className="font-sans text-base leading-relaxed text-[#F4F0E8]/75">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto my-12 h-px max-w-2xl bg-linear-to-r from-transparent via-[#c9a84c]/25 to-transparent" />

      <div className="mx-auto max-w-2xl px-6">
        <p className="mb-3 font-mono text-[0.6rem] tracking-[0.28em] text-[#c9a84c] uppercase">
          The Instruments
        </p>
        <h2 className="mb-7 text-2xl font-extrabold tracking-tight text-[#F4F0E8]">
          Put the philosophy to work
        </h2>

        <div className="flex flex-col gap-3">
          {INSTRUMENTS.map((inst) => (
            <div
              key={inst.label}
              className="flex items-center justify-between gap-4 border border-[#c9a84c]/15 bg-[#F4F0E8]/4 px-5 py-4"
            >
              <div>
                <div className="mb-0.5 font-sans text-sm font-bold text-[#F4F0E8]">
                  {inst.label}
                </div>
                <div className="font-sans text-xs text-[#F4F0E8]/45">{inst.desc}</div>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 font-mono text-[0.6rem] tracking-wide text-[#F4F0E8]/40 uppercase">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-2xl px-6 text-center">
        <div className="font-mono text-[0.65rem] tracking-wide text-[#F4F0E8]/25">
          © 2026 Tony Greenberg. All rights reserved.
          <br />
          tonygreenberg.com/the-philosophy
        </div>
      </div>
    </div>
  );
}
