import { ForwardIcon } from "@/components/ui/inline-icons";
// Ported from legacy client/src/components/BioChainCTA.tsx — a shared CTA
// used on every peptide/biohacking/bio-sourcing page. Real, static outbound
// links to RampRate's own BioChain business site (verified live); no
// backend/form on this side at all, so nothing to reduce here.
export type BioChainVariant = "supplier" | "buyer" | "both";

export function BioChainCTA({
  variant = "both",
  context,
}: {
  variant?: BioChainVariant;
  context?: string;
}) {
  return (
    <div className="my-10 border-l-4 border-[#8B5A2B] bg-linear-to-br from-[#F5F0E8] to-[#EDE4CC] p-8">
      <div className="mb-2 font-mono text-xs tracking-[0.12em] text-[#8B5A2B] uppercase">
        Verified Bio-Sourcing — BioChain by RampRate
      </div>
      <div className="mb-3 font-heading text-xl leading-snug text-[#2C1810] italic">
        {context ??
          "Supplier and buyer intake for peptides, stem cells, and exosomes lives at RampRate."}
      </div>
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-[#4A2E1A]">
        This site is where you read and learn. Business engagement — supplier applications, buyer
        onboarding, CoA verification, and distribution partnerships — happens at
        ramprate.com/biochain.
      </p>
      <div className="flex flex-wrap gap-3">
        {(variant === "supplier" || variant === "both") && (
          <a
            href="https://ramprate.com/biochain/supplier-intake"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-[#2C1810] px-6 py-3 font-mono text-xs tracking-wide text-[#F5F0E8] uppercase"
          >
            Supplier Application <ForwardIcon aria-hidden="true" />
          </a>
        )}
        {(variant === "buyer" || variant === "both") && (
          <a
            href="https://ramprate.com/biochain/buyer-intake"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-[#8B5A2B] px-6 py-3 font-mono text-xs tracking-wide text-[#2C1810] uppercase"
          >
            Buyer / Distribution Partner <ForwardIcon aria-hidden="true" />
          </a>
        )}
        <a
          href="https://ramprate.com/biochain"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm px-6 py-3 font-mono text-xs tracking-wide text-[#8B5A2B] uppercase"
        >
          <span className="inline-flex items-center gap-1.5">
            BioChain Overview <ForwardIcon aria-hidden="true" />
          </span>
        </a>
      </div>
    </div>
  );
}
