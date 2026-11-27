"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Camera,
  DollarSign,
  Lightbulb,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  Thermometer,
  Upload,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";
import { useToolPalette } from "@/components/sake/tool-palette";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";
import type { ScanResult } from "@/lib/content/sake/scanner";

// Ported from the Sake app's client/src/pages/SakeScanner.tsx (2026-11-26): upload or photograph a
// sake label and get the identification, prices, notes, pairings and a QPR database match. The app
// first uploaded every photo to Manus's S3 storage and then asked Manus's model; here the photo is
// shrunk in the browser (like the LiquidSun scanner) and read by /api/sake/scanner (Claude), and it
// is never stored.
// Changed (rule 18 and 20): the tips' emoji (📸 💡 🔍) are lucide icons; the app's `hover:${gold}`
// class (built from pieces, so it never worked) is a real hover color; the photo preview uses
// next/image; the upload zone is a real button for keyboard users. Motion as in the app (fade +
// scale/slide on swap) with tw-animate classes.

const MAX_SIDE = 1568;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Shrinks a photo to at most MAX_SIDE pixels as a JPEG (phone photos are far over the 5MB upload limit). */
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

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "text-green-500",
  medium: "text-yellow-500",
  low: "text-red-500",
};

const TIPS: { icon: LucideIcon; en: string; ja: string }[] = [
  {
    icon: Camera,
    en: "Get the full label in frame — front label with the brewery name and sake name visible",
    ja: "ラベル全体をフレームに — 蔵元名と酒名が見える表ラベル",
  },
  {
    icon: Lightbulb,
    en: "Good lighting helps — avoid glare on glass bottles. Matte labels scan best.",
    ja: "良い照明が助けになる — ガラス瓶の反射を避ける。マットラベルが最適。",
  },
  {
    icon: Search,
    en: "Kanji is key — the scanner reads Japanese characters to identify the brewery and style.",
    ja: "漢字が鍵 — スキャナーは日本語の文字を読んで蔵元とスタイルを識別。",
  },
];

