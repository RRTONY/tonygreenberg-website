// LiquidSun images, rescued from the Manus app into Sanity on 2026-11-21 (files.manuscdn.com
// session uploads, the app's client/public/images and the live host's /images). Mapping of every
// original URL: docs/ai/manus-media-rescue.md ("LiquidSun media rescued"). Use with next/image:
// <Image src={liquidsunImages.agaveFieldMoon.src} alt={liquidsunImages.agaveFieldMoon.alt} ... />

export type LiquidsunImage = { src: string; width: number; height: number; alt: string };

const CDN = "https://cdn.sanity.io/images/a3q1cyqs/production";

export const liquidsunImages = {
  /** JtUUDZeQRJiivtsd.jpg (also iQNorYHWVCXheNeK.jpg, the same picture): Home and Flavor Finder backgrounds. */
  agaveFieldMoon: {
    src: `${CDN}/ac05bc38f7bc8d13f22b992924555b40c78f9360-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Agave field at twilight under a full moon, a lit farmhouse on the ridge",
  },
  /** wXEioeOzBJTvyOtQ.jpg: Home manifesto "Volcanic Stone Tahona". */
  tahonaWheel: {
    src: `${CDN}/8620aaa52cfbf12e57687b01913bcd3315b183eb-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Volcanic stone tahona wheel crushing roasted agave fibers",
  },
  /** qSdLzpyCqNgVHbKa.jpg: Quadrant and Bottle Scanner backgrounds. */
  tahonaMill: {
    src: `${CDN}/d226c65b523defa1004ffdf143b29e493ebd4198-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Stone tahona wheel in a sunlit mill, cooked agave in the pit",
  },
  /** SPDjxRYIzrkZQZlx.jpg: the Altar bottles and several producer cards. */
  bottleVolcanico: {
    src: `${CDN}/dafffe172bd8bd73d0b01876548384dbf7ee53fc-1072x1920.webp`,
    width: 1072,
    height: 1920,
    alt: "Amber tequila bottle resting on volcanic rock",
  },
  /** zdxjHMMaNneHEQQk.jpg: producer cards. */
  pinaHalved: {
    src: `${CDN}/5cc1090577ac22e5bcb4744950dd46b8bbe3061c-1920x1920.webp`,
    width: 1920,
    height: 1920,
    alt: "A halved agave piña on red highland soil beside a coa",
  },
  /** LkNIsUdMWwFIpypD.jpg: producer cards. */
  agaveFieldDawn: {
    src: `${CDN}/e114615b2eb216ab3bfbe99fa8d4cca54853cf1c-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Rows of blue agave on red soil at dawn above a misty valley",
  },
  /** OlRLFmREgnnSeWwQ.jpg: producer cards. */
  copperStills: {
    src: `${CDN}/2d9fdb8bdd414523655e6e1a612ca2a699d03ff0-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Copper pot stills in a brick distillery hall, workers among roasted piñas",
  },
  /** PHLHjtTTLoSKHGgF.jpg (also kPkSjYjlIqSptmCE.jpg): Trade Board and Price Tracker backgrounds. */
  barrelCellar: {
    src: `${CDN}/ef2660ba5b50812e791159c4c7ab1bab6ef21b61-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "A long aisle of oak barrels, a figure with a lantern at the end",
  },
  /** JfgLjlWIDjMbaaKY.jpg: the Altar background. */
  altarShrine: {
    src: `${CDN}/ca1655e5763192e4a5e6693817fafd817515e737-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "A tequila bottle and a copita on an altar under a beam of light",
  },
  /** ZvBWHmBTEDtZbDcD.jpg: Agave Genetics and Jalisco Map backgrounds. */
  agaveMoonlit: {
    src: `${CDN}/37e2a37270bc8f7647f8bb0290a1375992603840-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Misty agave field under a full moon",
  },
  /** blnwHmtMTbBnITsZ.jpg: Science of Spirit and Sacred Kitchens backgrounds. */
  alchemyDistillery: {
    src: `${CDN}/5cdd40df2b668aadf072b8be7f7939f30da533d4-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Copper stills with swirling vapor in a lamp-lit distillery",
  },
  /** nwKzrhVZRKEgkABi.jpg: The Voices and The Gatekeepers backgrounds. */
  candleCellar: {
    src: `${CDN}/220cf97db10637319c282a2cede06ca5752a3bb7-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Candlelit stone cellar lined with barrels",
  },
  /** wiywxdQhuzZiYUxf.jpg: Squad Riders and Pilgrimage Guide backgrounds. */
  jimadorSunset: {
    src: `${CDN}/46b5dcea0fec544c5c58715a43326d28f109f7e5-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "A jimador swinging a coa among agaves at sunset",
  },
  /** UWhnQvZaDWKoltyD.jpg: The Assholes background. */
  industrialDistillery: {
    src: `${CDN}/a5c1438d4d96c91ccc22bb9098dbb0af0b803a95-1920x1072.webp`,
    width: 1920,
    height: 1072,
    alt: "Industrial distillery nightmare",
  },
  /** /images/bottle-fortaleza.jpg */
  bottleFortaleza: { src: `${CDN}/9dbfc1529d796ba7510fabd9aaed933728b959ff-256x327.webp`, width: 256, height: 327, alt: "Fortaleza tequila bottle" },
  /** /images/bottle-g4.jpg */
  bottleG4: { src: `${CDN}/76f1be65a5fa604c5c636e6afb29c48c944f2f44-800x1020.webp`, width: 800, height: 1020, alt: "G4 tequila bottle" },
  /** /images/bottle-caballito.jpg */
  bottleCaballito: { src: `${CDN}/df1ad22d29ef6c1da1f1415182e9d03abdd14bad-1200x1200.webp`, width: 1200, height: 1200, alt: "Caballito Cerrero tequila bottle" },
  /** /images/bottle-fuenteseca.jpg */
  bottleFuenteseca: { src: `${CDN}/68618bbe232a81e25474b5a7f069ed1028d622a8-1200x1200.webp`, width: 1200, height: 1200, alt: "Fuenteseca Reserva tequila bottle" },
  /** /images/bottle-rey.jpg */
  bottleReySol: { src: `${CDN}/70d8f6a91297e9ae138e60969b344be8fb915547-800x800.webp`, width: 800, height: 800, alt: "Rey Sol tequila bottle and box" },
  /** /images/bottle-tears.jpg */
  bottleTears: { src: `${CDN}/b16fa8f074eb8ba4e63e35817bc944ea14f6145a-600x900.webp`, width: 600, height: 900, alt: "Tears of Llorona tequila bottle" },
} satisfies Record<string, LiquidsunImage>;

/** transparenttextures.com "stardust" tile, the app's overlay texture (rescued so no third-party host is needed). */
export const LIQUIDSUN_STARDUST_URL = `${CDN}/ca610b5c7628a6e6aed384ebb744a5d1e4fc466c-798x798.png`;

/** The app's AudioController tracks (client/public/audio), rescued to Sanity. */
export const LIQUIDSUN_AUDIO = {
  wind: "https://cdn.sanity.io/files/a3q1cyqs/production/1a4e223a7e5f67d38ceb79a0c1fbba2d5b2b20c7.mp3",
  grind: "https://cdn.sanity.io/files/a3q1cyqs/production/30400ddb2225daecddff9c73d3c67aca0647ff0b.mp3",
} as const;
