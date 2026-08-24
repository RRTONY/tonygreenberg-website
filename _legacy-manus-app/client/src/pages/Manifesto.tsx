/**
 * A LIVING DECLARATION — The Measurement of Becoming
 * 
 * A living declaration: measure how fast people can become their best self,
 * connect them to biochemistry optimization, enable sacred fulfilling abundant life,
 * lowest carbon footprint, reducing GDP dependency, enabling better humanity.
 * 
 * Includes an interactive questionnaire inviting visitors to contribute.
 */

import { useState, useRef } from "react";
import {
  Section,
  FadeIn,
  Divider,
  Spacer,
  Pullquote,
  Eyebrow,
  NextPage,
} from "@/components/Editorial";

import SEO from "@/components/SEO";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/* ── LIVING DECLARATION SECTIONS ── */

const HERO_IMG = "/api/img/titans-collide-love_e2729180.jpeg";
const HAND_IMG = "/api/img/humanos-hand-breakthrough_58c99957.jpeg";

const PRINCIPLES = [
  {
    num: "I",
    title: "Measure the Becoming",
    body: "We believe the most important metric in human history has never been tracked: the speed at which a person becomes their best self. Not productivity. Not output. Not GDP. The velocity of becoming. Every system we build, every index we create, every community we convene exists to compress the distance between who you are and who you're capable of being — and to measure that compression with the same rigor Wall Street applies to quarterly earnings.",
  },
  {
    num: "II",
    title: "Optimize the Vessel",
    body: "Your biochemistry is not a footnote — it's the operating system. Peptides, exosomes, regenerative protocols, psychedelic-assisted therapy, biometric feedback loops with Oura and continuous glucose monitors — these aren't biohacking vanity projects. They're the infrastructure of human potential. You cannot think clearly in a body running on cortisol and seed oils. You cannot love deeply when your nervous system is stuck in fight-or-flight. We connect people to the biochemistry optimization that allows them to lead their most sacred, most fulfilling, most abundant life. Not as luxury. As prerequisite.",
  },
  {
    num: "III",
    title: "Shrink the Footprint, Expand the Soul",
    body: "Here is the heresy that makes economists nervous: the goal is not more GDP. The goal is less. Less extraction. Less waste. Less of the frantic production-consumption cycle that's cooking the planet and hollowing out the species. We're building toward a world where the lowest carbon footprint enables the highest quality of life — where abundance is measured in health, connection, creative output, and time sovereignty, not in units shipped. Every token we mint, every protocol we design, every community we build is oriented toward this inversion: reduce the economic footprint, expand the human one.",
  },
  {
    num: "IV",
    title: "Connect the Dots, Build the Tribe",
    body: "The loneliest generation in human history is also the most connected — digitally. The paradox is the diagnosis. We're not building another social network. We're building the connective tissue for people who've already done the inner work and are ready to find their tribe, their partner, their collaborator, their co-conspirator in building what comes next. Finding your people isn't a feature. It's the foundation. Every great company, every great movement, every great love story started with two people in a room who shouldn't have met but did.",
  },
  {
    num: "V",
    title: "Sacred Accountability",
    body: "We measure everything. Not because measurement is sacred — but because what you measure, you can improve, and what you improve, you can share. The Flow Circuit tracks team performance. The Regenerative Protocol tracks biological optimization. The QPR Index scores intellectual rigor. Sacred Waters maps the geometry of healing. These aren't vanity dashboards. They're mirrors. And mirrors don't lie — even when the reflection is uncomfortable. We hold ourselves accountable first, then invite others to do the same.",
  },
  {
    num: "VI",
    title: "The Invitation Is the Architecture",
    body: "This Living Declaration is not a monologue. It's an open door. We're asking you: What do you want to measure? What indices don't exist yet that should? What community would you build if you had the infrastructure? What does your most abundant life look like — and what's standing between you and it? The answers to these questions become the blueprint. Your input becomes the architecture. This isn't a platform built for you. It's a platform built with you.",
  },
];

const STATS = [
  { value: "25", label: "Years Building" },
  { value: "90", label: "Essays Written" },
  { value: "12", label: "Sites Launched" },
  { value: "1M+", label: "Data Points" },
  { value: "6", label: "Active Investments" },
  { value: "$10B+", label: "Benchmarked" },
];

/* ── QUESTIONNAIRE ── */

interface QuestionnaireData {
  biggestChallenge: string;
  whatToMeasure: string;
  referenceSites: string;
  newIndices: string;
  howToParticipate: string;
  abundantLife: string;
  email: string;
  name: string;
}

