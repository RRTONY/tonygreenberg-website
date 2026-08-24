/**
 * ClarisseRelatedStories — A curated "If You Felt This" section
 * specifically for the Clarisse article. More personal and intentional
 * than the generic ReadNext component. Designed to reduce bounce rate
 * by connecting readers to thematically resonant content.
 */
import { Link } from "wouter";

interface RelatedStory {
  slug: string;
  title: string;
  hook: string; // Personal, conversational reason to read this next
  theme: string; // Short theme label
}

const clarisseRelated: RelatedStory[] = [
  {
    slug: "the-decay-of-modern-day-communication",
    title: "The Decay of Modern Day Communication",
    hook: "If the algorithm's censorship of Clarisse made you angry, this is about what platforms have done to how we talk to each other. The same forces that suppress art also suppress honesty between people.",
    theme: "Platforms & Expression",
  },
  {
    slug: "psychedelics-could-become-extractive-capitalism",
    title: "Psychedelics Could Become Extractive Capitalism",
    hook: "Clarisse's painting reaches the body before the brain. So do psychedelics. This is about what happens when sacred experiences meet the same market forces that tried to hide her work.",
    theme: "Sacred vs. Market",
  },
  {
    slug: "boiling-the-human-summit-harvard-kurzweil",
    title: "\"Boiling the Human\" — H+ Summit / Harvard-Kurzweil",
    hook: "A million people felt something looking at a painting. That's not supposed to happen in a world optimized for clicks. This talk at Harvard explores what we're losing as machines decide what's worth seeing.",
    theme: "Consciousness & Technology",
  },
  {
    slug: "truth-bias-mutually-exclusive",
    title: "Truth And Bias Are Mutually Exclusive?",
    hook: "Instagram decided Clarisse's painting was inappropriate. Who decides what's true? Who decides what you're allowed to feel? This essay is about the machinery behind those decisions.",
    theme: "Who Controls the Narrative",
  },
];

export default function ClarisseRelatedStories() {
  return (
    <div style={{
      maxWidth: "780px",
      margin: "2.5rem 0",
      padding: "2rem 0",
      borderTop: "2px solid #D4B96A",
    }}>
      {/* Header */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#8B6914",
        marginBottom: "0.4rem",
      }}>
        IF YOU FELT THIS
      </div>
      <p style={{
        fontFamily: "'Source Serif 4', 'Georgia', serif",
        fontSize: "1.05rem",
        color: "#555",
        lineHeight: 1.6,
        marginBottom: "1.8rem",
        maxWidth: "600px",
      }}>
        The same forces that tried to hide Clarisse's painting are at work in every corner of modern life. These are the other threads.
      </p>

      {/* Story cards */}
      <div style={{
        display: "grid",
        gap: "1.2rem",
      }}>
        {clarisseRelated.map((story) => (
          <Link
            key={story.slug}
            href={`/blog/${story.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                padding: "1.4rem 1.6rem",
                border: "1px solid rgba(139,105,20,0.12)",
                borderRadius: "6px",
                background: "linear-gradient(135deg, rgba(250,250,247,0.8) 0%, rgba(248,245,238,0.6) 100%)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,185,106,0.5)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,105,20,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(139,105,20,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Theme tag */}
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#B8860B",
                marginBottom: "0.6rem",
                opacity: 0.8,
              }}>
                {story.theme}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#0A0A10",
                lineHeight: 1.35,
                marginBottom: "0.6rem",
              }}>
                {story.title}
              </div>

              {/* Hook — the personal, conversational reason */}
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.92rem",
                color: "#555",
                lineHeight: 1.65,
              }}>
                {story.hook}
              </div>

              {/* Read arrow */}
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: "#8B6914",
                marginTop: "0.8rem",
                letterSpacing: "0.06em",
              }}>
                Read this →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Browse all */}
      <div style={{
        textAlign: "center",
        marginTop: "1.5rem",
      }}>
        <Link
          href="/blog"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "#8B6914",
            textDecoration: "none",
            borderBottom: "1px solid rgba(139,105,20,0.3)",
            paddingBottom: "2px",
          }}
        >
          BROWSE ALL 110 ESSAYS →
        </Link>
      </div>
    </div>
  );
}
