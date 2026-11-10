import { Cinzel, Cinzel_Decorative, Cormorant, Inter, Special_Elite } from "next/font/google";

// SoulSmoke (/soul-smoke) faces, the same four the SoulSmoke app loaded from Google Fonts
// (Cinzel Decorative titles, Cinzel headings, Cormorant body, Special Elite mono), plus Inter for
// its "Aficionado" reading mode. Only the /soul-smoke layout imports this file, so no other page
// loads these fonts. The CSS variables are read by src/app/soul-smoke/soulsmoke.css.

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-ss-cinzel-decorative",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-ss-cinzel",
  display: "swap",
  preload: false,
});

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ss-cormorant",
  display: "swap",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ss-special-elite",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ss-inter",
  display: "swap",
  preload: false,
});

export const soulsmokeFontVariables = `${cinzelDecorative.variable} ${cinzel.variable} ${cormorant.variable} ${specialElite.variable} ${inter.variable}`;
