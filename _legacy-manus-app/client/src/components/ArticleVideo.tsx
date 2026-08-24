interface ArticleVideoProps {
  src: string;
  caption?: string;
}

export default function ArticleVideo({ src, caption }: ArticleVideoProps) {
  return (
    <figure style={{
      margin: "3.5rem calc(-1 * clamp(1.5rem, 6vw, 5rem))",
      padding: 0,
      textAlign: "center" as const,
    }}>
      <div style={{
        position: "relative",
        borderRadius: "3px",
        overflow: "hidden",
        boxShadow: "0 4px 30px rgba(0,0,0,0.12)",
        background: "#0a0a0a",
      }}>
        <video
          src={src}
          controls
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            display: "block",
            maxHeight: "620px",
            objectFit: "cover",
          }}
        />
      </div>
      {caption && (
        <figcaption style={{
          fontFamily: "'DM Sans', 'Source Sans 3', sans-serif",
          fontSize: "0.75rem",
          color: "#777",
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "1rem",
          letterSpacing: "0.02em",
          lineHeight: 1.5,
        }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
