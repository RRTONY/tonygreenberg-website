/**
 * FIND YOUR SEXUALITY
 *
 * A nuanced, research-backed exploration of sexual identity across 6 dimensions:
 * Attraction, Behavior, Identity, Fantasy, Emotional Bonding, and Fluidity.
 * Based on the Klein Sexual Orientation Grid (1978), Kinsey Scale (1948),
 * and modern sexology research from Lisa Diamond (2008) and Sari van Anders (2015).
 *
 * This is NOT a binary test. It maps a spectrum across multiple axes.
 * 16 questions, 6 dimensions, 12 archetypes.
 */
import React, { useState, useEffect, useMemo } from "react";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const ASSESSMENT_ID = "find-your-sexuality";
const LOCAL_STORAGE_KEY = "sexuality_results";

/* ── Dimensions ── */
type Scores = {
  attraction: number;
  behavior: number;
  identity: number;
  fantasy: number;
  emotional: number;
  fluidity: number;
};

const emptyScores = (): Scores => ({
  attraction: 0,
  behavior: 0,
  identity: 0,
  fantasy: 0,
  emotional: 0,
  fluidity: 0,
});

/* ── Questions ── */
const questions: {
  question: string;
  context?: string;
  options: { text: string; score: Partial<Scores> }[];
}[] = [
  {
    question: "When you notice someone across a room, what draws your attention?",
    context: "Based on the Klein Sexual Orientation Grid — attraction operates independently of behavior.",
    options: [
      { text: "I'm drawn almost exclusively to people of a different gender than mine.", score: { attraction: 1 } },
      { text: "Mostly a different gender, but occasionally someone of the same gender catches my eye.", score: { attraction: 2, fluidity: 1 } },
      { text: "Gender isn't the primary filter — I notice energy, presence, confidence.", score: { attraction: 4, fluidity: 2 } },
      { text: "I'm drawn mostly to people of the same gender.", score: { attraction: 5 } },
      { text: "I'm drawn exclusively to people of the same gender.", score: { attraction: 6 } },
      { text: "I rarely experience this kind of pull toward anyone.", score: { attraction: 0, emotional: 2 } },
    ],
  },
  {
    question: "Think about your most intense crush — the one that kept you up at night. Who was it?",
    context: "Fantasy and desire often reveal patterns that social conditioning suppresses.",
    options: [
      { text: "Always someone of a different gender.", score: { fantasy: 1, attraction: 1 } },
      { text: "Usually a different gender, but I've had at least one same-gender crush that surprised me.", score: { fantasy: 2, fluidity: 2, attraction: 2 } },
      { text: "It's been pretty evenly split across genders.", score: { fantasy: 4, attraction: 4, fluidity: 1 } },
      { text: "Mostly same-gender, with rare exceptions.", score: { fantasy: 5, attraction: 5 } },
      { text: "Exclusively same-gender.", score: { fantasy: 6, attraction: 6 } },
      { text: "My intense connections aren't really about gender — they're about the person's mind.", score: { fantasy: 3, emotional: 3, fluidity: 2 } },
    ],
  },
  {
    question: "In your actual sexual experiences, your partners have been...",
    context: "Behavior and attraction don't always align — and that's normal. (Kinsey, 1948)",
    options: [
      { text: "Exclusively a different gender.", score: { behavior: 1 } },
      { text: "Mostly a different gender, with some same-gender experiences.", score: { behavior: 2, fluidity: 1 } },
      { text: "A mix of genders, roughly equal.", score: { behavior: 4, fluidity: 1 } },
      { text: "Mostly the same gender.", score: { behavior: 5 } },
      { text: "Exclusively the same gender.", score: { behavior: 6 } },
      { text: "I haven't had sexual experiences, or they don't define my orientation.", score: { behavior: 0, identity: 1 } },
    ],
  },
  {
    question: "When you imagine your ideal long-term partner, what comes to mind?",
    context: "Emotional bonding patterns often differ from sexual attraction patterns.",
    options: [
      { text: "A partner of a different gender — that's always been the picture.", score: { emotional: 1, identity: 1 } },
      { text: "Probably a different gender, but I wouldn't rule anything out.", score: { emotional: 2, fluidity: 2, identity: 2 } },
      { text: "Gender genuinely doesn't factor in — I imagine a person, not a gender.", score: { emotional: 4, identity: 4, fluidity: 2 } },
      { text: "A same-gender partner feels most natural.", score: { emotional: 5, identity: 5 } },
      { text: "Exclusively same-gender — anything else would feel wrong.", score: { emotional: 6, identity: 6 } },
      { text: "I don't really imagine a long-term partner. I'm complete on my own.", score: { emotional: 0, identity: 0 } },
    ],
  },
  {
    question: "How would you describe your sexual orientation to a trusted friend?",
    context: "Self-identification is the most personal dimension — and often the last to shift.",
    options: [
      { text: "Straight / heterosexual — no ambiguity.", score: { identity: 1 } },
      { text: "Mostly straight, but I'm open-minded.", score: { identity: 2, fluidity: 1 } },
      { text: "Bisexual, pansexual, or queer — I'm attracted to more than one gender.", score: { identity: 4, fluidity: 1 } },
      { text: "Gay or lesbian — that's who I am.", score: { identity: 6 } },
      { text: "I don't love labels. I just like who I like.", score: { identity: 3, fluidity: 3 } },
      { text: "Asexual or on the ace spectrum — sexual attraction isn't really my thing.", score: { identity: 0, emotional: 2 } },
    ],
  },
  {
    question: "Has your sense of who you're attracted to changed over time?",
    context: "Lisa Diamond's research (2008) shows sexual fluidity is common and normal, especially in women — but not only in women.",
    options: [
      { text: "No — I've always known exactly who I'm attracted to.", score: { fluidity: 0 } },
      { text: "Slightly — my tastes have evolved but the core hasn't shifted.", score: { fluidity: 1 } },
      { text: "Yes — there was a clear shift at some point in my life.", score: { fluidity: 3 } },
      { text: "It's been an ongoing evolution. I'm different now than I was 5 years ago.", score: { fluidity: 4 } },
      { text: "It changes depending on the person, the context, the phase of life.", score: { fluidity: 5 } },
      { text: "I'm still figuring it out — and that's okay.", score: { fluidity: 4, identity: 3 } },
    ],
  },
  {
    question: "When consuming media (films, books, art), which romantic or sexual scenarios resonate most?",
    context: "Fantasy is often the most honest dimension — free from social performance.",
    options: [
      { text: "Opposite-gender romance and intimacy.", score: { fantasy: 1 } },
      { text: "Mostly opposite-gender, but same-gender stories intrigue me.", score: { fantasy: 2, fluidity: 1 } },
      { text: "I'm drawn to compelling chemistry regardless of the genders involved.", score: { fantasy: 4, fluidity: 1 } },
      { text: "Same-gender stories feel most authentic to me.", score: { fantasy: 5 } },
      { text: "I'm more interested in emotional depth than the sexual component.", score: { fantasy: 3, emotional: 3 } },
      { text: "I don't really connect with romantic or sexual media.", score: { fantasy: 0 } },
    ],
  },
  {
    question: "In your deepest emotional bonds — the ones that feel like home — the pattern is...",
    context: "Emotional orientation can differ from sexual orientation. (van Anders, 2015)",
    options: [
      { text: "My deepest bonds are with a different gender, and they're romantic.", score: { emotional: 1 } },
      { text: "My deepest bonds are with the same gender, but they're platonic.", score: { emotional: 2 } },
      { text: "My deepest bonds cross gender lines — some romantic, some not.", score: { emotional: 3, fluidity: 1 } },
      { text: "My most intense emotional connections have been with the same gender.", score: { emotional: 5 } },
      { text: "I bond deeply with people regardless of gender — it's about the soul.", score: { emotional: 4, fluidity: 2 } },
      { text: "I keep emotional distance from everyone. Deep bonds are rare for me.", score: { emotional: 0 } },
    ],
  },
  {
    question: "How much does gender play a role in who you find sexually attractive?",
    options: [
      { text: "It's the primary factor — I'm attracted to specific gender presentations.", score: { attraction: 2, identity: 2 } },
      { text: "It matters, but it's not the only thing.", score: { attraction: 3, fluidity: 1 } },
      { text: "It's one factor among many — personality, intelligence, humor matter more.", score: { attraction: 3, fluidity: 2 } },
      { text: "Gender is almost irrelevant to my attraction.", score: { attraction: 4, fluidity: 3 } },
      { text: "I'm specifically attracted to gender nonconformity or androgyny.", score: { attraction: 4, fluidity: 3, identity: 3 } },
      { text: "I don't experience sexual attraction in a way that involves gender.", score: { attraction: 0 } },
    ],
  },
  {
    question: "If all social judgment were removed — no one would ever know — would your behavior change?",
    context: "The gap between desire and behavior often reveals internalized social pressure.",
    options: [
      { text: "No — my behavior already matches my desires.", score: { identity: 1, behavior: 1 } },
      { text: "I might explore a little more, but nothing dramatic.", score: { fluidity: 2, behavior: 2 } },
      { text: "Yes — I'd probably explore same-gender experiences.", score: { fluidity: 3, behavior: 3, fantasy: 3 } },
      { text: "I'd be more open about my existing same-gender attractions.", score: { identity: 4, behavior: 4, fluidity: 2 } },
      { text: "I'd be more publicly visible about my orientation.", score: { identity: 5, behavior: 5 } },
      { text: "Social judgment doesn't really factor into my sexual decisions.", score: { identity: 3, fluidity: 1 } },
    ],
  },
  {
    question: "When you experience jealousy, it's most triggered by...",
    context: "Jealousy patterns can reveal attraction patterns we haven't consciously acknowledged.",
    options: [
      { text: "My partner being close to someone of a different gender.", score: { attraction: 2, emotional: 1 } },
      { text: "My partner being close to someone of the same gender.", score: { attraction: 4, emotional: 5 } },
      { text: "My partner being close to anyone — gender doesn't matter.", score: { emotional: 3, attraction: 3 } },
      { text: "I don't really experience jealousy.", score: { emotional: 1 } },
      { text: "Emotional intimacy with others bothers me more than physical.", score: { emotional: 4, attraction: 3 } },
      { text: "Physical intimacy with others bothers me more than emotional.", score: { attraction: 3, behavior: 3 } },
    ],
  },
  {
    question: "Your relationship to your own body and gender expression is...",
    context: "Gender identity and sexual orientation are distinct but often interrelated.",
    options: [
      { text: "I'm comfortable with my assigned gender and express it conventionally.", score: { identity: 1 } },
      { text: "I'm comfortable with my gender but enjoy playing with expression.", score: { identity: 2, fluidity: 1 } },
      { text: "I sometimes feel my gender expression doesn't match expectations.", score: { identity: 3, fluidity: 2 } },
      { text: "Gender feels like a spectrum to me — I exist somewhere in the middle.", score: { identity: 4, fluidity: 3 } },
      { text: "My gender identity is different from what was assigned at birth.", score: { identity: 4, fluidity: 2 } },
      { text: "I don't think about gender much — it's not central to who I am.", score: { identity: 3, fluidity: 1 } },
    ],
  },
  {
    question: "In your private fantasies (the ones you'd never share), the recurring theme involves...",
    context: "Private fantasy is often the most unfiltered window into desire.",
    options: [
      { text: "Exclusively opposite-gender scenarios.", score: { fantasy: 1 } },
      { text: "Mostly opposite-gender, with occasional same-gender elements.", score: { fantasy: 2, fluidity: 2 } },
      { text: "A mix — gender varies depending on mood or context.", score: { fantasy: 4, fluidity: 3 } },
      { text: "Mostly or exclusively same-gender scenarios.", score: { fantasy: 6 } },
      { text: "The focus isn't on gender — it's on power, connection, or sensation.", score: { fantasy: 3, emotional: 2 } },
      { text: "I don't have sexual fantasies, or they're very rare.", score: { fantasy: 0 } },
    ],
  },
  {
    question: "How do you feel about the concept of sexual orientation labels?",
    options: [
      { text: "My label fits perfectly — straight, and that's clear.", score: { identity: 1 } },
      { text: "My label fits perfectly — gay/lesbian, and that's clear.", score: { identity: 6 } },
      { text: "Labels are useful shorthand, but mine doesn't capture everything.", score: { identity: 3, fluidity: 2 } },
      { text: "I actively resist labels — they feel limiting.", score: { identity: 3, fluidity: 4 } },
      { text: "I've changed my label at least once as I've learned more about myself.", score: { identity: 3, fluidity: 4 } },
      { text: "I use 'queer' as an umbrella because nothing else fits.", score: { identity: 4, fluidity: 3 } },
    ],
  },
  {
    question: "If you could design your ideal intimate life with zero constraints, it would include...",
    options: [
      { text: "One committed partner of a different gender.", score: { behavior: 1, emotional: 1, identity: 1 } },
      { text: "One committed partner of the same gender.", score: { behavior: 6, emotional: 6, identity: 6 } },
      { text: "One committed partner — gender isn't the deciding factor.", score: { behavior: 3, emotional: 4, fluidity: 2 } },
      { text: "Multiple partners across the gender spectrum.", score: { behavior: 4, fluidity: 4, attraction: 4 } },
      { text: "Deep emotional intimacy with minimal sexual component.", score: { emotional: 5, behavior: 0, fantasy: 0 } },
      { text: "Freedom to explore without commitment to any pattern.", score: { fluidity: 5, behavior: 3, identity: 3 } },
    ],
  },
  {
    question: "Looking at your life as a whole — past, present, and imagined future — your sexuality is best described as...",
    context: "Integration question — how all dimensions come together in your self-understanding.",
    options: [
      { text: "A straight line — clear, consistent, no deviation.", score: { identity: 1, fluidity: 0 } },
      { text: "Mostly straight with some interesting footnotes.", score: { identity: 2, fluidity: 2 } },
      { text: "A rich, complex landscape that defies simple categories.", score: { identity: 3, fluidity: 4 } },
      { text: "A journey of discovery — I've learned a lot about myself.", score: { identity: 4, fluidity: 3 } },
      { text: "Clear and consistent — I'm gay/lesbian and always have been.", score: { identity: 6, fluidity: 0 } },
      { text: "Still unfolding — and I'm at peace with that.", score: { identity: 3, fluidity: 5 } },
    ],
  },
];

