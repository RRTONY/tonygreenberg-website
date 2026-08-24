import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Section,
  SectionTitle,
  Eyebrow,
  FadeIn,
  Divider,
} from "@/components/Editorial";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  formatTag: string;
  validityScore: number;
  reads: number;
}

const posts: Post[] = (blogData as (Post & { unpublished?: boolean })[]).filter(p => !p.unpublished);

/* ── CONCEPT TAXONOMY ── */
const conceptMap: Record<string, { label: string; description: string; slugs: string[] }> = {
  "trust": {
    label: "Trust & Relationships",
    description: "The currency that takes years to build and seconds to destroy",
    slugs: ["the-1000-hour-hold", "love-as-dharma-a-science-based-playbook-for-magnetic-partnership", "the-ties-that-bind-interpersonal-relationships", "the-decay-of-modern-day-communication", "only-time-buys-trust", "why-good-service-is-all-about-trust", "the-arithmetic-of-relationships", "the-buyers-and-sellers-honesty-dance-1", "the-buyers-sellers-honesty-dance-2", "customer-service-key-to-business-success"],
  },
  "negotiation": {
    label: "Negotiation & Deal-Making",
    description: "The art of getting to yes without losing your soul",
    slugs: ["mastering-bd-the-art-of-the-no-that-opens-the-real-door", "the-cios-guide-to-smarter-vendor-negotiation", "thing-price-gouging-price-fixing", "hiding-fees-tips-in-the-transparent-age", "mastering-human-and-business-development"],
  },
  "technology": {
    label: "Technology & Infrastructure",
    description: "Where silicon meets strategy and billion-dollar decisions are made",
    slugs: ["profiling-the-public-cloud-buyer", "it-challenges-buyers-are-ok-are-you-sure-part-1", "so-now-that-we-admit-we-have-a-problem-part-2", "fast-growth-companies-likely-to-fall-part-3", "business-at-the-speed-of-light-millisecond-worth", "cios-maximize-roi-or-find-new-role-joe-weinman", "productivity-apps-that-rocked-my-world-in-2024", "productivity-apps-that-rock-my-world-in-2026"],
  },
  "blockchain": {
    label: "Blockchain & Decentralization",
    description: "The promise, the reality, and the space between",
    slugs: ["what-solutions-are-best-built-with-blockchain", "the-ball-and-blockchain-decentralization"],
  },
  "health": {
    label: "Health & Longevity",
    description: "The body as the ultimate technology platform",
    slugs: ["forever-chemicals-in-my-blood-pfas-and-microplastics", "elixir-of-life-device-and-journey", "forward-health-is-a-sideway-step-at-best", "boiling-the-human-summit-harvard-kurzweil"],
  },
  "psychedelics": {
    label: "Psychedelics & Consciousness",
    description: "Expanding the operating system of the human mind",
    slugs: ["psychedelics-could-become-extractive-capitalism"],
  },
  "ethics": {
    label: "Ethics & Values",
    description: "When doing the right thing and doing the profitable thing collide",
    slugs: ["the-tug-of-war-ethical-vs-economic-decisions", "eco-vegan-realities-seriesethical-economic", "how-to-alienate-a-loyal-vegan", "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "grateful-smuggest-sentiment-or-selfish-act", "return-on-investment-going-green-going-green-2"],
  },
  "communication": {
    label: "Communication & Language",
    description: "What we say, what we mean, and the chasm between",
    slugs: ["clear-communication", "apologize", "6-act-of-speech-speaking-as-a-tool", "the-decay-of-modern-day-communication", "the-decay-of-professional-phone-calls"],
  },
  "entrepreneurship": {
    label: "Entrepreneurship & Startups",
    description: "Building something from nothing and surviving the process",
    slugs: ["save-entrepreneurs-big-business-buying-startup-2", "when-valuations-dont-mean-valuable", "innovative-thinking-with-tony-greenberg-scale-up-show", "founders-institute-tony-outsourci", "would-you-hire-someone-who-led-a-rebellion"],
  },
  "media": {
    label: "Media & Entertainment",
    description: "Hollywood, streaming, and the death of the old guard",
    slugs: ["jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "amazon-trumps-all-other-suitors-quest-hulu", "clout-v-klout-differences-and-never-be-the-same"],
  },
  "food": {
    label: "Food & Hospitality",
    description: "Where craft meets commerce and every detail matters",
    slugs: ["restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants", "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet", "an-ode-to-kusaki-where-plants-become-culinary-masterpieces", "origen-restaurant", "bread-stuck-with-no-customer-service", "luz-lounge-where-loyalty-goes-to-die-groupon"],
  },
  "fitness": {
    label: "Fitness & Fraud",
    description: "When the wellness industry sells you a beautiful lie",
    slugs: ["trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", "dmn8-the-most-beautiful-crooked-gym-in-the-world"],
  },
  "covid": {
    label: "Pandemic & Society",
    description: "What COVID revealed about who we really are",
    slugs: ["more-ignorance-or-indignance-in-the-wake-of-covid-19", "covid-deniers-need-to-take-a-breath"],
  },
  "philosophy": {
    label: "Philosophy & Consciousness",
    description: "The operating system beneath the operating system",
    slugs: ["the-way-of-dao", "human-operating-system", "high-hells-demise-of-powerful-femininity"],
  },
  "leadership": {
    label: "Leadership & Management",
    description: "The difference between managing people and leading them",
    slugs: ["10-magic-questions-for-projects-success-kick-ass", "marc-andreessen-rebuttal-2020"],
  },
  "predictions": {
    label: "Predictions & Forecasting",
    description: "Putting your reputation where your mouth is",
    slugs: ["the-2011-cynic-measures-his-predictions"],
  },
  "sustainability": {
    label: "Sustainability & EV",
    description: "The economics of doing right by the planet",
    slugs: ["my-other-car-is-a-bentley-not-car-to-leaf-alone", "return-on-investment-going-green-going-green-2"],
  },
  "community": {
    label: "Community & Culture",
    description: "Where people gather and ideas collide",
    slugs: ["summit-series-weekend-community", "davos-2022-world-economic-forum-here-we-come", "india-my-virtual-soul-home"],
  },
  "customer-service": {
    label: "Customer Service & Time Theft",
    description: "When companies steal your time and call it 'service'",
    slugs: ["the-1000-hour-hold", "california-toll-roads-legalized-scam", "why-good-service-is-all-about-trust", "customer-service-key-to-business-success", "bread-stuck-with-no-customer-service", "luz-lounge-where-loyalty-goes-to-die-groupon"],
  },
  "charity": {
    label: "Charity & Impact",
    description: "Where does your dollar actually go \u2014 and who's watching",
    slugs: [],
  },
};

export default function TheIndex() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Object.keys(conceptMap);

  // Search across titles, summaries, and concept labels
  const filteredResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && !activeCategory) return [];

    let results: Post[] = [];

    if (activeCategory) {
      const concept = conceptMap[activeCategory];
      if (concept) {
        results = concept.slugs
          .map((slug) => posts.find((p) => p.slug === slug))
          .filter((p): p is Post => !!p);
      }
    }

    if (q) {
      // Search across all posts
      const searchResults = posts.filter((p) => {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSummary = p.summary.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        return matchTitle || matchSummary || matchCategory;
      });

      // Also search concept labels
      const matchingConcepts = categories.filter((key) => {
        const c = conceptMap[key];
        return c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      });

      const conceptSlugs = matchingConcepts.flatMap((key) => conceptMap[key].slugs);
      const conceptPosts = conceptSlugs
        .map((slug) => posts.find((p) => p.slug === slug))
        .filter((p): p is Post => !!p);

      // Merge and deduplicate
      const merged = [...searchResults, ...conceptPosts];
      const seen = new Set<string>();
      results = merged.filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      });
    }

    return results;
  }, [search, activeCategory]);

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="The Index — Searchable Idea Database"
        description="Search across 91 essays, 18 concept categories, and 25 years of thinking on technology, trust, ethics, and human development."
        path="/the-index"
        indexable={true}
      />

      <Section>
        <FadeIn>
          <Eyebrow>THE INDEX</Eyebrow>
          <SectionTitle>Search the Thinking</SectionTitle>
          <p
            style={{
              fontFamily: "'Source Serif 4', 'Georgia', serif",
              fontSize: "clamp(1.1rem, 1.7vw, 1.22rem)",
              lineHeight: 1.75,
              color: "#555",
              maxWidth: "700px",
              marginBottom: "2.5rem",
            }}
          >
            91 essays. 18 concept categories. 25 years of thinking on technology, trust, ethics, and human development.
            Search by keyword or browse by concept.
          </p>

          {/* ── SEARCH BAR ── */}
          <div style={{ maxWidth: "700px", marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(139,105,20,0.2)",
                borderRadius: "4px",
                background: "#fff",
                padding: "0.1rem",
                transition: "border-color 0.2s",
              }}
            >
              <span style={{ padding: "0 0.8rem", color: "#8B6914", fontSize: "1.2rem" }}>&#9906;</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
                placeholder="Search ideas, concepts, companies, people..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "1.1rem",
                  padding: "0.9rem 0",
                  background: "transparent",
                  color: "#111",
                }}
              />
              {(search || activeCategory) && (
                <button
                  onClick={() => { setSearch(""); setActiveCategory(null); }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#999",
                    cursor: "pointer",
                    padding: "0 0.8rem",
                    fontSize: "1rem",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* ── CONCEPT CLOUD ── */}
          <div style={{ marginBottom: "3rem" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "1rem",
              }}
            >
              BROWSE BY CONCEPT
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {categories.map((key) => {
                const concept = conceptMap[key];
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveCategory(isActive ? null : key);
                      setSearch("");
                    }}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.04em",
                      padding: "0.5rem 1rem",
                      borderRadius: "3px",
                      border: `1px solid ${isActive ? "#8B6914" : "rgba(139,105,20,0.15)"}`,
                      background: isActive ? "#111" : "transparent",
                      color: isActive ? "#D4B96A" : "#666",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {concept.label}
                    <span style={{ marginLeft: "0.4rem", opacity: 0.5 }}>({concept.slugs.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── ACTIVE CATEGORY DESCRIPTION ── */}
          {activeCategory && conceptMap[activeCategory] && (
            <div
              style={{
                maxWidth: "700px",
                marginBottom: "2rem",
                padding: "1.4rem 1.8rem",
                borderLeft: "3px solid #8B6914",
                background: "rgba(139,105,20,0.03)",
              }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#111", marginBottom: "0.4rem" }}>
                {conceptMap[activeCategory].label}
              </div>
              <div style={{ fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "1.05rem", color: "#666",  }}>
                {conceptMap[activeCategory].description}
              </div>
              {activeCategory === "charity" && (
                <Link
                  href="/charity-scorecard"
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#8B6914",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(139,105,20,0.3)",
                    paddingBottom: "2px",
                  }}
                >
                  Explore the Grand Impact Accountability Index →
                </Link>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {filteredResults.length > 0 && (
            <div style={{ maxWidth: "780px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: "#999",
                  marginBottom: "1rem",
                }}
              >
                {filteredResults.length} {filteredResults.length === 1 ? "RESULT" : "RESULTS"}
              </div>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {filteredResults.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      textDecoration: "none",
                      padding: "1rem 1.2rem",
                      border: "1px solid rgba(139,105,20,0.08)",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.7)",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.25)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(212,185,106,0.05)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,105,20,0.08)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.7)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        style={{
                          width: "80px",
                          height: "55px",
                          objectFit: "cover",
                          borderRadius: "3px",
                          flexShrink: 0,
                        }}
                        loading="lazy"
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#111" }}>
                          {post.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#8B6914", letterSpacing: "0.06em" }}>
                          {post.formatTag}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#bbb" }}>
                          {post.reads?.toLocaleString()} reads
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "0.98rem", color: "#666", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {post.summary}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!search && !activeCategory && (
            <div style={{ maxWidth: "700px", textAlign: "center", padding: "3rem 0" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#ccc", marginBottom: "0.5rem" }}>
                &#9830;
              </div>
              <div style={{ fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "1.08rem", color: "#999", lineHeight: 1.6 }}>
                Start typing to search across all 91 essays, or click a concept above to browse by theme.
              </div>
            </div>
          )}

          {/* ── CHARITY SCORECARD SEARCH RESULT ── */}
          {search && ["charity", "impact", "accountability", "scorecard", "giving", "philanthropy", "nonprofit", "donation", "donate"].some(kw => kw.includes(search.toLowerCase().trim()) || search.toLowerCase().trim().includes(kw)) && (
            <div style={{ maxWidth: "780px", marginBottom: "1.5rem" }}>
              <Link
                href="/charity-scorecard"
                style={{
                  display: "flex",
                  gap: "1rem",
                  textDecoration: "none",
                  padding: "1rem 1.2rem",
                  border: "1px solid rgba(139,105,20,0.2)",
                  borderRadius: "4px",
                  background: "rgba(212,185,106,0.06)",
                  transition: "all 0.25s",
                }}
              >
                <div style={{ width: "80px", height: "55px", background: "#111", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#D4B96A" }}>♦</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#111", marginBottom: "0.2rem" }}>
                    The Grand Impact Accountability Index
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#8B6914", letterSpacing: "0.06em" }}>INTERACTIVE TOOL</span>
                  </div>
                  <div style={{ fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "0.98rem", color: "#666", lineHeight: 1.5 }}>
                    103 charities scored across 7 dimensions from 8 evaluators. Where does your dollar actually go?
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── NO RESULTS ── */}
          {(search || activeCategory) && filteredResults.length === 0 && !( search && ["charity", "impact", "accountability", "scorecard", "giving", "philanthropy", "nonprofit", "donation", "donate"].some(kw => kw.includes(search.toLowerCase().trim()) || search.toLowerCase().trim().includes(kw))) && activeCategory !== "charity" && (
            <div style={{ maxWidth: "700px", textAlign: "center", padding: "3rem 0" }}>
              <div style={{ fontFamily: "'Source Serif 4', 'Georgia', serif", fontSize: "1.08rem", color: "#999" }}>
                No essays found for "{search || conceptMap[activeCategory!]?.label}". Try a different search term.
              </div>
            </div>
          )}

          <Divider />

          {/* ── STATS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "2rem", maxWidth: "700px", padding: "2.5rem 0" }}>
            {[
              { num: "86", label: "Essays" },
              { num: "18", label: "Concepts" },
              { num: "25+", label: "Years" },
              { num: `${posts.reduce((sum, p) => sum + (p.reads || 0), 0).toLocaleString()}`, label: "Total Reads" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#8B6914" }}>
                  {stat.num}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
