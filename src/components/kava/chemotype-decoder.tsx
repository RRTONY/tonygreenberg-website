"use client";

import { useState } from "react";
import { KavaBadge } from "@/components/kava/kava-ui";
import { KAVALACTONES, type Kavalactone } from "@/lib/content/kava-science";

// Ported from legacy client/src/pages/kava/KavaScience.tsx's real
// chemotype decoder (enter a chemotype string like "4-2-6-5-3-1", see
// which kavalactones dominate), unchanged. Extracted into this client
// island; the 6-kavalactone data lives in `lib/content/kava-science.ts`
// so the Server Component page can reuse it for the static "6 Major
// Kavalactones" grid.
export function ChemotypeDecoder() {
  const [chemotypeInput, setChemotypeInput] = useState("");
  const [decodedResult, setDecodedResult] = useState<Kavalactone[] | null>(null);

  const decodeChemotype = () => {
    const nums = chemotypeInput
      .replace(/[^1-6]/g, "")
      .split("")
      .map(Number)
      .filter((n) => n >= 1 && n <= 6);
    if (nums.length === 0) return;
    const unique = Array.from(new Set(nums));
    const result = unique.map((n) => KAVALACTONES.find((k) => k.num === n)!).filter(Boolean);
    setDecodedResult(result);
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center gap-3 rounded-xl border-2 border-kava-sand-muted bg-white px-4 py-3">
        <input
          type="text"
          value={chemotypeInput}
          onChange={(e) => setChemotypeInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && decodeChemotype()}
          placeholder="e.g. 4-2-6-5-3-1"
          maxLength={20}
          className="flex-1 bg-transparent text-center font-mono text-lg tracking-widest text-kava-ink outline-none"
        />
        <button onClick={decodeChemotype} className="rounded-lg bg-kava-saffron px-4 py-2 text-sm font-bold text-white">
          Decode
        </button>
      </div>

      {decodedResult && (
        <div className="space-y-3">
          {decodedResult.map((kl, i) => (
            <div
              key={kl.num}
              className={`flex items-center gap-3 rounded-lg bg-white p-3 ${i === 0 ? "border-2" : "border"}`}
              style={{ borderColor: i === 0 ? kl.colorHex : "var(--kava-sand-muted)" }}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: kl.colorHex }}>
                {kl.num}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-kava-ink">
                  {i === 0 ? "DOMINANT: " : ""}
                  {kl.name}
                </p>
                <p className="text-xs text-kava-ink/60">{kl.mechanisms[0]}</p>
              </div>
              {i === 0 && <KavaBadge color="saffron">Primary</KavaBadge>}
            </div>
          ))}
          {decodedResult[0]?.num === 4 && (
            <div className="rounded-lg border-l-3 border-l-[#16a34a] bg-[#16a34a]/8 p-3 text-sm">
              <strong className="text-[#16a34a]">PRI Ceremony Grade:</strong> Chemotypes with kavain (4) as dominant are most desirable for ceremonial use.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
