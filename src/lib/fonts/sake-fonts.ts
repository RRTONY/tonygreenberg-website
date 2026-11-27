import { Cormorant_Garamond, JetBrains_Mono, Noto_Sans, Noto_Sans_JP } from "next/font/google";

// Sake for Sake's Sake (/sake) faces, the four the Sake Manus app loaded from Google Fonts in its
// index.html: Cormorant Garamond (headings, the logo), Noto Sans (body), Noto Sans JP (Japanese text
// and the whole Austere look) and JetBrains Mono (scores). next/font instead of the <link>. Only the
// /sake layout imports this file. Noto Sans JP isn't preloaded: its Japanese glyphs come in
// unicode-range slices the browser fetches only when Japanese text is on screen.

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sk-cormorant",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sk-noto",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sk-noto-jp",
  display: "swap",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sk-mono",
  display: "swap",
});

export const sakeFontVariables = `${cormorant.variable} ${notoSans.variable} ${notoSansJp.variable} ${jetbrains.variable}`;
