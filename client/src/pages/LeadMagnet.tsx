/**
 * Lead Magnet: "How I'd Approach Your Problem"
 * A 5-step diagnostic framework with real-world examples
 * Email-gated PDF download
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FadeIn, Divider } from "@/components/Editorial";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import {
  Download,
  ArrowRight,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Target,
  Layers,
  Zap,
  Lightbulb,
  Shield,
} from "lucide-react";

/* ── Framework steps ── */
const FRAMEWORK_STEPS = [
  {
    num: "01",
    title: "Name the Real Problem",
    subtitle: "Not the symptom. The structure.",
    icon: Target,
    description:
      "Most people come to me with a symptom: costs are too high, a vendor is underperforming, the board is nervous. The first thing I do is refuse to solve that problem. Instead, I ask: what system produced this outcome? What incentive structure made this inevitable? You can't fix a leak by mopping the floor.",
    prompt: "What keeps happening despite your best efforts to stop it?",
    example:
      "A Fortune 500 company came to me saying their cloud costs were 40% over budget. The real problem wasn't cloud costs — it was that procurement, engineering, and finance had never been in the same room together. Three departments optimizing for three different metrics. The cloud bill was just the scoreboard.",
  },
  {
    num: "02",
    title: "Map the Stakeholders",
    subtitle: "Who benefits from the status quo?",
    icon: Layers,
    description:
      "Every problem persists because someone is profiting from it. Not maliciously — structurally. The vendor who overcharges you has a quota. The consultant who extends the engagement has a mortgage. The internal champion who chose the failing platform has a reputation. Until you map who wins and who loses from change, you're negotiating in the dark.",
    prompt: "Who would be uncomfortable if this problem disappeared overnight?",
    example:
      "In a $200M infrastructure deal, I mapped 14 stakeholders across 3 organizations. Seven of them had financial incentives to maintain the current arrangement. We didn't fight them — we redesigned the incentive structure so alignment became more profitable than resistance.",
  },
  {
    num: "03",
    title: "Find the Leverage Point",
    subtitle: "Where does a small push create a large shift?",
    icon: Zap,
    description:
      "Donella Meadows taught me that systems have leverage points — places where a small intervention produces disproportionate change. Most people push on the wrong part of the system. They negotiate harder on price when the real leverage is in contract structure. They hire more people when the real leverage is in process design. Find the fulcrum.",
    prompt: "If you could change only one thing, what would unlock everything else?",
    example:
      "A media company was spending $8M/year on content delivery and wanted to negotiate a 15% discount. Instead, I looked at their traffic patterns and found that 60% of their bandwidth was serving content nobody watched. We didn't negotiate the price down — we eliminated the waste. Saved $4.8M. The CDN vendor was happy to keep the contract.",
  },
  {
    num: "04",
    title: "Design the First Move",
    subtitle: "Bias toward reversible action.",
    icon: Lightbulb,
    description:
      "Analysis paralysis kills more good ideas than bad execution. But recklessness kills more companies than caution. The resolution: design a first move that is bold enough to generate real data but reversible enough that failure is a lesson, not a catastrophe. Jeff Bezos calls these 'Type 2 decisions' — doors you can walk back through.",
    prompt: "What is the smallest experiment that would prove or disprove your thesis?",
    example:
      "A healthcare startup wanted to launch in 12 markets simultaneously. I suggested launching in 2 markets with deliberately different strategies — one premium, one value. Within 90 days, we had data that would have taken 18 months of planning to guess at. The premium market won by 3x. We killed the value strategy before it consumed capital.",
  },
  {
    num: "05",
    title: "Build the Feedback Loop",
    subtitle: "What you measure is what you become.",
    icon: Shield,
    description:
      "The difference between a strategy and a wish is a feedback loop. Every move should generate information that makes the next move smarter. Most organizations measure outputs (revenue, headcount, deliverables) when they should be measuring learning velocity: how fast are we getting smarter about this problem?",
    prompt: "How will you know in 30 days whether this is working?",
    example:
      "After restructuring a $10B technology sourcing operation, we didn't just track cost savings. We tracked decision speed — how long from identifying a need to signing a contract. That metric dropped from 14 weeks to 3 weeks. The cost savings followed naturally, but the real value was in the velocity.",
  },
];

/* ── Expandable step card ── */
function StepCard({
  step,
  index,
}: {
  step: (typeof FRAMEWORK_STEPS)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = step.icon;

  return (
    <FadeIn delay={index * 0.08}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(139,105,20,0.12)",
          borderRadius: "8px",
          padding: "2rem 2.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 4px 24px rgba(139,105,20,0.08)";
          e.currentTarget.style.borderColor = "rgba(139,105,20,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.03)";
          e.currentTarget.style.borderColor = "rgba(139,105,20,0.12)";
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #F7F3EA 0%, #EDE5D0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={22} color="#8B6914" />
          </div>
          <div className="flex-1">
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.3rem",
              }}
            >
              Step {step.num}
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.45rem",
                fontWeight: 700,
                color: "#111",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "1rem",
                color: "#666",
                margin: "0.3rem 0 0",
                lineHeight: 1.5,
              }}
            >
              {step.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "1.05rem",
            lineHeight: 1.85,
            color: "#333",
            marginTop: "1.2rem",
            marginBottom: expanded ? "1rem" : "0.5rem",
          }}
        >
          {step.description}
        </p>

        {/* The Prompt */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #F7F3EA 0%, #F0ECE0 100%)",
            borderLeft: "3px solid #D4B96A",
            borderRadius: "0 6px 6px 0",
            padding: "1rem 1.5rem",
            margin: "1rem 0",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.4rem",
            }}
          >
            The Question to Ask
          </div>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              color: "#111",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {step.prompt}
          </p>
        </div>

        {/* Expandable example */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#8B6914",
            padding: "0.5rem 0",
            marginTop: "0.5rem",
          }}
        >
          {expanded ? "Hide" : "See"} Real-World Example
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                background: "#FAFAF7",
                borderRadius: "6px",
                padding: "1.2rem 1.5rem",
                marginTop: "0.5rem",
                borderLeft: "3px solid rgba(139,105,20,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#999",
                  marginBottom: "0.5rem",
                }}
              >
                From the Field
              </div>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1rem",
                  lineHeight: 1.85,
                  color: "#444",
                  margin: 0,
                }}
              >
                {step.example}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </FadeIn>
  );
}

