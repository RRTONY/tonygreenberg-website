import { ImageResponse } from "next/og";

// Real brand mark, not a placeholder — reuses the exact "TonyG" wordmark
// treatment from site-header.tsx (Playfair Display, "G" in brand-gold) at
// monogram scale, since the full wordmark doesn't read at favicon size.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
        color: "#8b6914",
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "Georgia, serif",
      }}
    >
      G
    </div>,
    size,
  );
}
