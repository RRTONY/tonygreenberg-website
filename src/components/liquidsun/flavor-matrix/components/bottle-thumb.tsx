import Image from "next/image";
import { Wine } from "lucide-react";
import type { Bottle } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";

// A bottle photo in the Flavor Matrix hover card and list. Eleven bottles never had a photo on the
// live site (a broken image there); they get a quiet bottle icon on the same dark box instead.
export function BottleThumb({ bottle, imageClassName, sizes }: { bottle: Bottle; imageClassName: string; sizes: string }) {
  if (!bottle.image) {
    return (
      <span className="flex size-full items-center justify-center text-slate-600">
        <Wine aria-hidden="true" className="size-6" strokeWidth={1.25} />
        <span className="sr-only">{`${bottle.brand} ${bottle.expression}`}</span>
      </span>
    );
  }
  return <Image src={bottle.image.src} alt={bottle.image.alt} fill sizes={sizes} className={imageClassName} />;
}
