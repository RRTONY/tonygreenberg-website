import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useParams, Link, Redirect } from "wouter";
import {
  Section,
  Eyebrow,
  FadeIn,
  Divider,
} from "@/components/Editorial";
import blogData from "@/data/blogData.json";
import { BLOOD_DNA_REVISED_CONTENT } from "@/data/bloodDnaContent";
import { autoLinkText } from "@/data/linkMap";
import { getFurtherReading } from "@/data/furtherReading";
import { getCuratedPath } from "@/data/readingPaths";
import { getSeriesForPost } from "@/data/seriesData";
import { thoughtLeadersBySlug, ThoughtLeader } from "@/data/thoughtLeaders";
import { riddles } from "@/data/riddleData";
import footerData from "@/data/footerData.json";
import mirrorData from "@/data/mirrorData.json";
import { StickyShareBar, ReadingProgressBar, RateThisThinking, EmailCapture } from "@/components/ConversionMechanics";
import { getCanonicalUrl } from "@/lib/canonicalUrl";
import { responsiveImageProps } from "@/lib/imageUtils";
import { MicroYesBar, SubscribeOutburst, SocialProofCascade, ProofNugget } from "@/components/CommitmentEscalation";
import { HighlightSaveButton, MicroCommitmentBox } from "@/components/EngagementFeatures";
import React from "react";
import SEO from "@/components/SEO";
import PostReactions from "@/components/PostReactions";
import BlogPaywall from "@/components/BlogPaywall";
import ReadNext from "@/components/ReadNext";
import MovementSignup from "@/components/MovementSignup";
import { setLastBlog } from "@/components/ReturningVisitorHero";
import { useAuth } from "@/_core/hooks/useAuth";
import { FREE_BLOG_POST_COUNT } from "@shared/stripe";
import BlogComments from "@/components/BlogComments";
import { AskTonyButton } from "@/components/AskTonyModal";
import ReadCounter from "@/components/ReadCounter";
import ShareableQuote from "@/components/ShareableQuote";
import ShareTheStory from "@/components/ShareTheStory";
import ArticleUpdates from "@/components/ArticleUpdates";
import ArticleVideo from "@/components/ArticleVideo";
import ClarisseRelatedStories from "@/components/ClarisseRelatedStories";
import ClarisseCommunity from "@/components/ClarisseCommunity";
import { DrLeeTimeline } from "@/components/DrLeeTimeline";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  originalUrl: string;
  originalContent: string;
  updatedContent: string;
  lesson: string;
  nextSteps: string[];
  formatTag: string;
  validityScore: number;
  validityLabel: string;
  reads: number;
  keywords?: string[];
  relevantParties?: { name: string; reason: string }[];
  supportingNews?: { headline: string; source: string; year: string; connection: string };
  unpublished?: boolean;
}

const posts: Post[] = blogData as Post[];

const formatColors: Record<string, string> = {
  "The Crusade": "#8B0000",
  "The Field Report": "#2E8B57",
  "The Systems Map": "#4682B4",
  "The Lesson": "#5C4033",
  "The Manifesto": "#6A5ACD",
  "The Review": "#8B6914",
  "The Reckoning": "#9B2335",
  "The Dispatch": "#1a1a1a",
  "The Framework": "#2F4F4F",
};

/* ── ORNAMENTAL DIVIDER ── */
/* ── DYNAMIC SEO FOR BLOG POSTS ── */
/** Slugs that search engines are allowed to index */
// All blog posts are now indexable for full SEO coverage

function BlogSEO({ post }: { post: Post }) {
  const postAny = post as any;
  return (
    <SEO
      title={post.title}
      description={post.summary}
      path={`/blog/${post.slug}`}
      image={postAny.heroImage || post.image || undefined}
      type="article"
      publishDate={post.date}
      author="Tony &apos;WhyNot&apos; Greenberg"
      category={post.category}
      keywords={post.keywords ? post.keywords.join(", ") : undefined}
      indexable={true}
    />
  );
}

/* ── ORNAMENTAL DIVIDER ── */
function OrnamentalDivider() {
  return (
    <div style={{ textAlign: "center", margin: "2.5rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <div style={{ width: "50px", height: "1px", background: "linear-gradient(to right, transparent, rgba(139,90,43,0.35))" }} />
      <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.75rem", color: "rgba(139,90,43,0.5)", letterSpacing: "0.4em" }}>✦ ✦ ✦</span>
      <div style={{ width: "50px", height: "1px", background: "linear-gradient(to left, transparent, rgba(139,90,43,0.35))" }} />
    </div>
  );
}

/* ── AUTO-LINKED PARAGRAPH ── */
/* Render inline markdown: **bold**, *italic*, [text](url), and raw URLs */
function renderInlineMarkdown(text: string, linkColor: string, keyOffset = 0): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex: **bold**, *italic*, ~~strikethrough~~, [text](url), raw URLs — bold checked BEFORE italic
  const inlineRe = /\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<>"]+)/g;
  let lastIndex = 0;
  let match;
  let key = keyOffset;

  while ((match = inlineRe.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // **bold** — recursively parse inner content for links
      const innerNodes = renderInlineMarkdown(match[1], linkColor, key + 1000);
      nodes.push(<strong key={`md-${key++}`} style={{ fontWeight: 600 }}>{innerNodes}</strong>);
    } else if (match[2] !== undefined) {
      // *italic* — recursively parse inner content for links
      const innerNodes = renderInlineMarkdown(match[2], linkColor, key + 2000);
      nodes.push(<em key={`md-${key++}`}>{innerNodes}</em>);
    } else if (match[3] !== undefined) {
      // ~~strikethrough~~ — gold color to signal a factual update
      nodes.push(<del key={`md-${key++}`} style={{ textDecoration: 'line-through', color: '#8B6914', opacity: 0.8 }}>{match[3]}</del>);
    } else if (match[4] !== undefined && match[5] !== undefined) {
      // [text](url) — use internal navigation for same-site links
      const href = match[5];
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        nodes.push(
          <Link key={`md-${key++}`} href={href} style={{ color: linkColor, textDecoration: "underline", textDecorationColor: `${linkColor}40`, textUnderlineOffset: "3px" }}>
            {match[4]}
          </Link>
        );
      } else {
        nodes.push(
          <a key={`md-${key++}`} href={href} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: "underline", textDecorationColor: `${linkColor}40`, textUnderlineOffset: "3px" }}>
            {match[4]}
          </a>
        );
      }
    } else if (match[6] !== undefined) {
      // Raw URL
      nodes.push(
        <a key={`md-${key++}`} href={match[6]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: "underline", textDecorationColor: `${linkColor}40`, textUnderlineOffset: "3px", wordBreak: "break-all" }}>
          {match[6].length > 60 ? match[6].slice(0, 57) + "..." : match[6]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function LinkedParagraph({ text, linkColor = "#1a1a1a" }: { text: string; linkColor?: string }) {
  // If text already contains markdown links [text](url), skip autoLinkText to avoid breaking them
  const hasMarkdownLinks = /\[([^\]]+)\]\(([^)]+)\)/.test(text);
  if (hasMarkdownLinks) {
    const mdNodes = renderInlineMarkdown(text, linkColor);
    return <>{mdNodes}</>;
  }
  const segments = autoLinkText(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (typeof seg === "string") {
          // Process inline markdown within plain text segments
          const mdNodes = renderInlineMarkdown(seg, linkColor);
          return <React.Fragment key={i}>{mdNodes}</React.Fragment>;
        }
        return (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: linkColor,
              textDecoration: "underline",
              textDecorationColor: `${linkColor}40`,
              textUnderlineOffset: "3px",
              textDecorationThickness: "1px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecorationColor = linkColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecorationColor = `${linkColor}40`; }}
          >
            {seg.text}
          </a>
        );
      })}
    </>
  );
}

/* ── PULL QUOTE (inline in article) ── */
function ArticlePullQuote({ children }: { children: string }) {
  return (
    <blockquote
      style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: 1.6,
        color: "#2C1810",
        padding: "2.5rem 1rem",
        margin: "3.5rem auto",
        borderTop: "1px solid rgba(139,90,43,0.35)",
        borderBottom: "1px solid rgba(139,90,43,0.35)",
        textAlign: "center",
        maxWidth: "580px",
        position: "relative",
        fontStyle: "italic",
        background: "rgba(242,232,213,0.3)",
      }}
    >
      <span style={{ display: "block", fontFamily: "'IM Fell English', serif", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(139,90,43,0.55)", marginBottom: "1rem" }}>✦ &nbsp; ✦ &nbsp; ✦</span>
      {children}
      <span style={{ display: "block", fontFamily: "'IM Fell English', serif", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(139,90,43,0.55)", marginTop: "1rem" }}>✦ &nbsp; ✦ &nbsp; ✦</span>
    </blockquote>
  );
}

/* ── SHARE BAR ── */
function ImpactFuturistNewsletterForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem("tg_subscribed") === "true"; } catch { return false; }
  });
  const [focused, setFocused] = useState(false);
  const subscribeMutation = trpc.subscribe.add.useMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeMutation.mutateAsync({ email, source: `impact-futurist-cta-${slug}` });
      setSubmitted(true);
      try { localStorage.setItem("tg_subscribed", "true"); } catch {}
    } catch {
      setSubmitted(true);
    }
  };
  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "1rem 0" }}>
        <div style={{ fontSize: "1.5rem", color: "#D4B96A", marginBottom: "0.6rem" }}>◆</div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#F5F0E0", fontStyle: "italic" }}>
          You're in. The next dispatch arrives when it's ready.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" as const, alignItems: "stretch" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="your@email.com"
          required
          style={{
            flex: "1 1 200px",
            minWidth: 0,
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${focused ? "#D4B96A" : "rgba(212,185,106,0.3)"}`,
            color: "#F5F0E0",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.95rem",
            outline: "none",
            borderRadius: "3px",
            transition: "border-color 0.2s",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.8rem",
            background: "#D4B96A",
            color: "#0A0A10",
            border: "none",
            borderRadius: "3px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap" as const,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F5E6A3"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#D4B96A"; }}
        >
          Send Me the Dispatch
        </button>
      </div>
      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.75rem",
        color: "rgba(245,240,224,0.35)",
        marginTop: "0.6rem",
        lineHeight: 1.5,
      }}>
        No spam. No cadence. Unsubscribe anytime.
      </p>
    </form>
  );
}

function ShareBar({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const text = `${post.title} — by Tony "WhyNot" Greenberg`;

  // Generate short URL for this post
  const createShortUrl = trpc.shortUrls.create.useMutation();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  useEffect(() => {
    const path = `/blog/${post.slug}`;
    createShortUrl.mutateAsync({ targetPath: path }).then(r => {
      setShortUrl(`https://tonygreenberg.com${r.shortUrl}`);
    }).catch(() => {
      setShortUrl(getCanonicalUrl()); // fallback to full URL
    });
  }, [post.slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const url = shortUrl || getCanonicalUrl();

  const trackShareMutation = trpc.analytics.trackShare.useMutation();

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    // Track the share event in the database
    trackShareMutation.mutate({ postSlug: post.slug, shareType: platform });

    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }

    if (platform === "email") {
      // Use location.href for mailto to avoid popup blocker
      window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${post.title}\n\n${url}`)}`;
      return;
    }

    // For social platforms, use Web Share API on mobile if available, else use link navigation
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&via=ThinkTony`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const targetUrl = urls[platform];
    if (!targetUrl) return;

    // Use a link-click approach to avoid popup blockers on mobile
    const a = document.createElement("a");
    a.href = targetUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Show native share sheet on mobile if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text, url });
        // Track native share event
        trackShareMutation.mutate({ postSlug: post.slug, shareType: "native" });
      } catch {} // User cancelled
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const socialButtons = [
    {
      label: "Share on X",
      platform: "twitter",
      tooltip: "Share on X — opens in new tab",
      bg: "#000000",
      hoverBg: "#1a1a1a",
      color: "#ffffff",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Share on LinkedIn",
      platform: "linkedin",
      tooltip: "Share on LinkedIn — opens in new tab",
      bg: "#0A66C2",
      hoverBg: "#004182",
      color: "#ffffff",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ padding: "1.2rem 0 0.8rem", marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.12em", textTransform: "uppercase" }}>Share this essay</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(139,105,20,0.12)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        {socialButtons.map((s) => (
          <div key={s.platform} style={{ position: "relative", display: "inline-block" }}>
            {activeTooltip === s.platform && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(10,10,16,0.92)",
                color: "#fff",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.04em",
                padding: "0.4rem 0.75rem",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 100,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              }}>
                {(s as any).tooltip || s.label}
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid rgba(10,10,16,0.92)",
                }} />
              </div>
            )}
            <button
              onClick={() => handleShare(s.platform)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                fontWeight: 500,
                padding: "0.65rem 0.9rem",
                minHeight: "44px",
                borderRadius: "4px",
                border: "none",
                background: s.bg,
                color: s.color,
                cursor: "pointer",
                transition: "background 0.2s, transform 0.18s, box-shadow 0.18s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = s.hoverBg;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.22)";
                setActiveTooltip(s.platform);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = s.bg;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                setActiveTooltip(null);
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            >
              {s.icon}
              {s.label}
            </button>
          </div>
        ))}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            title="More sharing options"
            className="md:hidden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              padding: "0.65rem 0.9rem",
              minHeight: "44px",
              borderRadius: "4px",
              border: "1px solid rgba(139,105,20,0.3)",
              background: "transparent",
              color: "#8B6914",
              cursor: "pointer",
            }}
          >
            More...
          </button>
        )}
        <button
          onClick={() => handleShare("email")}
          title="Share via email"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            padding: "0.65rem 0.9rem",
            minHeight: "44px",
            borderRadius: "4px",
            border: "1px solid rgba(139,105,20,0.25)",
            background: "transparent",
            color: "#8B6914",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,105,20,0.06)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email
        </button>
        <button
          onClick={() => handleShare("copy")}
          title="Copy link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            padding: "0.65rem 0.9rem",
            minHeight: "44px",
            borderRadius: "4px",
            border: "1px solid rgba(139,105,20,0.25)",
            background: copied ? "rgba(139,105,20,0.08)" : "transparent",
            color: copied ? "#8B6914" : "#999",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

/* ── OFF-LABEL PRESCRIBING EXPLAINER CALLOUT ── */
function OffLabelCallout() {
  return (
    <div style={{
      marginLeft: "calc(-1 * var(--article-px, 2rem))",
      marginRight: "calc(-1 * var(--article-px, 2rem))",
      marginTop: "3.5rem",
      marginBottom: "3.5rem",
      background: "linear-gradient(135deg, #1C2B1E 0%, #243320 60%, #1A2A1C 100%)",
      overflow: "hidden",
      position: "relative",
      borderLeft: "3px solid #5A8A4A",
      boxShadow: "0 6px 40px rgba(0,0,0,0.25), inset 0 0 80px rgba(90,138,74,0.04)",
    }}>
      {/* Subtle texture watermark */}
      <div style={{
        position: "absolute",
        top: "-1rem",
        right: "1.5rem",
        fontFamily: "'IM Fell English', serif",
        fontSize: "clamp(10rem, 25vw, 18rem)",
        fontWeight: 400,
        color: "rgba(90,138,74,0.05)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        fontStyle: "italic",
      }}>Rx</div>
      <div style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3rem)",
        position: "relative",
      }}>
        {/* Label */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase" as const,
          color: "rgba(90,138,74,0.8)",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}>
          <span style={{ display: "inline-block", width: "24px", height: "1px", background: "rgba(90,138,74,0.4)" }} />
          A Note on the Medicine
          <span style={{ display: "inline-block", width: "24px", height: "1px", background: "rgba(90,138,74,0.4)" }} />
        </div>
        {/* Title */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(240,235,220,0.95)",
          lineHeight: 1.35,
          marginBottom: "1.75rem",
          letterSpacing: "0.01em",
        }}>This is a tragic case of off-label usage — and here is what that actually means.</div>
        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(90,138,74,0.5), transparent)" }} />
          <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.6rem", color: "rgba(90,138,74,0.5)", letterSpacing: "0.3em" }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(90,138,74,0.5), transparent)" }} />
        </div>
        {/* Body */}
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
          lineHeight: 1.9,
          color: "rgba(220,215,200,0.88)",
          display: "flex",
          flexDirection: "column" as const,
          gap: "1.1rem",
        }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "rgba(240,235,220,0.95)", fontStyle: "normal" }}>Off-label prescribing</strong> is when a doctor prescribes an FDA-approved medicine to treat a condition, or in a way, that the FDA has not officially approved. It depends upon and trusts the physician’s — the professional’s — judgement. Ketamine, for example, is FDA-approved as an anesthetic. Its use for treatment-resistant depression is off-label and now widespread. The mechanism is sound. The accountability is variable.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "rgba(240,235,220,0.95)", fontStyle: "normal" }}>Scheduled substances</strong> are drugs classified by the DEA under the Controlled Substances Act. Schedule I — which includes psilocybin, MDMA, and LSD — means the federal government has determined no currently accepted medical use and high abuse potential. That classification is increasingly contested by clinical evidence. MDMA received FDA Breakthrough Therapy designation for PTSD. Psilocybin has received it twice, for depression. These substances are being administered in FDA-authorized clinical trials. They remain Schedule I. The law has not caught up with the data.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "rgba(240,235,220,0.95)", fontStyle: "normal" }}>Illegal medicines</strong> — substances administered outside any authorized clinical or legal framework — occupy a different category entirely. A practitioner administering a Schedule I substance outside of an approved trial, a licensed ketamine clinic, or a state-legal framework (Oregon, Colorado) is operating outside the law. The credential on the wall does not change that. The good intentions do not change that. The patient's desperation does not change that.
          </p>
          <p style={{ margin: 0 }}>
            The distinction matters because the harm in this field does not come from the molecules. It comes from the gap between what practitioners claim and what they can actually be held accountable for. Off-label is a legal framework. Scheduled is a legal classification. Illegal is a legal fact. All three are being conflated — sometimes by accident, sometimes by design — and patients are paying for the confusion.
          </p>
        </div>
        {/* Bottom rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(90,138,74,0.4), transparent)" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(90,138,74,0.5)", letterSpacing: "0.25em", textTransform: "uppercase" as const }}>Context</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(90,138,74,0.4), transparent)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── SCAPPA QUOTE SHARE WIDGET ── */
function ScappaShareWidget({ shareText, articleUrl }: { shareText: string; articleUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = decodeURIComponent(articleUrl);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      margin: "0.5rem 0 2.5rem",
      padding: "1rem 1.2rem",
      background: "linear-gradient(135deg, rgba(139,105,20,0.05) 0%, rgba(212,185,106,0.08) 100%)",
      border: "1px solid rgba(139,105,20,0.2)",
      borderRadius: "6px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.6rem",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "#8B6914",
        fontWeight: 600,
      }}>
        Share Dr. Scappa's insight
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const, alignItems: "center" }}>
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${articleUrl}&via=ThinkTony`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em",
            padding: "0.5rem 0.9rem", minHeight: "36px",
            borderRadius: "4px", border: "none",
            background: "#000", color: "#fff",
            textDecoration: "none", cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em",
            padding: "0.5rem 0.9rem", minHeight: "36px",
            borderRadius: "4px", border: "none",
            background: "#0A66C2", color: "#fff",
            textDecoration: "none", cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </a>
        {/* Copy link */}
        <button
          onClick={handleCopy}
          title="Copy article link"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em",
            padding: "0.5rem 0.9rem", minHeight: "36px",
            borderRadius: "4px",
            border: "1px solid rgba(139,105,20,0.3)",
            background: copied ? "rgba(139,105,20,0.08)" : "transparent",
            color: copied ? "#8B6914" : "#666",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,105,20,0.05)"; }}
          onMouseLeave={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

/* ── SCAPPA FEATURED CALLOUT ── */
function ScappaCallout({ introText, quoteLines, attribution, closingLine, finalSentence }: {
  introText: string;
  quoteLines: string[];
  attribution: string | null;
  closingLine: string;
  finalSentence: string;
}) {
  const scappaShareText = encodeURIComponent('"Do not trust blindly because of a degree upon the wall." — Dr. Stephen Scappa on psychedelic medicine accountability');
  const scappaUrl = encodeURIComponent('https://tonygreenberg.com/blog/when-healing-becomes-extraction');
  const cleanAttrib = attribution ? attribution.replace(/^—\s*/, "").replace(/\*\*/g, "") : null;

  // Parse inline markdown: **bold** and *italic* into React elements
  function parseInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.slice(last, match.index));
      if (match[1] !== undefined) parts.push(<strong key={match.index} style={{ fontWeight: 700, fontStyle: "normal", color: "rgba(253,250,243,0.95)" }}>{match[1]}</strong>);
      else if (match[2] !== undefined) parts.push(<em key={match.index}>{match[2]}</em>);
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  return (
    <div style={{
      marginLeft: "calc(-1 * var(--article-px, 2rem))",
      marginRight: "calc(-1 * var(--article-px, 2rem))",
      marginTop: "4rem",
      marginBottom: "4rem",
      background: "#F2E8D5",
      overflow: "hidden",
      borderTop: "2px solid rgba(139,90,43,0.5)",
      borderBottom: "1px solid rgba(139,90,43,0.2)",
      boxShadow: "inset 0 0 60px rgba(139,90,43,0.05), 0 4px 40px rgba(44,24,16,0.08)",
    }}>
      {/* Manuscript texture watermark — large ✦ */}
      <div style={{
        position: "absolute",
        top: "-2rem",
        right: "1.5rem",
        fontFamily: "'IM Fell English', serif",
        fontSize: "clamp(12rem, 30vw, 22rem)",
        fontWeight: 400,
        color: "rgba(139,90,43,0.04)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        fontStyle: "italic",
      }}>“</div>
      {/* Inner content */}
      <div style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem) clamp(2rem, 5vw, 3rem)",
        position: "relative",
      }}>
        {/* Section label */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase" as const,
          color: "rgba(139,90,43,0.6)",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}>
          <span style={{ display: "inline-block", width: "24px", height: "1px", background: "rgba(139,90,43,0.35)" }} />
          A Response Worth Keeping
          <span style={{ display: "inline-block", width: "24px", height: "1px", background: "rgba(139,90,43,0.35)" }} />
        </div>
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#2C1810",
          lineHeight: 1.3,
          marginBottom: "1.75rem",
          letterSpacing: "0.01em",
        }}>A physician with 50 years of practice responds.</div>
        {/* Intro text */}
        {introText && (
          <p style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
            lineHeight: 1.85,
            color: "#4A2E1A",
            marginBottom: "2rem",
            fontStyle: "italic",
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}>{parseInline(introText)}</p>
        )}
        {/* Ochre rule with ✦ */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.4), transparent)" }} />
          <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.6rem", color: "rgba(139,90,43,0.5)", letterSpacing: "0.3em" }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(139,90,43,0.4), transparent)" }} />
        </div>
        {/* Quote lines */}
        <blockquote style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 2,
          color: "#2C1810",
          margin: "0 0 1.5rem 0",
          padding: "0 0 0 1.75rem",
          borderLeft: "2px solid rgba(139,90,43,0.45)",
        }}>
          {quoteLines.map((line, idx) => (
            <p key={idx} style={{ margin: idx === 0 ? 0 : "1.1rem 0 0", textWrap: "balance" as React.CSSProperties["textWrap"] }}>{parseInline(line)}</p>
          ))}
        </blockquote>
        {/* Attribution */}
        {cleanAttrib && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "#8B5A2B",
            marginBottom: "2.5rem",
            paddingLeft: "1.5rem",
          }}>— {cleanAttrib}</div>
        )}
        {/* Ochre rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.4), transparent)" }} />
          <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.6rem", color: "rgba(139,90,43,0.5)", letterSpacing: "0.3em" }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(139,90,43,0.4), transparent)" }} />
        </div>
        {/* Closing line — isolated, large */}
        {closingLine && (
          <div style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#5C3D1E",
            lineHeight: 1.45,
            marginBottom: "1.25rem",
            letterSpacing: "0.01em",
          }}>“{closingLine.replace(/^"|"$/g, "").replace(/^\u201c|\u201d$/g, "")}”</div>
        )}
        {/* Final sentence */}
        {finalSentence && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "rgba(92,61,30,0.45)",
            marginBottom: "2rem",
          }}>{finalSentence}</div>
        )}
        {/* Share widget */}
        <ScappaShareWidget shareText={scappaShareText} articleUrl={scappaUrl} />
      </div>
      {/* Ochre bottom bar */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,90,43,0.4), transparent)" }} />
    </div>
  );
}