/* ── Archetypes ── */
interface Archetype {
  name: string;
  title: string;
  description: string;
  note: string;
}

function getArchetype(scores: Scores): Archetype {
  const { attraction, behavior, identity, fantasy, emotional, fluidity } = scores;
  const total = attraction + behavior + identity + fantasy + emotional;
  const avg = total / 5;

  // High fluidity overrides
  if (fluidity >= 20) {
    return {
      name: "The River",
      title: "Sexually Fluid",
      description: "Your sexuality is a living, evolving force. You don't fit neatly into categories because you're not meant to. Lisa Diamond's research confirms what you already know: attraction is dynamic, contextual, and beautifully unpredictable. You respond to people, not categories.",
      note: "Fluidity is not confusion — it's range. Research shows fluid individuals often have higher emotional intelligence and adaptability in relationships.",
    };
  }

  // Very low across all dimensions
  if (avg <= 1 && emotional <= 2) {
    return {
      name: "The Sovereign",
      title: "Asexual Spectrum",
      description: "Sexual attraction isn't your primary operating system — and that's not a deficit, it's a different architecture. You may experience deep emotional bonds, aesthetic appreciation, or romantic feelings without the sexual component that society assumes is universal.",
      note: "Asexuality is a valid orientation, not a disorder. The ace spectrum includes demisexual, graysexual, and aromantic identities. You're in good company — an estimated 1-4% of the population shares this experience.",
    };
  }

  // Predominantly heterosexual
  if (avg <= 2) {
    if (fluidity >= 10) {
      return {
        name: "The Explorer",
        title: "Heteroflexible",
        description: "Your core attraction pattern is heterosexual, but you have an intellectual and emotional openness that allows for curiosity beyond rigid categories. You might not act on every attraction, but you don't deny them either. This is increasingly common — and increasingly acknowledged.",
        note: "The 'mostly straight' category is the fastest-growing sexual identity among young adults. It reflects honesty, not confusion.",
      };
    }
    return {
      name: "The Compass",
      title: "Heterosexual",
      description: "Your attraction, behavior, identity, and fantasy all point in the same direction — toward people of a different gender. This consistency across dimensions suggests a clear, stable orientation. There's nothing to prove and nothing to question unless you want to.",
      note: "Heterosexuality exists on a spectrum too. Kinsey found that even among those who identified as exclusively heterosexual, many reported some degree of same-sex attraction or fantasy.",
    };
  }

  // Bisexual spectrum (middle range)
  if (avg >= 2.5 && avg <= 4.5) {
    if (emotional >= fantasy + 3) {
      return {
        name: "The Bridge",
        title: "Biromantic",
        description: "Your emotional bonds cross gender lines more readily than your sexual attractions. You fall in love with souls, not bodies — though the body matters too. Your romantic and sexual orientations may not perfectly align, and that's a feature, not a bug.",
        note: "Split attraction (different romantic vs sexual orientation) is well-documented in sexology research. It's more common than most people realize.",
      };
    }
    if (fantasy > emotional + 3) {
      return {
        name: "The Dreamer",
        title: "Bisexual (Fantasy-Led)",
        description: "Your fantasy life is richer and more expansive than your behavioral history. You imagine across the gender spectrum even if you haven't fully explored it in practice. This gap between fantasy and behavior is one of the most common patterns in human sexuality.",
        note: "Fantasy is not obligation. Many people have rich bisexual fantasy lives within monogamous, single-gender relationships — and that's perfectly healthy.",
      };
    }
    if (Math.abs(attraction - behavior) >= 4) {
      return {
        name: "The Unspoken",
        title: "Bisexual (Unexpressed)",
        description: "There's a meaningful gap between what you feel and what you've acted on. This isn't hypocrisy — it's the reality of living in a world that often makes certain expressions of desire more costly than others. Your attractions are valid whether or not they've been expressed.",
        note: "The gap between desire and behavior is one of the most studied phenomena in sexology. Social context, opportunity, and safety all shape what we express.",
      };
    }
    return {
      name: "The Spectrum",
      title: "Bisexual / Pansexual",
      description: "You experience attraction across the gender spectrum — in your desires, your behavior, your emotional bonds, and your self-concept. This is one of the most common human experiences, though it's historically been the most invisible. You see people, not categories.",
      note: "Bisexuality is the largest non-heterosexual orientation category. Research consistently shows it's stable, valid, and not 'a phase.'",
    };
  }

  // Predominantly homosexual
  if (avg >= 5) {
    if (fluidity >= 10) {
      return {
        name: "The Anchor",
        title: "Homoflexible",
        description: "Your core orientation is toward the same gender, with occasional openness to other experiences. You know who you are — and you also know that human sexuality occasionally surprises even the most self-aware among us.",
        note: "Homoflexibility is the mirror of heteroflexibility — a predominantly same-gender orientation with occasional exceptions. It's increasingly recognized as its own valid category.",
      };
    }
    return {
      name: "The Lighthouse",
      title: "Gay / Lesbian",
      description: "Your attraction, behavior, identity, and emotional bonds all orient toward the same gender. This consistency across all six dimensions suggests a clear, integrated sense of self. You know who you are, and that clarity is a form of power.",
      note: "Same-gender orientation has been documented across every culture and every era of human history. It's not a modern invention — it's a human constant.",
    };
  }

  // Moderate same-gender leaning
  if (avg >= 4) {
    return {
      name: "The Current",
      title: "Predominantly Same-Gender Attracted",
      description: "Your primary pull is toward the same gender, with enough variation across dimensions to suggest complexity rather than rigidity. You may identify as gay, queer, or something else entirely — the label matters less than the lived experience.",
      note: "Many people in this range find that 'queer' captures their experience better than more specific labels. The word itself means 'not fitting neatly' — which is its own kind of clarity.",
    };
  }

  // Moderate different-gender leaning
  return {
    name: "The Mosaic",
    title: "Predominantly Different-Gender Attracted",
    description: "Your primary orientation is toward a different gender, but your profile shows enough variation across dimensions to suggest you're more complex than a simple label captures. You might call yourself straight, bi-curious, or just human.",
    note: "This is one of the most common profiles — and one of the least discussed. Many people experience some degree of same-gender attraction without it becoming central to their identity.",
  };
}

