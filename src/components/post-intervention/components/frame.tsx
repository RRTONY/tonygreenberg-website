import type { ReactNode } from "react";

// Shared look for every step: warm amber header band, cream cards (legacy
// PostIntervention.tsx's `styles`). `done` switches the band to green.
export function Frame({ eyebrow, title, sub, done = false, children }: { eyebrow: string; title: string; sub: string; done?: boolean; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-160 from-[#FFFDF7] via-[#FEF3C7] via-30% to-[#F5F0FF] pb-20 font-[Georgia,serif]">
      <header
        className={
          done
            ? "bg-linear-135 from-[#065F46] via-[#059669] to-[#10B981] px-6 pt-12 pb-10 text-center"
            : "bg-linear-135 from-[#78350F] via-[#B45309] to-[#D97706] px-6 pt-12 pb-10 text-center"
        }
      >
        <p className={done ? "mb-3 font-mono text-[11px] tracking-[0.2em] text-[#A7F3D0] uppercase" : "mb-3 font-mono text-[11px] tracking-[0.2em] text-[#FDE68A] uppercase"}>
          {eyebrow}
        </p>
        <h1 className="mb-3 text-[clamp(26px,5vw,40px)]/[1.2] font-normal text-[#FFFDF7]">{title}</h1>
        <p className="mx-auto max-w-130 text-[15px]/[1.6] text-[#FDE68A]">{sub}</p>
      </header>
      <div className="mx-auto max-w-160 px-6 py-10">{children}</div>
    </div>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`mb-5 rounded-2xl border-[1.5px] border-[#FDE68A] bg-[#FFFDF7]/95 p-7 shadow-[0_4px_20px_rgba(180,83,9,0.08)] ${className}`}>
      {title && <h2 className="mb-4 font-mono text-[11px] tracking-[0.18em] text-[#B45309] uppercase">{title}</h2>}
      {children}
    </section>
  );
}

export const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-linear-135 from-[#B45309] to-[#D97706] px-8 font-mono text-[13px] font-bold tracking-[0.08em] text-white uppercase disabled:cursor-not-allowed disabled:opacity-50";
export const outlineButton =
  "inline-flex min-h-12 items-center justify-center rounded-[10px] border-2 border-[#D97706] bg-transparent px-7 font-mono text-[13px] font-bold tracking-[0.08em] text-[#B45309] uppercase";
