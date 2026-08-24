import { Link, useLocation } from "wouter";
import { PAGE_CATEGORY_MAP } from "./BrewSoulDirectory";

/**
 * Renders a small category badge at the top of any BrewSoul page.
 * Automatically detects the category from the current URL.
 * Links back to the directory filtered to that category.
 */
export default function CategoryBadge() {
  const [location] = useLocation();
  const info = PAGE_CATEGORY_MAP[location];
  if (!info) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
      <Link href="/brewsoul/directory" style={{ textDecoration: "none" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.3rem 0.75rem", borderRadius: "20px",
          background: info.color, color: "#FAFAF7",
          fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          cursor: "pointer", transition: "opacity 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.opacity = "0.85"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.opacity = "1"; }}
        >
          <span style={{ fontSize: "0.7rem" }}>📋</span>
          {info.category}
        </span>
      </Link>
    </div>
  );
}
