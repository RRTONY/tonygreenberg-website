/**
 * ReturningVisitorHero — Personalized content strip for returning visitors.
 * Shows "Welcome back" with contextual suggestions based on their history.
 * Compact on mobile — single tight row.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getCompletedAssessments } from "@/components/AssessmentProgress";

const VISIT_KEY = "tg-visit-count";
const LAST_BLOG_KEY = "tg-last-blog-slug";
const LAST_BLOG_TITLE_KEY = "tg-last-blog-title";

function getVisitCount(): number {
  try {
    return parseInt(localStorage.getItem(VISIT_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

function incrementVisitCount() {
  try {
    const count = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(count));
    return count;
  } catch {
    return 1;
  }
}

export function getLastBlog(): { slug: string; title: string } | null {
  try {
    const slug = localStorage.getItem(LAST_BLOG_KEY);
    const title = localStorage.getItem(LAST_BLOG_TITLE_KEY);
    if (slug && title) return { slug, title };
    return null;
  } catch {
    return null;
  }
}

export function setLastBlog(slug: string, title: string) {
  try {
    localStorage.setItem(LAST_BLOG_KEY, slug);
    localStorage.setItem(LAST_BLOG_TITLE_KEY, title);
  } catch {
    // noop
  }
}

export default function ReturningVisitorHero() {
  const [visitCount, setVisitCount] = useState(0);
  const [lastBlog, setLastBlogState] = useState<{ slug: string; title: string } | null>(null);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    const count = incrementVisitCount();
    setVisitCount(count);
    setLastBlogState(getLastBlog());
    setAssessmentCount(getCompletedAssessments().length);
  }, []);

  // Only show for returning visitors (2+ visits)
  if (visitCount < 2) return null;

  const truncTitle = lastBlog
    ? lastBlog.title.length > 30
      ? lastBlog.title.slice(0, 30) + "…"
      : lastBlog.title
    : "";

  return (
    <div
      style={{
        background: "rgba(212,185,106,0.04)",
        borderBottom: "1px solid rgba(212,185,106,0.1)",
        padding: "0.4rem 0.8rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
          minHeight: 0,
        }}
      >
        {/* Left: Welcome + last read */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0, overflow: "hidden" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.82rem",
              color: "#D4B96A",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Welcome back.
          </span>
          {lastBlog && (
            <Link
              href={`/blog/${lastBlog.slug}`}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.04em",
                color: "rgba(212,185,106,0.55)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(212,185,106,0.15)",
                paddingBottom: "1px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Continue: {truncTitle}
            </Link>
          )}
        </div>

        {/* Right: CTA */}
        <Link
          href="/find-my"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            color: "#D4B96A",
            textDecoration: "none",
            padding: "0.2rem 0.5rem",
            background: "rgba(212,185,106,0.1)",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {assessmentCount > 0
            ? `${assessmentCount} done → Continue`
            : "Pick up where you left off →"}
        </Link>
      </div>
    </div>
  );
}