/* ── Radar Chart ── */
function RadarChart({ scores }: { scores: Scores }) {
  const dims = ["Attraction", "Behavior", "Identity", "Fantasy", "Emotional", "Fluidity"];
  const size = 200;
  const center = size / 2;
  const maxVal = 30; // rough max per dimension

  const points = dims.map((dim, i) => {
    const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
    const val = scores[dim.toLowerCase() as keyof Scores] || 0;
    const r = (val / maxVal) * (center - 20);
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: "0 auto", display: "block" }}>
      {/* Grid */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={dims
            .map((_, i) => {
              const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
              const r = level * (center - 20);
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(212,185,106,0.15)"
          strokeWidth="0.5"
        />
      ))}
      {/* Axes */}
      {dims.map((dim, i) => {
        const angle = (i / dims.length) * 2 * Math.PI - Math.PI / 2;
        const x2 = center + (center - 20) * Math.cos(angle);
        const y2 = center + (center - 20) * Math.sin(angle);
        const lx = center + (center - 5) * Math.cos(angle);
        const ly = center + (center - 5) * Math.sin(angle);
        return (
          <g key={dim}>
            <line x1={center} y1={center} x2={x2} y2={y2} stroke="rgba(212,185,106,0.2)" strokeWidth="0.5" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "6px", fill: "#999", fontFamily: "'DM Mono', monospace" }}
            >
              {dim}
            </text>
          </g>
        );
      })}
      {/* Data polygon */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(201,123,123,0.35)"
        stroke="#C97B7B"
        strokeWidth="1.5"
      />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#C97B7B" />
      ))}
    </svg>
  );
}

