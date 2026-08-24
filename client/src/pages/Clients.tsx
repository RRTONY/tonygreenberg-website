/*
 * CLIENTS — "The Rolodex"
 * RampRate's 90+ enterprise clients displayed as a visual grid
 * with Hawkins consciousness scores and industry categorization
 */

import { useState } from "react";
import {
  Section,
  SectionTitle,
  Eyebrow,
  Divider,
  Spacer,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";

/* ── CLIENT DATA ── */
interface Client {
  name: string;
  industry: string;
  hawkins: number;
  tier: 1 | 2 | 3;
}

const clients: Client[] = [
  // Tier 1 — Marquee
  { name: "Microsoft", industry: "Technology", hawkins: 310, tier: 1 },
  { name: "Disney", industry: "Entertainment", hawkins: 350, tier: 1 },
  { name: "Goldman Sachs", industry: "Finance", hawkins: 280, tier: 1 },
  { name: "Nike", industry: "Consumer", hawkins: 340, tier: 1 },
  { name: "Sony", industry: "Technology", hawkins: 320, tier: 1 },
  { name: "Intel", industry: "Technology", hawkins: 310, tier: 1 },
  { name: "JPMorgan Chase", industry: "Finance", hawkins: 290, tier: 1 },
  { name: "Verizon", industry: "Telecom", hawkins: 270, tier: 1 },
  { name: "AT&T", industry: "Telecom", hawkins: 260, tier: 1 },
  { name: "PayPal", industry: "Fintech", hawkins: 330, tier: 1 },
  { name: "Citigroup", industry: "Finance", hawkins: 275, tier: 1 },
  { name: "Fidelity Investments", industry: "Finance", hawkins: 310, tier: 1 },
  { name: "Merrill Lynch", industry: "Finance", hawkins: 285, tier: 1 },
  { name: "McKinsey & Company", industry: "Consulting", hawkins: 340, tier: 1 },
  { name: "Bain & Company", industry: "Consulting", hawkins: 350, tier: 1 },
  { name: "Accenture", industry: "Consulting", hawkins: 300, tier: 1 },
  { name: "Credit Suisse", industry: "Finance", hawkins: 270, tier: 1 },
  { name: "Fox", industry: "Media", hawkins: 250, tier: 1 },
  { name: "NBC", industry: "Media", hawkins: 280, tier: 1 },
  { name: "ViacomCBS", industry: "Media", hawkins: 290, tier: 1 },
  { name: "eBay", industry: "E-Commerce", hawkins: 300, tier: 1 },
  { name: "Expedia", industry: "Travel", hawkins: 310, tier: 1 },
  { name: "Gap", industry: "Retail", hawkins: 290, tier: 1 },
  { name: "Vodafone", industry: "Telecom", hawkins: 300, tier: 1 },
  { name: "Broadcom", industry: "Technology", hawkins: 280, tier: 1 },
  { name: "Virgin", industry: "Conglomerate", hawkins: 370, tier: 1 },
  { name: "Yahoo", industry: "Technology", hawkins: 270, tier: 1 },
  { name: "AOL", industry: "Technology", hawkins: 260, tier: 1 },

  // Tier 2 — Notable
  { name: "Bridgewater", industry: "Finance", hawkins: 340, tier: 2 },
  { name: "Citadel", industry: "Finance", hawkins: 310, tier: 2 },
  { name: "Houlihan Lokey", industry: "Finance", hawkins: 320, tier: 2 },
  { name: "Hearst Corporation", industry: "Media", hawkins: 300, tier: 2 },
  { name: "MGM", industry: "Entertainment", hawkins: 290, tier: 2 },
  { name: "Miramax", industry: "Entertainment", hawkins: 310, tier: 2 },
  { name: "MTV", industry: "Media", hawkins: 280, tier: 2 },
  { name: "Zurich Insurance", industry: "Insurance", hawkins: 300, tier: 2 },
  { name: "AON", industry: "Insurance", hawkins: 290, tier: 2 },
  { name: "Munich RE", industry: "Insurance", hawkins: 310, tier: 2 },
  { name: "Ticketmaster", industry: "Entertainment", hawkins: 260, tier: 2 },
  { name: "StubHub", industry: "E-Commerce", hawkins: 270, tier: 2 },
  { name: "GoDaddy", industry: "Technology", hawkins: 280, tier: 2 },
  { name: "Tribune Publishing", industry: "Media", hawkins: 270, tier: 2 },
  { name: "Blizzard Entertainment", industry: "Gaming", hawkins: 320, tier: 2 },
  { name: "Penske Logistics", industry: "Logistics", hawkins: 290, tier: 2 },
  { name: "Level 3 Communications", industry: "Telecom", hawkins: 280, tier: 2 },
  { name: "Cushman & Wakefield", industry: "Real Estate", hawkins: 290, tier: 2 },
  { name: "NPR", industry: "Media", hawkins: 400, tier: 2 },
  { name: "Girl Scouts", industry: "Nonprofit", hawkins: 420, tier: 2 },
  { name: "Scholastic", industry: "Education", hawkins: 380, tier: 2 },
  { name: "McGraw Hill", industry: "Education", hawkins: 340, tier: 2 },
  { name: "Sirius Satellite Radio", industry: "Media", hawkins: 290, tier: 2 },
  { name: "Sun Microsystems", industry: "Technology", hawkins: 330, tier: 2 },
  { name: "SanDisk", industry: "Technology", hawkins: 310, tier: 2 },
  { name: "Trend Micro", industry: "Cybersecurity", hawkins: 310, tier: 2 },
  { name: "Knight Ridder", industry: "Media", hawkins: 300, tier: 2 },
  { name: "Scripps", industry: "Media", hawkins: 310, tier: 2 },
  { name: "San Francisco Chronicle", industry: "Media", hawkins: 310, tier: 2 },
  { name: "Commonwealth Bank", industry: "Finance", hawkins: 300, tier: 2 },

  // Tier 3 — Tech/Startup/Impact
  { name: "Hedera Hashgraph", industry: "Web3", hawkins: 340, tier: 3 },
  { name: "Block.one (EOS)", industry: "Web3", hawkins: 290, tier: 3 },
  { name: "Good Money", industry: "Impact Finance", hawkins: 380, tier: 3 },
  { name: "Wavemaker 360 Health", industry: "Healthcare", hawkins: 370, tier: 3 },
  { name: "Unitus Ventures", industry: "Impact Investing", hawkins: 390, tier: 3 },
  { name: "eHealth Ontario", industry: "Healthcare", hawkins: 360, tier: 3 },
  { name: "Linden Lab", industry: "Gaming", hawkins: 330, tier: 3 },
  { name: "Audible.com", industry: "Media", hawkins: 350, tier: 3 },
  { name: "DRW Trading Group", industry: "Finance", hawkins: 300, tier: 3 },
  { name: "Stifel Financial", industry: "Finance", hawkins: 290, tier: 3 },
  { name: "Archon Capital", industry: "Finance", hawkins: 310, tier: 3 },
  { name: "TBWA", industry: "Advertising", hawkins: 310, tier: 3 },
  { name: "Constant Contact", industry: "Marketing", hawkins: 300, tier: 3 },
  { name: "Verne Global", industry: "Data Centers", hawkins: 340, tier: 3 },
  { name: "CCP Games", industry: "Gaming", hawkins: 310, tier: 3 },
  { name: "Sony Crackle", industry: "Streaming", hawkins: 280, tier: 3 },
  { name: "Syntropy", industry: "Web3", hawkins: 330, tier: 3 },
  { name: "GLG", industry: "Consulting", hawkins: 310, tier: 3 },
  { name: "Rodale", industry: "Publishing", hawkins: 370, tier: 3 },
  { name: "Fortis", industry: "Finance", hawkins: 290, tier: 3 },
  { name: "Metaldyne", industry: "Manufacturing", hawkins: 270, tier: 3 },
];

/* ── HAWKINS LEVEL HELPER ── */
function hawkinsLevel(score: number): { label: string; color: string } {
  if (score >= 400) return { label: "Enlightened", color: "#7B2D8E" };
  if (score >= 350) return { label: "Acceptance", color: "#2E7D32" };
  if (score >= 300) return { label: "Willingness", color: "#1565C0" };
  if (score >= 250) return { label: "Neutrality", color: "#8B6914" };
  return { label: "Courage", color: "#C75B12" };
}

/* ── INDUSTRY COLORS ── */
const industryColors: Record<string, string> = {
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

/* ── FILTER OPTIONS ── */
const industries = Array.from(new Set(clients.map((c) => c.industry))).sort();

export default function Clients() {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "hawkins" | "industry">("hawkins");

  const filtered = clients
    .filter((c) => filter === "all" || c.industry === filter)
    .sort((a, b) => {
      if (sortBy === "hawkins") return b.hawkins - a.hawkins;
      if (sortBy === "industry") return a.industry.localeCompare(b.industry);
      return a.name.localeCompare(b.name);
    });

  const avgHawkins = Math.round(
    clients.reduce((sum, c) => sum + c.hawkins, 0) / clients.length
  );

  return (
    <div>
      <SEO
        title="Clients"
        description="90+ enterprise clients served by RampRate over 25 years. Microsoft, Disney, Goldman Sachs, Nike, and more."
        path="/clients"
        indexable={true}
      />

      {/* ── HERO ── */}
      <div
        style={{
          padding: "4rem 2rem 3rem",
          background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E8 100%)",
        }}
      >
        <Section>
          <FadeIn>
            <a
              href="/"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "1.5rem",
                borderBottom: "1px solid transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottom = "1px solid #D4B96A")}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottom = "1px solid transparent")}
            >
              &larr; Back to The Broadsheet
            </a>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#0A0A10",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              The Rolodex
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: "#444",
                lineHeight: 1.7,
                maxWidth: "640px",
              }}
            >
              {clients.length} companies across 25 years. Every engagement measured, every
              relationship maintained. This is who trusts RampRate with their infrastructure.
            </p>
          </FadeIn>
        </Section>
      </div>

      {/* ── STATS BAR ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "1.5rem 2rem",
        }}
      >
        <Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            {[
              { label: "Clients Served", value: `${clients.length}+` },
              { label: "Years Active", value: "25" },
              { label: "Benchmarked", value: "$10B+" },
              { label: "Avg. Hawkins Score", value: avgHawkins.toString() },
              { label: "Data Points", value: "1M+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#D4B96A",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "#888",
                    marginTop: "0.3rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Spacer />

      {/* ── FILTERS & SORT ── */}
      <Section>
        <FadeIn>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginRight: "0.5rem",
              }}
            >
              Filter:
            </div>
            <button
              onClick={() => setFilter("all")}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                padding: "0.4rem 0.8rem",
                border: "1px solid",
                borderColor: filter === "all" ? "#8B6914" : "#ddd",
                background: filter === "all" ? "#8B6914" : "transparent",
                color: filter === "all" ? "#fff" : "#555",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              All ({clients.length})
            </button>
            {industries.map((ind) => {
              const count = clients.filter((c) => c.industry === ind).length;
              return (
                <button
                  key={ind}
                  onClick={() => setFilter(ind)}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    padding: "0.4rem 0.8rem",
                    border: "1px solid",
                    borderColor: filter === ind ? "#8B6914" : "#ddd",
                    background: filter === ind ? "#8B6914" : "transparent",
                    color: filter === ind ? "#fff" : "#555",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  {ind} ({count})
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginRight: "0.5rem",
              }}
            >
              Sort:
            </div>
            {(["hawkins", "name", "industry"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  padding: "0.4rem 0.8rem",
                  border: "1px solid",
                  borderColor: sortBy === s ? "#8B6914" : "#ddd",
                  background: sortBy === s ? "#8B6914" : "transparent",
                  color: sortBy === s ? "#fff" : "#555",
                  cursor: "pointer",
                  borderRadius: "2px",
                  textTransform: "capitalize" as const,
                }}
              >
                {s === "hawkins" ? "Consciousness" : s}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ── CLIENT GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((client) => {
            const level = hawkinsLevel(client.hawkins);
            const indColor = industryColors[client.industry] || "#555";
            return (
              <FadeIn key={client.name}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #E8E3D8",
                    borderRadius: "4px",
                    padding: "1.2rem 1.4rem",
                    transition: "all 0.3s ease",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D4B96A";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,105,20,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E8E3D8";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Tier indicator */}
                  {client.tier === 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "0",
                        height: "0",
                        borderTop: "24px solid #D4B96A",
                        borderLeft: "24px solid transparent",
                      }}
                    />
                  )}

                  {/* Industry badge */}
                  <div
                    style={{
                      display: "inline-block",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: indColor,
                      background: `${indColor}12`,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "2px",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {client.industry}
                  </div>

                  {/* Company name */}
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "#111",
                      marginBottom: "0.6rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {client.name}
                  </div>

                  {/* Hawkins score */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "4px",
                        background: "#F0EBE0",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((client.hawkins / 500) * 100, 100)}%`,
                          height: "100%",
                          background: level.color,
                          borderRadius: "2px",
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        color: level.color,
                        flexShrink: 0,
                        minWidth: "2rem",
                        textAlign: "right",
                      }}
                    >
                      {client.hawkins}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.06em",
                      color: level.color,
                      marginTop: "0.3rem",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {level.label}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      <Spacer />
      <Divider />
      <Spacer />

      {/* ── HAWKINS SCALE LEGEND ── */}
      <Section>
        <FadeIn>
          <Eyebrow>The Hawkins Scale</Eyebrow>
          <SectionTitle>Consciousness Calibration</SectionTitle>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem",
              color: "#555",
              lineHeight: 1.8,
              maxWidth: "680px",
              marginBottom: "2rem",
            }}
          >
            Dr. David Hawkins' Map of Consciousness calibrates organizations on a
            logarithmic scale from 1 to 1,000. Scores above 200 indicate constructive
            energy. Above 350 indicates acceptance and integration. Above 400 indicates
            reason and enlightened purpose. These scores reflect our assessment of each
            organization's alignment with regenerative, conscious business practices.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Courage", range: "200-249", color: "#C75B12", desc: "Taking action despite uncertainty" },
              { label: "Neutrality", range: "250-299", color: "#8B6914", desc: "Flexible, pragmatic, adaptable" },
              { label: "Willingness", range: "300-349", color: "#1565C0", desc: "Open, optimistic, growth-oriented" },
              { label: "Acceptance", range: "350-399", color: "#2E7D32", desc: "Transformative, purpose-driven" },
              { label: "Enlightened", range: "400+", color: "#7B2D8E", desc: "Visionary, regenerative, transcendent" },
            ].map((level) => (
              <div
                key={level.label}
                style={{
                  padding: "1rem",
                  borderLeft: `3px solid ${level.color}`,
                  background: `${level.color}08`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: level.color,
                    fontWeight: 600,
                  }}
                >
                  {level.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#888",
                    marginTop: "0.2rem",
                  }}
                >
                  {level.range}
                </div>
                <div
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.88rem",
                    color: "#555",
                    marginTop: "0.4rem",
                    lineHeight: 1.5,
                  }}
                >
                  {level.desc}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* ── CTA ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <Section>
          <FadeIn>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem",
                fontWeight: 600,
                color: "#FAFAF7",
                marginBottom: "1rem",
                lineHeight: 1.4,
              }}
            >
              "The best deals are the ones where both sides
              <br />
              walk away feeling like they won."
            </p>
            <a
              href="https://ramprate.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#D4B96A",
                textDecoration: "none",
                borderBottom: "1px solid #D4B96A",
                paddingBottom: "2px",
              }}
            >
              Visit RampRate &rarr;
            </a>
          </FadeIn>
        </Section>
      </div>

      <NextPage href="/recent-creations" label="Recent Creations" />
    </div>
  );
}
