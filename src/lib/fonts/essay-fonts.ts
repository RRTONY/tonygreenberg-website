import { Cormorant_Garamond, Fraunces, IM_Fell_English, Libre_Baskerville } from "next/font/google";

// The four faces live's essay pages use (legacy BlogPost.tsx, checked against
// tonygreenberg.com's computed styles 2026-10-07): Libre Baskerville body,
// Cormorant Garamond italic section titles, IM Fell English for the contents
// sidebar, drop cap, summary and pull quotes, Fraunces for the hero title.
// Loaded only by app/blog/[slug] (the classes go on its wrapper), so the rest
// of the site doesn't download them. Mapped to font-essay / font-essay-heading
// / font-fell / font-fraunces in globals.css.

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-cormorant-face",
  display: "swap",
  preload: false,
});

const imFell = IM_Fell_English({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-im-fell",
  display: "swap",
  preload: false,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-fraunces-face",
  display: "swap",
});

export const essayFontVariables = `${libreBaskerville.variable} ${cormorant.variable} ${imFell.variable} ${fraunces.variable}`;