/* ── QUOTE GROUP COMPONENT ── */
function QuoteGroup({ quoteLines, attribution, keyPrefix }: { quoteLines: string[]; attribution: string | null; keyPrefix: string }) {
  const quoteText = quoteLines.join(" ");
  // Clean attribution: remove leading "— " and bold markers
  const cleanAttrib = attribution
    ? attribution.replace(/^—\s*/, "").replace(/\*\*/g, "")
    : null;

    return (
    <figure
      key={keyPrefix}
      style={{
        margin: "2.5rem 0",
        padding: "0",
        maxWidth: "640px",
        textAlign: "left",
        position: "relative",
      }}
    >
      {/* Quote text */}
      <blockquote style={{
        fontFamily: "'IM Fell English', serif",
        fontSize: "clamp(1rem, 1.7vw, 1.12rem)",
        fontStyle: "italic",
        fontWeight: 400,
        lineHeight: 1.85,
        color: "#3D2B1A",
        padding: "0 0 0 1.5rem",
        margin: 0,
        borderLeft: "2px solid rgba(139,90,43,0.4)",
        letterSpacing: "0.005em",
      }}>
        <LinkedParagraph text={quoteText} />
      </blockquote>
      {/* Attribution */}
      {cleanAttrib && (
        <figcaption style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "#8B5A2B",
          marginTop: "0.75rem",
          paddingLeft: "1.5rem",
        }}>
          <LinkedParagraph text={cleanAttrib} />
        </figcaption>
      )}
    </figure>
  );
}

/* ── BOLD SECTION LABEL ("On Presence & Flow:") ── */
function SectionLabel({ text, keyId }: { text: string; keyId: number }) {
  return (
    <div
      key={keyId}
      style={{
        textAlign: "left",
        margin: "3rem 0 0.75rem",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase" as const,
        color: "#8B5A2B",
        fontWeight: 400,
        display: "inline-block",
      }}>
        {text.replace(/:$/, "")}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.25), transparent)" }} />
    </div>
  );
}

/* ── MARKDOWN TABLE COMPONENT ── */
function MarkdownTable({ rows, keyPrefix }: { rows: string[]; keyPrefix: string }) {
  const parseRow = (row: string) =>
    row.split("|").map((c) => c.trim()).filter((c) => c.length > 0);

  if (rows.length < 2) return null;
  const headerCells = parseRow(rows[0]);
  const dataRows = rows.slice(2).map(parseRow);

  // Detect mobile for card layout
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    // Card-based layout for mobile
    return (
      <div key={keyPrefix} style={{ margin: '1.5rem 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem',
        }}>
          <div style={{ width: '24px', height: '1px', background: '#999' }} />
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.68rem',
            letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', fontWeight: 600,
          }}>Reference</span>
        </div>
        {dataRows.map((cells, ri) => (
          <div key={ri} style={{
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '0.75rem',
            background: ri % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
          }}>
            {cells.map((cell, ci) => (
              <div key={ci} style={{ marginBottom: ci < cells.length - 1 ? '0.6rem' : 0 }}>
                <div style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.65rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#666', fontWeight: 600, marginBottom: '0.25rem',
                }}>
                  {headerCells[ci] ? headerCells[ci].replace(/\*\*/g, '') : ''}
                </div>
                <div style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.92rem', lineHeight: 1.65,
                  color: ci === 0 ? '#222' : '#444',
                  fontWeight: ci === 0 ? 500 : 400,
                }}>
                  <LinkedParagraph text={cell} />
                </div>
              </div>
            ))}
          </div>
        ))}
        <div style={{ height: '1px', background: '#ddd' }} />
      </div>
    );
  }

  return (
    <div
      key={keyPrefix}
      style={{
        margin: "1.5rem 0",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.8rem",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "1px",
              background: "#999",
            }}
          />
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#666",
              fontWeight: 600,
            }}
          >
            Reference
          </span>
        </div>
      <table
        style={{
          width: "100%",
          minWidth: "480px",
          borderCollapse: "collapse",
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "clamp(0.88rem, 1.4vw, 0.98rem)",
          lineHeight: 1.65,
        }}
      >
        <thead>
          <tr>
            {headerCells.map((cell, ci) => (
              <th
                key={ci}
                style={{
                  textAlign: "left",
                  padding: "0.9rem 1rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#555",
                  fontWeight: 600,
                  borderBottom: "1px solid #333",
                  background: "transparent",
                  whiteSpace: "normal",
                }}
              >
                {cell.replace(/\*\*/g, "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((cells, ri) => (
            <tr
              key={ri}
              style={{
                background: ri % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  ri % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)";
              }}
            >
              {cells.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    color: ci === 0 ? "#222" : "#444",
                    fontWeight: ci === 0 ? 500 : 400,
                    verticalAlign: "top",
                  }}
                >
                  <LinkedParagraph text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          height: "1px",
          background: "#ddd",
          marginTop: "0",
        }}
      />
    </div>
  );
}

/* ── TOC HEADING EXTRACTOR ── */
function extractTOCHeadings(content: string): { id: string; text: string; level: number }[] {
  const lines = content.split("\n");
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    // Tony's custom typographic section headers (◆ or ✴ prefix)
    const tonyH2 = line.match(/^[◆✴]\s+(.+)$/);
    if (h3) {
      const text = h3[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level: 3 });
    } else if (h2) {
      const text = h2[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level: 2 });
    } else if (tonyH2) {
      const text = tonyH2[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level: 2 });
    }
  }
  return headings;
}