const QUESTIONS = [
  {
    key: "biggestChallenge" as keyof QuestionnaireData,
    label: "What's the biggest obstacle between you and your best self right now?",
    placeholder: "Be honest. This isn't a job interview. It's a mirror.",
    type: "textarea" as const,
  },
  {
    key: "whatToMeasure" as keyof QuestionnaireData,
    label: "What do you wish someone was measuring — about you, about the world, about what matters?",
    placeholder: "The metrics that don't exist yet but should...",
    type: "textarea" as const,
  },
  {
    key: "referenceSites" as keyof QuestionnaireData,
    label: "What sites, communities, or platforms inspire you? Share links or names.",
    placeholder: "The places online that make you think, feel, or act differently...",
    type: "textarea" as const,
  },
  {
    key: "newIndices" as keyof QuestionnaireData,
    label: "If you could create a new index — a new way of scoring or ranking something that matters — what would it be?",
    placeholder: "A Happiness Index? A Regenerative Impact Score? A Trust Velocity Metric? Dream big.",
    type: "textarea" as const,
  },
  {
    key: "howToParticipate" as keyof QuestionnaireData,
    label: "How would you like to be part of this? What role do you see yourself playing?",
    placeholder: "Builder, connector, tester, writer, investor, community organizer, quiet supporter...",
    type: "textarea" as const,
  },
  {
    key: "abundantLife" as keyof QuestionnaireData,
    label: "Describe your most abundant life in one paragraph. No constraints. No budget. Just truth.",
    placeholder: "What does it look like when everything is working — health, love, purpose, impact?",
    type: "textarea" as const,
  },
];

