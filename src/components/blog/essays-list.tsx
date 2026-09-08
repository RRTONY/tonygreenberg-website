"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ARCHETYPES, type ArchetypeKey } from "@/lib/content/archetypes";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import { urlFor } from "@/lib/sanity/image";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  category?: { title: string; slug: string };
};

const ARCHETYPE_FILTERS: { key: ArchetypeKey | "all"; label: string }[] = [
  { key: "all", label: "All Paths" },
  { key: "builder", label: "Builder" },
  { key: "crusader", label: "Crusader" },
  { key: "investor", label: "Investor" },
];

// Ported from legacy client/src/pages/Essays.tsx. A second essay index,
// distinct from the homepage's archive — this one filters by "archetype"
// (Builder/Crusader/Investor, a reader-path taxonomy) instead of Core
// Themes, and uses a compact list layout rather than a card grid. Not
// linked from current nav (legacy didn't link it either — it's a
// destination referenced by other not-yet-built pages), but real,
// portable content in its own right.
export function EssaysList({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [archFilter, setArchFilter] = useState<ArchetypeKey | "all">("all");
  const [catFilter, setCatFilter] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const p of posts) if (p.category) cats.add(p.category.title);
    return Array.from(cats).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (archFilter !== "all") {
      const arch = ARCHETYPES[archFilter];
      result = result.filter((p) => p.category && arch.categories.includes(p.category.title));
    }
    if (catFilter !== "all") {
      result = result.filter((p) => p.category?.title === catFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.excerpt ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [posts, archFilter, catFilter, search]);

  return (
    <div>
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search essays..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 bg-background pl-9"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {ARCHETYPE_FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={archFilter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setArchFilter(f.key)}
            className="rounded-full font-mono text-xs tracking-wide uppercase"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-1.5">
        <button
          onClick={() => setCatFilter("all")}
          className={`rounded-sm px-3 py-1.5 text-sm ${
            catFilter === "all" ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`rounded-sm px-3 py-1.5 text-sm ${
              catFilter === cat ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-5 font-mono text-xs text-muted-foreground">
        {filtered.length} essay{filtered.length !== 1 ? "s" : ""}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="flex gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:border-brand-gold/40"
          >
            <div className="relative size-18 shrink-0 overflow-hidden rounded-md">
              <Image
                src={post.heroImage ? urlFor(post.heroImage).width(144).height(144).url() : DEFAULT_OG_IMAGE}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              {post.category && (
                <div className="mb-1 font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase">
                  {post.category.title}
                </div>
              )}
              <div className="mb-1 font-heading leading-snug text-foreground">{post.title}</div>
              {post.excerpt && (
                <div className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No essays match your filters.
        </div>
      )}
    </div>
  );
}
