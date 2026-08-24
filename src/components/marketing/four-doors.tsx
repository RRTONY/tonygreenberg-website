"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type Door = {
  num: string;
  title: string;
  sub: string;
  href: string;
  // Image is optional — a door with no rescued photo falls back to an
  // icon-on-gradient tile instead (see the homepage's doors: their legacy
  // source images live on the now-decommissioned Manus host and are gone).
  img?: string;
  imgWidth?: number;
  imgHeight?: number;
  // Already-rendered (e.g. `<Microscope className="..." />`), not a bare
  // component reference — FourDoors is a Client Component, and a component
  // *type* (a function) can't cross the server/client prop boundary, only
  // an already-rendered element can.
  icon?: ReactNode;
  headline: string;
  body: string;
  bullets: string[];
  cta: string;
};

export function FourDoors({ doors }: { doors: Door[] }) {
  const [active, setActive] = useState<Door | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-0.5 lg:grid-cols-4">
        {doors.map((door) => (
          <button
            key={door.num}
            onClick={() => setActive(door)}
            className="group relative block h-56 w-full overflow-hidden text-left"
          >
            {door.img && door.imgWidth && door.imgHeight ? (
              <Image
                src={door.img}
                alt={door.title}
                width={door.imgWidth}
                height={door.imgHeight}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-gold/25 via-background to-secondary transition-transform duration-700 ease-out group-hover:scale-105">
                {door.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold-light/80 uppercase">
                {door.num}
              </div>
              <div className="font-heading text-lg leading-tight text-white">{door.title}</div>
              <div className="text-xs text-white/70">{door.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">{active.headline}</DialogTitle>
                <DialogDescription>{active.body}</DialogDescription>
              </DialogHeader>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {active.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href={active.href}
                className="mt-2 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-brand-gold hover:text-brand-gold-light"
              >
                {active.cta} →
              </Link>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
