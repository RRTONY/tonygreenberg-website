"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Camera, CheckCircle, ExternalLink, Info, Loader2, Upload, XCircle } from "lucide-react";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/BottleScanner.tsx. Same layout, copy and
// result cards. The Manus app sent the photo to trpc.bottleScanner.analyze; this posts it to
// /api/soul-smoke/bottle-scanner (Anthropic, same prompt). Before sending, the photo is shrunk
// to at most 1568px on its long side as a JPEG (what the model reads anyway), so phone photos
// stay well under the server's size limit; if the browser can't do that, the original goes.

interface ScanResult {
  identified: boolean;
  brand?: string | null;
  expression?: string | null;
  producer?: string | null;
  agaveType?: string | null;
  region?: string | null;
  abv?: string | null;
  nomNumber?: string | null;
  confidence: "high" | "medium" | "low";
  authenticity: "verified" | "suspicious" | "unknown";
  warnings: string[];
  recommendations: string[];
  analysis: string;
}

const MAX_SIDE = 1568;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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

const getAuthenticityColor = (auth: string) => {
  switch (auth) {
    case "verified":
      return "text-emerald-400";
    case "suspicious":
      return "text-red-400";
    default:
      return "text-amber-400";
  }
};

const getAuthenticityIcon = (auth: string) => {
  switch (auth) {
    case "verified":
      return <CheckCircle aria-hidden="true" className="size-6 shrink-0 text-emerald-400" />;
    case "suspicious":
      return <XCircle aria-hidden="true" className="size-6 shrink-0 text-red-400" />;
    default:
      return <Info aria-hidden="true" className="size-6 shrink-0 text-amber-400" />;
  }
};

const getConfidenceLabel = (conf: string) => {
  switch (conf) {
    case "high":
      return { text: "High Confidence", color: "text-emerald-400" };
    case "medium":
      return { text: "Medium Confidence", color: "text-amber-400" };
    default:
      return { text: "Low Confidence", color: "text-red-400" };
  }
};

const findMatchingBottle = (brand?: string | null, expression?: string | null) => {
  if (!brand) return null;
  return allMezcals.find(
    (m) =>
      m.brand.toLowerCase().includes(brand.toLowerCase()) ||
      (expression && m.name.toLowerCase().includes(expression.toLowerCase())),
  );
};