/* ── Main Page ── */
export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const subscribeMutation = trpc.subscribe.add.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloading(true);
    try {
      await subscribeMutation.mutateAsync({
        email,
        source: "framework-download",
      });
      setSubmitted(true);
    } catch {
      // Still allow download even if subscription fails
      setSubmitted(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <SEO
        title="How I'd Approach Your Problem — Tony Greenberg"
        description="A 5-step framework for diagnosing complex business problems. Twenty-five years of pattern recognition distilled into questions worth asking."
        path="/framework"
      />

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #0A0A10 0%, #1a1a22 50%, #FAFAF7 100%)",
          padding: "5rem 2rem 6rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1.5rem",
            }}
          >
            A Framework for Thinking
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 400,
              color: "#F5F0E0",
              lineHeight: 1.2,
              maxWidth: "700px",
              margin: "0 auto 1.5rem",
            }}
          >
            How I'd Approach{" "}
            <span style={{ color: "#D4B96A" }}>Your Problem</span>
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: "rgba(245,240,224,0.7)",
              maxWidth: "580px",
              margin: "0 auto",
            }}
          >
            Twenty-five years of pattern recognition distilled into five
            questions worth asking before you spend a dollar, hire a
            consultant, or make a decision you can't reverse.
          </p>
        </FadeIn>
      </div>

      {/* Framework Steps */}
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          padding: "3rem 2rem 2rem",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.5rem",
            }}
          >
            The Framework
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 400,
              color: "#111",
              marginBottom: "0.8rem",
              lineHeight: 1.25,
            }}
          >
            Five Steps. Five Questions. One Diagnostic.
          </h2>
          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              color: "#555",
              marginBottom: "2.5rem",
              maxWidth: "620px",
            }}
          >
            This isn't a business plan template. It's a thinking tool. Each
            step forces you to slow down at the exact moment most people speed
            up. The goal isn't to find the answer — it's to find the right
            question.
          </p>
        </FadeIn>

        {FRAMEWORK_STEPS.map((step, i) => (
          <StepCard key={step.num} step={step} index={i} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ padding: "2rem 0" }}>
        <Divider />
      </div>

      {/* Download CTA */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "2rem 2rem 5rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          {!submitted ? (
            <>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #F7F3EA 0%, #EDE5D0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <Download size={28} color="#8B6914" />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: "#111",
                  marginBottom: "0.8rem",
                }}
              >
                Take the Framework With You
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  color: "#555",
                  marginBottom: "2rem",
                }}
              >
                Want to apply this to your own situation? Drop your email and
                I'll send you the printable one-page diagnostic worksheet.
                Five questions, space for your answers, and the thinking
                prompts that have shaped $10B in strategic decisions.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 items-center justify-center"
              >
                <div
                  className="relative flex-1 w-full sm:w-auto"
                  style={{ maxWidth: "320px" }}
                >
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                    }}
                  />
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.5rem",
                      border: "1px solid rgba(139,105,20,0.2)",
                      borderRadius: "6px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.88rem",
                      background: "#fff",
                      color: "#111",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#D4B96A")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(139,105,20,0.2)")
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={downloading}
                  style={{
                    background:
                      "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.85rem 1.8rem",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: downloading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap",
                    opacity: downloading ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {downloading ? "Sending..." : "Get the Framework"}
                  <ArrowRight size={14} />
                </button>
              </form>

              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  color: "#999",
                  marginTop: "1rem",
                  letterSpacing: "0.03em",
                }}
              >
                No spam. No sequences. Just the worksheet and occasional
                essays worth reading.
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle2
                size={48}
                color="#8B6914"
                style={{ margin: "0 auto 1rem" }}
              />
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  color: "#111",
                  marginBottom: "0.8rem",
                }}
              >
                You're In
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  color: "#555",
                  marginBottom: "1.5rem",
                }}
              >
                The framework is on its way to your inbox. In the meantime,
                try applying Step 1 right now: name the real problem. Not the
                symptom. The structure underneath it.
              </p>
              <a
                href="/start-here"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.82rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#8B6914",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                Read the essays that shaped this thinking{" "}
                <ArrowRight size={14} />
              </a>
            </motion.div>
          )}
        </FadeIn>
      </div>

      {/* Bottom quote */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #FAFAF7 0%, #F0ECE0 100%)",
          padding: "3rem 2rem",
          textAlign: "center",
          borderTop: "1px solid rgba(139,105,20,0.1)",
        }}
      >
        <FadeIn>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              color: "#555",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            "The problem is never the problem. The problem is that nobody
            asked the right question."
          </p>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginTop: "0.8rem",
            }}
          >
            — Tony Greenberg
          </p>
        </FadeIn>
      </div>

      {/* FauxTony CTA */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              color: "#555",
              marginBottom: "1rem",
            }}
          >
            Want to walk through this framework with your specific situation?
          </p>
          <a
            href="/fauxtony"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.82rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#fff",
              background:
                "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
              padding: "0.85rem 2rem",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Ask FauxTony <ArrowRight size={14} />
          </a>
        </FadeIn>
      </div>
    </>
  );
}
