"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { Brain, Loader2, Scan, Zap } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { usePresenceSwap } from "@/components/liquidsun/motion";
import { liquidsunImages } from "@/lib/content/liquidsun/images";
import type { OracleResult } from "@/lib/content/liquidsun/oracle";

// Ported from the LiquidSun app's client/src/pages/BottleScanner.tsx ("The Oracle", 2026-11-21).
// The app only pretended to scan: after 3 seconds it always showed Fortaleza Blanco. Here the
// photo is shrunk in the browser and read by /api/liquid-sun/bottle-scanner (Anthropic, like
// SoulSmoke's scanner); the result card is the app's, filled with the real reading. If the label
// can't be read or the request fails, the same card says so and offers "Scan Another".
// Motion, as in the app (AnimatePresence mode="wait", 300ms): the scan button fades and grows in
// and shrinks out, the scanning view fades, the result rises 50px into place; the beam sweeps
// top-bottom-top every 2s (.ls-scan-beam) and the 16 grid cells flicker on random delays
// (.ls-cell-flicker).

const MAX_SIDE = 1568;
const EXIT_MS = 300;

type View =
  | { kind: "idle" }
  | { kind: "scanning" }
  | { kind: "result"; result: OracleResult }
  | { kind: "error"; message: string };

const IDLE: View = { kind: "idle" };
const UNREADABLE = "The Oracle couldn't read that label. Try a clearer, well-lit photo of the front of the bottle.";
const UNREACHABLE = "Couldn't reach the Oracle. Check your connection and try again.";

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Shrinks a photo to at most MAX_SIDE pixels as a JPEG (phone photos are far over the 5MB limit). */
async function shrinkForUpload(file: File, original: string) {
  if (typeof createImageBitmap !== "function") return original;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return original;
  }
}

