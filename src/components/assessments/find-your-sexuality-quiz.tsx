"use client";

import { useEffect, useState } from "react";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourSexuality.tsx — a
// research-informed exploration of sexual identity across 6 dimensions
// (attraction/behavior/identity/fantasy/emotional bonding/fluidity),
// grounded in real cited research (the Klein Sexual Orientation Grid,
// 1978; the Kinsey Scale, 1948; Lisa Diamond's 2008 sexual-fluidity
// research; Sari van Anders' 2015 work). Real 16 questions (with their
// real per-question research context notes), the real 12 archetypes
// (each with a real name/title/description/research note), and the real
// scoring/archetype-selection logic all ported unchanged and verbatim —
// this is sensitive, carefully-worded content, not something to
// paraphrase or trim. Legacy's own `AssessmentIntro` stats prop claimed
// "20 questions, 7 dimensions," which doesn't match the real 16-question,
// 6-dimension implementation — used the live `QUESTIONS.length` and the
// real dimension count instead of repeating the stale numbers, same
// discipline already applied elsewhere in this migration. Legacy's
// results screen also used light grey text (`#ccc`/`#aaa`) on
// `ThemedBackground`'s real light pastel "sexuality" theme — the same
// low-contrast inconsistency already caught and fixed on
// `/find-your-style`; normalized to this migration's dark-ink convention.
// The real closing disclaimer (this is a reflection tool, not a
// diagnosis; consider a qualified therapist) is preserved unchanged.
type Dimension = "attraction" | "behavior" | "identity" | "fantasy" | "emotional" | "fluidity";
const DIMENSIONS: Dimension[] = [
  "attraction",
  "behavior",
  "identity",
  "fantasy",
  "emotional",
  "fluidity",
];
const INITIAL_SCORES: Record<Dimension, number> = {
  attraction: 0,
  behavior: 0,
  identity: 0,
  fantasy: 0,
  emotional: 0,
  fluidity: 0,
};
const ACCENT = "#C2185B";
const RESULT_ACCENT = "#C97B7B";

function opt(text: string, score: Partial<Record<Dimension, number>>) {
  return { text, score };
}

