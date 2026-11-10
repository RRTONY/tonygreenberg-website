import type { SoulsmokeImage } from "@/lib/content/soulsmoke/images";

// Copy for /soul-smoke/fane-kantsini, ported unchanged from the SoulSmoke app's
// client/src/pages/FaneKantsini.tsx (ORIGIN_STORY, COLLECTIVE_CONTENT, MAIN_MONTAGE_TRANSCRIPT).

// --- MEDIA ---
// The app's Fane Kantsini logo, backgrounds, 8 photos and 2 videos were hosted on the old app
// host's file CDN and are NOT rescued yet, so they can't be used here (no old-host URLs rule).
// Each one is `null` until it's re-hosted in Sanity; the page leaves out whatever is missing
// (no logo, no background textures, transcript without the player, no photo cards).
// To restore: upload to Sanity, then fill the entry in (images as { src, width, height, alt }).
export type FaneKantsiniMedia = {
  logo: SoulsmokeImage | null;
  heroBg: SoulsmokeImage | null;
  agaveTexture: SoulsmokeImage | null;
  videos: { main: string | null; business: string | null };
  /** Same order as the app: 0-4 are the Vault cards, 5 is Sósima, 6-7 the women's section. */
  photos: { image: SoulsmokeImage | null; title: string; desc: string }[];
};

export const faneKantsiniMedia: FaneKantsiniMedia = {
  logo: null,
  heroBg: null,
  agaveTexture: null,
  videos: { main: null, business: null },
  photos: [
    { image: null, title: "The Toast", desc: "Celebrating with the creator." },
    { image: null, title: "The Bar", desc: "Atmosphere and spirits." },
    { image: null, title: "Contemplation", desc: "A moment of reflection." },
    { image: null, title: "The Collection", desc: "Surrounded by liquid history." },
    { image: null, title: "Tasting Notes", desc: "Analyzing the 55 degree spirit." },
    { image: null, title: "Sosima Olivera", desc: "Maestra Mezcalera" },
    { image: null, title: "Women of Fane Kantsini", desc: "The Collective" },
    { image: null, title: "Mezcal Production", desc: "Traditional Process" },
  ],
};

// --- ORIGIN STORY (BILINGUAL) ---
export type OriginParagraph = string | { text: string; hasLink: true; linkText: string; afterLink: string };

export const ORIGIN_STORY: Record<
  "en" | "es",
  { sectionLabel: string; title: string; paragraphs: OriginParagraph[]; closing: string[] }
