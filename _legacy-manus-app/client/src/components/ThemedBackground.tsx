import { useMemo } from "react";

/**
 * ThemedBackground — Drop this into any assessment page to replace
 * boring flat backgrounds with immersive warm-toned themed visuals.
 *
 * NO BLACK BACKGROUNDS. All themes use warm parchment/earth tones.
 * Renders as a fixed full-screen layer behind content.
 */

interface ThemeDef {
  gradient: string;
  glow1: string;
  glow2: string;
  particleColor: string;
  geometryColor: string;
  /** Text should be dark on these warm backgrounds */
  isDark: false;
}

const THEMES: Record<string, ThemeDef> = {
  diet: {
    gradient: "linear-gradient(135deg, #E8F0DC 0%, #D4E4C0 30%, #C8DEB0 60%, #E0ECD0 100%)",
    glow1: "radial-gradient(ellipse at 30% 40%, rgba(76,175,80,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 70% 60%, rgba(124,179,66,0.08) 0%, transparent 50%)",
    particleColor: "rgba(76,175,80,0.15)",
    geometryColor: "#7CB342",
    isDark: false,
  },
  movement: {
    gradient: "linear-gradient(135deg, #F5E6DC 0%, #EDDCC8 30%, #E8D0B8 60%, #F0DCC8 100%)",
    glow1: "radial-gradient(ellipse at 25% 35%, rgba(255,112,67,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 75% 55%, rgba(255,87,34,0.08) 0%, transparent 50%)",
    particleColor: "rgba(255,112,67,0.15)",
    geometryColor: "#E65100",
    isDark: false,
  },
  sleep: {
    gradient: "linear-gradient(135deg, #E0D8F0 0%, #D0C4E8 30%, #C8BCE0 60%, #D8D0EC 100%)",
    glow1: "radial-gradient(ellipse at 40% 30%, rgba(126,87,194,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 60% 70%, rgba(94,53,177,0.08) 0%, transparent 50%)",
    particleColor: "rgba(126,87,194,0.15)",
    geometryColor: "#7E57C2",
    isDark: false,
  },
  kitchen: {
    gradient: "linear-gradient(135deg, #F5E8D0 0%, #EEDCB8 30%, #E8D4A8 60%, #F0DEC0 100%)",
    glow1: "radial-gradient(ellipse at 35% 45%, rgba(255,143,0,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 65% 55%, rgba(230,81,0,0.08) 0%, transparent 50%)",
    particleColor: "rgba(255,143,0,0.15)",
    geometryColor: "#E65100",
    isDark: false,
  },
  style: {
    gradient: "linear-gradient(135deg, #F5DCE8 0%, #EDCCD8 30%, #E8C0D0 60%, #F0D4E0 100%)",
    glow1: "radial-gradient(ellipse at 30% 40%, rgba(236,64,122,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 70% 60%, rgba(173,20,87,0.08) 0%, transparent 50%)",
    particleColor: "rgba(236,64,122,0.12)",
    geometryColor: "#AD1457",
    isDark: false,
  },
  sake: {
    gradient: "linear-gradient(135deg, #F0E8DC 0%, #E8DCC8 30%, #E0D4B8 60%, #EAE0D0 100%)",
    glow1: "radial-gradient(ellipse at 40% 35%, rgba(141,110,99,0.08) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 60% 65%, rgba(109,76,65,0.06) 0%, transparent 50%)",
    particleColor: "rgba(141,110,99,0.12)",
    geometryColor: "#8D6E63",
    isDark: false,
  },
  spirit: {
    gradient: "linear-gradient(135deg, #DCE8F0 0%, #C8DCE8 30%, #B8D4E0 60%, #D0E0EC 100%)",
    glow1: "radial-gradient(ellipse at 35% 40%, rgba(38,198,218,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 65% 60%, rgba(0,131,143,0.08) 0%, transparent 50%)",
    particleColor: "rgba(38,198,218,0.15)",
    geometryColor: "#00838F",
    isDark: false,
  },
  therapy: {
    gradient: "linear-gradient(135deg, #E8D8F0 0%, #DCC8E8 30%, #D0BCE0 60%, #E0D0EC 100%)",
    glow1: "radial-gradient(ellipse at 30% 35%, rgba(171,71,188,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 70% 65%, rgba(106,27,154,0.08) 0%, transparent 50%)",
    particleColor: "rgba(171,71,188,0.12)",
    geometryColor: "#7B1FA2",
    isDark: false,
  },
  religion: {
    gradient: "linear-gradient(135deg, #F5ECD0 0%, #EDE0B8 30%, #E8D8A8 60%, #F0E4C0 100%)",
    glow1: "radial-gradient(ellipse at 40% 40%, rgba(255,213,79,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 60% 60%, rgba(249,168,37,0.08) 0%, transparent 50%)",
    particleColor: "rgba(249,168,37,0.12)",
    geometryColor: "#F9A825",
    isDark: false,
  },
  peptide: {
    gradient: "linear-gradient(135deg, #DCE8EC 0%, #C8DCE4 30%, #B8D4DC 60%, #D0E0E8 100%)",
    glow1: "radial-gradient(ellipse at 25% 40%, rgba(77,208,225,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 75% 60%, rgba(0,172,193,0.08) 0%, transparent 50%)",
    particleColor: "rgba(0,172,193,0.12)",
    geometryColor: "#00838F",
    isDark: false,
  },
  sexuality: {
    gradient: "linear-gradient(135deg, #F5D8E4 0%, #EDCCD8 30%, #E8C0D0 60%, #F0D4DC 100%)",
    glow1: "radial-gradient(ellipse at 35% 45%, rgba(240,98,146,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 65% 55%, rgba(194,24,91,0.08) 0%, transparent 50%)",
    particleColor: "rgba(194,24,91,0.1)",
    geometryColor: "#C2185B",
    isDark: false,
  },
  attachment: {
    gradient: "linear-gradient(135deg, #F5DCE0 0%, #EDCCD4 30%, #E8C0C8 60%, #F0D4D8 100%)",
    glow1: "radial-gradient(ellipse at 30% 40%, rgba(244,143,177,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 70% 60%, rgba(173,20,87,0.08) 0%, transparent 50%)",
    particleColor: "rgba(173,20,87,0.1)",
    geometryColor: "#AD1457",
    isDark: false,
  },
  love: {
    gradient: "linear-gradient(135deg, #F5DCD8 0%, #EDCCC8 30%, #E8C0B8 60%, #F0D4D0 100%)",
    glow1: "radial-gradient(ellipse at 35% 35%, rgba(239,83,80,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 65% 65%, rgba(183,28,28,0.08) 0%, transparent 50%)",
    particleColor: "rgba(183,28,28,0.1)",
    geometryColor: "#C62828",
    isDark: false,
  },
  selfportrait: {
    gradient: "linear-gradient(135deg, #F0E8D8 0%, #E8DCC8 30%, #E0D4B8 60%, #EAE0D0 100%)",
    glow1: "radial-gradient(ellipse at 40% 30%, rgba(212,185,106,0.08) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 60% 70%, rgba(139,105,20,0.06) 0%, transparent 50%)",
    particleColor: "rgba(139,105,20,0.1)",
    geometryColor: "#8B6914",
    isDark: false,
  },
  ecosystem: {
    gradient: "linear-gradient(135deg, #DCE4F0 0%, #C8D8E8 30%, #B8D0E0 60%, #D0DCEC 100%)",
    glow1: "radial-gradient(ellipse at 30% 40%, rgba(66,165,245,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 70% 60%, rgba(25,118,210,0.08) 0%, transparent 50%)",
    particleColor: "rgba(25,118,210,0.1)",
    geometryColor: "#1565C0",
    isDark: false,
  },
  journey: {
    gradient: "linear-gradient(135deg, #DCE8DC 0%, #C8DCC8 30%, #B8D4B8 60%, #D0E0D0 100%)",
    glow1: "radial-gradient(ellipse at 35% 45%, rgba(129,199,132,0.1) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 65% 55%, rgba(56,142,60,0.08) 0%, transparent 50%)",
    particleColor: "rgba(56,142,60,0.1)",
    geometryColor: "#2E7D32",
    isDark: false,
  },
  me: {
    gradient: "linear-gradient(135deg, #E8E0D8 0%, #DCD4C8 30%, #D4CCB8 60%, #E0D8D0 100%)",
    glow1: "radial-gradient(ellipse at 40% 35%, rgba(158,128,100,0.08) 0%, transparent 60%)",
    glow2: "radial-gradient(ellipse at 60% 65%, rgba(121,85,72,0.06) 0%, transparent 50%)",
    particleColor: "rgba(121,85,72,0.1)",
    geometryColor: "#795548",
    isDark: false,
  },
};

