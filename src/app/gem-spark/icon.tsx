import { ImageResponse } from "next/og";

// Browser-tab icon for /gem-spark/*. The GemSpark app never set its own (its /favicon.ico was
// Manus's default), and the site's "G" monogram would look the same in a tab, so this is the
// four-point sparkle from the page's title animation, in its slate (#2C3E50) on its cream
// (#F5F5F0). Inline styles are how ImageResponse draws (same as src/app/icon.tsx).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5F0",
          borderRadius: 6,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z" fill="#2C3E50" />
        </svg>
      </div>
    ),
    size,
  );
}