/* ── Main Component ── */
export default function FindYourSexuality() {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<Scores>[]>([]);
  const [results, setResults] = useState<{ archetype: Archetype; scores: Scores } | null>(null);
  const { markComplete } = useJourneyProgress();

  useEffect(() => {
    if (phase === "results" && results) {
      markComplete(ASSESSMENT_ID);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...results, completedAt: new Date().toISOString() }));
    }
  }, [phase, results, markComplete]);

  const handleAnswer = (score: Partial<Scores>) => {
    const next = [...answers, score];
    setAnswers(next);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate
      const totals = next.reduce<Scores>(
        (acc, s) => {
          for (const k of Object.keys(s) as (keyof Scores)[]) {
            acc[k] = (acc[k] || 0) + (s[k] || 0);
          }
          return acc;
        },
        emptyScores()
      );
      const archetype = getArchetype(totals);
      setResults({ archetype, scores: totals });
      setPhase("results");
    }
  };

  const progress = questions.length > 0 ? Math.round((currentQ / questions.length) * 100) : 0;

  return (
    <>
    <SEO
        title="Find Your Sexuality"
        description="A thoughtful, evidence-based assessment to explore and understand your sexuality."
        path="/find-my/sexuality"
        keywords="Tony Greenberg, sexuality assessment, sexual identity, find my sexuality"
        indexable={true}
      />
      <>
    <ThemedBackground theme="sexuality" />
    <div style={{ position: "relative", minHeight: "100vh" }}>
    <div
      style={{
        backgroundColor: "transparent", position: "relative", zIndex: 1,
        color: "#2C1810",
        fontFamily: "'Source Sans 3', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* ── Landing ── */}
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Sexuality"
          subtitle="The body knows what the mind is still debating."
          description="A thoughtful, research-informed exploration of desire, identity, and intimacy. This assessment maps your relationship with your own sexuality across multiple dimensions — without judgment, without labels, without the noise. Just honest questions and honest answers."
          stats={{ questions: 20, dimensions: 7, minutes: 7 }}
          whatYouGet={["Your sexuality profile across seven dimensions","Understanding of your desire patterns and intimacy style","Insight into the relationship between identity and expression","Resources for deeper exploration"]}
          accentColor="#C2185B"
          onBegin={() => setPhase('questions')}
        />
      )}

      {/* ── Questions ── */}
      {phase === "questions" && (
        <div style={{ width: "100%", maxWidth: "600px" }}>
          {/* Progress */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "#777",
                marginBottom: "0.5rem",
                letterSpacing: "0.08em",
              }}
            >
              QUESTION {currentQ + 1} OF {questions.length}
            </div>
            <div
              style={{
                height: "2px",
                background: "rgba(201,123,123,0.15)",
                borderRadius: "1px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#C97B7B",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              color: "#2C1810",
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            {questions[currentQ].question}
          </h2>

          {questions[currentQ].context && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "#777",
                fontStyle: "italic",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              {questions[currentQ].context}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {questions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.score)}
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "transparent",
                  color: "#2C1810",
                  border: "1px solid rgba(201,123,123,0.3)",
                  padding: "0.9rem 1.2rem",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.4,
                  borderRadius: "4px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C97B7B";
                  e.currentTarget.style.backgroundColor = "rgba(201,123,123,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201,123,123,0.3)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Email Gate ── */}
      {phase === "results" && !emailGated && (
        <EmailGate assessmentName="sexuality profile" onUnlock={() => setEmailGated(true)} />
      )}

      {/* ── Results ── */}
      {phase === "results" && emailGated && results && (
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C97B7B",
              marginBottom: "0.5rem",
            }}
          >
            YOUR PROFILE
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
              color: "#8B6914",
              marginBottom: "0.3rem",
            }}
          >
            {results.archetype.name}
          </h2>

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.82rem",
              color: "#C97B7B",
              marginBottom: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            {results.archetype.title}
          </div>

          <p
            style={{
              color: "#ccc",
              lineHeight: 1.7,
              marginBottom: "2rem",
              fontSize: "1rem",
            }}
          >
            {results.archetype.description}
          </p>

          {/* Radar Chart */}
          <div style={{ marginBottom: "2rem" }}>
            <RadarChart scores={results.scores} />
          </div>

          {/* Dimension Scores */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.8rem",
              marginBottom: "2rem",
            }}
          >
            {(["attraction", "behavior", "identity", "fantasy", "emotional", "fluidity"] as (keyof Scores)[]).map((dim) => (
              <div
                key={dim}
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(201,123,123,0.15)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#5A4A3A",
                    marginBottom: "0.2rem",
                  }}
                >
                  {dim}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    color: "#8B6914",
                  }}
                >
                  {results.scores[dim]}
                </div>
              </div>
            ))}
          </div>

          {/* Research Note */}
          <div
            style={{
              padding: "1.2rem",
              borderRadius: "8px",
              border: "1px solid rgba(201,123,123,0.15)",
              background: "rgba(201,123,123,0.04)",
              marginBottom: "2rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#C97B7B",
                marginBottom: "0.5rem",
              }}
            >
              RESEARCH NOTE
            </div>
            <p style={{ fontSize: "0.9rem", color: "#aaa", lineHeight: 1.6, margin: 0 }}>
              {results.archetype.note}
            </p>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: "0.78rem",
              fontStyle: "italic",
              color: "#4A3A2A",
              maxWidth: "500px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            This assessment is a reflection tool, not a diagnosis. Sexual orientation is complex, personal, and can evolve over a lifetime. If you're exploring your identity, consider speaking with a qualified therapist who specializes in sexuality and gender.
          </p>

          {/* Journey */}
          <div style={{ borderTop: "1px solid #333", paddingTop: "2rem", marginTop: "1rem" }}>
            <JourneyTracker variant="light" />
          </div>
          <WhatsNext />
        </div>
      )}
    </div>
    </div>
    </>
    </>);
}
