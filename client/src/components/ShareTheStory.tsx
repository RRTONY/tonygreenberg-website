import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface ShareTheStoryProps {
  postSlug: string;
}

export default function ShareTheStory({ postSlug }: ShareTheStoryProps) {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const referralQuery = trpc.referral.getMyCode.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createShortUrl = trpc.shortUrls.create.useMutation({
    onSuccess: (data) => {
      const baseUrl = window.location.origin;
      const url = referralQuery.data?.code
        ? `${baseUrl}${data.shortUrl}?ref=${referralQuery.data.code}`
        : `${baseUrl}${data.shortUrl}`;
      setShareUrl(url);
    },
  });

  const handleGenerateLink = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createShortUrl.mutate({ targetPath: `/blog/${postSlug}` });
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{
      maxWidth: "780px",
      margin: "3rem 0",
      padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)",
      background: "linear-gradient(135deg, rgba(139,105,20,0.06) 0%, rgba(212,185,106,0.08) 100%)",
      border: "1px solid rgba(139,105,20,0.15)",
      borderRadius: "8px",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "#8B6914",
        marginBottom: "0.8rem",
      }}>
        SHARE THE WHOLE STORY
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        color: "#111",
        marginBottom: "0.8rem",
        lineHeight: 1.3,
      }}>
        Know someone who needs to read this?
      </h3>

      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "1rem",
        color: "#555",
        lineHeight: 1.6,
        marginBottom: "1.5rem",
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        Generate your unique referral link. We track who's sending readers our way — and we remember our amplifiers.
      </p>

      {!shareUrl ? (
        <button
          onClick={handleGenerateLink}
          disabled={createShortUrl.isPending}
          style={{
            padding: "0.9rem 2.5rem",
            background: "#8B6914",
            color: "#FAFAF7",
            border: "none",
            borderRadius: "4px",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: createShortUrl.isPending ? 0.6 : 1,
          }}
        >
          {createShortUrl.isPending ? "GENERATING..." : isAuthenticated ? "GENERATE MY LINK" : "SIGN IN TO SHARE"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#FAFAF7",
            border: "1px solid rgba(139,105,20,0.2)",
            borderRadius: "4px",
            padding: "0.6rem 1rem",
            width: "100%",
            maxWidth: "420px",
          }}>
            <input
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                color: "#333",
                outline: "none",
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: "0.4rem 1rem",
                background: copied ? "#2a7d3f" : "#8B6914",
                color: "#FAFAF7",
                border: "none",
                borderRadius: "3px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("A painter reached a million people in 72 hours. The art world is structured to prevent it. Read this:")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 1.2rem",
                background: "#0A0A10",
                color: "#FAFAF7",
                borderRadius: "3px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              SHARE ON 𝕏
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 1.2rem",
                background: "#0A66C2",
                color: "#FAFAF7",
                borderRadius: "3px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              LINKEDIN
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("You need to read this")}&body=${encodeURIComponent(`A painter reached a million people in 72 hours. The algorithm tried to hide it. Read the full story: ${shareUrl}`)}`}
              style={{
                padding: "0.5rem 1.2rem",
                background: "#555",
                color: "#FAFAF7",
                borderRadius: "3px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              EMAIL
            </a>
          </div>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.82rem",
            color: "#888",
            fontStyle: "italic",
            marginTop: "0.5rem",
          }}>
            Your referral link tracks reads. We see who amplifies this story.
          </p>
        </div>
      )}
    </div>
  );
}
