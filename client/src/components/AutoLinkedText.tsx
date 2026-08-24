import React from "react";
import { autoLinkText } from "@/data/linkMap";

interface AutoLinkedTextProps {
  children: string;
  style?: React.CSSProperties;
  className?: string;
  linkColor?: string;
}

/**
 * Renders text with automatic hyperlinks for recognized companies,
 * people, and organizations from the centralized link map.
 */
export default function AutoLinkedText({
  children,
  style,
  className,
  linkColor = "#8B6914",
}: AutoLinkedTextProps) {
  const segments = autoLinkText(children);

  return (
    <span style={style} className={className}>
      {segments.map((seg, i) => {
        if (typeof seg === "string") {
          return <React.Fragment key={i}>{seg}</React.Fragment>;
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecorationColor = linkColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecorationColor = `${linkColor}40`;
            }}
          >
            {seg.text}
          </a>
        );
      })}
    </span>
  );
}