export default function Manifesto() {
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<QuestionnaireData>({
    biggestChallenge: "",
    whatToMeasure: "",
    referenceSites: "",
    newIndices: "",
    howToParticipate: "",
    abundantLife: "",
    email: "",
    name: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.manifesto.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setSubmitting(false);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const handleSubmit = () => {
    // Require at least one substantive answer
    const hasContent = Object.entries(formData)
      .filter(([k]) => k !== "email" && k !== "name")
      .some(([, v]) => v.trim().length > 10);
    if (!hasContent) return;
    setSubmitting(true);
    submitMutation.mutate(formData);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="A Living Declaration | Tony Greenberg"
        description="The Measurement of Becoming — a declaration for measuring human potential, optimizing biochemistry, reducing carbon, and building community toward an abundant future."
        path="/living-declaration"
        indexable={true}
      />

      {/* ── CINEMATIC HERO ── */}
      <div
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#0A0A10",
        }}
      >
        {/* Background with sacred geometry overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.35) saturate(0.8)",
          }}
        />
        {/* Radial gold glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(139,105,20,0.15) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "800px",
            padding: "0 clamp(1.5rem, 5vw, 4rem)",
          }}
        >
          <FadeIn>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#D4B96A",
                marginBottom: "1.5rem",
              }}
            >
              A LIVING DECLARATION
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                fontWeight: 400,
                color: "#F5F0E0",
                lineHeight: 1.08,
                marginBottom: "1.5rem",
              }}
            >
              The Measurement{" "}
              <em style={{ fontStyle: "normal" }} className="gold-shimmer">
                of Becoming
              </em>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                maxWidth: "620px",
                margin: "0 auto 2rem",
              }}
            >
              We're going to measure how fast people can become their best self — and connect them to the biochemistry, the community, and the accountability infrastructure that makes it possible. The most abundant life. The lowest carbon footprint. A better humanity for the future.
            </p>
          </FadeIn>

          <FadeIn delay={0.45}>
            <button
              onClick={scrollToForm}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0A0A10",
                background: "#D4B96A",
                border: "none",
                padding: "0.9rem 2.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F5F0E0";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4B96A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Add Your Voice →
            </button>
          </FadeIn>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1.5rem",
          padding: "2.5rem clamp(1.5rem, 5vw, 4rem)",
          background: "#0A0A10",
          borderTop: "1px solid rgba(212,185,106,0.2)",
          borderBottom: "1px solid rgba(212,185,106,0.2)",
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#D4B96A",
                lineHeight: 1.2,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.5)",
                marginTop: "0.3rem",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── THE PREAMBLE ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE PREMISE</Eyebrow>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#222",
              lineHeight: 1.95,
              maxWidth: "680px",
            }}
          >
            For twenty-five years I've been building companies, exposing extractive systems, investing in consciousness-expanding medicine, tokenizing dinosaur skeletons for ocean cleanup, and writing about what happens when you refuse to accept the world as it's handed to you. Ninety-one essays. Twelve sites. A million data points. Six psychedelic medicine investments. A B Corp that tokenizes impact. A payments corridor measured in billions.
          </p>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#222",
              lineHeight: 1.95,
              maxWidth: "680px",
              marginTop: "1rem",
            }}
          >
            All of it — every single thread — converges on one question: <strong>How fast can a human being become the best version of themselves, and what infrastructure do they need to get there?</strong>
          </p>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#222",
              lineHeight: 1.95,
              maxWidth: "680px",
              marginTop: "1rem",
            }}
          >
            This Living Declaration is the answer. Not a final answer — a living one. It will change as you change it. Because the most important thing I've learned in twenty-five years of building is this: the best architecture is the one your community finishes for you.
          </p>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── BOILING THE HUMAN REVISITED ── */}
      <Section>
        <FadeIn>
          <Eyebrow>BOILING THE HUMAN REVISITED</Eyebrow>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            The Talk That Started It All
          </h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            At a Humanity+ conference at Harvard in 2010, I shared the stage with <strong>Ray Kurzweil</strong> to celebrate human potential and ingenuity. Yet even in that heady age of tech optimism — on the eve of Arab Spring when social media was undermining rather than enabling authoritarianism — I wasn't there to blindly cheerlead progress.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Instead, I warned about the drive to exploit, to add fine print, to enshittify every product for an additional dollar — and how the process could be so slow and imperceptible that we would fail to notice it like a frog slowly being boiled alive. Few listened. The congregation was drunk on possibility.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Two years later, in 2012, I wrote about the <strong>Human Operating System</strong> — arguing that "artificial intelligence is no match for natural stupidity" and that we needed technology built to fit humans "like a glove instead of a cast." The thesis has only become more urgent.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Today we both can claim the mantle of prophecy. In the last five years, we've made as big a leap as any since splitting the atom. Yet the value of this change to humanity is just as ambiguous as the nuclear age. With superhuman intelligence at our fingertips, we haven't become supermen. We've become shallower, more anxious, and less capable.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{ margin: "2rem 0", textAlign: "center" }}>
            <Link
              href="/blog/boiling-the-human-summit-harvard-kurzweil"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
                textDecoration: "none",
                padding: "0.6rem 1.5rem",
                border: "1px solid rgba(139,105,20,0.3)",
                borderRadius: "4px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,105,20,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Read the Original "Boiling the Human" Essay →
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ── HAND BREAKTHROUGH IMAGE ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn>
          <img
            src={HAND_IMG}
            alt="A hand breaking through the algorithmic grid — organic energy and golden flowers bursting through the machine"
            style={{
              maxWidth: "100%",
              width: "720px",
              height: "auto",
              borderRadius: "4px",
              opacity: 0.9,
            }}
          />
        </FadeIn>
      </div>

      {/* ── THE WORLD WAKING UP ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE WORLD WAKING UP</Eyebrow>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            The Frog Was Boiled Too Fast — and Can Still Jump
          </h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            The good news is that the pace of change has jolted us into awareness. <strong>Tristan Harris</strong>, former Design Ethicist at Google, describes "human downgrading" — the systematic erosion of human capacity through technologies optimized for engagement rather than flourishing. <strong>Aza Raskin</strong>, who invented the infinite scroll, now speaks with deep regret. They founded the Center for Humane Technology, warning that social media was humanity's first contact with AI — and that humanity lost.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Tristan and Aza are acquaintances of mine, and I'm gratified to see their power and direction become more relevant every day. They've reached hundreds of millions with their message. The world is finally listening.
          </p>
        </FadeIn>
      </Section>

      {/* ── PULLQUOTE: TRISTAN HARRIS ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "What we really need are people who grieve their way through the full metabolism and recognition of the metacrisis. And on the other side of that grief is the love you have for the world — post-tragic optimism, which is coming from love to protect that world as best as possible, being in service of that, but unattached to the outcome."
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginTop: "1.2rem",
            }}
          >
            — TRISTAN HARRIS, RECLAIMING HUMAN AGENCY (2026)
          </div>
        </FadeIn>
      </div>

      {/* ── AN ALGORITHM FOR HUMAN SCALE AGENCY ── */}
      <Section>
        <FadeIn>
          <Eyebrow>AN ALGORITHM FOR HUMAN SCALE AGENCY</Eyebrow>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            Yet I did not write this to add to the chorus of doom. Fear is not just a poor foundation for flourishing — it's a surrender to the very forces you think you're fighting. The attention economy profits from your anxiety. Don't let them.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            I offer a different path: <strong>agency at human scale</strong>. In a world of systems designed to break you down, you can stand tall and reclaim your self-determination.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#111", marginTop: "2rem", marginBottom: "0.8rem" }}>
            Ancient Wisdom and Modern Science Converge
          </h3>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            Many wisdom traditions that survived millennia converge on similar core practices: moderation, community, presence, contentment. The Stoics knew this two thousand years ago. The Buddhists knew it five hundred years before that. This convergence reflects invariant features of human flourishing.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Fifty-five years ago, <strong>Alvin Toffler</strong> warned of "Overchoice." Thirty-four years later, <strong>Barry Schwartz</strong> proved him right. In <em>The Paradox of Choice</em>, he identified Maximizers (who exhaustively search for optimal) and <Link href="/the-territory" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>Satisficers</Link> (who stop at "good enough"). The finding was counterintuitive: satisficers are happier.
          </p>
        </FadeIn>
      </Section>

      {/* ── PULLQUOTE: TOFFLER (moved here — between agency and principles) ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn."
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginTop: "1.2rem",
            }}
          >
            — ALVIN TOFFLER
          </div>
        </FadeIn>
      </div>

      {/* ── THE ORIGINAL SIX PRINCIPLES (from HumanOS) ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE ORIGINAL SIX PRINCIPLES</Eyebrow>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "0.8rem",
            }}
          >
            Not Commandments. Invitations.
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.8, maxWidth: "680px", marginBottom: "2rem" }}>
            For those who feel they can't get their head above water, here's an imperfect start.
          </p>
        </FadeIn>

        {[
          { num: "1", title: "Choose satisficing over maximizing.", body: "Set clear criteria for \"good enough.\" Once met, stop searching. The maximizer's pursuit is a trap algorithms exploit. The satisficer's contentment is a fortress they cannot breach." },
          { num: "2", title: "Embrace voluntary simplification.", body: "Reduce complexity by choice before circumstances compel it. This is not deprivation but liberation. Own fewer things. Maintain fewer accounts. Cultivate fewer but deeper relationships." },
          { num: "3", title: "Build at human scale.", body: "Robin Dunbar discovered humans can maintain approximately 150 stable relationships. Invest in these Dunbar-scale communities — your 15-50 deep bonds, your 5 inner circle. These sustain you when large systems fail." },
          { num: "4", title: "Redefine abundance.", body: "True abundance is not accumulation; it is alignment. When resources flow toward your conscious intentions, scarcity dissolves. Shift from \"Do I have enough?\" to \"Am I contributing enough?\"" },
          { num: "5", title: "Let the titans compete.", body: "Large corporations, governments, and AI systems will compete for dominance. You don't need to participate. Turn inward. Build community. Create meaning. Redirect attention to what you can actually affect." },
          { num: "6", title: "Love more, need less.", body: "The ultimate hedge against AI dominance and civilizational stress is genuine human love, presence, and connection. These require no external energy, scale poorly (which is their strength), and constitute the irreducible core of flourishing." },
        ].map((p, i) => (
          <FadeIn key={p.num} delay={i * 0.04}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(30px, 4vw, 45px) 1fr",
                gap: "clamp(0.8rem, 1.5vw, 1.2rem)",
                marginBottom: "clamp(1.8rem, 3vw, 2.5rem)",
                maxWidth: "720px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  fontWeight: 400,
                  color: "#D4B96A",
                  lineHeight: 1,
                  paddingTop: "0.15rem",
                }}
              >
                {p.num}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.9 }}>
                  {p.body}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}

        {/* Exceptions note */}
        <FadeIn delay={0.3}>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1.5rem", maxWidth: "680px", marginTop: "1rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#111", marginBottom: "0.6rem" }}>
              For Every Rule, There Are Exceptions
            </h3>
            <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.9 }}>
              This framework assumes baseline security. If you're in survival mode, meet basic needs first. Satisficing is not settling. The satisficer chooses sufficiency from clarity. The settler accepts inadequacy from exhaustion. Know when to maximize. Don't satisfice on safety, health, or ethics. Maximize your child's blossoming. Maximize your closest relationships. Satisfice on secondary decisions that drain bandwidth without adding meaning.
            </p>
          </div>
        </FadeIn>

        {/* Specific steps */}
        <FadeIn delay={0.35}>
          <div style={{ marginTop: "2rem", maxWidth: "680px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#111", marginBottom: "0.8rem" }}>
              Specific Steps to Take Today
            </h3>
            {[
              { label: "On your information diet", text: "Limit news to one focused session daily. Eliminate notifications except direct messages from people you know." },
              { label: "On your finances", text: "Maintain 6-12 months liquidity. Avoid debt that creates dependency. Invest in resilience — skills, relationships, community." },
              { label: "On your relationships", text: "Quality over quantity. Depth over breadth. Difficult conversations now, boundary-setting now, repair work now." },
              { label: "On your mind", text: "Invest in practices that restore your nervous system: meditation, nature, exercise, connection, sleep. These are not luxuries. They are infrastructure." },
            ].map((step) => (
              <p key={step.label} style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.9, marginBottom: "0.8rem" }}>
                <strong>{step.label}:</strong> {step.text}
              </p>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── PHASE 2: REBUILDING THE SYSTEMS ── */}
      <Section>
        <FadeIn>
          <Eyebrow>PHASE 2: REBUILDING THE SYSTEMS</Eyebrow>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            Just like pre-flight instructions that tell you to put on your oxygen mask before assisting others, find your own serenity first. Then join me in designing systems-breakers to help us find ourselves again.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            When I build <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>ImpactSoul</a>, I'm enabling reconciliation between making a living and doing good — while rebuilding human-scale connections in self-governing decentralized communities.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            <strong>Balaji Srinivasan</strong> — crypto-philosopher and architect of <em>The Network State</em> — offers the maximizer's complement to this framework. He's building a startup society prototype near Singapore, arguing technology should "reduce the barrier to exit" by giving people alternatives to broken systems. But we converge on a crucial point: a startup society must be "about community culture first, and technological innovation second." Technology serves values, not the reverse.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Balaji builds the new airplane. I'm asking you to secure your oxygen mask first. First find your center. Then build.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1.5rem", maxWidth: "680px", marginTop: "1.5rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#111", marginBottom: "0.6rem" }}>
              Recommended Reading
            </h3>
            <p style={{ fontSize: "1.05rem", color: "#333", lineHeight: 1.9 }}>
              For those who want to understand the man racing to build the future before we've decided what it should look like, read <a href="https://www.amazon.com/Optimist-Sam-Altman-OpenAI-Invent/dp/1668066920" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}><em>The Optimist: Sam Altman, OpenAI, and the Race to Invent the Future</em></a> by <strong>Keach Hagey</strong> of the Wall Street Journal. Written with Altman's cooperation but no hagiography — it lets you see how thoroughly Silicon Valley has absorbed its own mythology, and why that matters for everything this Living Declaration is about.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* ── PULLQUOTE: HARARI (moved here — after Phase 2) ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "The danger is that if we invest too much in developing AI and too little in developing human consciousness, the very sophisticated artificial intelligence of computers might only serve to empower the natural stupidity of humans."
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginTop: "1.2rem",
            }}
          >
            — YUVAL NOAH HARARI
          </div>
        </FadeIn>
      </div>

      {/* ── THE CODA ── */}
      <Section>
        <FadeIn>
          <Eyebrow>CODA</Eyebrow>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            The storm is coming — or perhaps it is already here. You cannot control the storm. But you can become the kind of person who navigates storms with grace. You can build the kind of community that weathers storms together. And once you do, you can start systemic change to make the journey easier for others.
          </p>
          <p style={{ fontSize: "1.25rem", color: "#111", lineHeight: 1.8, maxWidth: "680px", marginTop: "1.5rem", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
            It begins with you. It begins now.
          </p>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE PUZZLE PIECES ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE PUZZLE PIECES</Eyebrow>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px" }}>
            Each person I've met, each conversation I've had, each advisor who signed up for my bag of cookies — they are all part of the development of my ideals. And for that, I appreciate each one of them.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            These ideals are belief systems: thoughts attached to feelings. This construct was brought out by <Link href="/the-territory" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>Arnold Patent</Link> in his seminal book <em>You Can Have It All</em> — do buy and read it. I'm also shaped by <Link href="/the-territory" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>Ram Dass</Link>, after studying with him for much time in Maui. And I'm profoundly influenced by my partner and glorious artist <a href="https://clarisseart-jyfqwtnv.manus.space/" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>Clarisse Abelarde</a>, whose work is shown here as a constant inspiration to my creativity and my love for humankind.
          </p>
        </FadeIn>

        {/* Clarisse Abelarde Artwork */}
        <FadeIn delay={0.08}>
          <figure style={{ maxWidth: "680px", margin: "2.5rem 0" }}>
            <img
              src="/api/img/clarisse-abelarde-artwork_88b73dd0.jpeg"
              alt="Artwork by Clarisse Abelarde — mixed media collage portrait"
              style={{
                width: "100%",
                maxWidth: "520px",
                height: "auto",
                borderRadius: "6px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            />
            <figcaption
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginTop: "0.75rem",
              }}
            >
              Artwork by{" "}
              <a
                href="https://clarisseart-jyfqwtnv.manus.space/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Clarisse Abelarde
              </a>
            </figcaption>
          </figure>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            Every advisor who joined this journey, every skeptic who challenged my assumptions, every visionary who saw what I couldn't yet articulate — they each added a piece to the puzzle. The Human OS framework you see here is not mine alone. It's the distillation of collective wisdom, the simplification of profound complexity that only emerges when diverse minds collide and collaborate.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{ fontSize: "1.15rem", color: "#222", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem" }}>
            This is how we absorb AI and AGI into our lives. This is how we find our place in the sun. Not through individual genius, but through the patient accumulation of insight, the willingness to learn and unlearn, and the humility to recognize that the formula for navigating this new era was always going to be a collaborative effort.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: "1.15rem", color: "#111", lineHeight: 1.95, maxWidth: "680px", marginTop: "1rem", fontStyle: "italic" }}>
            To everyone who contributed — whether you know it or not — thank you. You are the operating system behind the Operating System.
          </p>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE SIX PRINCIPLES (MEASUREMENT OF BECOMING) ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE SIX PRINCIPLES</Eyebrow>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            What We Believe. What We Build.{" "}
            <em style={{ color: "#8B6914" }}>What We Measure.</em>
          </h2>
        </FadeIn>

        {PRINCIPLES.map((p, i) => (
          <FadeIn key={p.num} delay={i * 0.05}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(40px, 6vw, 60px) 1fr",
                gap: "clamp(1rem, 2vw, 1.5rem)",
                marginBottom: "clamp(2.5rem, 4vw, 3.5rem)",
                maxWidth: "720px",
              }}
            >
              {/* Roman numeral */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 400,
                  color: "#D4B96A",
                  lineHeight: 1,
                  paddingTop: "0.15rem",
                }}
              >
                {p.num}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.35rem",
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: "0.6rem",
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "#333",
                    lineHeight: 1.9,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </Section>

      {/* ── PULLQUOTE BREAK ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "The goal is not more GDP. The goal is less. Less extraction. Less waste. Less of the frantic production-consumption cycle that's cooking the planet and hollowing out the species."
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginTop: "1.5rem",
            }}
          >
            PRINCIPLE III — SHRINK THE FOOTPRINT, EXPAND THE SOUL
          </div>
        </FadeIn>
      </div>

      {/* ── THE ECOSYSTEM MAP ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE LIVING PROOF</Eyebrow>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 400,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            This Isn't Theory. It's Already Being Built.
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "#333",
              lineHeight: 1.9,
              maxWidth: "680px",
              marginBottom: "2rem",
            }}
          >
            Every principle in this Living Declaration maps to something that already exists — a site, a protocol, an investment, an essay, a community. The infrastructure isn't hypothetical. It's live.
          </p>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "900px",
          }}
        >
          {[
            {
              principle: "Measure the Becoming",
              proof: "The QPR Index scores intellectual rigor across 91 essays. The Flow Circuit maps team performance. Human OS V2.0 diagnoses decision-making patterns. The Gem Spark maps serendipity.",
              links: [
                { label: "The Index", href: "/the-index" },
                { label: "Flow Circuit", href: "/flow-circuit" },
                { label: "Human OS", href: "/humanos" },
                { label: "Gem Spark", href: "https://serensynch-2agjfwhe.manus.space" },
              ],
            },
            {
              principle: "Optimize the Vessel",
              proof: "The Regenerative Protocol tracks biological optimization. SoulSmoke and LiquidSun honor what enters the body. Sacred Waters maps the molecule that remembers.",
              links: [
                { label: "Regenerative Protocol", href: "https://regenhealth-4nns6jnd.manus.space" },
                { label: "SoulSmoke (Mezcal)", href: "https://mezcalagave-ahru9fq8.manus.space" },
                { label: "LiquidSun (Tequila)", href: "https://tequilaazul-fxqrr3js.manus.space" },
                { label: "Sacred Waters", href: "https://aqwaterqpr-wvzsc3ph.manus.space" },
              ],
            },
            {
              principle: "Shrink the Footprint",
              proof: "The Dairy Tax calculated the true carbon cost of cheese. ImpactSoul tokenizes assets for ocean cleanup. FusionRamp/STRATUM bridges Web3 to enterprise reality.",
              links: [
                { label: "Dairy Tax Essay", href: "/blog/the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet" },
                { label: "FusionRamp / STRATUM", href: "/living-declaration" },
                { label: "Ecosystem", href: "/ecosystem" },
                { label: "Going Green", href: "/blog/return-on-investment-going-green-going-green-2" },
              ],
            },
            {
              principle: "Connect the Dots",
              proof: "The Intimacy Assessment maps your relationship intelligence. The Relationship Circuit threads four essays on love. The community invites you to find your tribe.",
              links: [
                { label: "Intimacy Assessment", href: "https://intimacyassess-tcir3hon.manus.space" },
                { label: "Journeys", href: "/journeys" },
                { label: "Community", href: "/community" },
                { label: "Love as Dharma", href: "/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership" },
              ],
            },
            {
              principle: "Sacred Accountability",
              proof: "Homeaglow Exposed holds corporations accountable. Vancefolio enforces portfolio intelligence. Every essay is scored, rated, and open to reaction.",
              links: [
                { label: "Homeaglow Exposed", href: "/homeaglow-the-anatomy-of-a-consumer-fraud" },
                { label: "Vancefolio", href: "https://portfoliofamilyoffice.manus.space" },
                { label: "Open Door", href: "/the-open-door" },
                { label: "Intel", href: "/intel" },
              ],
            },
            {
              principle: "The Invitation",
              proof: "This page. The Life Assessment below. Find Your Journey maps your path. The community you build here becomes the infrastructure for what comes next.",
              links: [
                { label: "Life Assessment", href: "/life-assessment" },
                { label: "Find Your Journey", href: "/find-your-journey" },
                { label: "Community", href: "/community" },
                { label: "All 11 Sites", href: "/recent-creations" },
              ],
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "6px",
                  padding: "1.5rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#D4B96A",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.principle}
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#444",
                    lineHeight: 1.7,
                    flex: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {item.proof}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {item.links.map((link) =>
                    link.href.startsWith("http") ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "#8B6914",
                          textDecoration: "none",
                          padding: "0.3rem 0.6rem",
                          border: "1px solid rgba(139,105,20,0.2)",
                          borderRadius: "3px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(139,105,20,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "#8B6914",
                          textDecoration: "none",
                          padding: "0.3rem 0.6rem",
                          border: "1px solid rgba(139,105,20,0.2)",
                          borderRadius: "3px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(139,105,20,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── PULLQUOTE: EISENSTEIN (moved here — before questionnaire) ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "The old world is falling apart. The new world is being born. In between, there is a great deal of confusion and suffering. But this is also a time of tremendous opportunity — to let go of what no longer serves us and to create something beautiful."
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginTop: "1.2rem",
            }}
          >
            — CHARLES EISENSTEIN
          </div>
        </FadeIn>
      </div>

      <Divider />

      {/* ── DISCOVER YOUR OPERATING SYSTEM CTA ── */}
      <Section>
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
            <Eyebrow>DISCOVER YOUR OPERATING SYSTEM</Eyebrow>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
                marginBottom: "1rem",
              }}
            >
              Are You a Conscious Satisficer?
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.8, marginBottom: "2rem" }}>
              The ideas in this Living Declaration aren't abstract — they're diagnostic. Take the assessment to discover your decision-making pattern, understand your relationship with technology, and find out where you sit on the spectrum between maximizer and satisficer. Then share your results with someone who needs to read this.
            </p>
            <Link
              href="/assessment"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#F5F0E0",
                background: "#0A0A10",
                textDecoration: "none",
                padding: "0.9rem 2.5rem",
                borderRadius: "4px",
                display: "inline-block",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a1a2a";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0A0A10";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Take the Assessment →
            </Link>
            <div style={{ marginTop: "1rem" }}>
              <Link
                href="/humanos"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#e53e3e",
                  textDecoration: "none",
                  padding: "0.7rem 2rem",
                  border: "1px solid rgba(229,62,62,0.3)",
                  borderRadius: "4px",
                  display: "inline-block",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(229,62,62,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Or Explore Human OS V2.0 →
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── THE QUESTIONNAIRE ── */}
      <div ref={formRef}>
        <Section>
          <FadeIn>
            <Eyebrow>YOUR TURN</Eyebrow>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.2,
                marginBottom: "0.8rem",
              }}
            >
              The Architecture Needs{" "}
              <em style={{ color: "#8B6914" }}>Your Blueprint</em>
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#444",
                lineHeight: 1.8,
                maxWidth: "620px",
                marginBottom: "2.5rem",
              }}
            >
              This isn't a survey. It's an invitation to co-create. Your answers shape what gets built next — which indices we create, which communities we convene, which measurements we prioritize. Answer one question or all six. There are no wrong answers, only honest ones.
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div
                style={{
                  background: "#0A0A10",
                  borderRadius: "8px",
                  padding: "clamp(2rem, 5vw, 3.5rem)",
                  textAlign: "center",
                  maxWidth: "600px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem",
                    color: "#F5F0E0",
                    marginBottom: "1rem",
                  }}
                >
                  Received. Thank you.
                </div>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  Your voice is now part of the architecture. Every response shapes what gets built next. If you want to go deeper — to upload your contacts, find your tribe, and start building community — the door is open.
                </p>
                <Link
                  href="/community"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0A0A10",
                    background: "#D4B96A",
                    textDecoration: "none",
                    padding: "0.8rem 2rem",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  Enter the Community →
                </Link>
              </div>
            </FadeIn>
          ) : (
            <div style={{ maxWidth: "680px" }}>
              {QUESTIONS.map((q, i) => (
                <FadeIn key={q.key} delay={i * 0.03}>
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#111",
                        marginBottom: "0.5rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {q.label}
                    </label>
                    <textarea
                      value={formData[q.key]}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [q.key]: e.target.value }))
                      }
                      placeholder={q.placeholder}
                      rows={4}
                      style={{
                        width: "100%",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        color: "#222",
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        padding: "0.8rem 1rem",
                        lineHeight: 1.7,
                        resize: "vertical",
                        transition: "border-color 0.2s",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#D4B96A";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                      }}
                    />
                  </div>
                </FadeIn>
              ))}

              {/* Contact info */}
              <FadeIn delay={0.2}>
                <div
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    paddingTop: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                      marginBottom: "1rem",
                    }}
                  >
                    OPTIONAL — SO WE CAN FOLLOW UP
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your name"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        color: "#222",
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        padding: "0.7rem 1rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#D4B96A";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                      }}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="Your email"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "1rem",
                        color: "#222",
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        padding: "0.7rem 1rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#D4B96A";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                      }}
                    />
                  </div>
                </div>
              </FadeIn>

              {/* Submit */}
              <FadeIn delay={0.25}>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#F5F0E0",
                    background: "#0A0A10",
                    border: "none",
                    padding: "1rem 3rem",
                    borderRadius: "4px",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background = "#1a1a2a";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0A0A10";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {submitting ? "Submitting..." : "Submit My Blueprint →"}
                </button>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#888",
                    marginTop: "0.8rem",
                    lineHeight: 1.6,
                  }}
                >
                  Your responses are read personally. They shape what gets built. Nothing is sold or shared.
                </p>
              </FadeIn>
            </div>
          )}
        </Section>
      </div>

      <Spacer />

      {/* ── CLOSING ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1.2rem",
            }}
          >
            THE NEXT STEP
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 400,
              color: "#F5F0E0",
              lineHeight: 1.2,
              marginBottom: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto 1.2rem",
            }}
          >
            Build Your Tribe. Find Your People.
          </h2>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 2rem",
            }}
          >
            Upload your contacts. Invite your people. Let the community find the connections you didn't know existed. Finding your tribe, your partner, your collaborator — it all starts here.
          </p>
          <Link
            href="/community"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#0A0A10",
              background: "#D4B96A",
              textDecoration: "none",
              padding: "0.9rem 2.5rem",
              borderRadius: "4px",
              display: "inline-block",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F5F0E0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#D4B96A";
            }}
          >
            Enter the Community →
          </Link>
          <div style={{ marginTop: "1.5rem" }}>
            <Link
              href="/assessment"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#D4B96A",
                textDecoration: "none",
                padding: "0.7rem 2rem",
                border: "1px solid rgba(212,185,106,0.4)",
                borderRadius: "4px",
                display: "inline-block",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,185,106,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Or Take the Assessment First →
            </Link>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Link
              href="/humanos"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#e53e3e",
                textDecoration: "none",
                padding: "0.7rem 2rem",
                border: "1px solid rgba(229,62,62,0.3)",
                borderRadius: "4px",
                display: "inline-block",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(229,62,62,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Explore Human OS V2.0 →
            </Link>
          </div>
        </FadeIn>
      </div>

      <Spacer />
      <NextPage href="/community" label="The Community" />
    </div>
  );
}
