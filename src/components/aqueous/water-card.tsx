import Link from "next/link";
import Image from "next/image";
import { DollarSign, MapPin } from "lucide-react";
import { getPackagingLabel, getSourceTypeLabel, type WaterProduct } from "@/lib/content/aqueous/water-data";
import { calculateAWI, defaultProfile, getAWIGrade, getAWIScoreColor, type UserWaterProfile } from "@/lib/content/aqueous/awi-engine";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/components/WaterCard.tsx (2026-11-24).
// Frosted glass card with the AWI score (inverted 1-100, 1 = perfect, personalized to the profile).
// The motion.div entrance (initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }},
// transition={{ duration: 0.4, delay: index * 0.08 }}) is tw-animate classes plus the runtime delay.
// No hooks (the app's useMemo was only a cache), so it renders on the server or the client.

interface WaterCardProps {
  water: WaterProduct;
  index?: number;
  profile?: UserWaterProfile;
}

export function WaterCard({ water, index = 0, profile }: WaterCardProps) {
  const awi = calculateAWI(water, profile || defaultProfile);
  const scoreColor = getAWIScoreColor(awi.personalScore);

  return (
    <div className="animate-in duration-400 fill-mode-both fade-in slide-in-from-bottom-5" style={{ animationDelay: `${index * 0.08}s` }}>
      <Link href={aq(`/water/${water.id}`)}>
        <div className="glass-card group h-full overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {/* Image */}
          <div className="scan-lines glitch-hover relative h-44 overflow-hidden bg-muted">
            <Image
              src={water.imageUrl}
              alt={water.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* AWI Score Badge, top right */}
            <div className="absolute top-3 right-3">
              <div className="flex size-14 flex-col items-center justify-center rounded-lg border border-white/20 bg-[rgba(0,0,0,0.55)] backdrop-blur-md">
                <span className="font-data text-xl leading-none font-bold" style={{ color: scoreColor }}>
                  {awi.personalScore}
                </span>
                <span className="mt-0.5 text-[8px] font-semibold tracking-wider text-white/70 uppercase">AWI</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-2.5 left-3 rounded-full bg-black/30 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
              {getSourceTypeLabel(water.type)}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="mb-1 line-clamp-1 text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
              {water.name}
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">{water.brand}</p>

            <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3" />
                {water.sourceLocation}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              <div className="flex items-center gap-1 text-xs">
                <DollarSign aria-hidden="true" className="size-3 text-[oklch(0.60_0.12_55)]" />
                <span className="font-medium">${water.pricePerGallon.toFixed(2)}</span>
                <span className="text-muted-foreground">/gal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{getPackagingLabel(water.packaging)}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase"
                  style={{ color: scoreColor, backgroundColor: `${scoreColor}15` }}
                >
                  {getAWIGrade(awi.personalScore)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