> = {
  en: {
    sectionLabel: "THE ORIGIN",
    title: "How I Found the Unfindable",
    paragraphs: [
      `Years ago, I needed to assemble a case of things extraordinary for an extraordinary human. Not flashy. Not loud. Just undeniable.`,
      `I called Doug Frost. When you need the truth, you call someone who has no patience for nonsense. Doug is one of only three people on Earth to hold both the Master Sommelier and Master of Wine titles, which is less about credentials and more about surviving a lifetime of being wrong until you aren't.`,
      `I asked him what the most magnificent case would look like if every bottle had to outshine the last.`,
      `He gave me ten answers that made everything else feel like décor. Then he paused.`,
      `"Tony," he said, "this is already impossible. But there are two more. You're going to have trouble."`,
      `He didn't have a number. Just a name: Fane Kantsini.`,
      `What followed felt like chasing a myth through bad Wi-Fi. Broken social profiles. Half-remembered introductions. People who knew someone who once heard the name in Oaxaca. Eventually, improbably, I found a woman moving between Mexico City and Denver.`,
      `She said, "I'm the bearer. I can bring these spirits to you. Slowly."`,
      `And she did.`,
      `Cases arrived when they were ready. Each bottle quieter than the last, and somehow more powerful. Of course I sent some back to Doug. I still owe him. He knows.`,
      {
        text: `Without trying, I built a collection of nearly fifty bottles.`,
        hasLink: true,
        linkText: "fifty bottles",
        afterLink:
          " One producer. One sensibility. Esoteric, Bohemian, disciplined, and completely uninterested in performing for anyone.",
      },
      `I didn't meet Sosima until years later. When I did, everything snapped into place.`,
    ],
    closing: [
      `This site is not a store. It's a thank-you note. An act of respect. A small shrine to the idea that the greatest things don't rush, don't explain themselves, and don't care if you're ready.`,
      `I collect friends. I collect stories. I collect things that carry meaning longer than their contents.`,
      `This is devoted to Sosima of Fane Kantsini.`,
    ],
  },
  es: {
    sectionLabel: "EL ORIGEN",
    title: "Cómo Encontré lo Inencontrable",
    paragraphs: [
      `Hace años, necesitaba armar una caja de cosas extraordinarias para un ser humano extraordinario. Nada llamativo. Nada ruidoso. Solo innegable.`,
      `Llamé a Doug Frost. Cuando necesitas la verdad, llamas a alguien que no tiene paciencia para tonterías. Doug es una de las tres únicas personas en la Tierra que posee los títulos de Master Sommelier y Master of Wine, lo cual tiene menos que ver con credenciales y más con sobrevivir toda una vida equivocándose hasta que dejas de hacerlo.`,
      `Le pregunté cómo sería la caja más magnífica si cada botella tuviera que superar a la anterior.`,
      `Me dio diez respuestas que hicieron que todo lo demás pareciera decoración. Luego hizo una pausa.`,
      `"Tony," dijo, "esto ya es imposible. Pero hay dos más. Vas a tener problemas."`,
      `No tenía un número. Solo un nombre: Fane Kantsini.`,
      `Lo que siguió fue como perseguir un mito a través de Wi-Fi defectuoso. Perfiles sociales rotos. Presentaciones a medias recordadas. Gente que conocía a alguien que una vez escuchó el nombre en Oaxaca. Eventualmente, improbablemente, encontré a una mujer que se movía entre Ciudad de México y Denver.`,
      `Ella dijo, "Soy la portadora. Puedo traerte estos espíritus. Lentamente."`,
      `Y lo hizo.`,
      `Las cajas llegaban cuando estaban listas. Cada botella más silenciosa que la anterior, y de alguna manera más poderosa. Por supuesto, le envié algunas a Doug. Todavía le debo. Él lo sabe.`,
      {
        text: `Sin proponérmelo, construí una colección de casi cincuenta botellas.`,
        hasLink: true,
        linkText: "cincuenta botellas",
        afterLink:
          " Un productor. Una sensibilidad. Esotérico, bohemio, disciplinado, y completamente desinteresado en actuar para nadie.",
      },
      `No conocí a Sosima hasta años después. Cuando lo hice, todo encajó.`,
    ],
    closing: [
      `Este sitio no es una tienda. Es una nota de agradecimiento. Un acto de respeto. Un pequeño santuario a la idea de que las cosas más grandes no se apresuran, no se explican, y no les importa si estás listo.`,
      `Colecciono amigos. Colecciono historias. Colecciono cosas que llevan significado más tiempo que su contenido.`,
      `Esto está dedicado a Sosima de Fane Kantsini.`,
    ],
  },
};

