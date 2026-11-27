import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";

// Aqueous (/aqueous) faces, the same three the Aqueous Manus app loaded from Google Fonts in its
// index.html: Cormorant Garamond (headings, the logo), DM Sans (body) and JetBrains Mono (`.font-data`
// numbers). next/font instead of the <link>. Only the /aqueous layout imports this file.

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-aq-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-aq-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-aq-mono",
  display: "swap",
});

export const aqueousFontVariables = `${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`;
