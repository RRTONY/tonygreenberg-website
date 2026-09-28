"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
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

      {/* Door detail modal — ported from legacy components/FourDoorsModal.tsx
          (the live site's design): image header fading into parchment, a
          "Door 0X" badge, round close button, serif headline with an ochre
          rule, gold-dot bullets, and a full-width dark CTA. Always light,
          like legacy (`colorScheme: "light"`). Radix handles Escape, focus
          trapping and scroll lock, which legacy did by hand; it's a bottom
          sheet on phones and centered from `sm` up, same as legacy.
          Composed from DialogPortal/DialogOverlay rather than DialogContent
          because DialogContent always renders its own default overlay. */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogPortal>
          <DialogOverlay className="z-9000 bg-[#2C1810]/55 backdrop-blur-md" />
          <DialogPrimitive.Content
            className="fixed inset-x-0 bottom-0 z-9001 max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-[#FAFAF7] text-[#2C1810] shadow-[0_-8px_60px_rgba(44,24,16,0.18)] ring-1 ring-[#836311]/10 outline-none [color-scheme:light] data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-8 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-160 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[20px] sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95"
          >
            {active && (
              <>
                <div className="relative h-50 shrink-0 overflow-hidden rounded-t-[20px]">
                  {active.img ? (
                    <Image src={active.img} alt="" fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#836311]/25 to-[#FAFAF7]">
                      {active.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent from-30% to-[#FAFAF7]" />
                  <div className="absolute top-4 left-5 rounded-[3px] bg-[#2C1810]/55 px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.22em] text-[#FAFAF7] uppercase backdrop-blur-sm">
                    Door {active.num}
                  </div>
                </div>

                <DialogClose
                  aria-label="Close"
                  className="absolute top-3.5 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-[#2C1810]/45 text-[#FAFAF7] backdrop-blur-sm transition-colors hover:bg-[#2C1810]/65"
                >
                  <X aria-hidden="true" className="size-4" />
                </DialogClose>

                <div className="px-6 pb-8">
                  <DialogTitle className="mb-1.5 font-heading text-[clamp(1.6rem,4vw,2rem)] leading-[1.1] font-normal text-[#2C1810]">
                    {active.headline}
                  </DialogTitle>
                  <div className="mb-4 h-0.5 w-10 bg-[#836311]" />
                  <DialogDescription className="mb-5 text-[0.95rem] leading-[1.7] text-[#2C1810]/75">
                    {active.body}
                  </DialogDescription>

                  {active.bullets.length > 0 && (
                    <ul className="mb-6 flex flex-col gap-2">
                      {active.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[0.88rem] leading-normal text-[#2C1810]/70">
                          <span aria-hidden="true" className="mt-[0.45rem] size-1.25 shrink-0 rounded-full bg-[#836311]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={active.href}
                    onClick={() => setActive(null)}
                    className="block w-full rounded-md bg-[#2C1810] px-6 py-3.5 text-center font-mono text-[0.78rem] tracking-[0.14em] text-[#FAFAF7] uppercase transition-colors hover:bg-[#836311]"
                  >
                    {active.cta} →
                  </Link>

                  <p className="mt-4 text-center font-mono text-[0.62rem] tracking-[0.12em] text-[#2C1810]/30">
                    Tap outside or press Esc to close
                  </p>
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