// --- CONTENT ---
export const COLLECTIVE_CONTENT = {
  history: {
    title: "The Legend of Fane Kantsini",
    subtitle: "A Mythical Hero, A Modern Movement",
    body: `In the rugged Sierra Sur of Oaxaca, where the clouds kiss the agave, a legend was born. Fane Kantsini—the "Three Hummingbirds"—is not just a name; it is a homage to a mythical superhero of the Chontal region. Born on the third day of the month of the hummingbird in the pre-Hispanic calendar, Fane Kantsini represents strength, agility, and the nectar of life itself.

    Maestra Mezcalera Sósima Olivera Aguilar, a fourth-generation guardian of the spirit, chose this name to honor her roots. But she did more than name a brand; she built a sanctuary. Tres Colibrí is not a factory. It is a cooperative born from the soil of necessity and the spirit of community. Inspired by her work with church groups that used cooperative models to feed the hungry, Sósima asked a radical question: "How do we continue forming this in the pueblos, this communal work that at the end of the day is how you make mezcal anyway?"

    The answer was Fane Kantsini. A collective where mezcaleros don't just share a copper still; they share a destiny. They rotate production, make economic decisions as a family, and stand together against the industrial tide.`,
  },
  women: {
    title: "The Matriarchs of Mezcal",
    subtitle: "Shattering the Glass Ceiling with Clay and Copper",
    body: `For centuries, the story of mezcal has been told through the hands of men. Sósima Olivera Aguilar is rewriting that narrative, not with ink, but with liquid spirit.

    When Sósima returned to the Chontal region after a decade of motherhood, she saw a market exploding and traditions eroding. She founded the cooperative with a vision to support women producers, but the reality became something even more profound: a true balance.

    "The practice of working collaboratively between men and women has supported a shift in perception... of what work women are capable of within the production chain: all of it."

    At Fane Kantsini, women are not just helpers; they are Maestras. They are the custodians of the "Tasmanian Tiger of Agaves"—the Chuparrosas. They are the alchemists behind the 55-degree Pelon Verde. They are the guardians of biodiversity, planting twenty magueyes for every ten they harvest, ensuring that the spirit of the earth survives for the next generation.

    This is not just mezcal. It is a statement. A liquid testament to the power of the feminine in a world of fire and smoke.`,
  },
  philosophy: {
    title: "The Philosophy of the Soil",
    points: [
      {
        title: "Communal Over Commercial",
        desc: "We don't compete; we collaborate. Every bottle supports eight families, not a boardroom.",
      },
      {
        title: "Biodiversity as Religion",
        desc: "We don't just harvest; we heal. We plant heirloom corn, beans, and squash alongside our agave, restoring the earth that feeds us.",
      },
      {
        title: "The Spirit of the Glitch",
        desc: "We embrace the imperfections, the wild yeasts, the unpredictable weather. We are not machines. We are people, and our mezcal tastes like us.",
      },
    ],
  },
};

// --- TRANSCRIPT DATA ---
export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  isHighlight?: boolean;
}

export const MAIN_MONTAGE_TRANSCRIPT: TranscriptSegment[] = [
  { start: 0, end: 5, text: "This is the Chuparrosas. This is the Tasmanian Tiger of agaves.", isHighlight: true },
  { start: 5, end: 10, text: "It's almost extinct. It's very rare. It's very hard to find.", isHighlight: true },
  { start: 10, end: 15, text: "And this is what we're drinking right now. This is history in a glass." },
  { start: 15, end: 20, text: "Look at the pearls. Look at the pearls on this.", isHighlight: true },
  { start: 20, end: 25, text: "This is 55 degrees. This is not for the faint of heart." },
  { start: 25, end: 30, text: "But it's smooth. It's incredibly smooth for 55 degrees." },
  { start: 30, end: 35, text: "You can taste the earth. You can taste the smoke. You can taste the hands that made it." },
  { start: 35, end: 40, text: "Sósima, she's a genius. She's an absolute genius." },
  { start: 40, end: 45, text: "Before we drink, we think. From our heart.", isHighlight: true },
  { start: 45, end: 50, text: "Not from our head. From our heart." },
  { start: 50, end: 55, text: "Salud. To the journey. To the collection." },
  { start: 55, end: 60, text: "Six years. Six years of sneaking bottles over the border." },
  { start: 60, end: 65, text: "And now we're here. At the source." },
  { start: 65, end: 70, text: "This is Fane Kantsini. This is the Three Hummingbirds." },
  { start: 70, end: 75, text: "It's more than a brand. It's a movement." },
  { start: 75, end: 80, text: "It's about the people. It's about the community." },
  { start: 80, end: 85, text: "It's about preserving something that is disappearing." },
  { start: 85, end: 90, text: "So when you drink this, you're drinking a piece of resistance." },
  { start: 90, end: 95, text: "You're drinking a piece of the future." },
  { start: 95, end: 100, text: "Cheers to that." },
];

/** "m:ss" for a transcript start time. */
export function formatTimestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}
