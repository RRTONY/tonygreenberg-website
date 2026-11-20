import Image from "next/image";
import type { LiquidsunImage } from "@/lib/content/liquidsun/images";

// The fixed background most LiquidSun editorial pages share (the app repeated it in each page):
// a photo (the app's CSS background-image with cover sizing, here next/image fill + object-cover),
// a dark slate gradient and the pulsing stardust texture. `imageClassName` carries the page's own
// opacity / blend classes as a full literal string.
export function EditorialBackdrop({
  image,
  imageClassName,
  stardust = true,
}: {
  image: LiquidsunImage;
  imageClassName: string;
  stardust?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Image src={image.src} alt="" fill priority sizes="100vw" className={imageClassName} />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />
      {stardust && <div className="ls-stardust absolute inset-0 animate-pulse opacity-20" />}
    </div>
  );
}
