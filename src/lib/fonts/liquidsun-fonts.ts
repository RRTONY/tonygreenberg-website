import { Space_Mono } from "next/font/google";

// LiquidSun (/liquid-sun) body face: Space Mono, which the LiquidSun app loaded from Google Fonts
// for its body text (index.css `font-body`). The app's link also loaded Cinzel Decorative and
// Uncial Antiqua, but no page used them, so they are not loaded here. Its headings asked for
// "Playfair Display" without loading it, so visitors saw the browser's serif; that stack is kept
// as-is in liquidsun.css. Only the /liquid-sun layout imports this file.

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-ls-space-mono",
  display: "swap",
});

export const liquidsunFontVariables = spaceMono.variable;
