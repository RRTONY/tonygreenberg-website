"use client";

import { useMemo, useState } from "react";

export type Client = { name: string; industry: string; hawkins: number; tier: 1 | 2 | 3 };

// Industry colors are genuinely dynamic (29 distinct values from data) —
// the documented inline-style exception, same reasoning as the portfolio
// accent colors on /recent-creations. Not a small fixed set that's worth
// precomposing as literal Tailwind classes.
const INDUSTRY_COLORS: Record<string, string> = {
  Technology: "#1565C0",
  Finance: "#2E7D32",
  Entertainment: "#7B2D8E",
  Media: "#C75B12",
  Telecom: "#00838F",
  Consulting: "#4527A0",
  "E-Commerce": "#AD1457",
  Consumer: "#E65100",
  Fintech: "#00695C",
  Travel: "#0277BD",
  Retail: "#BF360C",
  Conglomerate: "#880E4F",
  Insurance: "#33691E",
  Gaming: "#6A1B9A",
  Logistics: "#4E342E",
  "Real Estate": "#37474F",
  Nonprofit: "#1B5E20",
  Education: "#0D47A1",
  Cybersecurity: "#B71C1C",
  Web3: "#4A148C",
  "Impact Finance": "#1B5E20",
  "Impact Investing": "#2E7D32",
  Healthcare: "#00695C",
  Advertising: "#E65100",
  Marketing: "#AD1457",
  "Data Centers": "#37474F",
  Streaming: "#6A1B9A",
  Publishing: "#4E342E",
  Manufacturing: "#455A64",
};

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 font-mono text-xs tracking-wide ${
        active
          ? "border-brand-gold bg-brand-gold text-white"
          : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function hawkinsLevel(score: number): { label: string; color: string } {
  if (score >= 400) return { label: "Enlightened", color: "#7B2D8E" };
  if (score >= 350) return { label: "Acceptance", color: "#2E7D32" };
  if (score >= 300) return { label: "Willingness", color: "#1565C0" };
  if (score >= 250) return { label: "Neutrality", color: "#8B6914" };
  return { label: "Courage", color: "#C75B12" };
}

export function ClientsGrid({ clients }: { clients: Client[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"hawkins" | "name" | "industry">("hawkins");

  const industries = useMemo(
    () => Array.from(new Set(clients.map((c) => c.industry))).sort(),
    [clients],
  );

  const filtered = useMemo(() => {
    return clients
      .filter((c) => filter === "all" || c.industry === filter)
      .sort((a, b) => {
        if (sortBy === "hawkins") return b.hawkins - a.hawkins;
        if (sortBy === "industry") return a.industry.localeCompare(b.industry);
        return a.name.localeCompare(b.name);
      });
  }, [clients, filter, sortBy]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="mr-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
          Filter:
        </span>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All ({clients.length})
        </FilterButton>
        {industries.map((ind) => {
          const count = clients.filter((c) => c.industry === ind).length;
          return (
            <FilterButton key={ind} active={filter === ind} onClick={() => setFilter(ind)}>
              {ind} ({count})
            </FilterButton>
          );
        })}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="mr-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
          Sort:
        </span>
        {(["hawkins", "name", "industry"] as const).map((s) => (
          <FilterButton key={s} active={sortBy === s} onClick={() => setSortBy(s)}>
            {s === "hawkins" ? "Consciousness" : s}
          </FilterButton>
        ))}
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        {filtered.map((client) => {
          const level = hawkinsLevel(client.hawkins);
          const indColor = INDUSTRY_COLORS[client.industry] || "#555";
          return (
            <div
              key={client.name}
              className="relative overflow-hidden rounded-md border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              {client.tier === 1 && (
                <div
                  className="absolute top-0 right-0 size-0"
                  style={{ borderTop: "24px solid #D4B96A", borderLeft: "24px solid transparent" }}
                />
              )}
              <span
                className="mb-2 inline-block rounded-sm px-2 py-0.5 font-mono text-xs tracking-wide uppercase"
                style={{ color: indColor, background: `${indColor}1a` }}
              >
                {client.industry}
              </span>
              <p className="mb-2.5 font-heading text-lg font-semibold text-foreground">
                {client.name}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((client.hawkins / 500) * 100, 100)}%`,
                      background: level.color,
                    }}
                  />
                </div>
                <span
                  className="min-w-8 shrink-0 text-right font-mono text-xs"
                  style={{ color: level.color }}
                >
                  {client.hawkins}
                </span>
              </div>
              <p
                className="mt-1 font-mono text-xs tracking-wide uppercase"
                style={{ color: level.color }}
              >
                {level.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