const QUESTIONS: {
  question: string;
  context?: string;
  options: { text: string; score: Partial<Record<Dimension, number>> }[];
}[] = [
  {
    question: "When you notice someone across a room, what draws your attention?",
    context:
      "Based on the Klein Sexual Orientation Grid — attraction operates independently of behavior.",
    options: [
      opt("I'm drawn almost exclusively to people of a different gender than mine.", {
        attraction: 1,
      }),
      opt(
        "Mostly a different gender, but occasionally someone of the same gender catches my eye.",
        { attraction: 2, fluidity: 1 },
      ),
      opt("Gender isn't the primary filter — I notice energy, presence, confidence.", {
        attraction: 4,
        fluidity: 2,
      }),
      opt("I'm drawn mostly to people of the same gender.", { attraction: 5 }),
      opt("I'm drawn exclusively to people of the same gender.", { attraction: 6 }),
      opt("I rarely experience this kind of pull toward anyone.", { attraction: 0, emotional: 2 }),
    ],
  },
  {
    question:
      "Think about your most intense crush — the one that kept you up at night. Who was it?",
    context: "Fantasy and desire often reveal patterns that social conditioning suppresses.",
    options: [
      opt("Always someone of a different gender.", { fantasy: 1, attraction: 1 }),
      opt(
        "Usually a different gender, but I've had at least one same-gender crush that surprised me.",
        { fantasy: 2, fluidity: 2, attraction: 2 },
      ),
      opt("It's been pretty evenly split across genders.", {
        fantasy: 4,
        attraction: 4,
        fluidity: 1,
      }),
      opt("Mostly same-gender, with rare exceptions.", { fantasy: 5, attraction: 5 }),
      opt("Exclusively same-gender.", { fantasy: 6, attraction: 6 }),
      opt("My intense connections aren't really about gender — they're about the person's mind.", {
        fantasy: 3,
        emotional: 3,
        fluidity: 2,
      }),
    ],
  },
  {
    question: "In your actual sexual experiences, your partners have been...",
    context: "Behavior and attraction don't always align — and that's normal. (Kinsey, 1948)",
    options: [
      opt("Exclusively a different gender.", { behavior: 1 }),
      opt("Mostly a different gender, with some same-gender experiences.", {
        behavior: 2,
        fluidity: 1,
      }),
      opt("A mix of genders, roughly equal.", { behavior: 4, fluidity: 1 }),
      opt("Mostly the same gender.", { behavior: 5 }),
      opt("Exclusively the same gender.", { behavior: 6 }),
      opt("I haven't had sexual experiences, or they don't define my orientation.", {
        behavior: 0,
        identity: 1,
      }),
    ],
  },
  {
    question: "When you imagine your ideal long-term partner, what comes to mind?",
    context: "Emotional bonding patterns often differ from sexual attraction patterns.",
    options: [
      opt("A partner of a different gender — that's always been the picture.", {
        emotional: 1,
        identity: 1,
      }),
      opt("Probably a different gender, but I wouldn't rule anything out.", {
        emotional: 2,
        fluidity: 2,
        identity: 2,
      }),
      opt("Gender genuinely doesn't factor in — I imagine a person, not a gender.", {
        emotional: 4,
        identity: 4,
        fluidity: 2,
      }),
      opt("A same-gender partner feels most natural.", { emotional: 5, identity: 5 }),
      opt("Exclusively same-gender — anything else would feel wrong.", {
        emotional: 6,
        identity: 6,
      }),
      opt("I don't really imagine a long-term partner. I'm complete on my own.", {
        emotional: 0,
        identity: 0,
      }),
    ],
  },
  {
    question: "How would you describe your sexual orientation to a trusted friend?",
    context: "Self-identification is the most personal dimension — and often the last to shift.",
    options: [
      opt("Straight / heterosexual — no ambiguity.", { identity: 1 }),
      opt("Mostly straight, but I'm open-minded.", { identity: 2, fluidity: 1 }),
      opt("Bisexual, pansexual, or queer — I'm attracted to more than one gender.", {
        identity: 4,
        fluidity: 1,
      }),
      opt("Gay or lesbian — that's who I am.", { identity: 6 }),
      opt("I don't love labels. I just like who I like.", { identity: 3, fluidity: 3 }),
      opt("Asexual or on the ace spectrum — sexual attraction isn't really my thing.", {
        identity: 0,
        emotional: 2,
      }),
    ],
  },
  {
    question: "Has your sense of who you're attracted to changed over time?",
    context:
      "Lisa Diamond's research (2008) shows sexual fluidity is common and normal, especially in women — but not only in women.",
    options: [
      opt("No — I've always known exactly who I'm attracted to.", { fluidity: 0 }),
      opt("Slightly — my tastes have evolved but the core hasn't shifted.", { fluidity: 1 }),
      opt("Yes — there was a clear shift at some point in my life.", { fluidity: 3 }),
      opt("It's been an ongoing evolution. I'm different now than I was 5 years ago.", {
        fluidity: 4,
      }),
      opt("It changes depending on the person, the context, the phase of life.", { fluidity: 5 }),
      opt("I'm still figuring it out — and that's okay.", { fluidity: 4, identity: 3 }),
    ],
  },
  {
    question:
      "When consuming media (films, books, art), which romantic or sexual scenarios resonate most?",
    context: "Fantasy is often the most honest dimension — free from social performance.",
    options: [
      opt("Opposite-gender romance and intimacy.", { fantasy: 1 }),
      opt("Mostly opposite-gender, but same-gender stories intrigue me.", {
        fantasy: 2,
        fluidity: 1,
      }),
      opt("I'm drawn to compelling chemistry regardless of the genders involved.", {
        fantasy: 4,
        fluidity: 1,
      }),
      opt("Same-gender stories feel most authentic to me.", { fantasy: 5 }),
      opt("I'm more interested in emotional depth than the sexual component.", {
        fantasy: 3,
        emotional: 3,
      }),
      opt("I don't really connect with romantic or sexual media.", { fantasy: 0 }),
    ],
  },
  {
    question: "In your deepest emotional bonds — the ones that feel like home — the pattern is...",
    context: "Emotional orientation can differ from sexual orientation. (van Anders, 2015)",
    options: [
      opt("My deepest bonds are with a different gender, and they're romantic.", { emotional: 1 }),
      opt("My deepest bonds are with the same gender, but they're platonic.", { emotional: 2 }),
      opt("My deepest bonds cross gender lines — some romantic, some not.", {
        emotional: 3,
        fluidity: 1,
      }),
      opt("My most intense emotional connections have been with the same gender.", {
        emotional: 5,
      }),
      opt("I bond deeply with people regardless of gender — it's about the soul.", {
        emotional: 4,
        fluidity: 2,
      }),
      opt("I keep emotional distance from everyone. Deep bonds are rare for me.", { emotional: 0 }),
    ],
  },
  {
    question: "How much does gender play a role in who you find sexually attractive?",
    options: [
      opt("It's the primary factor — I'm attracted to specific gender presentations.", {
        attraction: 2,
        identity: 2,
      }),
      opt("It matters, but it's not the only thing.", { attraction: 3, fluidity: 1 }),
      opt("It's one factor among many — personality, intelligence, humor matter more.", {
        attraction: 3,
        fluidity: 2,
      }),
      opt("Gender is almost irrelevant to my attraction.", { attraction: 4, fluidity: 3 }),
      opt("I'm specifically attracted to gender nonconformity or androgyny.", {
        attraction: 4,
        fluidity: 3,
        identity: 3,
      }),
      opt("I don't experience sexual attraction in a way that involves gender.", { attraction: 0 }),
    ],
  },
  {
    question:
      "If all social judgment were removed — no one would ever know — would your behavior change?",
    context: "The gap between desire and behavior often reveals internalized social pressure.",
    options: [
      opt("No — my behavior already matches my desires.", { identity: 1, behavior: 1 }),
      opt("I might explore a little more, but nothing dramatic.", { fluidity: 2, behavior: 2 }),
      opt("Yes — I'd probably explore same-gender experiences.", {
        fluidity: 3,
        behavior: 3,
        fantasy: 3,
      }),
      opt("I'd be more open about my existing same-gender attractions.", {
        identity: 4,
        behavior: 4,
        fluidity: 2,
      }),
      opt("I'd be more publicly visible about my orientation.", { identity: 5, behavior: 5 }),
      opt("Social judgment doesn't really factor into my sexual decisions.", {
        identity: 3,
        fluidity: 1,
      }),
    ],
  },
  {
    question: "When you experience jealousy, it's most triggered by...",
    context:
      "Jealousy patterns can reveal attraction patterns we haven't consciously acknowledged.",
    options: [
      opt("My partner being close to someone of a different gender.", {
        attraction: 2,
        emotional: 1,
      }),
      opt("My partner being close to someone of the same gender.", { attraction: 4, emotional: 5 }),
      opt("My partner being close to anyone — gender doesn't matter.", {
        emotional: 3,
        attraction: 3,
      }),
      opt("I don't really experience jealousy.", { emotional: 1 }),
      opt("Emotional intimacy with others bothers me more than physical.", {
        emotional: 4,
        attraction: 3,
      }),
      opt("Physical intimacy with others bothers me more than emotional.", {
        attraction: 3,
        behavior: 3,
      }),
    ],
  },
  {
    question: "Your relationship to your own body and gender expression is...",
    context: "Gender identity and sexual orientation are distinct but often interrelated.",
    options: [
      opt("I'm comfortable with my assigned gender and express it conventionally.", {
        identity: 1,
      }),
      opt("I'm comfortable with my gender but enjoy playing with expression.", {
        identity: 2,
        fluidity: 1,
      }),
      opt("I sometimes feel my gender expression doesn't match expectations.", {
        identity: 3,
        fluidity: 2,
      }),
      opt("Gender feels like a spectrum to me — I exist somewhere in the middle.", {
        identity: 4,
        fluidity: 3,
      }),
      opt("My gender identity is different from what was assigned at birth.", {
        identity: 4,
        fluidity: 2,
      }),
      opt("I don't think about gender much — it's not central to who I am.", {
        identity: 3,
        fluidity: 1,
      }),
    ],
  },
  {
    question:
      "In your private fantasies (the ones you'd never share), the recurring theme involves...",
    context: "Private fantasy is often the most unfiltered window into desire.",
    options: [
      opt("Exclusively opposite-gender scenarios.", { fantasy: 1 }),
      opt("Mostly opposite-gender, with occasional same-gender elements.", {
        fantasy: 2,
        fluidity: 2,
      }),
      opt("A mix — gender varies depending on mood or context.", { fantasy: 4, fluidity: 3 }),
      opt("Mostly or exclusively same-gender scenarios.", { fantasy: 6 }),
      opt("The focus isn't on gender — it's on power, connection, or sensation.", {
        fantasy: 3,
        emotional: 2,
      }),
      opt("I don't have sexual fantasies, or they're very rare.", { fantasy: 0 }),
    ],
  },
  {
    question: "How do you feel about the concept of sexual orientation labels?",
    options: [
      opt("My label fits perfectly — straight, and that's clear.", { identity: 1 }),
      opt("My label fits perfectly — gay/lesbian, and that's clear.", { identity: 6 }),
      opt("Labels are useful shorthand, but mine doesn't capture everything.", {
        identity: 3,
        fluidity: 2,
      }),
      opt("I actively resist labels — they feel limiting.", { identity: 3, fluidity: 4 }),
      opt("I've changed my label at least once as I've learned more about myself.", {
        identity: 3,
        fluidity: 4,
      }),
      opt("I use 'queer' as an umbrella because nothing else fits.", { identity: 4, fluidity: 3 }),
    ],
  },
  {
    question:
      "If you could design your ideal intimate life with zero constraints, it would include...",
    options: [
      opt("One committed partner of a different gender.", {
        behavior: 1,
        emotional: 1,
        identity: 1,
      }),
      opt("One committed partner of the same gender.", { behavior: 6, emotional: 6, identity: 6 }),
      opt("One committed partner — gender isn't the deciding factor.", {
        behavior: 3,
        emotional: 4,
        fluidity: 2,
      }),
      opt("Multiple partners across the gender spectrum.", {
        behavior: 4,
        fluidity: 4,
        attraction: 4,
      }),
      opt("Deep emotional intimacy with minimal sexual component.", {
        emotional: 5,
        behavior: 0,
        fantasy: 0,
      }),
      opt("Freedom to explore without commitment to any pattern.", {
        fluidity: 5,
        behavior: 3,
        identity: 3,
      }),
    ],
  },
  {
    question:
      "Looking at your life as a whole — past, present, and imagined future — your sexuality is best described as...",
    context: "Integration question — how all dimensions come together in your self-understanding.",
    options: [
      opt("A straight line — clear, consistent, no deviation.", { identity: 1, fluidity: 0 }),
      opt("Mostly straight with some interesting footnotes.", { identity: 2, fluidity: 2 }),
      opt("A rich, complex landscape that defies simple categories.", { identity: 3, fluidity: 4 }),
      opt("A journey of discovery — I've learned a lot about myself.", {
        identity: 4,
        fluidity: 3,
      }),
      opt("Clear and consistent — I'm gay/lesbian and always have been.", {
        identity: 6,
        fluidity: 0,
      }),
      opt("Still unfolding — and I'm at peace with that.", { identity: 3, fluidity: 5 }),
    ],
  },
];

