/**
 * SearchResults — Full-page search results with highlighted snippets,
 * category filters, and pagination. Editorial broadsheet style.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Search, ArrowLeft, Filter, ChevronLeft, ChevronRight, X, BookOpen, Coffee, Pill, Brain, Globe, ClipboardCheck, Heart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

/* ── Category config ── */

const CATEGORIES = [
  { key: "all", label: "All", icon: Globe },
  { key: "blog", label: "Essays", icon: BookOpen },
  { key: "brewsoul", label: "BrewSoul", icon: Coffee },
  { key: "peptide", label: "Peptides", icon: Pill },
  { key: "humanos", label: "Human OS", icon: Brain },
  { key: "assessment", label: "Assessments", icon: ClipboardCheck },
  { key: "kava", label: "Kava", icon: Heart },
  { key: "page", label: "Pages", icon: FileText },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  blog: "text-amber-700 bg-amber-50 border-amber-200",
  brewsoul: "text-emerald-700 bg-emerald-50 border-emerald-200",
  peptide: "text-violet-700 bg-violet-50 border-violet-200",
  humanos: "text-sky-700 bg-sky-50 border-sky-200",
  assessment: "text-rose-700 bg-rose-50 border-rose-200",
  kava: "text-teal-700 bg-teal-50 border-teal-200",
  page: "text-stone-700 bg-stone-50 border-stone-200",
};

/* ── Highlight helper ── */

function highlightText(text: string, query: string): React.ReactNode {
  if (!text || !query) return text;
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (words.length === 0) return text;

  // Build regex that matches any query word
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = words.some(w => part.toLowerCase() === w);
    return isMatch ? (
      <mark key={i} className="bg-amber-200/60 text-amber-900 rounded-sm px-0.5 font-medium">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

/* ── Main Component ── */

export default function SearchResults() {
  const [, setLocation] = useLocation();

  // Parse query from URL
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialCategory = params.get("category") || "all";
  const initialPage = parseInt(params.get("page") || "1", 10);

  const [inputValue, setInputValue] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const PAGE_SIZE = 20;

  // Update URL when search params change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (currentPage > 1) params.set("page", String(currentPage));
    const qs = params.toString();
    const newUrl = `/search${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, activeCategory, currentPage]);

  // tRPC query
  const { data, isLoading, isFetching } = trpc.search.query.useQuery(
    {
      q: searchQuery,
      category: activeCategory === "all" ? undefined : activeCategory,
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
    },
    {
      enabled: searchQuery.length > 0,
      placeholderData: (prev: any) => prev,
    }
  );

  const logClick = trpc.search.logClick.useMutation();

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      setCurrentPage(1);
    }
  }, [inputValue]);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleResultClick = useCallback((path: string) => {
    logClick.mutate({ query: searchQuery, clickedPath: path });
  }, [searchQuery, logClick]);

  // Auto-search on mount if query present
  useEffect(() => {
    if (initialQuery && !searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, []);

  return (
    <>
    <SEO
        title="Search Results"
        description="Search across Tony Greenberg's essays, assessments, and resources."
        path="/search"
        keywords="Tony Greenberg, search, Tony Greenberg essays"
        indexable={true}
      />
      <div className="min-h-screen bg-[var(--color-parchment)]">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors" aria-label="Back to home">
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search everything…"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-[family-name:var(--font-family-sans)] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                autoFocus
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => { setInputValue(""); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-stone-200 rounded"
                >
                  <X className="w-3.5 h-3.5 text-stone-400" />
                </button>
              )}
            </form>
          </div>

          {/* Category filters */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap font-[family-name:var(--font-family-mono)] ${
                  activeCategory === key
                    ? "bg-[var(--color-ink)] text-[var(--color-parchment)]"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Status bar */}
        {searchQuery && data && (
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-sm text-stone-500 font-[family-name:var(--font-family-mono)] tracking-wide uppercase">
              {data.total} result{data.total !== 1 ? "s" : ""} for{" "}
              <span className="text-[var(--color-ink)] font-medium">"{searchQuery}"</span>
              {activeCategory !== "all" && (
                <span> in <span className="text-[var(--color-gold)]">{CATEGORIES.find(c => c.key === activeCategory)?.label}</span></span>
              )}
            </p>
            {isFetching && (
              <span className="text-xs text-stone-400 animate-pulse">Searching…</span>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && searchQuery && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-stone-200 p-5 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-stone-100 rounded w-full mb-2" />
                <div className="h-3 bg-stone-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && searchQuery && data?.results.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-[family-name:var(--font-family-serif)] text-[var(--color-ink)] mb-2">
              No results found
            </h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              Try different keywords, check your spelling, or broaden your search by removing category filters.
            </p>
          </div>
        )}

        {/* No query state */}
        {!searchQuery && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-[family-name:var(--font-family-serif)] text-[var(--color-ink)] mb-2">
              Search Everything
            </h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              114 essays, 80+ coffees, 103 charities, 20+ assessments, peptide research, kava science, and more — all searchable from one place.
            </p>
          </div>
        )}

        {/* Results list */}
        {data?.results && data.results.length > 0 && (
          <div className="space-y-3">
            {data.results.map((result) => (
              <Link key={result.id} href={result.path} onClick={() => handleResultClick(result.path)}>
                <article className="group bg-white rounded-lg border border-stone-200 p-5 hover:border-[var(--color-gold-light)] hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* Image thumbnail if available */}
                    {result.imageUrl && (
                      <div className="hidden sm:block w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-stone-100">
                        <img
                          src={result.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Category badge + path */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border font-[family-name:var(--font-family-mono)] ${CATEGORY_COLORS[result.category] || CATEGORY_COLORS.page}`}>
                          {result.category === "brewsoul" ? "BrewSoul" : result.subcategory || result.category}
                        </span>
                        <span className="text-[10px] text-stone-400 font-[family-name:var(--font-family-mono)] truncate">
                          {result.path}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-[family-name:var(--font-family-serif)] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors leading-snug mb-1">
                        {highlightText(result.title, searchQuery)}
                      </h3>

                      {/* Snippet or excerpt */}
                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 font-[family-name:var(--font-family-sans)]">
                        {result.snippet
                          ? highlightText(result.snippet, searchQuery)
                          : result.excerpt
                            ? highlightText(result.excerpt, searchQuery)
                            : null
                        }
                      </p>

                      {/* Tags */}
                      {result.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.split(",").slice(0, 5).map((tag, i) => (
                            <span key={i} className="text-[10px] text-stone-400 font-[family-name:var(--font-family-mono)]">
                              {i > 0 && "·"} {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-family-mono)]"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <span className="text-sm text-stone-500 font-[family-name:var(--font-family-mono)] px-3">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-family-mono)]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
    </>);
}
