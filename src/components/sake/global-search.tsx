"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Search, Sparkles, Wine, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLanguage, useSakePortalClass } from "@/components/sake/sake-providers";
import { cn } from "@/lib/utils";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath, sakePageIndex, sk, type SakeSearchEntry } from "@/lib/content/sake/nav";

// The Sake app's GlobalSearch (client/src/components/GlobalSearch.tsx): an overlay opened from the
// nav's search button or Cmd/Ctrl+K that searches every sake in the QPR database plus the page
// index, with arrow-key, Enter and Escape handling. Built on the site's shadcn Dialog (focus trap,
// Escape, backdrop) instead of the app's hand-made overlay; same look and copy.

const SAKE_INDEX: SakeSearchEntry[] = qprSakeDatabase.map((sake) => ({
  type: "sake",
  id: sake.id,
  title: sake.name,
  titleJa: sake.nameJa,
  subtitle: `${sake.type} · ${sake.prefecture} · $${sake.priceUS}`,
  subtitleJa: `${sake.type} · ${sake.prefecture} · $${sake.priceUS}`,
  href: sakeDetailPath(sake.id),
}));

const ALL_INDEX: SakeSearchEntry[] = [...SAKE_INDEX, ...sakePageIndex.map((p) => ({ ...p, href: sk(p.href) }))];

const ICONS = { sake: Wine, page: BookOpen, feature: Sparkles } as const;

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const portalClass = useSakePortalClass();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    // Opening again starts from an empty box (adjusting state during render).
    setWasOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return ALL_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.titleJa.includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.subtitleJa.includes(q),
    ).slice(0, 12);
  }, [query]);

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const select = (i: number) => {
    setSelectedIndex(i);
    (listRef.current?.children[i] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      select(Math.min(selectedIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      select(Math.max(selectedIndex - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      go(results[selectedIndex].href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          portalClass,
          "top-[10vh] translate-y-0 w-[90vw] max-w-150 sm:max-w-150 gap-0 p-0 rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden",
        )}
      >
        <DialogTitle className="sr-only">{t("Search", "検索")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("Search sakes, pages, features...", "酒、ページ、機能を検索...")}
        </DialogDescription>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search aria-hidden="true" size={20} className="shrink-0 text-(--sk-accent)" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onKeyDown}
            aria-label={t("Search", "検索")}
            placeholder={t("Search sakes, pages, features...", "酒、ページ、機能を検索...")}
            className="flex-1 bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close", "閉じる")}
            className="flex items-center justify-center p-1 rounded-md hover:bg-accent/10 transition-colors"
          >
            <X aria-hidden="true" size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {query.trim() && results.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">{t("No results found", "結果が見つかりません")}</div>
          )}
          {!query.trim() && (
            <div className="px-5 py-6 text-center text-muted-foreground text-sm">
              {t(
                "Start typing to search across 100+ sakes, 30+ pages, and all features",
                "100以上の酒、30以上のページ、全機能を検索",
              )}
            </div>
          )}
          {results.map((result, i) => {
            const Icon = ICONS[result.type];
            return (
              <button
                type="button"
                key={`${result.type}-${result.id}`}
                onClick={() => go(result.href)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={
                  i === selectedIndex
                    ? "w-full flex items-center gap-3 px-5 py-3 text-left transition-colors bg-(--sk-accent-soft)"
                    : "w-full flex items-center gap-3 px-5 py-3 text-left transition-colors bg-transparent"
                }
              >
                <span className="size-8 rounded-lg flex items-center justify-center shrink-0 border bg-(--sk-accent-soft) border-(--sk-accent-faint)">
                  <Icon aria-hidden="true" size={14} className="text-(--sk-accent)" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-foreground truncate">{t(result.title, result.titleJa)}</span>
                  <span className="block text-xs text-muted-foreground truncate">{t(result.subtitle, result.subtitleJa)}</span>
                </span>
                <ArrowRight aria-hidden="true" size={14} className="text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px]">↑↓</kbd> {t("Navigate", "ナビ")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px]">↵</kbd> {t("Select", "選択")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px]">Esc</kbd> {t("Close", "閉じる")}
            </span>
          </div>
          <span>{results.length > 0 ? `${results.length} ${t("results", "件")}` : ""}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