function ScanningGrid() {
  // Each cell's flicker starts at its own random moment (the app: delay Math.random() * 2),
  // picked once when the scan starts.
  const [delays] = useState(() => Array.from({ length: 16 }, () => Math.random() * 2));
  return (
    <div className="grid size-full grid-cols-4 grid-rows-4">
      {delays.map((delay, i) => (
        <div
          key={i}
          data-testid="ls-scan-cell"
          className="ls-cell-flicker border border-amber-500/10 bg-amber-500/5"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

export function BottleScanner() {
  const [view, setView] = useState<View>(IDLE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { shown, leaving } = usePresenceSwap(view, EXIT_MS);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setView({ kind: "scanning" });
    try {
      const original = await readAsDataUrl(file);
      const imageBase64 = await shrinkForUpload(file, original);
      const res = await fetch("/api/liquid-sun/bottle-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<OracleResult> & { message?: string };
      if (!res.ok) {
        setView({ kind: "error", message: data.message || UNREADABLE });
      } else if (data.identified && data.name) {
        setView({ kind: "result", result: data as OracleResult });
      } else {
        setView({ kind: "error", message: UNREADABLE });
      }
    } catch {
      setView({ kind: "error", message: UNREACHABLE });
    }
  };

  const reset = () => setView(IDLE);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans text-white">
      <AudioController />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.tahonaMill.src} alt="" fill priority sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black" />

        {/* Scanning Grid Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_100%)] bg-size-[50px_50px]" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24">
        {/* The file box stays mounted so "Scan Another" can reuse it. */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          aria-label="Upload a photo of a tequila label"
          onChange={handleUpload}
        />

        {shown.kind === "idle" && (
          <div
            className={
              leaving
                ? "animate-out space-y-8 text-center duration-300 fade-out fill-mode-forwards zoom-out-90"
                : "animate-in space-y-8 text-center duration-300 fade-in zoom-in-90"
            }
          >
            <div className="group relative inline-block">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl transition-colors duration-500 group-hover:bg-amber-500/40" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex size-48 flex-col items-center justify-center rounded-full border-2 border-amber-500/50 bg-black/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
              >
                <Scan aria-hidden="true" className="mb-4 size-16 text-amber-500" strokeWidth={1} />
                <span className="font-mono text-xs tracking-widest text-amber-200 uppercase">Scan Label</span>
              </button>
            </div>

            <div>
              <h1 className="mb-2 font-serif text-4xl text-white">The Oracle</h1>
              <p className="font-light text-slate-400 italic">Upload a photo. Reveal the soul.</p>
            </div>
          </div>
        )}

        {shown.kind === "scanning" && (
          <div
            role="status"
            className={
              leaving
                ? "flex animate-out flex-col items-center justify-center space-y-8 duration-300 fade-out fill-mode-forwards"
                : "flex animate-in flex-col items-center justify-center space-y-8 duration-300 fade-in"
            }
          >
            <h1 className="sr-only">The Oracle</h1>
            <div className="relative size-64">
              {/* Scanning Beam */}
              <div data-testid="ls-scan-beam" className="ls-scan-beam absolute right-0 left-0 z-20 h-1 bg-amber-500 shadow-[0_0_20px_#f59e0b]" />
              <div className="absolute inset-0 overflow-hidden rounded-lg border border-amber-500/30 bg-black/50">
                <ScanningGrid />
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm tracking-widest text-amber-500 uppercase">
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              <span>Analyzing Spirit DNA...</span>
            </div>
          </div>
        )}

        {(shown.kind === "result" || shown.kind === "error") && (
          <div
            className={
              leaving
                ? "w-full max-w-md animate-out overflow-hidden rounded-xl border border-amber-500/30 bg-slate-900/90 shadow-2xl backdrop-blur-xl duration-300 fade-out fill-mode-forwards"
                : "w-full max-w-md animate-in overflow-hidden rounded-xl border border-amber-500/30 bg-slate-900/90 shadow-2xl backdrop-blur-xl duration-300 fade-in slide-in-from-bottom-[50px]"
            }
          >
            {shown.kind === "result" ? (
              <>
                <h1 className="sr-only">The Oracle</h1>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-amber-500/20 bg-amber-500/10 p-6">
                  <div>
                    <h2 className="mb-1 font-serif text-3xl text-white">{shown.result.name}</h2>
                    <p className="font-mono text-xs tracking-widest text-amber-500 uppercase">
                      NOM {shown.result.nom ?? "—"}
                      {shown.result.rarity ? ` • ${shown.result.rarity}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-amber-400">{shown.result.soulScore ?? "—"}</div>
                    <div className="text-[10px] tracking-widest text-slate-500 uppercase">Soul Score</div>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-white/5 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs tracking-wider text-slate-400 uppercase">
                        <Zap aria-hidden="true" className="size-3" /> EVI Rating
                      </div>
                      <div className="font-mono text-xl text-white">{shown.result.evi ?? "—"}/100</div>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-black/40 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs tracking-wider text-slate-400 uppercase">
                        <Brain aria-hidden="true" className="size-3" /> Complexity
                      </div>
                      <div className="font-mono text-xl text-white">High</div>
                    </div>
                  </div>

                  {shown.result.notes.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-mono text-xs tracking-widest text-slate-500 uppercase">Detected Notes</h3>
                      <div className="flex flex-wrap gap-2">
                        {shown.result.notes.map((note) => (
                          <span key={note} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {shown.result.verdict && (
                    <div className="border-l-2 border-amber-500 bg-linear-to-r from-amber-900/20 to-transparent py-2 pl-4">
                      <h3 className="mb-1 font-mono text-xs tracking-widest text-amber-500 uppercase">The Verdict</h3>
                      <p className="text-sm text-slate-300 italic">&quot;{shown.result.verdict}&quot;</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={reset}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3 font-mono text-sm tracking-widest text-slate-300 uppercase transition-colors hover:bg-white/10"
                  >
                    Scan Another
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6 p-6">
                <div>
                  <h1 className="mb-2 font-serif text-3xl text-white">The Oracle</h1>
                  <p role="alert" className="text-sm text-slate-300">
                    {shown.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-3 font-mono text-sm tracking-widest text-slate-300 uppercase transition-colors hover:bg-white/10"
                >
                  Scan Another
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
