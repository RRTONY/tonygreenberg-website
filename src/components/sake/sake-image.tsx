import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SakeImageData } from "@/lib/content/sake/images";

// A Sake picture, or the app's ink-wash gradient in its place when the picture has no Sanity copy
// yet (src/lib/content/sake/images.ts) — the same stand-in the app drew in Austere mode
// (AustereWrapper.tsx AustereImage). `className` sizes and positions it either way (the app's
// <img className=...>), e.g. "absolute inset-0 size-full object-cover opacity-30 hero-image".
export function SakeImage({
  image,
  className,
  sizes = "100vw",
  priority = false,
}: {
  image: SakeImageData | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) return <div aria-hidden="true" className={cn("sk-image-wash", className)} />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