export function BottleScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [upload, setUpload] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large. Please use an image under 10MB.");
      return;
    }
    try {
      const dataUrl = await readAsDataUrl(file);
      setImage(dataUrl);
      setResult(null);
      setError(null);
      setUpload(await shrinkForUpload(file, dataUrl));
    } catch {
      setError("Analysis failed. Please try again.");
    }
  };

  const analyzeBottle = async () => {
    if (!image) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/soul-smoke/bottle-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: upload ?? image }),
      });
      const data = (await res.json().catch(() => null)) as (ScanResult & { message?: string }) | null;
      if (res.ok && data) {
        setResult(data);
      } else {
        setError(data?.message || "Analysis failed. Please try again.");
      }
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setUpload(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const matchedBottle = result ? findMatchingBottle(result.brand, result.expression) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-black py-12">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href={ss("/")}
            className="mb-6 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <h1 className="mb-4 font-serif text-4xl text-amber-400 md:text-5xl">Bottle Scanner</h1>
          <p className="max-w-2xl text-xl text-gray-300">
            Upload a photo of any mezcal label. Our AI will identify the bottle, verify authenticity, and tell you if
            it&apos;s worth your money.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <div>
            <div
              className={
                image
                  ? "relative rounded-2xl border-2 border-dashed border-amber-600 p-8 text-center transition-all"
                  : "relative rounded-2xl border-2 border-dashed border-gray-700 p-8 text-center transition-all hover:border-gray-500"
              }
            >
              {image ? (
                <div className="relative">
                  {/* The visitor's own photo (a data: URL), so next/image can't resize it. */}
                  <Image
                    src={image}
                    alt="Uploaded bottle"
                    width={640}
                    height={640}
                    unoptimized
                    className="mx-auto h-auto max-h-80 w-auto rounded-lg"
                  />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={resetScanner}
                    className="absolute top-2 right-2 rounded-full bg-black/80 p-2 text-gray-300 hover:text-white"
                  >
                    <XCircle aria-hidden="true" className="size-5" />
                  </button>
                </div>
              ) : (
                <div className="py-12">
                  <Upload aria-hidden="true" className="mx-auto mb-4 size-12 text-gray-400" />
                  <p className="mb-2 text-gray-300">Drop your bottle photo here</p>
                  <p className="mb-4 text-sm text-gray-400">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    aria-label="Upload a bottle photo"
                    onChange={handleFileSelect}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                </div>
              )}
            </div>

            {image && !result && (
              <button
                type="button"
                onClick={analyzeBottle}
                disabled={pending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-4 font-medium transition-colors hover:bg-amber-500 disabled:bg-gray-700"
              >
                {pending ? (
                  <>
                    <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                    AI Analyzing Label
                  </>
                ) : (
                  <>
                    <Camera aria-hidden="true" className="size-5" />
                    Analyze This Bottle
                  </>
                )}
              </button>
            )}

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-red-800 bg-red-900/30 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 rounded-xl bg-white/5 p-4">
              <p className="mb-2 text-sm font-medium text-gray-200">Tips for best results:</p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Capture the front label clearly</li>
                <li>• Include the brand name and expression</li>
                <li>• Good lighting helps accuracy</li>
                <li>• NOM number visible is a plus</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div aria-live="polite">
            {!result && !pending && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Camera aria-hidden="true" className="mx-auto mb-4 size-16 opacity-30" />
                  <p>Upload a bottle photo to see analysis</p>
                </div>
              </div>
            )}

            {pending && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Loader2 aria-hidden="true" className="mx-auto mb-4 size-16 animate-spin text-amber-400" />
                  <p className="text-gray-300">AI reading the label</p>
                  <p className="mt-2 text-sm text-gray-400">Checking authenticity markers</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Identification */}
                <div className="rounded-xl bg-white/5 p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      {result.identified ? (
                        <>
                          <p className="text-sm text-gray-400">IDENTIFIED AS</p>
                          <h2 className="font-serif text-2xl text-white">{result.brand}</h2>
                          {result.expression && <p className="text-amber-400">{result.expression}</p>}
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-400">STATUS</p>
                          <h2 className="font-serif text-2xl text-amber-400">Unknown Bottle</h2>
                        </>
                      )}
                    </div>
                    {getAuthenticityIcon(result.authenticity)}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={getAuthenticityColor(result.authenticity)}>
                      {result.authenticity === "verified"
                        ? "Authentic"
                        : result.authenticity === "suspicious"
                          ? "Suspicious"
                          : "Unknown"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className={getConfidenceLabel(result.confidence).color}>
                      {getConfidenceLabel(result.confidence).text}
                    </span>
                  </div>
                </div>

                {/* Details */}
                {result.identified && (
                  <div className="rounded-xl bg-white/5 p-6">
                    <h3 className="mb-4 text-sm font-medium text-gray-300">DETAILS</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { label: "Producer", value: result.producer },
                        { label: "Agave", value: result.agaveType },
                        { label: "Region", value: result.region },
                        { label: "ABV", value: result.abv },
                        { label: "NOM", value: result.nomNumber },
                      ]
                        .filter((row) => row.value)
                        .map((row) => (
                          <div key={row.label}>
                            <p className="text-gray-400">{row.label}</p>
                            <p className="wrap-break-word text-white">{row.value}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle aria-hidden="true" className="size-5 text-red-400" />
                      <h3 className="text-sm font-medium text-red-400">WARNINGS</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.warnings.map((warning) => (
                        <li key={warning} className="flex items-start gap-2 text-sm text-red-300">
                          <span className="mt-1 text-red-500">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Analysis */}
                <div className="rounded-xl bg-white/5 p-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-300">AI ANALYSIS</h3>
                  <p className="text-sm leading-relaxed text-gray-200">{result.analysis}</p>
                </div>

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div className="rounded-xl border border-amber-800/50 bg-amber-900/20 p-6">
                    <h3 className="mb-3 text-sm font-medium text-amber-400">RECOMMENDATIONS</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec) => (
                        <li key={rec} className="flex items-start gap-2 text-sm text-amber-200">
                          <span className="mt-1 text-amber-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Matched Bottle Link */}
                {matchedBottle && (
                  <Link
                    href={`${ss("/quadrant")}?bottle=${encodeURIComponent(matchedBottle.id)}`}
                    className="block rounded-xl border border-emerald-800/50 bg-emerald-900/20 p-6 transition-colors hover:bg-emerald-900/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="mb-1 text-sm text-emerald-400">FOUND IN OUR DATABASE</p>
                        <p className="font-medium text-white">
                          {matchedBottle.brand} {matchedBottle.name}
                        </p>
                        <p className="text-sm text-gray-300">View full profile in the Quadrant</p>
                      </div>
                      <ExternalLink aria-hidden="true" className="size-5 shrink-0 text-emerald-400" />
                    </div>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={resetScanner}
                  className="w-full rounded-xl border border-gray-700 py-3 text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                >
                  Scan Another Bottle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