interface Archetype {
  name: string;
  title: string;
  description: string;
  note: string;
}

function getArchetype(scores: Record<Dimension, number>): Archetype {
  const { attraction, behavior, identity, fantasy, emotional, fluidity } = scores;
  const total = attraction + behavior + identity + fantasy + emotional;
  const avg = total / 5;

  if (fluidity >= 20) {
    return {
      name: "The River",
      title: "Sexually Fluid",
      description:
        "Your sexuality is a living, evolving force. You don't fit neatly into categories because you're not meant to. Lisa Diamond's research confirms what you already know: attraction is dynamic, contextual, and beautifully unpredictable. You respond to people, not categories.",
      note: "Fluidity is not confusion — it's range. Research shows fluid individuals often have higher emotional intelligence and adaptability in relationships.",
    };
  }

  if (avg <= 1 && emotional <= 2) {
    return {
      name: "The Sovereign",
      title: "Asexual Spectrum",
      description:
        "Sexual attraction isn't your primary operating system — and that's not a deficit, it's a different architecture. You may experience deep emotional bonds, aesthetic appreciation, or romantic feelings without the sexual component that society assumes is universal.",
      note: "Asexuality is a valid orientation, not a disorder. The ace spectrum includes demisexual, graysexual, and aromantic identities. You're in good company — an estimated 1-4% of the population shares this experience.",
    };
  }

  if (avg <= 2) {
    if (fluidity >= 10) {
      return {
        name: "The Explorer",
        title: "Heteroflexible",
        description:
          "Your core attraction pattern is heterosexual, but you have an intellectual and emotional openness that allows for curiosity beyond rigid categories. You might not act on every attraction, but you don't deny them either. This is increasingly common — and increasingly acknowledged.",
        note: "The 'mostly straight' category is the fastest-growing sexual identity among young adults. It reflects honesty, not confusion.",
      };
    }
    return {
      name: "The Compass",
      title: "Heterosexual",
      description:
        "Your attraction, behavior, identity, and fantasy all point in the same direction — toward people of a different gender. This consistency across dimensions suggests a clear, stable orientation. There's nothing to prove and nothing to question unless you want to.",
      note: "Heterosexuality exists on a spectrum too. Kinsey found that even among those who identified as exclusively heterosexual, many reported some degree of same-sex attraction or fantasy.",
    };
  }

  if (avg >= 2.5 && avg <= 4.5) {
    if (emotional >= fantasy + 3) {
      return {
        name: "The Bridge",
        title: "Biromantic",
        description:
          "Your emotional bonds cross gender lines more readily than your sexual attractions. You fall in love with souls, not bodies — though the body matters too. Your romantic and sexual orientations may not perfectly align, and that's a feature, not a bug.",
        note: "Split attraction (different romantic vs sexual orientation) is well-documented in sexology research. It's more common than most people realize.",
      };
    }
    if (fantasy > emotional + 3) {
      return {
        name: "The Dreamer",
        title: "Bisexual (Fantasy-Led)",
        description:
          "Your fantasy life is richer and more expansive than your behavioral history. You imagine across the gender spectrum even if you haven't fully explored it in practice. This gap between fantasy and behavior is one of the most common patterns in human sexuality.",
        note: "Fantasy is not obligation. Many people have rich bisexual fantasy lives within monogamous, single-gender relationships — and that's perfectly healthy.",
      };
    }
    if (Math.abs(attraction - behavior) >= 4) {
      return {
        name: "The Unspoken",
        title: "Bisexual (Unexpressed)",
        description:
          "There's a meaningful gap between what you feel and what you've acted on. This isn't hypocrisy — it's the reality of living in a world that often makes certain expressions of desire more costly than others. Your attractions are valid whether or not they've been expressed.",
        note: "The gap between desire and behavior is one of the most studied phenomena in sexology. Social context, opportunity, and safety all shape what we express.",
      };
    }
    return {
      name: "The Spectrum",
      title: "Bisexual / Pansexual",
      description:
        "You experience attraction across the gender spectrum — in your desires, your behavior, your emotional bonds, and your self-concept. This is one of the most common human experiences, though it's historically been the most invisible. You see people, not categories.",
      note: "Bisexuality is the largest non-heterosexual orientation category. Research consistently shows it's stable, valid, and not 'a phase.'",
    };
  }

  if (avg >= 5) {
    if (fluidity >= 10) {
      return {
        name: "The Anchor",
        title: "Homoflexible",
        description:
          "Your core orientation is toward the same gender, with occasional openness to other experiences. You know who you are — and you also know that human sexuality occasionally surprises even the most self-aware among us.",
        note: "Homoflexibility is the mirror of heteroflexibility — a predominantly same-gender orientation with occasional exceptions. It's increasingly recognized as its own valid category.",
      };
    }
    return {
      name: "The Lighthouse",
      title: "Gay / Lesbian",
      description:
        "Your attraction, behavior, identity, and emotional bonds all orient toward the same gender. This consistency across all six dimensions suggests a clear, integrated sense of self. You know who you are, and that clarity is a form of power.",
      note: "Same-gender orientation has been documented across every culture and every era of human history. It's not a modern invention — it's a human constant.",
    };
  }

  if (avg >= 4) {
    return {
      name: "The Current",
      title: "Predominantly Same-Gender Attracted",
      description:
        "Your primary pull is toward the same gender, with enough variation across dimensions to suggest complexity rather than rigidity. You may identify as gay, queer, or something else entirely — the label matters less than the lived experience.",
      note: "Many people in this range find that 'queer' captures their experience better than more specific labels. The word itself means 'not fitting neatly' — which is its own kind of clarity.",
    };
  }

  return {
    name: "The Mosaic",
    title: "Predominantly Different-Gender Attracted",
    description:
      "Your primary orientation is toward a different gender, but your profile shows enough variation across dimensions to suggest you're more complex than a simple label captures. You might call yourself straight, bi-curious, or just human.",
    note: "This is one of the most common profiles — and one of the least discussed. Many people experience some degree of same-gender attraction without it becoming central to their identity.",
  };
}

