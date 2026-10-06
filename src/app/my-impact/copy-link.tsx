"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <code className="max-w-full rounded-md bg-white/10 px-3 py-2 font-mono text-sm break-all text-[#F5F0E6]">{url}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-brand-gold-light px-4 font-mono text-xs tracking-[0.1em] text-[#0A0A10] uppercase"
      >
        {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
