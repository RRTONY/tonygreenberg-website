import Link from "next/link";

// Shared across every peptide page in legacy — real, unchanged.
export function PeptideShutdownBanner() {
  return (
    <div className="border-b border-red-600/30 bg-linear-to-r from-[#1a0a0a] via-[#2a0a0a] to-[#1a0a0a] px-6 py-3">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4">
        <span className="font-mono text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
          March 2026
        </span>
        <span className="text-sm text-red-300">
          Peptide Sciences shut down by FDA.{" "}
          <Link href="/rip-peptide-sciences" className="font-semibold text-red-600 underline">
            Full breakdown →
          </Link>
        </span>
      </div>
    </div>
  );
}
