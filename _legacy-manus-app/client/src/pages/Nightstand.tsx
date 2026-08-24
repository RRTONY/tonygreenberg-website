/*
 * DESIGN: "The Folio" — Library page
 * Books, ideas, and intellectual influences
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  HeroImage,
  NextPage,
  FadeIn,
  Pullquote,
  Divider,
  Spacer,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import SEO from "@/components/SEO";

const HERO_LIBRARY = "/api/img/nightstand-orig_945b87c0.jpg";

const books = [
  { title: "Operating Manual for Spaceship Earth", author: "Buckminster Fuller", note: "The book that rewired my brain at 22. We're all crew on this ship — there are no passengers." },
  { title: "The Doors of Perception", author: "Aldous Huxley", note: "The original map of consciousness expansion. Still the most elegant articulation of what psychedelics reveal." },
  { title: "Finite and Infinite Games", author: "James P. Carse", note: "Finite players play within boundaries. Infinite players play with boundaries. I try to be the latter." },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", note: "The satisficer vs. maximizer framework changed how I make decisions. I'm a satisficer — and proud of it." },
  { title: "The Master and His Emissary", author: "Iain McGilchrist", note: "Left brain vs. right brain isn't what you think. This book is about the crisis of Western civilization." },
  { title: "Dune", author: "Frank Herbert", note: "\"The mystery of life isn't a problem to solve, but a reality to experience.\" Business advice disguised as science fiction." },
  { title: "The Tao Te Ching", author: "Lao Tzu", note: "The water that wears away the stone. Patience as strategy. Emptiness as fullness." },
];

const concepts = [
  { term: "Satisficing", def: "Choosing the first option that meets your criteria rather than exhaustively searching for the optimal one. My operating system." },
  { term: "Hedonic Engineering", def: "The deliberate design of experiences that maximize well-being. Applied to business, health, and relationships." },
  { term: "Rolling Close", def: "Never stopping. Every conversation is a potential collaboration. Every problem is a potential product." },
  { term: "The Glitch", def: "People are the glitches in the system. The beautiful, unpredictable, irreducible anomalies that make everything interesting." },
  { term: "Radical Transparency", def: "Say what you mean. Show your work. Let people see the process, not just the product." },
];

export default function Nightstand() {
  return (
    <div>
      <SEO title="The Nightstand" description="What Tony Greenberg is reading, watching, and thinking about. Books, articles, and ideas that shape the worldview." path="/the-nightstand"
        indexable={true} />
      <HeroImage src={HERO_LIBRARY} alt="Books and reading lamp" />

      <Section>
        <FadeIn>
          <Eyebrow>Intellectual Infrastructure</Eyebrow>
          <SectionTitle>The Library</SectionTitle>
          <p style={{ color: "#222", marginBottom: "2rem" }}>
            The books and ideas that built my operating system. Not a comprehensive reading list — a curated set of texts that actually changed how I think and act.
          </p>
        </FadeIn>

        {books.map((book, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              style={{
                padding: "1.8rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    
                    color: "#111",
                  }}
                >
                  {book.title}
                </h4>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    color: "#8B6914",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {book.author}
                </span>
              </div>
              <p style={{ color: "#333", fontSize: "1rem", lineHeight: 1.75 }}>
                <AutoLinkedText>{book.note}</AutoLinkedText>
              </p>
            </div>
          </FadeIn>
        ))}

        <Divider />
        <Spacer />

        <FadeIn>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1.5rem",
            }}
          >
            Key Concepts
          </h3>
        </FadeIn>

        {concepts.map((c, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              style={{
                padding: "1.5rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {c.term}
              </span>
              <span style={{ color: "#333", fontSize: "1rem", marginLeft: "0.5rem" }}>
                — {c.def}
              </span>
            </div>
          </FadeIn>
        ))}

        <Spacer />

        <FadeIn>
          <Pullquote>
            "I read the way some people eat — compulsively, omnivorously, with no regard for what's 'appropriate.' The best ideas come from the strangest intersections. A mycology textbook next to a payments whitepaper next to a Sufi poem. That's my bookshelf."
          </Pullquote>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.5rem",
              }}
            >
              The Lesson
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#222" }}>
              Your bookshelf is your autobiography. The ideas you return to aren't just preferences — they're the scaffolding of every decision you'll make. Curate ruthlessly. The wrong book at the right time can change everything.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/the-web" label="Continue to The Web" />
    </div>
  );
}