/* ── STICKY TABLE OF CONTENTS ── */
function ArticleTOC({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <aside style={{
      position: "sticky",
      top: "calc(var(--start-banner-h, 0px) + 80px)",
      width: "220px",
      flexShrink: 0,
      alignSelf: "flex-start",
      display: "none",
    }} className="blog-toc-sidebar">
      <div style={{
        background: "#F2E8D5",
        border: "1px solid rgba(139,90,43,0.18)",
        borderRadius: "4px",
        padding: "1.2rem 1rem 1.4rem",
        boxShadow: "0 2px 16px rgba(44,24,16,0.06)",
      }}>
        {/* Header */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: "0.78rem",
          fontStyle: "italic",
          color: "#8B5A2B",
          letterSpacing: "0.06em",
          marginBottom: "0.9rem",
          paddingBottom: "0.6rem",
          borderBottom: "1px solid rgba(139,90,43,0.2)",
          textAlign: "center",
        }}>Contents</div>
        {/* Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          {headings.map(({ id, text, level }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  const offset = 100;
                  const top = el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              style={{
                display: "block",
                fontFamily: level === 2 ? "'IM Fell English', serif" : "'DM Mono', monospace",
                fontStyle: level === 2 ? "italic" : "normal",
                fontSize: level === 2 ? "0.88rem" : "0.7rem",
                letterSpacing: level === 3 ? "0.06em" : "0",
                textTransform: level === 3 ? "uppercase" : "none",
                color: activeId === id ? "#2C1810" : "#7A5C3A",
                textDecoration: "none",
                padding: level === 2 ? "0.35rem 0.5rem 0.35rem 0.7rem" : "0.25rem 0.5rem 0.25rem 1.2rem",
                borderLeft: activeId === id ? "2px solid #8B5A2B" : "2px solid transparent",
                background: activeId === id ? "rgba(139,90,43,0.07)" : "transparent",
                borderRadius: "0 3px 3px 0",
                transition: "all 0.2s",
                lineHeight: 1.35,
                wordBreak: "break-word" as const,
              }}
            >
              {text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

/* ── GEMSPARK CALLOUT COMPONENT ── */
function GemSparkCallout({ subtitle, bodyParagraphs }: { subtitle: string; bodyParagraphs: string[] }) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  // Render body paragraphs with basic markdown (bold, italic, links)
  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/);
      const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)/);
      const candidates = [
        boldMatch ? { idx: boldMatch[1].length, type: 'bold' as const, match: boldMatch } : null,
        italicMatch ? { idx: italicMatch[1].length, type: 'italic' as const, match: italicMatch } : null,
        linkMatch ? { idx: linkMatch[1].length, type: 'link' as const, match: linkMatch } : null,
      ].filter(Boolean) as { idx: number; type: 'bold' | 'italic' | 'link'; match: RegExpMatchArray }[];
      if (candidates.length === 0) { parts.push(remaining); break; }
      candidates.sort((a, b) => a.idx - b.idx);
      const winner = candidates[0];
      if (winner.idx > 0) parts.push(winner.match[1]);
      if (winner.type === 'bold') {
        parts.push(<strong key={key++} style={{ fontWeight: 700, color: '#5C3A1E' }}>{winner.match[2]}</strong>);
        remaining = remaining.slice(winner.match[0].length);
      } else if (winner.type === 'italic') {
        parts.push(<em key={key++}>{winner.match[2]}</em>);
        remaining = remaining.slice(winner.match[0].length);
      } else {
        parts.push(<a key={key++} href={winner.match[3]} target="_blank" rel="noopener noreferrer" style={{ color: '#8B6914', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{winner.match[2]}</a>);
        remaining = remaining.slice(winner.match[0].length);
      }
    }
    return parts;
  };

  return (
    <div
      style={{
        margin: '4rem -1rem',
        position: 'relative',
      }}
    >
      {/* Top ornamental rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0', padding: '0 1rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C8860A)' }} />
        <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '0.75rem', color: '#C8860A', letterSpacing: '0.4em' }}>✦</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #C8860A)' }} />
      </div>

      {/* Card body */}
      <div style={{
        background: 'linear-gradient(160deg, #FFFDF5 0%, #FFF8E3 60%, #FFFBF0 100%)',
        border: '1px solid rgba(200,134,10,0.22)',
        borderTop: '3px solid #C8860A',
        padding: '2.25rem 2rem 2rem',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(200,134,10,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      }}>

        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '1.1rem', color: '#C8860A', lineHeight: 1 }}>✦</span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C8860A',
                fontWeight: 500,
              }}>GemSpark of the Day</span>
            </div>
            {subtitle && (
              <div style={{
                fontFamily: "'Playfair Display', 'IM Fell English', serif",
                fontSize: '1.25rem',
                fontStyle: 'italic',
                color: '#3D2B1F',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}>{subtitle}</div>
            )}
          </div>

          {/* What is GemSpark? tooltip */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setShowTooltip(v => !v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(200,134,10,0.4)',
                borderRadius: '2px',
                padding: '0.25rem 0.7rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                color: '#8B6914',
                cursor: 'pointer',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >What is this?</button>
            {showTooltip && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 0.5rem)',
                width: '260px',
                background: '#FFFDF5',
                border: '1px solid rgba(200,134,10,0.25)',
                borderTop: '2px solid #C8860A',
                padding: '1rem 1.1rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                zIndex: 20,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.8rem',
                color: '#3D2B1F',
                lineHeight: 1.65,
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8860A', display: 'block', marginBottom: '0.5rem' }}>✦ GemSpark</span>
                A GemSpark lives at the intersection of serendipity and synchronicity. Serendipity is the lucky accident. Synchronicity is the meaningful coincidence that defies logic. When they meet, something wordless happens. A real encounter, a real place, a real person. Not a theory. The kind of moment that only makes sense after it has already changed you. Every Tony "WhyNot" Greenberg essay includes one. <a href="/blog/the-molecule-as-mirror-from-substance-to-service" target="_blank" rel="noopener noreferrer" style={{ color: '#C8860A', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Read more about serendipity and synchronicity.</a>
              </div>
            )}
          </div>
        </div>

        {/* Thin gold divider under header */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,134,10,0.35), rgba(200,134,10,0.08))', marginBottom: '1.5rem' }} />

        {/* Body */}
        <div style={{
          fontFamily: "'IM Fell English', 'Playfair Display', serif",
          fontSize: '1.02rem',
          lineHeight: 1.85,
          color: '#3D2B1F',
        }}>
          {bodyParagraphs.filter(p => p.trim() && !p.match(/^---+$/) && !p.match(/^⁂/)).map((para, idx) => {
            const isHrPara = /^---+$/.test(para) || /^⁂/.test(para);
            if (isHrPara) return null;
            const isGemSparkMoment = /^That is a GemSpark/i.test(para.trim());
            return (
              <p key={idx} style={isGemSparkMoment ? {
                marginBottom: '1.1rem',
                fontStyle: 'italic',
                animation: 'gemsparkGlow 3s ease-in-out infinite',
                display: 'inline-block',
                width: '100%',
              } : { marginBottom: '1.1rem' }}>
                {renderInline(para)}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(200,134,10,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            color: 'rgba(200,134,10,0.55)',
            textTransform: 'uppercase',
          }}>A GemSpark appears in every Tony Greenberg essay</span>
          <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '0.7rem', color: 'rgba(200,134,10,0.4)', letterSpacing: '0.4em' }}>✦ · ✦ · ✦</span>
        </div>
      </div>

      {/* Bottom ornamental rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0', padding: '0 1rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,134,10,0.3))' }} />
        <span style={{ fontFamily: "'IM Fell English', serif", fontSize: '0.65rem', color: 'rgba(200,134,10,0.35)', letterSpacing: '0.4em' }}>✦</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(200,134,10,0.3))' }} />
      </div>
    </div>
  );
}

/* ── CONTENT RENDERER ── */
function ArticleContent({ content, isUpdated, slug }: { content: string; isUpdated: boolean; slug?: string }) {
  const isHealingArticle = slug === "when-healing-becomes-extraction";

  // For the healing article: extract disclosure/editor summary from top so narrative hits first
  const { strippedContent, topBlocks } = useMemo(() => {
    // The page hero already owns the document H1. Preserve the source text while
    // removing a duplicated leading Markdown H1 from the rendered article body.
    const normalizedContent = content.replace(/^\s*#\s+[^\n]+\n+/, "");
    const disclosureContent = slug === "your-blood-lies-without-your-dna"
      ? normalizedContent
        .replace(
          "I get a referral credit. Full transparency.",
          "I get a referral credit.* Full transparency."
        )
        .concat("\n\n---\n\n*All proceeds I receive from this referral code are donated to my foundation.*")
      : normalizedContent;
    if (!isHealingArticle) return { strippedContent: disclosureContent, topBlocks: [] };
    const lines = disclosureContent.split("\n");
    const blocks: string[] = [];
    const remaining: string[] = [];
    let inTopBlock = true;
    let i = 0;
    // Skip H1, H3 subtitle, ---, and leading blockquotes (Disclosure + Editor's Summary)
    while (i < lines.length) {
      const line = lines[i];
      if (inTopBlock && (line.startsWith("# ") || line.startsWith("### ") || line.trim() === "---" || line.trim() === "" || line.startsWith("> "))) {
        if (line.startsWith("> ")) blocks.push(line);
        i++;
      } else {
        inTopBlock = false;
        remaining.push(...lines.slice(i));
        break;
      }
    }
    return { strippedContent: remaining.join("\n"), topBlocks: blocks };
  }, [content, isHealingArticle]);

  const paragraphs = useMemo(() => {
    return strippedContent.split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
  }, [strippedContent]);

  // Extract a good pull quote: find the most quotable sentence (short, punchy, ends with period)
  const pullQuote = useMemo(() => {
    if (paragraphs.length < 4) return null;
    for (let i = 2; i < Math.min(paragraphs.length - 1, 8); i++) {
      const p = paragraphs[i];
      if (p.length > 40 && p.length < 200 && !p.startsWith("#") && !p.startsWith("|") && !p.startsWith("-") && !p.startsWith("*") && !p.startsWith(">") && !p.startsWith("![")) {
        return { text: p, afterIndex: i };
      }
    }
    return null;
  }, [paragraphs]);

  // Pre-process: group consecutive blockquotes into quote groups
  // Each group = { quoteLines: string[], attribution: string | null, startIdx: number, endIdx: number }
  const quoteGroups = useMemo(() => {
    const groups: { quoteLines: string[]; attribution: string | null; startIdx: number; endIdx: number }[] = [];
    let i = 0;
    while (i < paragraphs.length) {
      if (paragraphs[i].startsWith("> ") || paragraphs[i] === ">") {
        const startIdx = i;
        const lines: string[] = [];
        let attrib: string | null = null;
        while (i < paragraphs.length && (paragraphs[i].startsWith("> ") || paragraphs[i] === ">")) {
          const lineText = paragraphs[i].replace(/^>\s*/, "");
          // Check if this is an attribution line (starts with — or - **)
          if (/^—\s/.test(lineText) || /^–\s/.test(lineText)) {
            attrib = lineText;
          } else {
            lines.push(lineText);
          }
          i++;
        }
        groups.push({ quoteLines: lines, attribution: attrib, startIdx, endIdx: i - 1 });
      } else {
        i++;
      }
    }
    return groups;
  }, [paragraphs]);

  // Build a set of paragraph indices that belong to quote groups (so we skip them in normal rendering)
  const quoteGroupIndices = useMemo(() => {
    const set = new Set<number>();
    for (const g of quoteGroups) {
      for (let j = g.startIdx; j <= g.endIdx; j++) set.add(j);
    }
    return set;
  }, [quoteGroups]);

  // Map from startIdx to group for rendering
  const quoteGroupMap = useMemo(() => {
    const map = new Map<number, typeof quoteGroups[0]>();
    for (const g of quoteGroups) map.set(g.startIdx, g);
    return map;
  }, [quoteGroups]);

  // Pre-compute GemSpark section: find heading, extract body, mark consumed indices
  const gemSparkData = useMemo(() => {
    // Detect both markdown (## ✦ GemSpark) and Tony's symbol format (✦ GemSpark)
    const gemIdx = paragraphs.findIndex((p) =>
      (p.startsWith("##") && /GemSpark/i.test(p.replace(/^#+\s*/, ""))) ||
      /^✦\s*GemSpark/i.test(p)
    );
    if (gemIdx === -1) return null;
    let jGem = gemIdx + 1;
    const body: string[] = [];
    // Stop at next ## heading, ◆/✴ section header, or ⁂ break
    while (jGem < paragraphs.length &&
      !paragraphs[jGem].startsWith("## ") &&
      !/^[◆✴]\s/.test(paragraphs[jGem]) &&
      paragraphs[jGem] !== "⁂"
    ) {
      body.push(paragraphs[jGem]);
      jGem++;
    }
    const consumedSet = new Set<number>();
    for (let k = gemIdx; k < jGem; k++) consumedSet.add(k);
    const subtitle = paragraphs[gemIdx]
      .replace(/^#+\s*/, "")
      .replace(/^✦\s*GemSpark\s*(of the Day)?\s*[—\-]?\s*/i, "")
      .trim();
    return { headingIdx: gemIdx, body, consumedSet, subtitle };
  }, [paragraphs]);

  return (
    <div
      className="content-protected"
      onContextMenu={(e) => e.preventDefault()}
      style={{ maxWidth: isUpdated ? "680px" : "780px", width: "100%", overflowWrap: "break-word" as const, wordBreak: "break-word" as const }}
    >
      {(() => {
        let scappaConsumedUntil = -1;
        return paragraphs.map((para, i) => {
        if (i <= scappaConsumedUntil) return null;
        // Skip GemSpark section paragraphs (handled by pre-computed gemSparkData)
        if (gemSparkData && gemSparkData.consumedSet.has(i)) {
          // At the heading index, render the callout
          if (i === gemSparkData.headingIdx) {
            return <GemSparkCallout key={`gemspark-${i}`} subtitle={gemSparkData.subtitle} bodyParagraphs={gemSparkData.body} />;
          }
          return null;
        }
        // Skip paragraphs that are part of a quote group (except the start)
        if (quoteGroupIndices.has(i) && !quoteGroupMap.has(i)) return null;

        // Render quote group at its start index
        if (quoteGroupMap.has(i)) {
          const group = quoteGroupMap.get(i)!;
          const elements: React.ReactNode[] = [];
          elements.push(
            <QuoteGroup
              key={`qg-${i}`}
              quoteLines={group.quoteLines}
              attribution={group.attribution}
              keyPrefix={`qg-${i}`}
            />
          );
          // Insert pull quote after this group if applicable
          if (pullQuote && i <= pullQuote.afterIndex && group.endIdx >= pullQuote.afterIndex) {
            elements.push(<ArticlePullQuote key={`pq-${i}`}>{pullQuote.text}</ArticlePullQuote>);
          }
          // Dr. Scappa featured quote — inject share buttons directly after
          const isScappaQuote = group.attribution && group.attribution.includes("Scappa");
          if (isScappaQuote) {
            const scappaShareText = encodeURIComponent('"Do not trust blindly because of a degree upon the wall." — Dr. Stephen Scappa on psychedelic medicine accountability');
            const scappaUrl = encodeURIComponent('https://tonygreenberg.com/blog/when-healing-becomes-extraction');
            elements.push(
              <ScappaShareWidget key={`scappa-share-${i}`} shareText={scappaShareText} articleUrl={scappaUrl} />
            );
          }
          return elements;
        }

        // Safety net: if paragraph contains raw HTML tags, render as HTML
        const isRawHtml = /^<[a-z][^>]*>/i.test(para);
        if (isRawHtml) {
          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: para }}
              style={{ marginBottom: "0.8rem" }}
            />
          );
        }

        const isFirst = i === 0;
        const isLinkedImage = /^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/.test(para);
        const isImage = !isLinkedImage && /^!\[([^\]]*)\]\(([^)]+)\)$/.test(para);
        const isHr = /^---+$/.test(para) || para === "⁂";
        // Tony's custom typographic system
        const isTonySectionHeader = /^[◆✴]\s/.test(para); // ◆ or ✴ starts a section header
        // Plain-text section titles (short, no punctuation at end, not a sentence)
        const isPlainSectionTitle = !para.startsWith("##") && !para.startsWith("-") && !para.startsWith("*") && !para.startsWith(">") && !para.startsWith("!") && !para.startsWith("[") && !para.startsWith("|") && para.length < 60 && !/[.!?,:;]$/.test(para) && /^[A-Z✦✴◆]/.test(para) && !/^\d+\./.test(para) && para.split(" ").length <= 8;
        // Numbered question items (1. Question text)
        const isNumberedQuestion = /^\d+\.\s/.test(para);
        const isHeading = para.startsWith("##");
        const isSubHeading = para.startsWith("###");
        const isListItem = para.startsWith("- ") || para.startsWith("* ") || para.startsWith("→");
        const isTable = para.startsWith("|");
        const isBold = para.startsWith("**") && para.endsWith("**");

        // Detect Six Laws cards (healing article only)
        // Note: LAW paragraphs start with **LAW... but don't end with ** (body text follows bold title)
        const isLawCard = isHealingArticle && /^\*\*LAW (I{1,3}V?|VI?)/.test(para);

        // Detect off-label prescribing explainer heading — render as a dark olive callout box
        const isOffLabelHeading = isHealingArticle && isHeading && para.replace(/^#+\s*/, "") === "What Is Off-Label Prescribing?";

        // Detect Scappa section heading — render the whole section as a cinematic callout
        const isScappaHeading = isHealingArticle && isHeading && para.replace(/^#+\s*/, "") === "A Response Worth Keeping";

        // Detect GemSpark heading — render the whole section as a warm amber GemSpark callout

        // Check if this bold line is a section label (like "On Presence & Flow:")
        const isSectionLabel = !isLawCard && isBold && /^\*\*On .+:\*\*$/.test(para);
        // Also catch other bold labels that precede quotes (e.g. "Interventions:", "Core Work:")
        const isBoldLabel = isBold && para.endsWith(":**");

        const showPullQuote = pullQuote && i === pullQuote.afterIndex;
        // Skip the paragraph that IS the pullquote (it will be rendered as a styled pullquote instead)
        if (pullQuote && para === pullQuote.text) {
          if (showPullQuote) {
            return <ArticlePullQuote key={`pq-${i}`}>{pullQuote.text}</ArticlePullQuote>;
          }
          return null;
        }
        const elements: React.ReactNode[] = [];

        if (isLinkedImage) {
          const linkedImgMatch = para.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
          if (linkedImgMatch) {
            elements.push(
              <figure key={i} style={{ margin: "2rem 0", textAlign: "center" }}>
                <a href={linkedImgMatch[3]} target="_blank" rel="noopener noreferrer" style={{ display: "block", cursor: "pointer" }}>
                  <img
                    src={linkedImgMatch[2]}
                    alt={linkedImgMatch[1]}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}
                  />
                </a>
                {linkedImgMatch[1] && (
                  <figcaption style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    color: "#777",
                    marginTop: "0.75rem",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}><a href={linkedImgMatch[3]} target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}>{linkedImgMatch[1]} ↗</a></figcaption>
                )}
              </figure>
            );
          }
        } else if (isImage) {
          const imgMatch = para.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
          if (imgMatch) {
            elements.push(
              <figure key={i} style={{
                margin: "3.5rem calc(-1 * clamp(1.5rem, 6vw, 5rem))",
                textAlign: "center",
                position: "relative",
              }}>
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "3px",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
                    transition: "box-shadow 0.45s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 48px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 30px rgba(0,0,0,0.08)"; }}
                >
                  <img
                    src={imgMatch[2]}
                    alt={imgMatch[1]}
                    loading="lazy"
                    {...responsiveImageProps(imgMatch[2], "section")}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      maxHeight: "620px",
                      opacity: 1,
                      cursor: "zoom-in",
                      transition: "transform 0.45s ease, filter 0.45s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.025)"; e.currentTarget.style.filter = "brightness(1.06) saturate(1.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(1) saturate(1)"; }}
                  />
                </div>
                {imgMatch[1] && (
                  <figcaption style={{
                    fontFamily: "'DM Sans', 'Source Sans 3', sans-serif",
                    fontSize: "0.75rem",
                    color: "#777",
                    marginTop: "1rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1.5,
                    textAlign: "center",
                    fontStyle: "italic",
                  }}>{imgMatch[1]}</figcaption>
                )}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(139,90,43,0.12)",
                }}>
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: "#999", textTransform: "uppercase" }}>Share</span>
                  {(["\u{1D54F}", "in", "Copy"] as const).map((label) => (
                    <button
                      key={label}
                      onClick={() => {
                        const shareUrl = `https://tonygreenberg.com/blog/${slug || ""}`;
                        if (label === "\u{1D54F}") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent((imgMatch[1] || "").slice(0, 120))}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer,width=600,height=400");
                        else if (label === "in") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer,width=600,height=400");
                        else navigator.clipboard.writeText(shareUrl);
                      }}
                      style={{
                        background: label === "\u{1D54F}" ? "#000" : label === "in" ? "#0077B5" : "#8B5A2B",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.3rem 0.7rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                    >{label}</button>
                  ))}
                </div>
              </figure>
            );
          }
        } else if (isHr) {
          elements.push(
            <hr
              key={i}
              style={{
                border: "none",
                borderTop: "1px solid rgba(139,90,43,0.2)",
                margin: "3rem auto",
                width: "40%",
              }}
            />
          );
        } else if (isTonySectionHeader) {
          // Tony's custom ◆ / ✴ section headers
          const headerText = para.replace(/^[◆✴]\s*/, "");
          const headingId = headerText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          elements.push(
            <h2
              key={i}
              id={headingId}
              style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#2C1810",
                marginTop: "4.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.25,
                letterSpacing: "0.01em",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(139,90,43,0.15)",
                scrollMarginTop: "100px",
              }}
            >
              {headerText}
            </h2>
          );
        } else if (isPlainSectionTitle) {
          // Plain-text section titles like "Further Reading", "Five Questions Worth Sitting With"
          const titleId = para.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          elements.push(
            <h2
              key={i}
              id={titleId}
              style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#2C1810",
                marginTop: "4.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.25,
                letterSpacing: "0.01em",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(139,90,43,0.15)",
                scrollMarginTop: "100px",
              }}
            >
              {para}
            </h2>
          );
        } else if (isNumberedQuestion) {
          // Numbered question items
          const numMatch = para.match(/^(\d+)\.\s*(.+)$/);
          const num = numMatch ? numMatch[1] : "";
          const questionText = numMatch ? numMatch[2] : para;
          elements.push(
            <div key={i} style={{ display: "flex", gap: "1rem", marginTop: "2rem", marginBottom: "0.25rem" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#8B6914", letterSpacing: "0.1em", minWidth: "1.5rem", paddingTop: "0.35rem" }}>{num}.</span>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)", fontWeight: 600, color: "#2C1810", lineHeight: 1.5, margin: 0 }}>
                <LinkedParagraph text={questionText} linkColor="#5C3D1E" />
              </p>
            </div>
          );
        } else if (isSubHeading) {
          elements.push(
            <h3
              key={i}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginTop: "1.5rem",
                marginBottom: "0.6rem",
                paddingBottom: "0.4rem",
                borderBottom: "1px solid rgba(139,105,20,0.15)",
              }}
            >
              {para.replace(/^#{1,3}\s*/, "")}
            </h3>
          );
        } else if (isOffLabelHeading) {
          // Consume all following paragraphs until the next ## heading
          let jOff = i + 1;
          while (jOff < paragraphs.length && !paragraphs[jOff].startsWith("## ")) jOff++;
          scappaConsumedUntil = jOff - 1;
          elements.push(<OffLabelCallout key={`off-label-callout-${i}`} />);
        } else if (isScappaHeading) {
          // ── CINEMATIC SCAPPA CALLOUT ─────────────────────────────────────────
          // Look ahead: collect intro paragraph, quote lines, attribution, closing line, final sentence
          let introText = "";
          let scappaQuoteLines: string[] = [];
          let scappaAttrib: string | null = null;
          let closingLine = "";
          let finalSentence = "";
          let j = i + 1;
          // Next non-empty paragraph is the intro
          while (j < paragraphs.length && paragraphs[j].trim() === "") j++;
          if (j < paragraphs.length && !paragraphs[j].startsWith(">") && !paragraphs[j].startsWith("##")) {
            introText = paragraphs[j];
            j++;
          }
          // Collect blockquote lines
          while (j < paragraphs.length && (paragraphs[j].startsWith("> ") || paragraphs[j] === ">")) {
            const lineText = paragraphs[j].replace(/^>\s*/, "");
            if (/^[—\-]\s/.test(lineText)) {
              scappaAttrib = lineText;
            } else {
              scappaQuoteLines.push(lineText);
            }
            j++;
          }
          // Next paragraph after quote: closing line (the isolated quote)
          while (j < paragraphs.length && paragraphs[j].trim() === "") j++;
          if (j < paragraphs.length && !paragraphs[j].startsWith("##") && !paragraphs[j].startsWith(">")) {
            const candidate = paragraphs[j];
            // Closing line is the one with "Do not trust blindly" or starts with a quote char
            if (candidate.includes("Do not trust blindly") || candidate.startsWith('"') || candidate.startsWith('\u201c')) {
              closingLine = candidate.replace(/^"|"$/g, "").replace(/^\u201c|\u201d$/g, "");
              j++;
            }
          }
          // Final sentence
          while (j < paragraphs.length && paragraphs[j].trim() === "") j++;
          if (j < paragraphs.length && !paragraphs[j].startsWith("##") && !paragraphs[j].startsWith(">")) {
            const candidate = paragraphs[j];
            if (candidate.includes("Six Laws in one sentence") || candidate.includes("That is the")) {
              finalSentence = candidate;
              j++;
            }
          }
          // Mark all consumed paragraphs as skipped (handled by scappaConsumedIndices)
          // We'll use a ref-like approach: push the callout and return early
          elements.push(
            <ScappaCallout
              key={`scappa-callout-${i}`}
              introText={introText}
              quoteLines={scappaQuoteLines}
              attribution={scappaAttrib}
              closingLine={closingLine}
              finalSentence={finalSentence}
            />
          );
          // Mark subsequent paragraphs as consumed so they don't render again
          // We do this by storing consumed range in a variable accessible to the outer map
          // Since we can't mutate from inside map, we use a workaround: render null for them
          // This is handled by the scappaConsumedUntil check added to the map
          scappaConsumedUntil = j - 1;
        } else if (isHeading) {
          const headingText = para.replace(/^#{1,2}\s*/, "");
          const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          elements.push(
            <h2
              key={i}
              id={headingId}
              style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: isUpdated ? "clamp(1.5rem, 2.8vw, 2rem)" : "clamp(1.35rem, 2.3vw, 1.75rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#2C1810",
                marginTop: isUpdated ? "4.5rem" : "3.5rem",
                marginBottom: isUpdated ? "0.5rem" : "1rem",
                lineHeight: 1.25,
                letterSpacing: "0.01em",
                paddingBottom: isUpdated ? "0.75rem" : "0",
                borderBottom: isUpdated ? "1px solid rgba(139,90,43,0.15)" : "none",
                scrollMarginTop: "100px",
              }}
            >
              {headingText}
            </h2>
          );
        } else if (isLawCard) {
          // ── CINEMATIC SIX LAWS CARD ──────────────────────────────────────────
          const lawMatch = para.match(/^\*\*(LAW (I|II|III|IV|V|VI)[^*]*)\*\*(.*)$/);
          const lawTitle = lawMatch ? lawMatch[1].trim() : "";
          const lawBody = lawMatch ? lawMatch[3].trim() : para.replace(/^\*\*/, "").replace(/\*\*$/, "");
          const romanMatch = para.match(/LAW (I{1,3}V?|VI?)/);
          const roman = romanMatch ? romanMatch[1] : "";
          const lawNum = lawTitle.match(/LAW (I{1,3}V?|VI?)/)?.[1] || "";
          const shareTitle = lawTitle.replace(/^LAW (I{1,3}V?|VI?) — /, "");
          const shareUrl = encodeURIComponent("https://tonygreenberg.com/blog/when-healing-becomes-extraction");
          const shareText = encodeURIComponent(`"${shareTitle}" — The Six Laws of Conscious Medicine by Tony "WhyNot" Greenberg`);
          // Metaphorical art images for each law — luminous Japanese minimalism + sacred geometry
          const lawImageMap: Record<string, string> = {
            "I":   "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-I-ph-96qHxZzqsJyjTZXj5stcZu.webp",
            "II":  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-II-ph-2jkUnLxSGLdk48x9tipYeE.webp",
            "III": "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-III-ph-VYrHcozwcm4KTftHgXTXt4.webp",
            "IV":  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-IV-ph-L6uGZv7jGQLkhG2MNPt2fB.webp",
            "V":   "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-V-ph-ZixWjtQpaZUdBNKBDvASPW.webp",
            "VI":  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/law-VI-ph-hbQMiuo6CeGLzaJhDPuHSA.webp",
          };
          const lawImage = lawImageMap[roman] || "";
          elements.push(
            <div key={i} style={{
              marginLeft: "calc(-1 * var(--article-px, 2rem))",
              marginRight: "calc(-1 * var(--article-px, 2rem))",
              marginTop: "1.75rem",
              marginBottom: "1.75rem",
              overflow: "hidden",
              background: "rgba(255,252,248,0.62)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid rgba(255,255,255,0.8)",
              borderLeft: "3px solid rgba(139,90,43,0.35)",
              boxShadow: "0 2px 20px rgba(139,90,43,0.07), 0 1px 0 rgba(255,255,255,0.95) inset",
              borderRadius: "0 12px 12px 0",
              position: "relative",
            }}>
              {/* Faint roman numeral watermark */}
              <div style={{
                position: "absolute",
                bottom: "-0.5rem",
                right: "0.75rem",
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(4rem, 12vw, 7rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(139,90,43,0.07)",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}>{roman}</div>
              {/* Content */}
              <div style={{
                padding: "clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 1.75rem)",
                position: "relative",
              }}>
                {/* Label row: THE SIX LAWS · LAW I — on one line */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.65rem",
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: "rgba(139,90,43,0.45)",
                    border: "1px solid rgba(139,90,43,0.18)",
                    padding: "0.15rem 0.5rem",
                    lineHeight: 1.4,
                  }}>The Six Laws</span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: "#8B5A2B",
                    fontWeight: 600,
                  }}>Law {lawNum}</span>
                </div>
                {/* Headline */}
                <div style={{
                  fontFamily: "'IM Fell English', serif",
                  fontSize: "clamp(1.1rem, 2.8vw, 1.45rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#2C1810",
                  lineHeight: 1.25,
                  marginBottom: "0.65rem",
                  letterSpacing: "0.01em",
                }}>{shareTitle}</div>
                {/* Thin rule */}
                <div style={{ width: "2rem", height: "1px", background: "rgba(139,90,43,0.35)", marginBottom: "0.65rem" }} />
                {/* Body text */}
                {lawBody && (
                  <div style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: "clamp(0.82rem, 1.4vw, 0.9rem)",
                    color: "#4A2E1A",
                    lineHeight: 1.75,
                    marginBottom: "0.85rem",
                    letterSpacing: "0.005em",
                  }}>{lawBody}</div>
                )}
                {/* Share row */}
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  borderTop: "1px solid rgba(139,105,20,0.1)",
                  paddingTop: "0.65rem",
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase" as const,
                    color: "rgba(139,105,20,0.35)",
                  }}>Share</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&via=ThinkTony`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      color: "rgba(139,105,20,0.55)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#8B6914"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(139,105,20,0.55)"; }}
                  >𝕏 Post</a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      color: "rgba(139,105,20,0.55)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#8B6914"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(139,105,20,0.55)"; }}
                  >LinkedIn</a>
                </div>
              </div>
            </div>
          );
        } else if (isSectionLabel || isBoldLabel) {
          // Render as an elegant centered section label
          const labelText = para.replace(/^\*\*/, "").replace(/\*\*$/, "");
          elements.push(<SectionLabel key={i} text={labelText} keyId={i} />);
        } else if (isBold) {
          // Standalone bold line that's NOT a section label — render as emphasis callout
          const boldText = para.replace(/^\*\*/, "").replace(/\*\*$/, "");
          elements.push(
            <div
              key={i}
              style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#5C3D1E",
                padding: "0.5rem 0",
                margin: "0.5rem 0",
                lineHeight: 1.75,
                borderLeft: "2px solid rgba(139,90,43,0.3)",
                paddingLeft: "1rem",
              }}
            >
              <LinkedParagraph text={boldText} linkColor="#5C3D1E" />
            </div>
          );
        } else if (isListItem) {
          const itemText = para.replace(/^[-*→]\s*/, "");
          elements.push(
            <div
              key={i}
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.1rem)",
                lineHeight: 1.8,
                color: "#3D2B1A",
                marginBottom: "0.65rem",
                paddingLeft: "1.75rem",
                position: "relative",
                fontFamily: "'Libre Baskerville', serif",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#8B5A2B", fontWeight: 400, fontFamily: "'IM Fell English', serif" }}>✦</span>
              <LinkedParagraph text={itemText} linkColor="#5C3D1E" />
            </div>
          );
        } else if (isTable) {
          // Check if this is the first row of a table group
          const prevIsTable = i > 0 && paragraphs[i - 1]?.startsWith("|");
          if (!prevIsTable) {
            // Collect all consecutive table rows
            const tableRows: string[] = [para];
            let j = i + 1;
            while (j < paragraphs.length && paragraphs[j].startsWith("|")) {
              tableRows.push(paragraphs[j]);
              j++;
            }
            elements.push(
              <MarkdownTable key={`table-${i}`} rows={tableRows} keyPrefix={`table-${i}`} />
            );
          } else {
            // This row is part of a table group already rendered — skip
            return null;
          }
        } else if (isFirst) {
          const firstChar = para.charAt(0);
          const restOfPara = para.slice(1);
          elements.push(
            <p
              key={i}
              style={{
                fontSize: "clamp(1.1rem, 1.8vw, 1.22rem)",
                lineHeight: 1.85,
                color: "#2C1810",
                fontFamily: "'Libre Baskerville', 'Georgia', serif",
                marginBottom: "1.25rem",
                textIndent: 0,
              }}
            >
              <span
                style={{
                  float: "left",
                  fontFamily: "'IM Fell English', serif",
                  fontSize: "clamp(3.5rem, 6vw, 4.8rem)",
                  lineHeight: 0.78,
                  fontWeight: 400,
                  color: "#8B5A2B",
                  marginRight: "0.12rem",
                  marginTop: "0.1rem",
                  paddingRight: "0.08rem",
                }}
              >
                {firstChar}
              </span>
              <LinkedParagraph text={restOfPara} />
            </p>
          );
        } else {
          elements.push(
            <p
              key={i}
              style={{
                fontSize: isUpdated ? "clamp(1.05rem, 1.7vw, 1.18rem)" : "clamp(1.05rem, 1.7vw, 1.2rem)",
                lineHeight: isUpdated ? 1.95 : 1.9,
                color: "#2C1810",
                fontFamily: "'Libre Baskerville', 'Georgia', serif",
                marginBottom: isUpdated ? "1.6rem" : "1.5rem",
                letterSpacing: "0.005em",
                textIndent: "1.5em",
              }}
            >
              <LinkedParagraph text={para} linkColor="#5C3D1E" />
            </p>
          );
        }

        if (showPullQuote) {
          elements.push(<ArticlePullQuote key={`pq-${i}`}>{pullQuote.text}</ArticlePullQuote>);
        }

        // For the healing article: insert NBC source link after the first mention of Dr. Lee's charges
        if (isUpdated && para.includes("second-degree felony manslaughter")) {
          elements.push(
            <div key="nbc-source" style={{
              margin: "1.5rem 0",
              padding: "1rem 1.2rem",
              borderLeft: "3px solid #D4B96A",
              background: "rgba(212,185,106,0.05)",
              borderRadius: "0 4px 4px 0",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.3rem" }}>Primary Source</div>
              <a href="https://www.nbcmiami.com/news/local/doctor-charged-after-heart-protocol-ceremony-kills-woman-records-show/3833550/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.95rem", color: "#1a1a1a", textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.2)", lineHeight: 1.5, display: "inline" }}>
                NBC Miami: "Doctor charged after 'Heart Protocol' ceremony kills woman, records show" — July 14, 2026 ↗
              </a>
            </div>
          );
        }

        // For the healing article: insert share prompt after the Five Standards section
        if (isUpdated && (para.includes("Standard 5") || para.includes("Public adverse event reporting"))) {
          elements.push(
            <div key="standards-share" style={{
              margin: "3rem 0 2rem",
              padding: "2rem",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "4px",
              textAlign: "center",
              background: "rgba(0,0,0,0.02)",
            }}>
              <div style={{ fontFamily: "'Fraunces', 'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.5rem", fontStyle: "italic" }}>
                If you believe these five standards should be non-negotiable — share this.
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.88rem", color: "#666", marginBottom: "1.2rem", lineHeight: 1.5 }}>
                The field won't self-regulate from the top. It starts with the person reading this.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Five non-negotiable standards for psychedelic medicine — from an investor who made money today and can't celebrate.")}&url=${encodeURIComponent("https://tonygreenberg.com/blog/when-healing-becomes-extraction")}&via=ThinkTony`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em", padding: "0.6rem 1.2rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "3px", color: "#333", textDecoration: "none", background: "transparent" }}>Share on X</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://tonygreenberg.com/blog/when-healing-becomes-extraction")}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em", padding: "0.6rem 1.2rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "3px", color: "#333", textDecoration: "none", background: "transparent" }}>Share on LinkedIn</a>
              </div>
            </div>
          );
        }

        // Mid-article email capture at ~40% through — suppressed on grief/accountability pieces
        const insertPoint = Math.floor(paragraphs.length * 0.4);
        if (i === insertPoint && !isHealingArticle) {
          elements.push(
            <div key="mid-email" style={{
              margin: "2rem 0",
              padding: "1.25rem 1.5rem",
              borderRadius: "4px",
              background: "#FAFAF7",
              borderLeft: "3px solid #D4B96A",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
              }}>◆ The Dispatch — 12,000 readers</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.3,
              }}>The unpolished version of what I actually think.</div>
              <EmailCapture source="mid-article" />
            </div>
          );
        }

        // After first paragraph for healing article: insert bold pull-out sentence
        if (isHealingArticle && i === 0) {
          elements.push(
            <p key="pullout-hook" style={{
              fontFamily: "'Fraunces', 'Playfair Display', serif",
              fontSize: "clamp(1.35rem, 2.5vw, 1.7rem)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 1.4,
              color: "#0a0a0a",
              maxWidth: "620px",
              margin: "2rem 0 2rem 0",
              letterSpacing: "-0.02em",
              borderLeft: "3px solid #D4B96A",
              paddingLeft: "1.2rem",
            }}>
              I made money today. I'm not celebrating.
            </p>
          );
        }

        return elements;
      });
      })()}

      {/* Disclosure block at bottom for healing article */}
      {isHealingArticle && topBlocks.length > 0 && (
        <div style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8B6914",
            marginBottom: "0.75rem",
          }}>Disclosures & Editor's Notes</p>
          {topBlocks.map((block, bi) => {
            const text = block.replace(/^>\s*/, "");
            return (
              <p key={bi} style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                color: "#666",
                marginBottom: "0.75rem",
                paddingLeft: "1rem",
                borderLeft: "2px solid rgba(139,105,20,0.25)",
              }}>
                <LinkedParagraph text={text} />
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [version, setVersion] = useState<"original" | "updated">("original");

  const post = posts.find((p) => p.slug === params.slug);

  // Fuzzy slug redirect: if exact match fails, try finding a close match
  const fuzzyMatch = useMemo(() => {
    if (post) return null;
    return posts.find((p) => {
      const inputWords = (params.slug || "").split("-");
      const postWords = p.slug.split("-");
      const overlap = inputWords.filter((w) => postWords.includes(w)).length;
      return overlap >= Math.floor(postWords.length * 0.8);
    }) || null;
  }, [post, params.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  // Track last-read blog for returning visitor personalization
  useEffect(() => {
    if (post) {
      setLastBlog(post.slug, post.title);
    }
  }, [post?.slug, post?.title]);

  // Password gate for unpublished or password-protected posts (hooks must be before any early returns)
  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const UNPUBLISHED_PASSWORD = "ofservice";

  const isHealingPost = post?.slug === "when-healing-becomes-extraction";
  const isIndiaPost = post?.slug === "india-my-virtual-soul-home";
  const [lightboxCaption, setLightboxCaption] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!lightboxCaption) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxCaption(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxCaption]);
  const isUnpublished = post ? !!(post as any).unpublished : false;
  const postPassword = post ? (post as any).passwordGate : null;
  const isPasswordGated = !!postPassword;

  // Check sessionStorage for previously unlocked posts
  useEffect(() => {
    if (post && (isUnpublished || isPasswordGated)) {
      const unlockedPosts = JSON.parse(sessionStorage.getItem("unlockedPosts") || "[]");
      if (unlockedPosts.includes(post.slug)) {
        setUnlocked(true);
      }
    }
  }, [post?.slug, isUnpublished, isPasswordGated]);

  // === ALL HOOKS MUST BE ABOVE EARLY RETURNS ===
  const currentIdx = posts.findIndex((p) => p.slug === params.slug);
  const isPremiumPost = currentIdx >= FREE_BLOG_POST_COUNT;
  const { isAuthenticated } = useAuth();
  const { data: blogAccessData, isLoading: blogAccessLoading } = trpc.stripe.hasBlogAccess.useQuery(
    undefined,
    { enabled: isAuthenticated && isPremiumPost && !!post, retry: false }
  );

  const [riddleRevealed, setRiddleRevealed] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    setRiddleRevealed(false);
    setShowHint(false);
  }, [post?.slug]);

  const { data: analyticsData } = trpc.analytics.getPostStats.useQuery(
    { postSlug: post?.slug || "" },
    { staleTime: 60_000, enabled: !!post }
  );

  // === EARLY RETURNS (after all hooks) ===
  if (fuzzyMatch) {
    return <Redirect to={`/blog/${fuzzyMatch.slug}`} />;
  }

  // Redirect Akbar blog post to standalone cinematic page
  if (post?.slug === "akbar-cuisine-restoration-economics") {
    return <Redirect to="/akbar" />;
  }

  if (!post) {
    return (
      <Section>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", marginBottom: "1rem" }}>
            Post Not Found
          </h2>
          <Link href="/blog" style={{ color: "#8B6914" }}>← Back to The Blog</Link>
        </div>
      </Section>
    );
  }

  if ((isUnpublished || isPasswordGated) && !unlocked) {
    const gatePassword = postPassword || UNPUBLISHED_PASSWORD;
    const gateTitle = isPasswordGated ? "This One's Behind a Door" : "Unpublished Work";
    const gateMessage = isPasswordGated
      ? "You need the password to read this piece. If you have it, enter it below."
      : "This piece isn't public yet. If you have the password, enter it below.";
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF7" }}>
        <div style={{ maxWidth: 440, width: "100%", padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#D4B96A" }}>&#9830;</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "0.5rem" }}>
            {gateTitle}
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            {gateMessage}
          </p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === gatePassword) {
              setUnlocked(true);
              setPasswordError(false);
              const unlockedPosts = JSON.parse(sessionStorage.getItem("unlockedPosts") || "[]");
              unlockedPosts.push(post.slug);
              sessionStorage.setItem("unlockedPosts", JSON.stringify(unlockedPosts));
            } else {
              setPasswordError(true);
            }
          }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.95rem",
                border: passwordError ? "2px solid #8B0000" : "2px solid #D4B96A",
                borderRadius: 8,
                background: "#fff",
                outline: "none",
                textAlign: "center",
                letterSpacing: "0.15em",
                marginBottom: "0.75rem",
                boxSizing: "border-box",
              }}
              autoFocus
            />
            {passwordError && (
              <p style={{ color: "#8B0000", fontSize: "0.85rem", fontFamily: "'DM Mono', monospace", marginBottom: "0.75rem" }}>
                That's not it. Try again.
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.8rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "#8B6914",
                color: "#FAFAF7",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Unlock
            </button>
          </form>
          <Link href="/blog" style={{ display: "inline-block", marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#8B6914", letterSpacing: "0.1em" }}>
            ← Back to The Blog
          </Link>
        </div>
      </div>
    );
  }

  // === DERIVED STATE (post is guaranteed non-null below) ===
  const hasPaidAccess = !isPremiumPost || blogAccessData === true;

  // Series-aware prev/next: if this post belongs to a series, navigate within the series
  const tempSeriesInfo = getSeriesForPost(post.slug);
  let prevPost: Post | null = null;
  let nextPost: Post | null = null;
  if (tempSeriesInfo) {
    const seriesSlugs = tempSeriesInfo.series.posts;
    const seriesIdx = seriesSlugs.indexOf(post.slug);
    if (seriesIdx > 0) prevPost = posts.find(p => p.slug === seriesSlugs[seriesIdx - 1]) || null;
    if (seriesIdx < seriesSlugs.length - 1) nextPost = posts.find(p => p.slug === seriesSlugs[seriesIdx + 1]) || null;
  } else {
    prevPost = currentIdx > 0 ? posts[currentIdx - 1] : null;
    nextPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;
  }

  const hasOriginal = post.originalContent && post.originalContent.length > 50;
  const hasUpdated = post.updatedContent && post.updatedContent.length > 50;
  const content = post.slug === "your-blood-lies-without-your-dna"
    ? BLOOD_DNA_REVISED_CONTENT
    : version === "updated" && hasUpdated
    ? post.updatedContent
    : hasOriginal
    ? post.originalContent
    : hasUpdated
    ? post.updatedContent
    : post.originalContent;
  const isUpdated = version === "updated" && !!hasUpdated;

  // Extract TOC headings from article content
  const tocHeadings = React.useMemo(() => extractTOCHeadings(content || ""), [content]);

  const furtherReading = getFurtherReading(post.category, post.formatTag);
  const formatColor = formatColors[post.formatTag] || "#333";

  // Curated reading paths — editorial "up next" connections
  const curatedNext = getCuratedPath(post.slug, post.category, posts);
  // Fallback to category-based if curated returns nothing
  const relatedPostsBase = curatedNext.length > 0 ? curatedNext : posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, reason: "More from this collection", summary: p.summary }));
  // Enrich with full post data (image, formatTag, readTime, category)
  const relatedPosts = relatedPostsBase.map((rp) => {
    const full = posts.find((p) => p.slug === rp.slug);
    return {
      ...rp,
      image: full?.image || "",
      formatTag: full?.formatTag || "",
      readTime: (full as any)?.readTime || "",
      category: full?.category || "",
    };
  });

  // Series info
  const seriesInfo = getSeriesForPost(post.slug);

  // Riddle for this post
  const riddle = riddles[post.slug];

  // Article footer data (exercise, related articles, riddle, further reading)
  const articleFooter = (footerData as Record<string, any>)[post.slug] || null;
  const mirrorEntry = (mirrorData.mirrors as Record<string, any>)[post.slug] || null;
  const mirrorDimension = mirrorEntry ? mirrorData.dimensions.find((d: any) => d.id === mirrorEntry.dimension) : null;

  // Estimate reading time
  const wordCount = content ? content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 230));

  // Dynamic read count: baseline from blogData + actual analytics views
  const baselineReads = post.reads || 500;
  const actualViews = analyticsData?.views ?? 0;
  const displayReads = baselineReads + actualViews;

  return (
    <div>
      <BlogSEO post={post} />
      <ReadingProgressBar />
      <StickyShareBar title={post.title} slug={post.slug} />

      {/* ── HERO ── */}
      {post.image ? (
        (post.slug === "when-healing-becomes-extraction" || post.slug === "energy-is-money-money-is-memory") ? (
          /* ── MAGAZINE HERO: full-viewport, title overlaid bottom-left ── */
          <div style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0a0a0a", height: "clamp(520px, 90vh, 100vh)" }}>
            <img
              alt={post.title}
              {...responsiveImageProps(post.image, "hero")}
              style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: "center 35%" }}
              loading="eager"
              fetchPriority="high"
            />
            {/* Deep gradient vignette — heavier at bottom for legibility */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.08) 65%, transparent 100%)", pointerEvents: "none" }} />
            {/* Thin gold rule above title */}
            <div style={{ position: "absolute", bottom: "clamp(7.5rem, 18vw, 12rem)", left: "clamp(1.5rem, 6vw, 5rem)", width: "clamp(2.5rem, 6vw, 4rem)", height: "2px", background: "#D4B96A", pointerEvents: "none" }} />
            {/* Category eyebrow */}
            <div style={{ position: "absolute", bottom: "clamp(6.2rem, 15vw, 10.5rem)", left: "clamp(1.5rem, 6vw, 5rem)", pointerEvents: "none" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4B96A", fontWeight: 500 }}>{post.formatTag || post.category}</span>
            </div>
            {/* Main title */}
            <div style={{ position: "absolute", bottom: "calc(clamp(2rem, 5vw, 3.5rem) + env(safe-area-inset-bottom, 0px))", left: "clamp(1.5rem, 6vw, 5rem)", right: "clamp(1.5rem, 6vw, 5rem)", pointerEvents: "none" }}>
              <h1 style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                margin: 0,
                color: "#F5EDD8",
                textShadow: "0 2px 40px rgba(0,0,0,0.7), 0 0 80px rgba(0,0,0,0.4)",
                letterSpacing: "0.01em",
                maxWidth: "900px",
                fontStyle: "italic",
              }}>{post.title}</h1>
            </div>
          </div>
        ) : (
          <div style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0a0a0a", minHeight: "clamp(320px, 50vh, 600px)" }}>
            {(post as any).heroLink ? (
              <a href={(post as any).heroLink} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: "100%" }}>
                <img alt={post.title} {...responsiveImageProps(post.image, "hero")} style={{ width: "100%", height: "clamp(320px, 50vh, 600px)", display: "block", objectFit: "cover", objectPosition: "center 40%" }} loading="eager" fetchPriority="high" />
              </a>
            ) : (
              <img alt={post.title} {...responsiveImageProps(post.image, "hero")} style={{ width: "100%", height: "clamp(320px, 50vh, 600px)", display: "block", objectFit: "cover", objectPosition: "center 40%" }} loading="eager" fetchPriority="high" />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "clamp(1.5rem, 5vw, 3rem)", right: "clamp(1.5rem, 5vw, 3rem)", color: "#fff", pointerEvents: "none" }}>
              <h1 style={{ fontFamily: "'Fraunces', 'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.1, margin: 0, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>{post.title}</h1>
            </div>
          </div>
        )
      ) : (
        <div style={{ width: "100%", height: "clamp(80px, 12vw, 140px)", background: `linear-gradient(135deg, #F5F0E8 0%, ${formatColor}22 100%)` }} />
      )}

      {/* ── TWO-COLUMN LAYOUT: article + sticky TOC sidebar ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "flex-start", gap: "2.5rem" }}>
      <section style={{ flex: "1 1 0", minWidth: 0, padding: "2.5rem clamp(1rem, 3vw, 2rem) calc(3rem + env(safe-area-inset-bottom, 60px))", boxSizing: "border-box" as const, width: "100%", ["--article-px" as string]: "clamp(1rem, 3vw, 2rem)" }}>
        <FadeIn>
          {/* ── BACK LINK ── */}
          <Link
            href="/blog"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "0.5rem",
              color: "#555",
              opacity: 0.8,
            }}
          >
            ← Back to The Blog
          </Link>

          {/* ── META ROW ── */}
          <div style={{ marginBottom: "0.35rem" }}>
            {/* Format tag */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
              {post.formatTag && (
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.7rem",
                    borderRadius: "2px",
                    background: formatColor,
                    color: "#fff",
                  }}
                >
                  {post.formatTag}
                </span>
              )}
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "#999",
                letterSpacing: "0.06em",
                lineHeight: 1.6,
              }}>
                <span style={{ whiteSpace: "nowrap" as const }}>{post.date}</span>
                <span style={{ margin: "0 0.25rem" }}>·</span>
                <span style={{ whiteSpace: "nowrap" as const }}>{post.category}</span>
                <span style={{ margin: "0 0.25rem" }}>·</span>
                <span style={{ whiteSpace: "nowrap" as const }}>{readingTime} min read</span>
                <span style={{ margin: "0 0.25rem" }}>·</span>
                <span style={{ whiteSpace: "nowrap" as const }}>{displayReads.toLocaleString()} reads</span>
              </span>
            </div>

            {/* Validity score */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: post.validityScore >= 90 ? "#2E8B57" : post.validityScore >= 75 ? "#4682B4" : post.validityScore >= 60 ? "#B8860B" : "#8B0000",
                  display: "inline-block",
                }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999" }}>
                Validity: {post.validityScore} — {post.validityLabel}
              </span>
            </div>
          </div>

          {/* ── SERIES BADGE ── */}
          {seriesInfo && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.8rem",
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "3px",
              marginBottom: "0.35rem",
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#333",
                fontWeight: 600,
              }}>
                {seriesInfo.series.title}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "#999",
              }}>
                Part {seriesInfo.episodeNumber} of {seriesInfo.totalEpisodes}
              </span>
            </div>
          )}

          {/* ── TITLE (hidden when hero has overlaid title) ── */}
          {!post.image && (
            <h1
              style={{
                fontFamily: "'Fraunces', 'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 900,
                color: "#0a0a0a",
                lineHeight: 1.05,
                marginBottom: "0.5rem",
                maxWidth: "780px",
                letterSpacing: "-0.025em",
              }}
            >
              {post.title}
            </h1>
          )}

          {/* ── BYLINE ── */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            color: "#999",
            letterSpacing: "0.06em",
            marginBottom: "0.75rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}>
            By{" "}
            <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" style={{ color: "#333", textDecoration: "none" }}>
              Tony "WhyNot" Greenberg
            </a>
          </div>

          {/* ── ABOVE-THE-FOLD HOOK — summary that hooks cold readers ── */}
          {post.summary && (
            post.slug === "when-healing-becomes-extraction" ? (
              /* Magazine standfirst: large centered italic deck, no border */
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                lineHeight: 1.8,
                color: "#5C3D1E",
                maxWidth: "680px",
                marginBottom: "1.5rem",
                marginTop: "0.5rem",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}>
                {post.summary}
              </p>
            ) : (
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: "clamp(1rem, 1.8vw, 1.12rem)",
                lineHeight: 1.8,
                color: "#5C3D1E",
                maxWidth: "680px",
                marginBottom: "1rem",
                paddingLeft: "1rem",
                borderLeft: "2px solid rgba(139,90,43,0.35)",
                fontStyle: "italic",
              }}>
                {post.summary}
              </p>
            )
          )}

          {/* ── VERSION TOGGLE ── */}
          {hasOriginal && hasUpdated && (
            <div style={{ display: "flex", gap: "0", marginBottom: "0.8rem", overflow: "visible", maxWidth: "100%", flexWrap: "wrap" as const }}>
              <button
                onClick={() => setVersion("original")}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  padding: "0.5rem 1.2rem",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRight: "none",
                  borderRadius: "3px 0 0 3px",
                  background: version === "original" ? "#111" : "transparent",
                  color: version === "original" ? "#F5F0E0" : "#888",
                  fontWeight: version === "original" ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {post.slug === "is-that-a-lot-clarisse-abelarde" ? "THE ESSAY · 8 MIN" : "ORIGINAL POST"}
              </button>
              <button
                onClick={() => setVersion("updated")}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  padding: "0.5rem 1.2rem",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: "0 3px 3px 0",
                  background: version === "updated" ? "#111" : "transparent",
                  color: version === "updated" ? "#F5F0E0" : "#888",
                  fontWeight: version === "updated" ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {post.slug === "is-that-a-lot-clarisse-abelarde" ? "✦ DEEP DISCOURSE · 15 MIN" : "✦ UPDATED FOR TODAY"}
              </button>
            </div>
          )}

          {/* ── PRIDE NOTE (Clarisse article only) ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: "#8B6914",
              marginBottom: "0.8rem",
              lineHeight: 1.5,
              opacity: 0.85,
            }}>
              I am so proud to be a part of this story.
            </p>
          )}

          {/* ── LIVE READ COUNTER (Clarisse article only) ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <div style={{ marginBottom: "0.8rem" }}>
              <ReadCounter postSlug={post.slug} version={version === "updated" ? "long" : "short"} />
            </div>
          )}

            {/* ── SHARE BAR ── */}
          <ShareBar post={post} />

          {/* RIDDLE */}
          {riddle && (
            <div style={{
              maxWidth: "780px",
              margin: "0 0 20px 0",
              padding: "20px 24px",
              background: "linear-gradient(135deg, #fefdfb 0%, #f8f5ed 100%)",
              border: "1px solid #e8e4dc",
              borderLeft: "3px solid #8B6914",
              borderRadius: 8,
            }}>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: 12,
              }}>
                Before You Read
              </p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                lineHeight: 1.6,
                color: "#1a1a1a",
                marginBottom: 16,
              }}>
                {riddle.question}
              </p>
              {!riddleRevealed ? (
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setRiddleRevealed(true)}
                    style={{
                      background: "#8B6914",
                      color: "#FAFAF7",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 20px",
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Reveal
                  </button>
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      style={{
                        background: "transparent",
                        color: "#8B6914",
                        border: "1px solid #d4c9a8",
                        borderRadius: 6,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Hint
                    </button>
                  )}
                  {showHint && (
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      color: "#888",
                    }}>
                      {riddle.hint}
                    </span>
                  )}
                </div>
              ) : (
                <p style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#444",
                  padding: "12px 0 0 0",
                  borderTop: "1px solid #e8e4dc",
                }}>
                  {riddle.answer}
                </p>
              )}
            </div>
          )}

          {/* \u2500\u          {/* ── ARTICLE CONTENT ── */}
          {isPremiumPost && !hasPaidAccess && !blogAccessLoading ? (
            <BlogPaywall postIndex={currentIdx} totalPosts={posts.length} />
          ) : content ? (
            <>
              <ArticleContent content={content} isUpdated={isUpdated} slug={post.slug} />
              {post.slug === "the-restaurant-with-no-menu-prices-ai-ethics-manifesto" && (
                <div style={{ maxWidth: "780px" }}>
                  <MovementSignup />
                </div>
              )}
              {post.slug === "boiling-the-human-summit-harvard-kurzweil" && (
                <div style={{
                  maxWidth: "780px",
                  margin: "2.5rem 0",
                  padding: "2rem clamp(1rem, 3vw, 2rem)",
                  background: "linear-gradient(135deg, #FEFCF7 0%, #F5F0E8 100%)",
                  border: "1px solid rgba(139,105,20,0.15)",
                  borderRadius: "6px",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    marginBottom: "0.8rem",
                  }}>This essay became the foundation</div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    fontWeight: 400,
                    color: "#0a0a0a",
                    lineHeight: 1.3,
                    marginBottom: "1rem",
                  }}>The ideas here grew into a Living Declaration — and a diagnostic tool.</h3>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "#555",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    maxWidth: "520px",
                    margin: "0 auto 1.5rem",
                  }}>Are you a conscious satisficer or an unconscious maximizer? The assessment takes five minutes. The Living Declaration explains why it matters.</p>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href="/living-declaration"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#FAFAF7",
                        background: "#8B6914",
                        textDecoration: "none",
                        padding: "0.8rem 1.8rem",
                        borderRadius: "4px",
                        transition: "all 0.2s",
                      }}
                    >Read the Living Declaration →</a>
                    <a
                      href="/assessment"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#8B6914",
                        background: "transparent",
                        textDecoration: "none",
                        padding: "0.8rem 1.8rem",
                        borderRadius: "4px",
                        border: "1px solid rgba(139,105,20,0.4)",
                        transition: "all 0.2s",
                      }}
                    >Take the Assessment →</a>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ maxWidth: "780px" }}>
              <p style={{ color: "#888",  fontSize: "1.1rem" }}>Full content is being migrated.</p>
              <a href={post.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>
                Read on tonygreenberg.com →
              </a>
            </div>
          )}          {/* ── SUBSCRIBE OUTBURST (mid-article) — suppressed on grief/accountability pieces ── */}
          {!isHealingPost && (
          <div style={{ maxWidth: "780px" }}>
            <SubscribeOutburst slug={post.slug} />
          </div>
          )}

          <OrnamentalDivider />

          {/* ── THE LESSON ── */}
          {post.lesson && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "1.5rem clamp(1rem, 3vw, 1.8rem)",
                  background: "rgba(242,232,213,0.4)",
                  borderLeft: "2px solid rgba(139,90,43,0.4)",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: "#8B5A2B",
                    marginBottom: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.7rem" }}>✦</span> The Lesson
                </div>
                <p
                  style={{
                    fontFamily: "'IM Fell English', serif",
                    fontSize: "clamp(1.05rem, 1.6vw, 1.18rem)",
                    lineHeight: 1.8,
                    color: "#2C1810",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  {post.lesson}
                </p>
              </div>
            </div>
          )}

          {/* ── DEEPEN YOUR UNDERSTANDING ── */}
          {post.nextSteps && post.nextSteps.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "2rem 0",
                  borderTop: "1px solid #ddd",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: "#8B5A2B",
                    fontWeight: 400,
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  Next Steps
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.25), transparent)" }} />
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {post.nextSteps.map((step, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                        lineHeight: 1.85,
                        color: "#3D2B1A",
                        marginBottom: "0.7rem",
                        paddingLeft: "1.5rem",
                        position: "relative",
                        fontFamily: "'Libre Baskerville', serif",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0, color: "#8B5A2B", fontWeight: 400, fontFamily: "'IM Fell English', serif" }}>✦</span>
                      <LinkedParagraph text={step} linkColor="#5C3D1E" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── ELIXIR OF LIFE PRODUCT SHOWCASE ── */}
          {post.slug === "elixir-of-life-device-and-journey" && (
            <div style={{ maxWidth: "780px", marginBottom: "2.5rem" }}>
              {/* Section Header */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#8B6914",
                  marginBottom: "0.5rem",
                  paddingBottom: "0.4rem",
                  borderBottom: "1px solid rgba(139,105,20,0.15)",
                }}
              >
                THE ELIXIR OF LIFE COLLECTION
              </div>

              {/* Poetic intro */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.15rem, 1.8vw, 1.3rem)",
                  lineHeight: 1.8,
                  color: "#333",
                  marginBottom: "2rem",
                  fontStyle: "italic",
                }}
              >
                Water is the universe's most precious resource—the original healer, the first medicine, the memory of the earth itself. Every sacred tradition understood this. The Elixir of Life collection, handcrafted in France by Richard Poiré, channels 33 sacred waters, 33 crystals, and 15,000 quantum frequencies into objects that don't just hold water—they remember it. Spreading love and healing throughout the universe, one drop at a time.
              </p>

              {/* Two Product Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                {/* Product 1: Golden Rudraksha */}
                <div
                  style={{
                    border: "1px solid rgba(139,105,20,0.15)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E8 100%)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.15)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center", background: "#fff" }}>
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/elixir-golden-rudraksha_f3662a8d.png"
                      alt="Golden Rudraksha Pendant by Elixir of Life"
                      style={{ maxHeight: "280px", objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ padding: "1.2rem 1.5rem" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1a1a1a", margin: "0 0 0.5rem" }}>
                      Golden Rudraksha Pendant
                    </h4>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.6, margin: "0 0 1rem" }}>
                      The pendant that started the journey. Based on the therapeutic properties of 33 sacred waters, 33 crystals, and 15,000 quantum frequencies—a dynamic elixir that stimulates the chakras, increases vital energy, and harmonizes emotions.
                    </p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#8B6914" }}>
                      €199.00
                    </div>
                  </div>
                </div>

                {/* Product 2: Alchemy Meditation Therapy */}
                <div
                  style={{
                    border: "1px solid rgba(139,105,20,0.15)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E8 100%)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,105,20,0.15)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center", background: "#fff" }}>
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/elixir-meditation-hat_74c24d62.jpeg"
                      alt="Alchemy Meditation Therapy Set by Elixir of Life"
                      style={{ maxHeight: "280px", objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ padding: "1.2rem 1.5rem" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#1a1a1a", margin: "0 0 0.5rem" }}>
                      Alchemy Meditation Therapy Set
                    </h4>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.6, margin: "0 0 1rem" }}>
                      A complete ceremonial set for therapists and practitioners. Includes the meditation device, vitalizers, and pendant—everything needed to create a sacred space for healing work and group ceremonies.
                    </p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "#8B6914" }}>
                      €199.00
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Codes to Order */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem" }}>
                    SCAN TO ORDER — GOLDEN RUDRAKSHA
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://www.elixiroflife.fr/en/product-page/golden-rudraksha")}&color=8B6914&bgcolor=FAFAF7`}
                    alt="QR Code to order Golden Rudraksha"
                    style={{ width: "160px", height: "160px", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "8px", background: "#FAFAF7" }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem" }}>
                    SCAN TO ORDER — MEDITATION SET
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://www.elixiroflife.fr/en/product-page/elixir-of-life-alchemy-meditation-therapy")}&color=8B6914&bgcolor=FAFAF7`}
                    alt="QR Code to order Alchemy Meditation Therapy Set"
                    style={{ width: "160px", height: "160px", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "8px", background: "#FAFAF7" }}
                  />
                </div>
              </div>

              {/* Order Through Tony */}
              <div
                style={{
                  padding: "1.8rem clamp(1rem, 3vw, 2rem)",
                  background: "linear-gradient(135deg, rgba(139,105,20,0.08) 0%, rgba(212,185,106,0.06) 100%)",
                  border: "2px solid rgba(139,105,20,0.2)",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    marginBottom: "0.8rem",
                  }}
                >
                  ORDER THROUGH TONY
                </div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.1rem, 1.6vw, 1.25rem)",
                    lineHeight: 1.75,
                    color: "#333",
                    marginBottom: "1rem",
                    maxWidth: "600px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Special pricing and shipping when you order through me. Especially for bulk orders of 10 or more—perfect for ceremonies, retreats, healing circles, and meaningful gifts that carry the memory of sacred water.
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "#666",
                    marginBottom: "1.5rem",
                  }}
                >
                  Reach out directly and I'll arrange everything with Richard in France.
                </p>
                <a
                  href="mailto:tony@tonygreenberg.com?subject=Elixir%20of%20Life%20%E2%80%94%20Bulk%20Order%20Inquiry&body=Hi%20Tony%2C%0A%0AI'm%20interested%20in%20ordering%20Elixir%20of%20Life%20pieces.%0A%0AQuantity%3A%0AWhich%20pieces%3A%0APurpose%20(ceremony%2C%20gifts%2C%20personal)%3A%0A%0AThanks!"
                  style={{
                    display: "inline-block",
                    padding: "0.8rem 2.5rem",
                    background: "#8B6914",
                    color: "#FAFAF7",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderRadius: "4px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#D4B96A";
                    e.currentTarget.style.color = "#0A0A10";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#8B6914";
                    e.currentTarget.style.color = "#FAFAF7";
                  }}
                >
                  Contact Tony for Special Pricing
                </a>
              </div>
            </div>
          )}

          {/* ── DR LEE TIMELINE (when-healing-becomes-extraction only) ── */}
          {post.slug === "when-healing-becomes-extraction" && (
            <DrLeeTimeline />
          )}

          {/* ── INDIA PHOTO GALLERIES ── */}
          {isIndiaPost && (
            <div style={{ maxWidth: "780px", margin: "3rem 0" }}>
              {/* Saiphai School Gallery */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#8B5A2B", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ display: "inline-block", width: "24px", height: "1px", background: "#8B5A2B" }} />
                  Saiphai School · Just Let Me Learn Foundation
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {["Ground breaking · April 2012", "Opening day · April 2014", "The fields"].map((caption, i) => (
                    <div key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxCaption(caption)}
                      onKeyDown={e => e.key === "Enter" && setLightboxCaption(caption)}
                      style={{ position: "relative" as const, overflow: "hidden", borderRadius: "3px", background: "#F0EBE1", aspectRatio: "4/3", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", border: "1px dashed #C4A882", cursor: "zoom-in", transition: "box-shadow 0.35s ease, transform 0.35s ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(139,105,20,0.18)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.025)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.2" style={{ marginBottom: "0.5rem" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#9A7A50", textAlign: "center" as const, padding: "0 0.5rem" }}>{caption}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: "#888", marginTop: "0.6rem", fontStyle: "italic" }}>Photos coming. If you have images from Saiphai, contact Tony.</p>
              </div>

              {/* Aspen Gallery */}
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#8B5A2B", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ display: "inline-block", width: "24px", height: "1px", background: "#8B5A2B" }} />
                  Good Money Conference · Aspen Institute · July 2026
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                  {["Resnick Aspen Action Forum", "350 Fellows · 30+ countries"].map((caption, i) => (
                    <div key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxCaption(caption)}
                      onKeyDown={e => e.key === "Enter" && setLightboxCaption(caption)}
                      style={{ position: "relative" as const, overflow: "hidden", borderRadius: "3px", background: "#F0EBE1", aspectRatio: "16/9", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", border: "1px dashed #C4A882", cursor: "zoom-in", transition: "box-shadow 0.35s ease, transform 0.35s ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(139,105,20,0.18)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.025)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.2" style={{ marginBottom: "0.5rem" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#9A7A50", textAlign: "center" as const, padding: "0 0.5rem" }}>{caption}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem", color: "#888", marginTop: "0.6rem", fontStyle: "italic" }}>Photos from the Good Money Conference will appear here.</p>
              </div>
            </div>
          )}

          {/* ── INDIA LIGHTBOX OVERLAY ── */}
          {isIndiaPost && lightboxCaption && (
            <div
              onClick={() => setLightboxCaption(null)}
              style={{
                position: "fixed" as const,
                inset: 0,
                zIndex: 9999,
                background: "rgba(10,10,16,0.92)",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                cursor: "zoom-out",
                animation: "fadeIn 0.2s ease",
              }}
            >
              {/* Placeholder full-screen frame */}
              <div style={{
                position: "relative" as const,
                width: "min(80vw, 900px)",
                aspectRatio: "4/3",
                background: "#1A1610",
                border: "1px dashed rgba(196,168,130,0.4)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
                onClick={e => e.stopPropagation()}
              >
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(196,168,130,0.5)" strokeWidth="0.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(196,168,130,0.7)", textAlign: "center" as const, padding: "0 2rem" }}>{lightboxCaption}</span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem" }}>Photo coming soon</span>
              </div>
              {/* Caption bar */}
              <div style={{ marginTop: "1.25rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(196,168,130,0.6)" }}>
                {lightboxCaption}
              </div>
              {/* Close hint */}
              <div style={{ position: "absolute" as const, top: "1.5rem", right: "1.75rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}
                onClick={() => setLightboxCaption(null)}
              >
                ESC × CLOSE
              </div>
            </div>
          )}

          {/* ── FURTHER READING ── */}
          {furtherReading.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase" as const,
                  color: "#8B5A2B",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.7rem" }}>✦</span>
                Further Reading
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.2), transparent)" }} />
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                {furtherReading.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      padding: "1rem clamp(0.8rem, 2vw, 1.2rem)",
                      border: "1px solid rgba(139,105,20,0.1)",
                      borderRadius: "4px",
                      background: "rgba(250,250,247,0.5)",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,105,20,0.3)";
                      e.currentTarget.style.background = "rgba(212,185,106,0.05)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,105,20,0.1)";
                      e.currentTarget.style.background = "rgba(250,250,247,0.5)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem", flexWrap: "wrap" as const, gap: "0.3rem" }}>
                      <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "1.05rem", fontWeight: 400, fontStyle: "italic", color: "#2C1810", minWidth: 0 }}>
                        {link.title}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
                        {link.source}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.9rem", color: "#4A2E1A", lineHeight: 1.65 }}>
                      {link.why}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── VOICES IN THIS SPACE ── */}
          {thoughtLeadersBySlug[post.slug] && thoughtLeadersBySlug[post.slug].length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase" as const,
                  color: "#8B5A2B",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "0.7rem" }}>✦</span>
                Voices in This Space
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,90,43,0.2), transparent)" }} />
              </div>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {thoughtLeadersBySlug[post.slug].map((leader: ThoughtLeader, i: number) => (
                  <a
                    key={i}
                    href={leader.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      textDecoration: "none",
                      padding: "1rem 1.2rem",
                      border: "1px solid rgba(139,105,20,0.08)",
                      borderRadius: "4px",
                      background: "rgba(250,250,247,0.5)",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,105,20,0.25)";
                      e.currentTarget.style.background = "rgba(212,185,106,0.05)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,105,20,0.08)";
                      e.currentTarget.style.background = "rgba(250,250,247,0.5)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#FAFAF7",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}>
                      {leader.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem" }}>
                        <span style={{ fontFamily: "'IM Fell English', serif", fontSize: "1rem", fontWeight: 400, fontStyle: "italic", color: "#2C1810" }}>
                          {leader.name}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#D4B96A", letterSpacing: "0.06em", flexShrink: 0, marginLeft: "0.8rem" }}>
                          ↗
                        </span>
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#888", letterSpacing: "0.03em", marginBottom: "0.3rem" }}>
                        {leader.title}
                      </div>
                      <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.88rem", color: "#4A2E1A", lineHeight: 1.65 }}>
                        {leader.relevance}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── RELEVANT PARTIES ── */}
          {post.relevantParties && post.relevantParties.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#999", marginRight: "0.3rem",
                }}>Also involves:</span>
                {post.relevantParties.map((party, i) => (
                  <span key={i} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                    padding: "0.28rem 0.7rem", borderRadius: "3px",
                    border: "1px solid rgba(139,105,20,0.15)", color: "#8B6914",
                    background: "rgba(212,185,106,0.06)",
                  }} title={party.reason}>{party.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── SUPPORTING NEWS ── */}
          {post.supportingNews && (
            <div style={{
              maxWidth: "780px", marginBottom: "2rem",
              padding: "1.2rem 1.5rem", borderLeft: "3px solid rgba(139,105,20,0.25)",
              background: "rgba(212,185,106,0.04)", borderRadius: "0 4px 4px 0",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem",
              }}>Since this was written</div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: "1.12rem",
                color: "#333", lineHeight: 1.4, fontWeight: 600, marginBottom: "0.3rem",
              }}>{post.supportingNews.headline}</div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                color: "#999", marginBottom: "0.5rem",
              }}>{post.supportingNews.source} · {post.supportingNews.year}</div>
              <div style={{
                fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "1.02rem",
                color: "#555", lineHeight: 1.6, 
              }}>{post.supportingNews.connection}</div>
            </div>
          )}

          {/* ── KEYWORDS ── */}
          {post.keywords && post.keywords.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {post.keywords.map((kw, i) => (
                  <Link key={i} href={`/?q=${encodeURIComponent(kw)}`}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                      padding: "0.25rem 0.6rem", borderRadius: "2px",
                      background: "rgba(0,0,0,0.03)", color: "#888",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,105,20,0.08)"; e.currentTarget.style.color = "#8B6914"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.color = "#888"; }}
                    >#{kw}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── QUICK REACTION BAR — compact, right after content ── */}
          <div style={{
            maxWidth: "780px",
            marginBottom: "1.5rem",
            padding: "1rem 1.2rem",
            background: "rgba(139,105,20,0.04)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "#333",
            }}>Did this land?</span>
            <PostReactions postSlug={post.slug} compact />
          </div>

          {/* ── SHAREABLE QUOTE CARDS (Clarisse article only) ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <div style={{ maxWidth: "780px" }}>
              <ShareableQuote
                quote="Painters do not reach a million people in seventy-two hours. The art world is structured to prevent it."
                hashtag="#DontCensorArt"
                postSlug={post.slug}
                style="censor"
              />
              <ShareableQuote
                quote="The platform allows performance. It restricts honesty."
                hashtag="#SensoryArtIsArt"
                postSlug={post.slug}
                style="sensory"
              />
              <ShareableQuote
                quote="The market moved faster than the institutions. The collectors moved faster than the critics. The audience moved faster than everyone."
                hashtag="#ArtBelongsToEveryone"
                postSlug={post.slug}
                style="art"
              />
            </div>
          )}

          {/* ── VIDEO MOMENT ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <ArticleVideo
              src="/api/img/clarisse-painting-moment_d338c917.mp4"
              caption="Clarisse, behind the bars the algorithm built. The platform restricts. The artist persists."
            />
          )}
          {post.slug === "frqncy-the-bus-that-restores-the-world" && (
            <ArticleVideo
              src="/manus-storage/frqncy-bus-tour_dd4daeae.mov"
              caption="Inside the BioFRQNCY Bus — where red light, sound, and electromagnetic fields converge into a single coherent protocol."
            />
          )}

          {/* ── COMMENTS SECTION — all articles ── */}
          <AskTonyButton postTitle={post.title} postSlug={post.slug} />
          <BlogComments postSlug={post.slug} postTitle={post.title} />

          {/* ── SHARE THE WHOLE STORY ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <ShareTheStory postSlug={post.slug} />
          )}

          {/* ── COMMUNITY CTA — "IF THEY'RE WEIRD, WE ARE WEIRD" ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <ClarisseCommunity postSlug={post.slug} />
          )}

          {/* ── IF YOU FELT THIS — RELATED STORIES ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <ClarisseRelatedStories />
          )}

          {/* ── UPDATES SECTION ── */}
          {post.slug === "is-that-a-lot-clarisse-abelarde" && (
            <ArticleUpdates updates={[
              { date: "MAY 21", text: "Article published. Three galleries reach out within hours. One collector asks if Cam Roll II is available." },
              { date: "MAY 22", text: "Interview request from an art publication. Several bewildered messages from people who just want to see more of her work." },
              { date: "ONGOING", text: "Let's see what next week bestows upon us." },
            ]} />
          )}

          {/* ── POST REACTIONS ── */}
          <div style={{ maxWidth: "780px" }}>
            <PostReactions postSlug={post.slug} />
          </div>

          {/* ── RATE THIS THINKING ── */}
          <div style={{ maxWidth: "780px" }}>
            <RateThisThinking postSlug={post.slug} topic={post.category.toLowerCase()} />
          </div>

          {/* ── SOCIAL PROOF CASCADE — suppressed on grief/accountability pieces ── */}
          {!isHealingPost && (
          <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
            <SocialProofCascade variant="inline" />
          </div>
          )}

          {/* ── POST-ARTICLE CTA — suppressed on grief/accountability pieces ── */}
          {!isHealingPost && <div style={{
            maxWidth: "780px",
            marginBottom: "1.5rem",
            padding: "1.5rem clamp(1rem, 3vw, 1.5rem)",
            background: "rgba(139,105,20,0.04)",
            borderLeft: "3px solid #D4B96A",
            borderRadius: "0 4px 4px 0",
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "#111",
              marginBottom: "0.5rem",
            }}>If this resonated, try a diagnostic tool</h3>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.6,
              marginBottom: "1.2rem",
            }}>Turn thinking into action. Assessments that clarify who you are and what you want. Five to ten minutes. Immediate insight.</p>
            <Link href="/find-my" style={{
              display: "inline-block",
              padding: "0.7rem 1.8rem",
              background: "#8B6914",
              color: "#FAFAF7",
              borderRadius: "3px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s",
            }}>Start Assessment</Link>
          </div>}

          {/* ── IMPACT FUTURIST NEWSLETTER CTA — blood article ── */}
          {post.slug === "your-blood-lies-without-your-dna" && (
            <div style={{
              maxWidth: "780px",
              marginBottom: "2rem",
              padding: "2.5rem clamp(1.5rem, 4vw, 3rem)",
              background: "linear-gradient(135deg, #0A0A10 0%, #1a1020 50%, #0d0a18 100%)",
              borderRadius: "8px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Ambient glow */}
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "220px", height: "220px",
                background: "radial-gradient(circle, rgba(74,29,94,0.6) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: "-30px", left: "10%",
                width: "160px", height: "160px",
                background: "radial-gradient(circle, rgba(212,185,106,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Eyebrow */}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "#D4B96A",
                  marginBottom: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}>
                  <span style={{ color: "#D4B96A" }}>◆</span> Impact Futurist Dispatch
                </div>
                {/* Headline */}
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  fontWeight: 400,
                  color: "#F5F0E0",
                  lineHeight: 1.25,
                  marginBottom: "0.8rem",
                  fontStyle: "italic",
                }}>
                  The systems that run your health, your money, and your future are broken. I write about what comes next.
                </h3>
                {/* Body */}
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1rem",
                  color: "rgba(245,240,224,0.65)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                  maxWidth: "560px",
                }}>
                  Psychedelic medicine. Biomarker-driven health. AI and the future of trust. Asset-backed impact tokens. The things that are quietly reshaping everything — before they make the news. No cadence. No funnel. Just the dispatches I couldn't not write.
                </p>
                {/* Inline subscribe form */}
                <ImpactFuturistNewsletterForm slug={post.slug} />
              </div>
            </div>
          )}
          {/* ── RELATED INSIGHTS — blood article only ── */}
          {post.slug === "your-blood-lies-without-your-dna" && (
            <div style={{ maxWidth: "780px", marginBottom: "2rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.2rem",
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B6914" }}>
                  Related Insights
                </div>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(139,105,20,0.3), transparent)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {/* Card 1 — Energy/Money/Memory */}
                <Link href="/blog/energy-is-money-money-is-memory" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    border: "1px solid rgba(139,105,20,0.15)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    background: "#FAFAF7",
                    transition: "box-shadow 0.25s, transform 0.25s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(139,105,20,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <div style={{ height: "140px", background: "linear-gradient(135deg, #0A0A10 0%, #1a1020 100%)", overflow: "hidden", position: "relative" }}>
                      <img src="/manus-storage/energy-money-memory-hero-v2_deb8f3db.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                    </div>
                    <div style={{ padding: "1rem 1.1rem 1.2rem" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>Impact Futurism</div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#111", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                        Energy Is Money. Money Is Memory. We Just Made Remembering the Most Expensive Thing on Earth.
                      </h4>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#666", lineHeight: 1.55 }}>
                        The physics underneath the AI buildout — and why the largest act of memory-making in human history is happening right now.
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Card 2 — Psychedelics/Extraction */}
                <Link href="/blog/when-healing-becomes-extraction" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    border: "1px solid rgba(139,105,20,0.15)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    background: "#FAFAF7",
                    transition: "box-shadow 0.25s, transform 0.25s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(139,105,20,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <div style={{ height: "140px", overflow: "hidden" }}>
                      <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/when-healing-hero-FEiKS3iCJcSfUDNrR6wwXm.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "1rem 1.1rem 1.2rem" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "0.4rem" }}>Psychedelic Medicine</div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#111", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                        I Made Money Today on Psychedelics. I'm Not Celebrating.
                      </h4>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#666", lineHeight: 1.55 }}>
                        On the day Eli Lilly spent $2.8B validating psychedelic medicine, a woman named Tina died. The system that should have saved her failed her.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
          {/* ── EMAIL CAPTURE ── */}
          {!isHealingPost && <>
          <div style={{ maxWidth: "780px", marginBottom: "0.5rem" }}>
            <EmailCapture source={`blog-${post.slug}`} />
          </div>
          <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
            <ProofNugget />
          </div>
          </>}

          {/* ── IMPACTSOUL CTA BRIDGE ── */}
          {!isHealingPost && <div style={{
            maxWidth: "780px",
            marginBottom: "1.5rem",
            padding: "1.2rem clamp(1rem, 3vw, 1.5rem)",
            background: "linear-gradient(135deg, #FEFCF7 0%, #F8F4EC 100%)",
            border: "1px solid rgba(139,105,20,0.15)",
            borderLeft: "3px solid #8B6914",
            borderRadius: "0 6px 6px 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.4rem",
              }}>Consciousness-Aligned Capital</div>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                color: "#444",
                lineHeight: 1.5,
                margin: 0,
              }}>ImpactSoul tokenizes high-value assets to fund regenerative impact. Art, culture, and consciousness — backed by real value.</p>
            </div>
            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.6rem 1.5rem",
                background: "#8B6914",
                color: "#FAFAF7",
                borderRadius: "3px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >Explore ImpactSoul</a>
          </div>}

          {/* ── THE MIRROR: SELF-DISCOVERY REFLECTION ── */}
          {mirrorEntry && (
            <div style={{
              maxWidth: "780px",
            marginBottom: "1.5rem",
                  padding: "1.5rem clamp(1rem, 3vw, 1.8rem)",
                  background: "linear-gradient(135deg, rgba(139,105,20,0.06) 0%, rgba(212,185,106,0.04) 100%)",
                  border: "1px solid rgba(139,105,20,0.15)",
                  position: "relative",
                  overflow: "hidden",
          }}>
              {/* Decorative corner */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, transparent 50%, rgba(139,105,20,0.08) 50%)",
              }} />
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.8rem",
                fontWeight: 600,
              }}>The Mirror</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "#1A1A17",
                marginBottom: "0.6rem",
                lineHeight: 1.4,
              }}>This article is a mirror for {mirrorEntry.reflection}</div>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                color: "#5A5A52",
                lineHeight: 1.7,
                margin: "0 0 1.2rem 0",
                fontStyle: "italic",
              }}>{mirrorEntry.prompt}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                {mirrorDimension && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    padding: "0.3rem 0.7rem",
                    border: "1px solid rgba(139,105,20,0.25)",
                    background: "rgba(139,105,20,0.05)",
                  }}>{mirrorDimension.name}</span>
                )}
                <a
                  href="/the-mirror"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    textDecoration: "none",
                    padding: "0.3rem 0.7rem",
                    border: "1px solid rgba(139,105,20,0.25)",
                    background: "rgba(139,105,20,0.05)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#8B6914";
                    e.currentTarget.style.color = "#FAFAF7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(139,105,20,0.05)";
                    e.currentTarget.style.color = "#8B6914";
                  }}
                >Take The Full Assessment →</a>
              </div>
            </div>
          )}

          {/* ── ARTICLE FOOTER: EXERCISE ── */}
          {articleFooter?.exercise?.title && (
            <div style={{
              maxWidth: "780px",
              marginBottom: "1.5rem",
              padding: "1.5rem clamp(1rem, 3vw, 1.8rem)",
              background: "linear-gradient(135deg, rgba(46,139,87,0.06) 0%, rgba(46,139,87,0.02) 100%)",
              border: "1px solid rgba(46,139,87,0.15)",
              borderLeft: "3px solid #2E8B57",
              borderRadius: "0 6px 6px 0",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#2E8B57",
                marginBottom: "0.6rem",
                fontWeight: 600,
              }}>TRY THIS</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#111",
                marginBottom: "0.8rem",
                lineHeight: 1.3,
              }}>{articleFooter.exercise.title}</div>
              <p style={{
                fontFamily: "'Source Serif 4', 'Georgia', serif",
                fontSize: "1.05rem",
                color: "#444",
                lineHeight: 1.8,
                margin: 0,
              }}>{articleFooter.exercise.description}</p>
            </div>
          )}

          {/* ── ARTICLE FOOTER: RELATED ARTICLES WITH REASONS ── */}
          {articleFooter?.related?.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.8rem",
                paddingBottom: "0.4rem",
                borderBottom: "1px solid rgba(139,105,20,0.15)",
              }}>WHERE THIS LEADS</div>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {articleFooter.related.map((rel: { slug: string; title: string; reason: string }, i: number) => {
                  const relPost = posts.find((p) => p.slug === rel.slug);
                  const linkHref = rel.slug === '__manifesto__' ? '/living-declaration' : rel.slug === '__assessment__' ? '/find-my' : rel.slug === 'psychedelic-readiness-index' ? '/psychedelic-readiness-index' : `/blog/${rel.slug}`;
                  // Derive label from reason prefix
                  const reasonText = rel.reason || "";
                  const isRelated = reasonText.toLowerCase().startsWith("related");
                  const isDeeper = reasonText.toLowerCase().startsWith("go deeper");
                  const isDo = reasonText.toLowerCase().startsWith("do something");
                  const labelText = isRelated ? "Related Idea" : isDeeper ? "Go Deeper" : isDo ? "Do Something" : "Continue";
                  const labelColor = isRelated ? "#4A1D5E" : isDeeper ? "#1a3a5c" : isDo ? "#2d4a1e" : "#8B6914";
                  const eventName = isRelated ? "related_article_click" : isDeeper ? "go_deeper_click" : isDo ? "action_click" : "related_article_click";
                  return (
                    <Link
                      key={i}
                      href={linkHref}
                      onClick={() => { try { (window as any).gtag?.("event", eventName, { from_slug: post.slug, to_slug: rel.slug, position: i }); } catch {} }}
                      style={{
                        display: "block",
                        textDecoration: "none",
                        padding: "1.2rem 1.4rem",
                        border: "1px solid rgba(139,105,20,0.1)",
                        borderRadius: "6px",
                        background: "rgba(250,250,247,0.5)",
                        transition: "all 0.25s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.55rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase" as const,
                          color: "#fff",
                          background: labelColor,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "2px",
                          flexShrink: 0,
                        }}>{labelText}</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "#111", flex: 1 }}>
                          {rel.title || relPost?.title || rel.slug}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#D4B96A", flexShrink: 0 }}>→</span>
                      </div>
                      <div style={{
                        fontFamily: "'Source Serif 4', 'Georgia', serif",
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}>
                        {reasonText.replace(/^(Related idea|Go deeper|Do something):\s*/i, "")}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ARTICLE FOOTER: RIDDLE ── */}
          {articleFooter?.riddle && (
            <div style={{
              maxWidth: "780px",
              marginBottom: "1.5rem",
              padding: "1.5rem clamp(1rem, 3vw, 1.8rem)",
              background: "linear-gradient(135deg, rgba(106,90,205,0.06) 0%, rgba(106,90,205,0.02) 100%)",
              border: "1px solid rgba(106,90,205,0.12)",
              borderRadius: "6px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6A5ACD",
                marginBottom: "0.8rem",
              }}>A RIDDLE TO CARRY WITH YOU</div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                color: "#333",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}>{typeof articleFooter.riddle === 'string' ? articleFooter.riddle : typeof articleFooter.riddle === 'object' && articleFooter.riddle !== null ? `${(articleFooter.riddle as any).question || ''} — ${(articleFooter.riddle as any).answer || ''}` : String(articleFooter.riddle)}</p>
            </div>
          )}

          {/* ── ARTICLE FOOTER: FURTHER READING ── */}
          {articleFooter?.furtherReading?.length > 0 && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.6rem",
                paddingBottom: "0.4rem",
                borderBottom: "1px solid rgba(139,105,20,0.15)",
              }}>GO DEEPER</div>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {articleFooter.furtherReading.map((item: any, i: number) => {
                  const isObj = typeof item === 'object' && item !== null;
                  const title = isObj ? item.title : item;
                  const url = isObj ? item.url : null;
                  const desc = isObj ? item.description : null;
                  return (
                    <div
                      key={i}
                      style={{
                        fontFamily: "'Source Serif 4', 'Georgia', serif",
                        fontSize: "1rem",
                        color: "#555",
                        lineHeight: 1.7,
                        paddingLeft: "1.2rem",
                        position: "relative",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0, color: "#D4B96A", fontWeight: 700 }}>&#9671;</span>
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                          {title}
                        </a>
                      ) : title}
                      {desc && <span style={{ display: "block", fontSize: "0.88rem", color: "#888", marginTop: "0.15rem" }}>{desc}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TRUESOUL SOUL PRINT CTA ── */}
          <div style={{
            maxWidth: "780px",
            marginBottom: "1.5rem",
            padding: "1.5rem clamp(1rem, 3vw, 1.8rem)",
            background: "linear-gradient(135deg, #FEFCF7 0%, #F5F0E8 100%)",
            border: "1px solid rgba(139,105,20,0.15)",
            borderRadius: "6px",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.6rem",
            }}>DISCOVER YOUR PATTERN</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "#0a0a0a",
              lineHeight: 1.4,
              marginBottom: "1rem",
            }}>Take the TrueSelf Soul Print Assessment</div>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              color: "#555",
              lineHeight: 1.6,
              marginBottom: "1.2rem",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}>A personalized map of your consciousness, values, and growth edges — built from the same frameworks that inform these essays.</p>
            <Link
              href="/assessments"
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                color: "#FAFAF7",
                background: "#8B6914",
                padding: "0.7rem 2rem",
                borderRadius: "3px",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "all 0.3s",
              }}
            >EXPLORE ASSESSMENTS →</Link>
          </div>

          {/* ── ORIGINAL POST LINK ── */}
          {post.originalUrl && (
          <div style={{ maxWidth: "780px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#aaa", marginBottom: "2rem", letterSpacing: "0.04em" }}>
            Originally published at{" "}
            <a href={post.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>
              tonygreenberg.com
            </a>
          </div>
          )}

          {/* ── SERIES NAVIGATION ── */}
          {seriesInfo && (
            <div style={{
              maxWidth: "780px",
            marginBottom: "1.5rem",
            padding: "1.2rem 1.5rem",
            background: "rgba(139,105,20,0.04)",
            border: "1px solid rgba(139,105,20,0.12)",
            borderRadius: "4px",
          }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.6rem",
                fontWeight: 600,
              }}>
                {seriesInfo.series.title} — Part {seriesInfo.episodeNumber} of {seriesInfo.totalEpisodes}
              </div>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.92rem",
                color: "#666",
                lineHeight: 1.6,
                marginBottom: "1.2rem",
              }}>
                {seriesInfo.series.description}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {seriesInfo.series.posts.map((s, i) => {
                  const seriesPost = posts.find((p) => p.slug === s);
                  if (!seriesPost) return null;
                  const isCurrent = s === post.slug;
                  return (
                    <Link
                      key={s}
                      href={`/blog/${s}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        textDecoration: "none",
                        padding: "0.5rem 0.6rem",
                        borderRadius: "3px",
                        background: isCurrent ? "rgba(139,105,20,0.1)" : "transparent",
                        transition: "background 0.2s",
                      }}
                    >
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        color: isCurrent ? "#8B6914" : "#bbb",
                        fontWeight: 600,
                        minWidth: "1.5rem",
                      }}>
                        {i + 1}.
                      </span>
                      <span style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        color: isCurrent ? "#111" : "#8B6914",
                        fontWeight: isCurrent ? 600 : 400,
                      }}>
                        {seriesPost.title}
                        {isCurrent && " ← You are here"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <Divider />

          {/* ── PREV/NEXT NAVIGATION ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", padding: "1.5rem 0", maxWidth: "780px" }}>
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  ← Previous
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#8B6914", lineHeight: 1.3 }}>
                  {prevPost.title}
                </div>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                style={{ textDecoration: "none", display: "block", textAlign: "right" }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Next →
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#8B6914", lineHeight: 1.3 }}>
                  {nextPost.title}
                </div>
              </Link>
            ) : <div />}
          </div>

          {/* ── WHY THIS MATTERS NOW ── */}
          <div style={{
            maxWidth: "780px",
            padding: "1.5rem clamp(1rem, 3vw, 1.5rem)",
            background: "rgba(139,105,20,0.04)",
            borderLeft: "3px solid #D4B96A",
            borderRadius: "0 4px 4px 0",
            marginBottom: "1.5rem",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "0.8rem",
            }}>WHY THIS MATTERS NOW</div>
            <p style={{
              fontFamily: "'Source Serif 4', 'Georgia', serif",
              fontSize: "1.1rem",
              color: "#333",
              lineHeight: 1.8,
              margin: 0,
            }}>
              We are living through the largest transfer of wealth, power, and attention in human history. Every essay on this site is a dispatch from the front lines of that fight — naming what's extractive, building what replaces it. If this one landed, it's because the question it raises hasn't been answered yet — and probably won't be by the people currently in charge of answering it.
            </p>
          </div>

          {/* ── AUTHORITY BLOCK ── */}
          <div style={{
            maxWidth: "780px",
            display: "flex",
            gap: "1.2rem",
            alignItems: "center",
            padding: "1.2rem clamp(0.8rem, 3vw, 1.5rem)",
            background: "#FEFCF7",
            border: "1px solid rgba(139,105,20,0.12)",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            flexWrap: "wrap" as const,
          }}>
            <img
              src="/api/img/tony-headshot_2d63de23.jpg"
              alt="Tony Greenberg"
              sizes="64px"
              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(139,105,20,0.2)" }}
            />
            <div>
            <div style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "1.1rem",
              color: "#2C1810",
              fontWeight: 400,
              fontStyle: "italic",
              marginBottom: "0.3rem",
            }}>Tony "WhyNot" Greenberg</div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "#777",
                letterSpacing: "0.04em",
                lineHeight: 1.5,
              }}>Systems thinker. Impact builder. Corporate accountability crusader.</div>
            </div>
          </div>

          {/* ── ESSAY FOOTER — ENGAGEMENT CTA ── */}
          <div style={{
            maxWidth: "780px",
            marginBottom: "1.5rem",
          }}>
            {/* Quote line */}
            <div style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "#2C1810",
              lineHeight: 1.55,
              textAlign: "center",
              marginBottom: "1.2rem",
            }}>
              “If this made you think differently — share it. If it made you angry — good.”
            </div>

            {/* Booking + Email CTAs */}
            <div style={{
              background: "linear-gradient(135deg, #FEFCF7 0%, #F5F0E8 100%)",
              padding: "1.5rem clamp(1rem, 3vw, 2rem)",
              borderRadius: "6px",
              border: "1px solid rgba(139,105,20,0.18)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>📞</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#1a1a1a", fontSize: "0.95rem" }}>
                    Book a strategy hour →{" "}
                    <a
                      href="/engage"
                      style={{ color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.4)" }}
                    >
                      Enter The Gate
                    </a>
                    <span style={{ color: "rgba(0,0,0,0.35)", fontSize: "0.85rem", marginLeft: "0.5rem" }}>Engagements begin with a scoping conversation</span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>✉️</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#1a1a1a", fontSize: "0.95rem" }}>
                    Send preparation doc →{" "}
                    <a
                      href="mailto:tony@impactsoul.is"
                      style={{ color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.4)" }}
                    >
                      tony@impactsoul.is
                    </a>
                  </span>
                </div>
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "rgba(0,0,0,0.35)",
                marginTop: "0.8rem",
                letterSpacing: "0.05em",
              }}>
                Prep doc required 48hrs before session · All sessions recorded via Fireflies · 30-day review gate before Stage 2
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "#8B6914",
                marginTop: "0.6rem",
                letterSpacing: "0.08em",
                textAlign: "center" as const,
              }}>
                2× MONEY-BACK GUARANTEE — Do the work. Document it. Zero results? We refund your fee, times two.
              </div>
            </div>

            {/* Secondary CTAs — v1.2 */}
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
              <a
                href="/subscribe"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  color: "#FAFAF7",
                  background: "#8B6914",
                  padding: "0.7rem 1.8rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >SUBSCRIBE FREE</a>
              <a
                href="/shop"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  color: "#1a1a1a",
                  border: "1px solid rgba(0,0,0,0.15)",
                  padding: "0.7rem 1.8rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >ESSAY COMPILATION $27</a>
              <a
                href="/invest"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  color: "#8B6914",
                  border: "1px solid rgba(139,105,20,0.3)",
                  padding: "0.7rem 1.8rem",
                  textDecoration: "none",
                  borderRadius: "2px",
                }}
              >ABIT WAITLIST</a>
            </div>
          </div>

          {/* ── SOCIAL FOOTER ── */}
          <div style={{ textAlign: "center", padding: "2rem 0 1rem", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#bbb", letterSpacing: "0.06em" }}>
              Follow{" "}
              <a href="https://x.com/ThinkTony" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>@ThinkTony</a>
              {" "}on X ·{" "}
              <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" style={{ color: "#8B6914" }}>LinkedIn</a>
              {" "}· Only Time Buys Trust
            </div>
          </div>
        </FadeIn>
      </section>
      {/* TOC sidebar — rendered inside the two-column flex container */}
      <ArticleTOC headings={tocHeadings} />
      </div>{/* end two-column layout */}

      {/* ── CONTINUE READING ── */}
      {relatedPosts.length > 0 && (
        <div style={{
          background: "#F5F0E8",
          borderTop: "1px solid rgba(139,105,20,0.12)",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.2rem, 5vw, 3rem)",
          marginBottom: "0",
        }}>
          {/* Header */}
          <div style={{ maxWidth: "1100px", margin: "0 auto 2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <div style={{ width: "2.5rem", height: "1px", background: "#8B6914" }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#8B6914",
              }}>Continue Reading</span>
            </div>
            <h3 style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#0a0a0a",
              margin: 0,
              lineHeight: 1.2,
            }}>The thread continues.</h3>
          </div>

          {/* Cards grid */}
          <div style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {relatedPosts.map((rp, idx) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  background: "#FEFCF7",
                  border: "1px solid rgba(139,105,20,0.12)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(139,105,20,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Image */}
                {rp.image && (
                  <div style={{ position: "relative", paddingTop: "52%", overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={rp.image}
                      alt={rp.title}
                      {...responsiveImageProps(rp.image, "card")}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.92) saturate(0.95)",
                      }}
                      loading="lazy"
                    />
                    <div style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      color: "#8B6914",
                      background: "rgba(254,252,247,0.92)",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "2px",
                    }}>0{idx + 1}</div>
                    {rp.formatTag && (
                      <div style={{
                        position: "absolute",
                        bottom: "0.75rem",
                        right: "0.75rem",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#8B6914",
                        background: "rgba(254,252,247,0.9)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "2px",
                      }}>{rp.formatTag}</div>
                    )}
                  </div>
                )}
                {!rp.image && (
                  <div style={{
                    height: "4px",
                    background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                    flexShrink: 0,
                  }} />
                )}
                <div style={{ padding: "1.2rem 1.4rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    marginBottom: "0.6rem",
                    lineHeight: 1.4,
                  }}>{rp.reason}</div>
                  <h4 style={{
                    fontFamily: "'IM Fell English', serif",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "#2C1810",
                    margin: "0 0 0.7rem",
                    lineHeight: 1.3,
                    flex: 1,
                  }}>{rp.title}</h4>
                  <p style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: "0.83rem",
                    color: "#4A2E1A",
                    lineHeight: 1.65,
                    margin: "0 0 1rem",
                  }}>{(rp.summary || "").slice(0, 100)}{rp.summary && rp.summary.length > 100 ? "…" : ""}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                    }}>{rp.category}</span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#aaa",
                    }}>{rp.readTime ? rp.readTime.replace(" read", "") : ""}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Commitment escalation components */}
      <HighlightSaveButton postSlug={post.slug} />
      <MicroCommitmentBox postSlug={post.slug} />
      <MicroYesBar title={post.title} slug={post.slug} />
    </div>
  );
}
