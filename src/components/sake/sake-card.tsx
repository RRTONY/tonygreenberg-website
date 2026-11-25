"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronRight, ExternalLink, ShoppingCart } from "lucide-react";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { getBottleImage } from "@/lib/content/sake/images";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { SAKE_PRODUCTS } from "@/lib/content/sake/shop-data";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/components/SakeCard.tsx (2026-11-26): a sake with its bottle
// picture, brewery, price, aroma tags (matched ones highlighted), flavor notes, a "View Details" link
// and an add-to-cart button for sakes in the shop. Same look in both styles. Changed:
// - The cart is the app's own browser key ("sake-cart", [{ productId, quantity }], max 12 a bottle),
//   read through useLocalStore so every page sees the same cart; the "Added!" flash is React state
//   instead of rewriting the button's HTML, and the icon-only button has an accessible name.
// - The bottle picture (Manus, deleted) is SakeImage: the Sanity copy once uploaded, the ink-wash
//   stand-in until then.
// - The app's `hover:${accentBg}` on the details link was built from fragments and never applied;
//   it's a real hover wash now.

const CART_KEY = "sake-cart";
const NO_CART: CartLine[] = [];
type CartLine = { productId: string; quantity: number };

const KINTSUGI = {
  card: "bg-[oklch(0.16_0.03_270)] border-[oklch(0.28_0.04_270)]",
  textPrimary: "text-[oklch(0.96_0.01_85)]",
  textSecondary: "text-[oklch(0.55_0.02_270)]",
  accent: "text-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.1)]",
  textAccent: "text-[oklch(0.78_0.12_85)]",
  tagOn: "bg-[oklch(0.78_0.12_85/0.1)] text-[oklch(0.78_0.12_85)] border border-[oklch(0.78_0.12_85/0.3)]",
  tagOff: "bg-[oklch(0.2_0.03_270)] text-[oklch(0.55_0.02_270)]",
  divider: "border-[oklch(0.25_0.03_270)]",
  details: "text-[oklch(0.78_0.12_85)] hover:bg-[oklch(0.78_0.12_85/0.1)]",
  cart: "border-[oklch(0.25_0.03_270)] text-[oklch(0.96_0.01_85)] hover:bg-[oklch(0.2_0.04_270)]",
};

const AUSTERE = {
  card: "bg-stone-100 border-stone-300",
  textPrimary: "text-stone-900",
  textSecondary: "text-stone-600",
  accent: "text-[oklch(0.52_0.19_30)] bg-[oklch(0.52_0.19_30/0.1)]",
  textAccent: "text-[oklch(0.52_0.19_30)]",
  tagOn: "bg-[oklch(0.52_0.19_30/0.1)] text-[oklch(0.52_0.19_30)] border border-[oklch(0.78_0.12_85/0.3)]",
  tagOff: "bg-[oklch(0.2_0.03_270)] text-stone-600",
  divider: "border-stone-300",
  details: "text-[oklch(0.52_0.19_30)] hover:bg-[oklch(0.52_0.19_30/0.1)]",
  cart: "border-stone-300 text-stone-700 hover:bg-stone-200",
};

export type SakeCardProps = {
  /** Sake id: links to its detail page and finds its shop product. */
  id: string;
  name: string;
  nameJa?: string;
  brewery?: string;
  breweryJa?: string;
  /** Sake type (junmai, daiginjo...), picks the bottle picture. */
  type?: string;
  flavorNotes?: string;
  flavorNotesJa?: string;
  aromas?: string[];
  /** Aromas to highlight (e.g. the ones the visitor picked). */
  highlightedAromas?: string[];
  /** Match label, e.g. "3/4". */
  matchLabel?: string;
  className?: string;
  compact?: boolean;
  /** Price in USD to show instead of the shop price. */
  priceUS?: number;
  children?: ReactNode;
};

