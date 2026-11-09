import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { soulsmokeJourneyPages, ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/components/PageJourney.tsx: the "Your Journey"
// progress dots and Previous/Next cards at the bottom of the six journey pages.

const LIME_TEXT_HOVER = "group-hover:text-[oklch(0.85_0.18_130)]";

export function PageJourney({ currentPath }: { currentPath: string }) {
  const currentIndex = soulsmokeJourneyPages.findIndex((page) => page.path === currentPath);
  const prevPage = currentIndex > 0 ? soulsmokeJourneyPages[currentIndex - 1] : null;
  const nextPage = currentIndex < soulsmokeJourneyPages.length - 1 ? soulsmokeJourneyPages[currentIndex + 1] : null;

  return (
    <section className="border-t border-white/10 bg-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-6 text-center font-mono text-sm tracking-widest text-white/40">YOUR JOURNEY</p>
          <div className="flex items-center justify-center gap-2">
            {soulsmokeJourneyPages.map((page, index) => (
              <Link
                key={page.path}
                href={ss(page.path)}
                aria-label={`${index + 1} of ${soulsmokeJourneyPages.length}: ${page.label}`}
                className="group flex cursor-pointer items-center"
              >
                <span
                  className={
                    index === currentIndex
                      ? "size-3 scale-125 rounded-full bg-[oklch(0.85_0.18_130)] transition-all duration-300"
                      : index < currentIndex
                        ? "size-3 rounded-full bg-[oklch(0.85_0.18_130)]/50 transition-all duration-300"
                        : "size-3 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/40"
                  }
                />
                {index < soulsmokeJourneyPages.length - 1 && (
                  <span
                    className={
                      index < currentIndex
                        ? "h-px w-8 bg-[oklch(0.85_0.18_130)]/50 transition-all duration-300"
                        : "h-px w-8 bg-white/10 transition-all duration-300"
                    }
                  />
                )}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-sm text-white/60">
              {currentIndex + 1} of {soulsmokeJourneyPages.length}:{" "}
              <span className="text-white">{soulsmokeJourneyPages[currentIndex]?.label}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {prevPage ? (
            <Link
              href={ss(prevPage.path)}
              className="group cursor-pointer border border-white/10 p-6 transition-all duration-300 hover:border-[oklch(0.85_0.18_130)]/50"
            >
              <div className={`mb-2 flex items-center gap-3 text-white/40 transition-colors ${LIME_TEXT_HOVER}`}>
                <ArrowLeft aria-hidden="true" size={16} />
                <span className="font-mono text-xs tracking-widest">PREVIOUS</span>
              </div>
              <h3 className={`font-heading text-xl text-white transition-colors ${LIME_TEXT_HOVER}`}>{prevPage.label}</h3>
              <p className="mt-1 text-sm text-white/50">{prevPage.description}</p>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href={nextPage ? ss(nextPage.path) : ss("/")}
            className="group cursor-pointer border border-white/10 p-6 text-right transition-all duration-300 hover:border-[oklch(0.85_0.18_130)]/50"
          >
            <div className={`mb-2 flex items-center justify-end gap-3 text-white/40 transition-colors ${LIME_TEXT_HOVER}`}>
              <span className="font-mono text-xs tracking-widest">{nextPage ? "NEXT" : "START OVER"}</span>
              <ArrowRight aria-hidden="true" size={16} />
            </div>
            <h3 className={`font-heading text-xl text-white transition-colors ${LIME_TEXT_HOVER}`}>
              {nextPage ? nextPage.label : "Return Home"}
            </h3>
            <p className="mt-1 text-sm text-white/50">{nextPage ? nextPage.description : "Begin the journey again"}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