export function SakeScanner() {
  const { t } = useLanguage();
  const k = useToolPalette();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError(t("Please upload an image file", "画像ファイルをアップロードしてください"));
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(t("Image must be under 10MB", "画像は10MB以下にしてください"));
        return;
      }
      setError(null);
      setScanResult(null);
      setImageFile(file);
      try {
        setImagePreview(await readAsDataUrl(file));
      } catch {
        setError(t("Please upload an image file", "画像ファイルをアップロードしてください"));
      }
    },
    [t],
  );

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleScan = async () => {
    if (!imageFile || !imagePreview) return;
    setIsScanning(true);
    setError(null);
    try {
      const imageBase64 = await shrinkForUpload(imageFile, imagePreview);
      const res = await fetch("/api/sake/scanner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const body = (await res.json().catch(() => ({}))) as { result?: ScanResult; message?: string };
      if (!res.ok || !body.result) throw new Error(body.message || "");
      setScanResult(body.result);
    } catch (err) {
      setError(
        (err instanceof Error && err.message) ||
          t("Failed to identify sake. Please try again.", "酒の識別に失敗しました。もう一度お試しください。"),
      );
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setImageFile(null);
    setScanResult(null);
    setError(null);
  };

  // The app's match: the first word of either name appears in the other.
  const matchedQPR = scanResult
    ? qprSakeDatabase.find(
        (s) =>
          s.name.toLowerCase().includes(scanResult.name.toLowerCase().split(" ")[0]) ||
          scanResult.name.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]),
      )
    : null;

  const card = `border ${k.cardBorder} ${k.cardBg}`;
  const tag = `text-xs px-2 py-1 font-mono ${k.goldBg} ${k.gold}`;

  return (
    <div className={`min-h-screen ${k.pageBg} ${k.textMain}`}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 ${k.glow}`} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${k.gold}`}>{t("AI-Powered Identification", "AI搭載識別")}</p>
            <h1 className="font-sk-display text-5xl sm:text-6xl lg:text-7xl font-bold [.sake-austere_&]:font-light [.sake-austere_&]:tracking-wider">
              {t("Sake", "酒")}{" "}
              <span className={k.isAustere ? k.gold : `${k.gold} gold-shimmer`}>{t("Scanner", "スキャナー")}</span>
            </h1>
            <p className={`mt-6 max-w-xl mx-auto text-lg ${k.textMuted}`}>
              {t(
                "Snap a photo of any sake label. Our AI identifies the bottle, estimates pricing, and tells you exactly what you're looking at.",
                "日本酒のラベルを撮影。AIがボトルを識別し、価格を推定し、何を見ているか正確に教えます。",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      {/* Scanner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          {!imagePreview ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <button
                type="button"
                className={`relative block w-full border-2 border-dashed p-16 text-center transition-all duration-300 cursor-pointer ${
                  dragActive ? `${k.goldBorder} ${k.goldBg}` : `${k.cardBorder} ${k.cardBg}`
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera aria-hidden="true" size={48} className={`mx-auto mb-6 opacity-60 ${k.gold}`} />
                <span className="font-sk-display block text-xl font-bold mb-2">{t("Upload a Sake Label Photo", "日本酒ラベルの写真をアップロード")}</span>
                <span className={`block text-sm mb-6 ${k.textMuted}`}>
                  {t("Drag & drop, click to browse, or use your camera", "ドラッグ＆ドロップ、クリックして選択、またはカメラを使用")}
                </span>
                <span className={`inline-flex items-center gap-2 px-6 py-3 border text-sm tracking-wider ${k.goldBorder} ${k.gold}`}>
                  <Upload aria-hidden="true" size={16} />
                  {t("Choose Image", "画像を選択")}
                </span>
                <span className={`block mt-4 text-xs ${k.textMuted}`}>{t("Supports JPG, PNG, WebP · Max 10MB", "JPG、PNG、WebP対応 · 最大10MB")}</span>
              </button>
              {error && (
                <p role="alert" className="mt-4 text-sm text-red-400 text-center">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 fill-mode-both">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Preview */}
                <div className="relative">
                  <div className={`border overflow-hidden ${k.cardBorder}`}>
                    <Image
                      src={imagePreview}
                      alt={t("Sake label", "日本酒ラベル")}
                      width={600}
                      height={800}
                      unoptimized
                      className="w-full aspect-3/4 object-contain bg-black/20"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      type="button"
                      onClick={reset}
                      className={`flex items-center gap-2 px-4 py-2 text-xs border transition-colors ${k.cardBorder} ${k.textMuted} ${k.hoverGold}`}
                    >
                      <RotateCcw aria-hidden="true" size={14} />
                      {t("New Scan", "新しいスキャン")}
                    </button>
                    {!scanResult && !isScanning && (
                      <button
                        type="button"
                        onClick={() => void handleScan()}
                        className={`flex items-center gap-2 px-6 py-2 text-xs border tracking-wider ${k.goldBg} ${k.goldBorder} ${k.gold}`}
                      >
                        <Sparkles aria-hidden="true" size={14} />
                        {t("Identify This Sake", "この酒を識別")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div aria-live="polite">
                  {isScanning && (
                    <div className={`p-8 text-center animate-in fade-in ${card}`}>
                      <Loader2 aria-hidden="true" size={32} className={`mx-auto mb-4 animate-spin ${k.gold}`} />
                      <p className={`font-mono text-sm tracking-wider ${k.gold}`}>{t("Analyzing label...", "ラベルを分析中...")}</p>
                      <p className={`text-xs mt-2 ${k.textMuted}`}>
                        {t("Reading kanji, identifying brewery, estimating value", "漢字を読み取り、蔵元を識別、価値を推定中")}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div role="alert" className="p-6 border border-red-500/30 bg-red-500/10 text-red-400 animate-in fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle aria-hidden="true" size={16} />
                        <span className="font-mono text-sm">{t("Identification Failed", "識別失敗")}</span>
                      </div>
                      <p className="text-xs">{error}</p>
                    </div>
                  )}

                  {scanResult && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2.5 duration-500 fill-mode-both">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={k.textMuted}>{t("Confidence:", "確信度:")}</span>
                        <span className={CONFIDENCE_COLORS[scanResult.confidence] ?? k.textMuted}>{scanResult.confidence.toUpperCase()}</span>
                      </div>

                      <div className={`p-6 ${card}`}>
                        <h2 className={`font-sk-display text-2xl font-bold ${k.gold}`}>{t(scanResult.name, scanResult.nameJa)}</h2>
                        <p className={`text-sm mt-1 ${k.textMuted}`}>{t(scanResult.brewery, scanResult.breweryJa)}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {scanResult.type && <span className={tag}>{scanResult.type}</span>}
                          {scanResult.prefecture && (
                            <span className={`${tag} flex items-center gap-1`}>
                              <MapPin aria-hidden="true" size={10} /> {scanResult.prefecture}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {scanResult.ricePolishRatio ? (
                          <div className={`p-4 ${card}`}>
                            <div className={`text-xs font-mono ${k.textMuted}`}>{t("Polish Ratio", "精米歩合")}</div>
                            <div className={`text-xl font-bold font-mono ${k.gold}`}>{scanResult.ricePolishRatio}%</div>
                          </div>
                        ) : null}
                        {scanResult.abv ? (
                          <div className={`p-4 ${card}`}>
                            <div className={`text-xs font-mono ${k.textMuted}`}>ABV</div>
                            <div className={`text-xl font-bold font-mono ${k.gold}`}>{scanResult.abv}%</div>
                          </div>
                        ) : null}
                        <div className={`p-4 ${card}`}>
                          <div className={`text-xs font-mono flex items-center gap-1 ${k.textMuted}`}>
                            <DollarSign aria-hidden="true" size={10} /> {t("US Retail", "米国小売")}
                          </div>
                          <div className="text-xl font-bold font-mono">${scanResult.estimatedRetailUS}</div>
                        </div>
                        <div className={`p-4 ${card}`}>
                          <div className={`text-xs font-mono flex items-center gap-1 ${k.textMuted}`}>
                            <DollarSign aria-hidden="true" size={10} /> {t("Japan Retail", "日本小売")}
                          </div>
                          <div className="text-xl font-bold font-mono">${scanResult.estimatedRetailJapan}</div>
                        </div>
                      </div>

                      {scanResult.description && (
                        <div className={`p-4 ${card}`}>
                          <p className={`text-sm leading-relaxed ${k.textMuted}`}>{scanResult.description}</p>
                        </div>
                      )}

                      {scanResult.flavorNotes.length > 0 && (
                        <div className={`p-4 ${card}`}>
                          <div className={`text-xs font-mono mb-2 flex items-center gap-1 ${k.gold}`}>
                            <Wine aria-hidden="true" size={12} /> {t("Flavor Notes", "味わいノート")}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {scanResult.flavorNotes.map((note) => (
                              <span key={note} className={`text-xs px-2 py-1 ${k.goldBg} ${k.gold}`}>
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className={`p-4 ${card}`}>
                          <div className={`text-xs font-mono mb-2 flex items-center gap-1 ${k.gold}`}>
                            <Thermometer aria-hidden="true" size={12} /> {t("Serving Temp", "提供温度")}
                          </div>
                          <p className={`text-sm ${k.textMuted}`}>{scanResult.servingTemp}</p>
                        </div>
                        <div className={`p-4 ${card}`}>
                          <div className={`text-xs font-mono mb-2 flex items-center gap-1 ${k.gold}`}>
                            <UtensilsCrossed aria-hidden="true" size={12} /> {t("Pairings", "ペアリング")}
                          </div>
                          <ul className={`text-sm space-y-1 ${k.textMuted}`}>
                            {scanResult.pairings.map((p) => (
                              <li key={p} className="text-xs">
                                · {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {matchedQPR && (
                        <div className={`p-4 border-2 ${k.goldBorder} ${k.goldBg}`}>
                          <div className={`text-xs font-mono mb-2 flex items-center gap-1 ${k.gold}`}>
                            <Sparkles aria-hidden="true" size={12} /> {t("QPR Database Match!", "QPRデータベースに一致！")}
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <div>
                              <div className={`text-xs ${k.textMuted}`}>{t("US QPR", "米国QPR")}</div>
                              <div className={`text-2xl font-bold font-mono ${k.gold}`}>{matchedQPR.qprUS}</div>
                            </div>
                            <div>
                              <div className={`text-xs ${k.textMuted}`}>{t("Japan QPR", "日本QPR")}</div>
                              <div className={`text-2xl font-bold font-mono ${k.gold}`}>{matchedQPR.qprJapan}</div>
                            </div>
                            <div>
                              <div className={`text-xs ${k.textMuted}`}>{t("Tier", "ティア")}</div>
                              <div className={`text-sm font-mono uppercase ${k.gold}`}>{matchedQPR.qprTier}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                          href={matchedQPR ? sakeDetailPath(matchedQPR.id) : `${sk("/retailer-finder")}?sake=${encodeURIComponent(scanResult.name)}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)] hover:bg-[oklch(0.82_0.10_85)] transition-all min-h-12 rounded-lg"
                        >
                          {matchedQPR ? t("View & Buy", "詳細・購入") : t("Find This Sake", "この酒を探す")}
                        </Link>
                        <Link
                          href={sk("/qpr")}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm uppercase tracking-wider border transition-all min-h-12 rounded-lg ${k.cardBorder} ${k.textMuted}`}
                        >
                          {t("QPR Rankings", "QPRランキング")}
                        </Link>
                      </div>
                    </div>
                  )}

                  {!isScanning && !scanResult && !error && (
                    <div className={`p-8 text-center ${card}`}>
                      <Camera aria-hidden="true" size={32} className={`mx-auto mb-4 opacity-40 ${k.textMuted}`} />
                      <p className={`text-sm ${k.textMuted}`}>
                        {t('Click "Identify This Sake" to scan the label', "「この酒を識別」をクリックしてラベルをスキャン")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-sk-display text-xl font-bold mb-6 text-center ${k.gold}`}>{t("Tips for Best Results", "最良の結果を得るためのヒント")}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.en} className={`p-5 ${card}`}>
                <tip.icon aria-hidden="true" className={`size-6 mb-3 ${k.gold}`} />
                <p className={`text-sm leading-relaxed ${k.textMuted}`}>{t(tip.en, tip.ja)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
