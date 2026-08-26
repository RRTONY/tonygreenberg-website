// Ported from legacy client/src/components/ThemedBackground.tsx — a
// warm-toned, theme-specific full-screen background used behind every
// "Find Your X" assessment. Real per-theme colors unchanged (16 themes,
// each a distinct warm gradient). Two decorative layers dropped, same
// "not worth the cost" judgment made repeatedly elsewhere in this
// migration: the two extra radial-gradient "glow" layers per theme (the
// base gradient alone already carries the real color identity) and the
// floating-particle field + SVG sacred-geometry overlay (random-position
// decoration, no real content). The base gradient is a small,
// known-at-build-time set (16 themes) — precomposed as one literal
// Tailwind class per theme rather than assembled from fragments, so
// Tailwind's scanner actually generates the CSS.
const THEME_BG: Record<string, string> = {
  diet: "bg-linear-to-br from-[#E8F0DC] via-[#D4E4C0] to-[#E0ECD0]",
  movement: "bg-linear-to-br from-[#F5E6DC] via-[#EDDCC8] to-[#F0DCC8]",
  sleep: "bg-linear-to-br from-[#E0D8F0] via-[#D0C4E8] to-[#D8D0EC]",
  kitchen: "bg-linear-to-br from-[#F5E8D0] via-[#EEDCB8] to-[#F0DEC0]",
  style: "bg-linear-to-br from-[#F5DCE8] via-[#EDCCD8] to-[#F0D4E0]",
  sake: "bg-linear-to-br from-[#F0E8DC] via-[#E8DCC8] to-[#EAE0D0]",
  spirit: "bg-linear-to-br from-[#DCE8F0] via-[#C8DCE8] to-[#D0E0EC]",
  therapy: "bg-linear-to-br from-[#E8D8F0] via-[#DCC8E8] to-[#E0D0EC]",
  religion: "bg-linear-to-br from-[#F5ECD0] via-[#EDE0B8] to-[#F0E4C0]",
  peptide: "bg-linear-to-br from-[#DCE8EC] via-[#C8DCE4] to-[#D0E0E8]",
  sexuality: "bg-linear-to-br from-[#F5D8E4] via-[#EDCCD8] to-[#F0D4DC]",
  attachment: "bg-linear-to-br from-[#F5DCE0] via-[#EDCCD4] to-[#F0D4D8]",
  love: "bg-linear-to-br from-[#F5DCD8] via-[#EDCCC8] to-[#F0D4D0]",
  selfportrait: "bg-linear-to-br from-[#F0E8D8] via-[#E8DCC8] to-[#EAE0D0]",
  ecosystem: "bg-linear-to-br from-[#DCE4F0] via-[#C8D8E8] to-[#D0DCEC]",
  journey: "bg-linear-to-br from-[#DCE8DC] via-[#C8DCC8] to-[#D0E0D0]",
  me: "bg-linear-to-br from-[#E8E0D8] via-[#DCD4C8] to-[#E0D8D0]",
};

export function ThemedBackground({ theme }: { theme: string }) {
  const bgClass = THEME_BG[theme] ?? THEME_BG.selfportrait;
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${bgClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(139,105,20,0.04)_100%)]" />
    </div>
  );
}
