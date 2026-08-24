interface Update {
  date: string;
  text: string;
}

interface ArticleUpdatesProps {
  updates: Update[];
}

export default function ArticleUpdates({ updates }: ArticleUpdatesProps) {
  if (!updates || updates.length === 0) return null;

  return (
    <div style={{
      maxWidth: "780px",
      margin: "2.5rem 0",
      padding: "2rem clamp(1.2rem, 3vw, 2rem)",
      background: "rgba(250,250,247,0.8)",
      border: "1px solid rgba(139,105,20,0.12)",
      borderRadius: "6px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        marginBottom: "1.5rem",
        paddingBottom: "0.8rem",
        borderBottom: "1px solid rgba(139,105,20,0.1)",
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#8B6914",
        }}>
          UPDATES
        </span>
        <span style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.82rem",
          color: "#888",
          fontStyle: "italic",
        }}>
          — this story is still unfolding
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {updates.map((update, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#8B6914",
              whiteSpace: "nowrap",
              paddingTop: "0.2rem",
              minWidth: "80px",
            }}>
              {update.date}
            </div>
            <div style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              color: "#333",
              lineHeight: 1.6,
            }}>
              {update.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "1.5rem",
        paddingTop: "1rem",
        borderTop: "1px solid rgba(139,105,20,0.08)",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "0.85rem",
        color: "#888",
        fontStyle: "italic",
        textAlign: "center",
      }}>
        Subscribe to get notified when this story updates.
      </div>
    </div>
  );
}
