"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SHAME = [
  {
    name: "Dunkin' Donuts Decaf",
    process: "Methylene Chloride",
    issue:
      "Clean Label Project confirmed MC process. Dunkin' does not disclose decaffeination method on packaging. Pregnant women and heart patients are primary decaf consumers.",
    price: "~$9/12oz",
  },
  {
    name: "Amazon Fresh Decaf Colombia",
    process: "Methylene Chloride",
    issue:
      "Clean Label Project testing detected methylene chloride. CLP filed lawsuit against AmazonFresh for false/misleading labeling claiming 'pure' while containing MC residue.",
    price: "~$8/12oz",
  },
  {
    name: "Café Bustelo Decaf",
    process: "Methylene Chloride",
    issue:
      "CLP filed lawsuit against J.M. Smucker's (Café Bustelo parent) for methylene chloride in decaffeination process without label disclosure.",
    price: "~$7/12oz",
  },
  {
    name: "Maxwell House Decaf",
    process: "Methylene Chloride",
    issue:
      "CLP filed lawsuit against Kraft Heinz (Maxwell House parent). Testing found quantifiable MC amounts. Labeled as 'pure' despite chemical residue.",
    price: "~$8/12oz",
  },
  {
    name: "Kirkland Signature Decaf Dark Roast",
    process: "Methylene Chloride",
    issue:
      "Clean Label Project testing found MC traces. Made by Starbucks for Costco. Not disclosed on label. Signature Brand confirmed MC process.",
    price: "~$15/3lb",
  },
  {
    name: "Keurig Green Mountain Decaf K-Cups",
    process: "Methylene Chloride (most lines)",
    issue:
      "CLP filed lawsuit. Most K-Cup decaf lines use MC process. Convenience format makes it harder to check. Some specialty lines may differ.",
    price: "~$12/24ct",
  },
  {
    name: "Folgers Decaf",
    process: "Methylene Chloride",
    issue:
      "Does not disclose decaffeination method. Industry standard assumption is MC process for major commodity brands. No organic certification.",
    price: "~$8/12oz",
  },
  {
    name: "Starbucks Decaf (most lines)",
    process: "Methylene Chloride",
    issue:
      "Clean Label Project reports Starbucks uses MC for most decaf lines. The company does not disclose method on packaging. Some specialty lines may vary. Japan and Korea have banned MC in decaf coffee entirely.",
    price: "varies",
  },
  {
    name: "Nescafé Decaf Instant",
    process: "Methylene Chloride (industry standard for instant)",
    issue:
      "Virtually all instant decaf coffee globally uses MC process. Instant decaf also has higher mycotoxin levels than whole bean. Double risk.",
    price: "~$8/7oz",
  },
  {
    name: "Most store-brand/private label decaf",
    process: "Methylene Chloride (default)",
    issue:
      "If the packaging doesn't say 'Swiss Water', 'chemical-free', 'solvent-free', or 'certified organic', assume MC process. The FDA does not require method disclosure.",
    price: "varies",
  },
];

// Ported from legacy client/src/pages/brewsoul/BrewSoulDecaf.tsx's real
// reveal-toggle "Wall of Shame" list of 10 methylene-chloride decaf
// brands, unchanged, including the real Clean Label Project lawsuit
// citations and the FDA-defense rebuttal.
export function DecafShame() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="mb-6 rounded-sm border border-[#9b3030]/50 bg-[#9b3030]/30 px-6 py-3 font-mono text-xs tracking-[0.1em] text-[#e8dcc8]"
      >
        <span className="inline-flex items-center gap-1.5">
          {show ? (
            <ChevronUp aria-hidden="true" className="size-3.5" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-3.5" />
          )}
          {show ? "Hide Wall of Shame" : "Reveal Wall of Shame"}
        </span>
      </button>

      {show && (
        <div>
          {SHAME.map((b) => (
            <div
              key={b.name}
              className="mb-2.5 rounded-md border border-[#9b3030]/20 border-l-4 border-l-[#9b3030] bg-[#9b3030]/8 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-base font-bold text-[#e8dcc8]">{b.name}</div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-wide text-[#9b3030]">
                    Process: {b.process}
                  </div>
                </div>
                <div className="font-mono text-sm text-[#f5efe0]/50">{b.price}</div>
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#f5efe0]/65">{b.issue}</div>
            </div>
          ))}

          <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-sm font-bold text-[#e8dcc8]">
              Clean Label Project Lawsuits (2020-present)
            </div>
            <p className="text-sm leading-relaxed text-[#f5efe0]/88">
              CLP filed lawsuits in D.C. Superior Court against AmazonFresh, J.M. Smucker&apos;s
              (Café Bustelo), Peet&apos;s Coffee &amp; Tea Holdco, Keurig Green Mountain, and Kraft
              Heinz (Maxwell House) for false and misleading advertising — labeling products as
              &ldquo;pure&rdquo; or &ldquo;natural&rdquo; while containing methylene chloride
              residue without disclosure. The Organic &amp; Natural Health Association endorsed
              CLP&apos;s findings.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-sm font-bold text-[#e8dcc8]">
              The Industry&apos;s Defense (and Why It&apos;s Weak)
            </div>
            <p className="text-sm leading-relaxed text-[#f5efe0]/88">
              A coffee industry group wrote the FDA claiming that &ldquo;true coffee aficionados in
              blind tastings&rdquo; prefer MC-processed decaf. As STAT reporter Nick Florko noted:
              &ldquo;which is a pretty funny claim if you consider the fact that we&apos;re talking
              about coffee here that&apos;s essentially rinsed in paint thinner.&rdquo; The
              FDA&apos;s risk assessment is from 1985, assumes a 5oz cup size (less than half a
              Starbucks tall), and hasn&apos;t been updated in 40 years.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
