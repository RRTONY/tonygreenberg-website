/**
 * ReadNext — "Continue Reading" recommendations at the bottom of blog posts.
 * Shows 2-3 related essays based on category match, then keyword overlap.
 * Styled to match the editorial aesthetic.
 */
import { useMemo } from "react";
import { Link } from "wouter";
import blogData from "@/data/blogData.json";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  formatTag?: string;
  keywords?: string[];
}

const allPosts: Post[] = blogData as Post[];

function getRelatedPosts(currentSlug: string, count = 3): Post[] {
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) return allPosts.filter((p) => p.slug !== currentSlug).slice(0, count);

  const currentKeywords = new Set(
    (current.keywords || []).map((k: string) => k.toLowerCase())
  );

  // Score each post by relevance
  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;
      // Same category = strong signal
      if (p.category === current.category) score += 10;
      // Same format tag = moderate signal
      if (p.formatTag && p.formatTag === current.formatTag) score += 5;
      // Keyword overlap
      const pKeywords = (p.keywords || []).map((k: string) => k.toLowerCase());
      for (const kw of pKeywords) {
        if (currentKeywords.has(kw)) score += 3;
      }
      // Small recency bonus (newer posts slightly preferred)
      const dateNum = new Date(p.date).getTime();
      if (!isNaN(dateNum)) score += dateNum / 1e15; // tiny tiebreaker
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return scored.map((s) => s.post);
}

export default function ReadNext({ currentSlug }: { currentSlug: string }) {
  const related = useMemo(() => getRelatedPosts(currentSlug, 3), [currentSlug]);

  if (related.length === 0) return null;

  return (
    <div
      style={{
        margin: "2.5rem 0 1.5rem",
        padding: "2rem 0",
        borderTop: "2px solid #D4B96A",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: "#8B6914",
          marginBottom: "1.2rem",
        }}
      >
        Continue Reading
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                padding: "1.2rem",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "4px",
                transition: "all 0.25s ease",
                cursor: "pointer",
                background: "rgba(250,250,247,0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,185,106,0.4)";
                e.currentTarget.style.background = "rgba(250,250,247,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                e.currentTarget.style.background = "rgba(250,250,247,0.5)";
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#999",
                  marginBottom: "0.5rem",
                }}
              >
                {post.category}
                {post.formatTag && (
                  <span style={{ marginLeft: "0.6rem", color: "#bbb" }}>
                    · {post.formatTag}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#0A0A10",
                  lineHeight: 1.35,
                  marginBottom: "0.5rem",
                }}
              >
                {post.title}
              </div>
              <div
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.82rem",
                  color: "#666",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }}
              >
                {post.summary}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
