// Aqueous images, in Sanity since 2026-11-24. The Aqueous Manus app's four photos (hero, water drops,
// lab, spring; Manus "sessionFile" links) were already deleted on Manus (HTTP 403 "Unknown Key", live
// site broken too), so the webmaster chose free Unsplash stand-ins on the same subjects; Tony can swap
// them for the originals in Sanity. The bottle photos the app pulled from Unsplash are in Sanity too
// (water-data.ts). Mapping: docs/ai/manus-media-rescue.md ("Aqueous media").
// Use with next/image: <Image src={aqueousImages.heroWaterSacred.src} alt={aqueousImages.heroWaterSacred.alt} ... />

export type AqueousImage = { src: string; width: number; height: number; alt: string };

const CDN = "https://cdn.sanity.io/images/a3q1cyqs/production";

export const aqueousImages = {
  /** Was img-1 "hero-water-sacred". Stand-in: Unsplash photo-1432405972618-c60b0225b8f9. Home hero, share image. */
  heroWaterSacred: {
    src: `${CDN}/1ff9fa5261fb6fbdabb9d7c47373b1241bf024fd-1920x1280.jpg`,
    width: 1920,
    height: 1280,
    alt: "Waterfalls pouring over a mossy cliff into a clear forest pool",
  },
  /** Was img-2 "water-drops-macro". Stand-in: Unsplash photo-1559825481-12a05cc00344. Home, Philosophy. */
  waterDropsMacro: {
    src: `${CDN}/ca272bcd41bda907be5aa8ff158cb11fa861f8a9-1920x2400.jpg`,
    width: 1920,
    height: 2400,
    alt: "Sunlight rippling through clear blue water over a sandy floor",
  },
  /** Was img-3 "water-testing-lab". Stand-in: Unsplash photo-1532187863486-abf9dbad1b69. Home, QPR Methodology. */
  waterTestingLab: {
    src: `${CDN}/fafefc084d8227bd656fc3a096f8076dc79ac55a-1920x1280.jpg`,
    width: 1920,
    height: 1280,
    alt: "A pipette filling rows of clear test tubes in a water testing lab",
  },
  /** Was img-4 "nature-spring-source". Stand-in: Unsplash photo-1437482078695-73f5ca6c96e2. Home, Philosophy, Manifesto. */
  natureSpringSource: {
    src: `${CDN}/7113afd5c07fe4c023c9192301c31ad8bfb638ac-1920x1280.jpg`,
    width: 1920,
    height: 1280,
    alt: "A clear mountain stream running over smooth stones in a green forest",
  },
} satisfies Record<string, AqueousImage>;