export function FindYourSexualityQuiz() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (score: Partial<Record<Dimension, number>>) => {
    const next = { ...scores };
    for (const dim in score) next[dim as Dimension] += score[dim as Dimension] ?? 0;
    setScores(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setPhase("results");
  };

  useEffect(() => {
    if (phase === "results") markComplete("find-your-sexuality");
  }, [phase, markComplete]);

  const archetype = getArchetype(scores);
  const progress = QUESTIONS.length > 0 ? Math.round((step / QUESTIONS.length) * 100) : 0;

  return (
    <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-8 py-8 text-center font-sans text-[#2C1810]">
      <ThemedBackground theme="sexuality" />

      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Sexuality"
          subtitle="The body knows what the mind is still debating."
          description="A thoughtful, research-informed exploration of desire, identity, and intimacy. This assessment maps your relationship with your own sexuality across multiple dimensions — without judgment, without labels, without the noise. Just honest questions and honest answers."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 7 }}
          whatYouGet={[
            "Your sexuality profile across six dimensions",
            "Understanding of your desire patterns and intimacy style",
            "Insight into the relationship between identity and expression",
            "Resources for deeper exploration",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("questions")}
        />
      )}

      {phase === "questions" && (
        <div className="relative z-1 w-full max-w-2xl">
          <div className="mb-8">
            <div className="mb-2 font-mono text-[0.7rem] tracking-[0.08em] text-[#8B7B6B]">
              QUESTION {step + 1} OF {QUESTIONS.length}
            </div>
            <div className="h-0.5 overflow-hidden rounded-full bg-[#C97B7B]/15">
              <div
                className="h-full bg-[#C97B7B] transition-[width] duration-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="mb-2 font-heading text-2xl leading-[1.3]">{QUESTIONS[step].question}</h2>
          {QUESTIONS[step].context && (
            <p className="mb-6 text-[0.78rem] leading-relaxed text-[#8B7B6B] italic">
              {QUESTIONS[step].context}
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            {QUESTIONS[step].options.map((option) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(option.score)}
                className="block w-full rounded-sm border border-[#C97B7B]/30 bg-transparent px-5 py-3.5 text-left text-[0.95rem] leading-snug transition-all hover:border-[#C97B7B] hover:bg-[#C97B7B]/8"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && (
        <EmailGate assessmentSlug="sexuality" onUnlock={() => setEmailGated(true)} />
      )}

      {phase === "results" && emailGated && (
        <div className="relative z-1 w-full max-w-2xl">
          <div className="mb-2 font-mono text-[0.7rem] tracking-[0.12em] text-[#C97B7B] uppercase">
            Your Profile
          </div>
          <h2 className="mb-1 font-heading text-4xl text-brand-gold">{archetype.name}</h2>
          <div className="mb-6 font-mono text-[0.82rem] tracking-[0.05em] text-[#C97B7B]">
            {archetype.title}
          </div>
          <p className="mb-8 text-base leading-relaxed">{archetype.description}</p>

          <div className="mb-8">
            <AssessmentRadarChart scores={scores} max={30} accentColor={RESULT_ACCENT} />
          </div>

          <div className="mb-8 grid grid-cols-3 gap-3">
            {DIMENSIONS.map((dim) => (
              <div key={dim} className="rounded-md border border-[#C97B7B]/15 p-2.5 text-center">
                <div className="mb-0.5 font-mono text-[0.6rem] tracking-[0.08em] text-[#5A4A3A] uppercase">
                  {dim}
                </div>
                <div className="font-heading text-xl text-brand-gold">{scores[dim]}</div>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-lg border border-[#C97B7B]/15 bg-[#C97B7B]/4 p-5 text-left">
            <div className="mb-2 font-mono text-[0.65rem] tracking-[0.08em] text-[#C97B7B] uppercase">
              Research Note
            </div>
            <p className="m-0 text-sm leading-relaxed text-[#4A3A2A]">{archetype.note}</p>
          </div>

          <p className="mx-auto mb-8 max-w-125 text-[0.78rem] leading-relaxed text-[#4A3A2A] italic">
            This assessment is a reflection tool, not a diagnosis. Sexual orientation is complex,
            personal, and can evolve over a lifetime. If you&apos;re exploring your identity,
            consider speaking with a qualified therapist who specializes in sexuality and gender.
          </p>

          <div className="mt-4 border-t border-black/10 pt-8">
            <JourneyTracker variant="light" currentAssessmentId="find-your-sexuality" />
          </div>
        </div>
      )}
      <WhatsNext />
    </div>
  );
}
