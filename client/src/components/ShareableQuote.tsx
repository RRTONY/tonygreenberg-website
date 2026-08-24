import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface ShareableQuoteProps {
  quote: string;
  hashtag?: string;
  postSlug: string;
  style?: "censor" | "art" | "sensory" | "default";
}

/**
 * Contextual shareable quote cards woven into articles.
 * Each has a unique visual treatment and pre-composed share text.
 */
export default function ShareableQuote({ quote, hashtag = "#DontCensorArt", postSlug, style = "default" }: ShareableQuoteProps) {
  const [copied, setCopied] = useState(false);
  const trackShare = trpc.analytics.trackShare.useMutation();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `"${quote}" ${hashtag}\n\n`;

  const styleMap = {
    censor: {
      bg: "linear-gradient(135deg, #1a0000 0%, #2d0a0a 100%)",
      border: "1px solid rgba(139,0,0,0.4)",
      quoteColor: "#F5F0E0",
      hashColor: "#ff4444",
      labelColor: "#ff4444",
    },
    art: {
      bg: "linear-gradient(135deg, #0a0a10 0%, #1a1a2e 100%)",
      border: "1px solid rgba(212,185,106,0.3)",
      quoteColor: "#F5F0E0",
      hashColor: "#D4B96A",
      labelColor: "#D4B96A",
    },
    sensory: {
      bg: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      border: "1px solid rgba(139,105,20,0.25)",
      quoteColor: "#F5F0E0",
      hashColor: "#8B6914",
      labelColor: "#8B6914",
    },
    default: {
      bg: "linear-gradient(135deg, #FAFAF7 0%, #F5F0E8 100%)",
      border: "1px solid rgba(139,105,20,0.2)",
      quoteColor: "#111",
      hashColor: "#8B6914",
      labelColor: "#8B6914",
    },
  };

  const s = styleMap[style];

  const handleShare = (platform: string) => {
    trackShare.mutate({ postSlug, shareType: `quote-${platform}` });
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    if (platform === "copy") {
      navigator.clipboard.writeText(`${shareText}${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const a = document.createElement("a");
    a.href = urls[platform] || "";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{
      maxWidth: "680px",
      margin: "2.5rem auto",
      padding: "1.8rem 2rem",
      background: s.bg,
      border: s.border,
      borderRadius: "6px",
      textAlign: "center",
      position: "relative",
    }}>
      {/* Quote */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
        lineHeight: 1.6,
        color: s.quoteColor,
        fontStyle: "italic",
        margin: "0 0 0.8rem",
      }}>
        "{quote}"
      </p>

      {/* Hashtag */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        color: s.hashColor,
        margin: "0 0 1.2rem",
      }}>
        {hashtag}
      </p>

      {/* Share buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => handleShare("twitter")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "3px",
            border: `1px solid ${s.labelColor}40`,
            background: "transparent",
            color: s.labelColor,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Share on 𝕏
        </button>
        <button
          onClick={() => handleShare("linkedin")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "3px",
            border: `1px solid ${s.labelColor}40`,
            background: "transparent",
            color: s.labelColor,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Share on LinkedIn
        </button>
        <button
          onClick={() => handleShare("copy")}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "3px",
            border: `1px solid ${s.labelColor}40`,
            background: "transparent",
            color: s.labelColor,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {copied ? "Copied!" : "Copy Quote"}
        </button>
      </div>

      {/* Subtle label */}
      <div style={{
        position: "absolute",
        top: "0.6rem",
        right: "0.8rem",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: `${s.labelColor}80`,
      }}>
        SHARE THIS
      </div>
    </div>
  );
}