export function SakeCard({
  id,
  name,
  nameJa,
  brewery,
  breweryJa,
  type,
  flavorNotes,
  flavorNotesJa,
  aromas,
  highlightedAromas,
  matchLabel,
  className,
  compact = false,
  priceUS,
  children,
}: SakeCardProps) {
  const { lang, t } = useLanguage();
  const { isAustere } = useAesthetic();
  const c = isAustere ? AUSTERE : KINTSUGI;
  const [, setCart] = useLocalStore<CartLine[]>(CART_KEY, NO_CART);
  const [added, setAdded] = useState(false);

  const hasDetailPage = qprSakeDatabase.some((s) => s.id === id);
  const product = SAKE_PRODUCTS.find((p) => p.id === id);
  const displayPrice = priceUS || (product ? product.priceCents / 100 : null);

  const addToCart = () => {
    setCart((prev) => {
      const lines = Array.isArray(prev) ? prev : NO_CART;
      const existing = lines.find((item) => item.productId === id);
      return existing
        ? lines.map((item) => (item.productId === id ? { ...item, quantity: Math.min(12, item.quantity + 1) } : item))
        : [...lines, { productId: id, quantity: 1 }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={`relative group border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${c.card} ${className ?? ""}`}>
      <div className={compact ? "p-3 flex gap-3" : "p-4 sm:p-5 flex gap-3"}>
        <SakeImage
          image={getBottleImage(type || "junmai")}
          sizes="56px"
          className={compact ? "w-10 h-14 rounded object-cover shrink-0" : "w-12 h-16 sm:w-14 sm:h-20 rounded object-cover shrink-0"}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={
                  compact
                    ? `text-sm font-semibold font-sk-serif leading-tight truncate ${c.textPrimary}`
                    : `text-base sm:text-lg font-semibold font-sk-serif leading-tight truncate ${c.textPrimary}`
                }
              >
                {lang === "ja" && nameJa ? nameJa : name}
              </h3>
              {brewery && <p className={`text-xs mt-0.5 truncate ${c.textSecondary}`}>{lang === "ja" && breweryJa ? breweryJa : brewery}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {matchLabel && <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${c.accent}`}>{matchLabel}</span>}
              {displayPrice && <span className={`font-mono text-sm font-bold ${c.textAccent}`}>${displayPrice}</span>}
            </div>
          </div>

          {aromas && aromas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {aromas.map((a) => {
                const isHighlighted = highlightedAromas?.some(
                  (ha) => a.toLowerCase().includes(ha.toLowerCase()) || ha.toLowerCase().includes(a.toLowerCase()),
                );
                return (
                  <span key={a} className={`px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-sm ${isHighlighted ? c.tagOn : c.tagOff}`}>
                    {a}
                  </span>
                );
              })}
            </div>
          )}

          {flavorNotes && !compact && (
            <p className={`mt-2 text-xs italic font-sk-serif line-clamp-2 ${c.textSecondary}`}>{lang === "ja" && flavorNotesJa ? flavorNotesJa : flavorNotes}</p>
          )}

          {children}
        </div>
      </div>

      <div className={`flex items-center border-t ${c.divider}`}>
        <Link
          href={hasDetailPage ? sakeDetailPath(id) : sk("/qpr")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium uppercase tracking-wider transition-colors min-h-11 ${c.details}`}
        >
          <ExternalLink aria-hidden="true" size={14} />
          {t("View Details", "詳細を見る")}
          <ChevronRight aria-hidden="true" size={14} />
        </Link>
        {product && (
          <button
            type="button"
            onClick={addToCart}
            aria-label={added ? t("Added!", "追加しました") : t(`Add ${name} to cart`, `${nameJa || name}をカートに追加`)}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider border-l transition-colors min-h-11 ${c.cart}`}
          >
            {added ? (
              <>
                <Check aria-hidden="true" size={16} />
                Added!
              </>
            ) : (
              <ShoppingCart aria-hidden="true" size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
