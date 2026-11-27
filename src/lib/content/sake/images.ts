// Sake for Sake's Sake images. The Sake Manus app's 15 pictures (5 scene photos and 10 bottle
// renders, Manus "sessionFile" links) were already deleted on Manus (HTTP 403, checked 2026-11-26),
// and the export has no image files. Until stand-ins are chosen and uploaded to Sanity (same approach
// as Aqueous, src/lib/content/aqueous/images.ts), each entry is `null` and pages show the app's own
// ink-wash gradient in its place, which is what the app showed in Austere mode
// (components/AustereWrapper.tsx `AustereImage`). Fill an entry in with a Sanity CDN url and it
// shows everywhere that picture was used. Use <SakeImage image={sakeImages.hero} ... />.

export type SakeImageData = { src: string; width: number; height: number; alt: string };

/** Scene photos: was the app's Manus file name, and where it was used. */
export const sakeImages: Record<
  "hero" | "brewing" | "rice" | "aroma" | "prefecture",
  SakeImageData | null
> = {
  /** Was "sake-hero". Home hero, WabiSabi, Producers, Kyoto, share image. */
  hero: null,
  /** Was "sake-brewing". Process hero, Home. */
  brewing: null,
  /** Was "sake-rice". Rice hero, Home. */
  rice: null,
  /** Was "sake-aroma". Aroma hero, Home. */
  aroma: null,
  /** Was "sake-prefecture". Prefectures hero, Home. */
  prefecture: null,
};

export type BottleKind =
  | "junmai"
  | "daiginjo"
  | "nigori"
  | "sparkling"
  | "aged"
  | "yamahai"
  | "ginjo"
  | "honjozo"
  | "can"
  | "craft";

/** Bottle renders by sake type (the app's lib/bottleImages.ts), was "sake-bottle-<kind>". */
export const bottleImages: Record<BottleKind, SakeImageData | null> = {
  junmai: null,
  daiginjo: null,
  nigori: null,
  sparkling: null,
  aged: null,
  yamahai: null,
  ginjo: null,
  honjozo: null,
  can: null,
  craft: null,
};

/**
 * The app's getBottleImage(): which bottle picture a sake type shows, same matching order. Fixed: the
 * app tested `includes("can")`, which also matched "Ameri-can", so American craft sakes showed the
 * canned-sake picture; "can" now has to be its own word.
 */
export function bottleKindFor(sakeType: string): BottleKind {
  const t = sakeType.toLowerCase();
  if (t.includes("nigori")) return "nigori";
  if (t.includes("sparkling")) return "sparkling";
  if (t.includes("aged") || t.includes("koshu")) return "aged";
  if (t.includes("yamahai") || t.includes("kimoto")) return "yamahai";
  if (/\bcan\b/.test(t) || t.includes("futsu") || t.includes("honjozo nama")) return "can";
  if (t.includes("craft") || t.includes("american")) return "craft";
  if (t.includes("daiginjo")) return "daiginjo";
  if (t.includes("ginjo")) return "ginjo";
  if (t.includes("honjozo")) return "honjozo";
  if (t.includes("tokubetsu")) return "ginjo";
  return "junmai";
}

export function getBottleImage(sakeType: string): SakeImageData | null {
  return bottleImages[bottleKindFor(sakeType)];
}