function SacredGeometrySVG({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(130vw, 1000px)",
        height: "min(130vw, 1000px)",
        opacity: 0.06,
        pointerEvents: "none",
      }}
    >
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const cx = 400 + 100 * Math.cos((a * Math.PI) / 180);
        const cy = 400 + 100 * Math.sin((a * Math.PI) / 180);
        return <circle key={a} cx={cx} cy={cy} r={100} fill="none" stroke={color} strokeWidth="0.5" />;
      })}
      <circle cx={400} cy={400} r={100} fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx={400} cy={400} r={200} fill="none" stroke={color} strokeWidth="0.3" />
      <circle cx={400} cy={400} r={300} fill="none" stroke={color} strokeWidth="0.2" />
      <circle cx={400} cy={400} r={400} fill="none" stroke={color} strokeWidth="0.15" />
    </svg>
  );
}

function Particles({ color }: { color: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 4,
        dur: 20 + Math.random() * 25,
        delay: Math.random() * -20,
      })),
    []
  );
  return (
    <>
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: "absolute",
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: color,
            animation: `tbFloat ${d.dur}s ease-in-out ${d.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
      <style>{`
        @keyframes tbFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
          50% { transform: translateY(-6px) translateX(-6px); opacity: 0.5; }
          75% { transform: translateY(-28px) translateX(4px); opacity: 0.6; }
        }
      `}</style>
    </>
  );
}

/**
 * ThemedBackground — Fixed full-screen layer.
 * Place at the TOP of your assessment page's root element.
 *
 * Usage:
 *   <div style={{ position: "relative", minHeight: "100vh" }}>
 *     <ThemedBackground theme="diet" />
 *     ... your content with position: relative; zIndex: 1
 *   div
 */
export default function ThemedBackground({ theme }: { theme: string }) {
  const t = THEMES[theme] || THEMES.selfportrait;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Base gradient */}
      <div style={{ position: "absolute", inset: 0, background: t.gradient }} />
      {/* Glow 1 */}
      <div style={{ position: "absolute", inset: 0, background: t.glow1 }} />
      {/* Glow 2 */}
      <div style={{ position: "absolute", inset: 0, background: t.glow2 }} />
      {/* Sacred geometry */}
      <SacredGeometrySVG color={t.geometryColor} />
      {/* Particles */}
      <Particles color={t.particleColor} />
      {/* Subtle warm vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(139,105,20,0.04) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export { THEMES };
