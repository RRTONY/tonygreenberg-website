/**
 * PUBLISHED — Tony Greenberg's bylines across major publications
 * Editorial broadsheet style matching the rest of the site
 */

import { Section, SectionTitle, Eyebrow, FadeIn, Spacer } from "@/components/Editorial";
import { Link } from "wouter";
import SEO from "@/components/SEO";

interface Article {
  title: string;
  publication: string;
  date: string;
  url: string;
  teaser: string;
  category: "tech" | "trust" | "culture" | "blockchain" | "media" | "impact";
}

const PUBLICATIONS: { name: string; logo: string; color: string; count: number; tagline: string }[] = [
  { name: "HuffPost", logo: "H", color: "#0dbe4e", count: 28, tagline: "Contributor, 2010–2012" },
  { name: "Medium", logo: "M", color: "#000000", count: 7, tagline: "@ramprate & @tonygreenberg" },
  { name: "MediaVillage", logo: "MV", color: "#1a73e8", count: 3, tagline: "Industry Analysis" },
  { name: "RampRate", logo: "R", color: "#8B6914", count: 40, tagline: "ramprate.com/blog" },
  { name: "Enterprise Radio", logo: "🎙", color: "#c0392b", count: 2, tagline: "Podcast Guest" },
];

const ARTICLES: Article[] = [
  // HuffPost — Trust & Philosophy
  { title: "Trust Us? Define Trust For Social Networks And Life!", publication: "HuffPost", date: "Nov 2011", url: "https://www.huffpost.com/entry/trust-us-are-you-really-m_b_569378", teaser: "The foundational essay on why trust is the only currency that compounds.", category: "trust" },
  { title: "The Triple Bottom Line of Soul > Trust + Empathy in Business + Friendship", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Before ESG was a buzzword, this was the math.", category: "trust" },
  { title: "The Act Of Gratitude: Show, Don't Tell", publication: "HuffPost", date: "Nov 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Gratitude as a strategic practice, not a Hallmark card.", category: "culture" },
  { title: "Gratitude: The Smuggest Sentiment or the World's Second Most Selfish Act?", publication: "HuffPost", date: "Nov 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The uncomfortable truth about why we say thank you.", category: "culture" },

  // HuffPost — Tech & Markets
  { title: "Building a Services Market for the Transhuman Era", publication: "HuffPost", date: "May 2011", url: "https://www.huffpost.com/entry/building-a-services-marke_b_569378", teaser: "The Harvard summit talk distilled. What happens when the market meets the singularity.", category: "tech" },
  { title: "Business at the Speed of Light: What Is a Millisecond Worth?", publication: "HuffPost", date: "May 2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Low-latency computing is turning financial markets inside out.", category: "tech" },
  { title: "Key Cloud Migration Decisions", publication: "HuffPost", date: "Oct 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The decisions nobody tells you about before you move to the cloud.", category: "tech" },
  { title: "Profiling the Public Cloud Buyer's Danger", publication: "HuffPost", date: "Oct 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Public cloud buyers are walking into traps. Here's the map.", category: "tech" },
  { title: "Where's My Flying Car... and an Efficient IT Market?", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "We were promised jet packs. We got vendor lock-in.", category: "tech" },
  { title: "Making IT Fit Like a Good Shoe", publication: "HuffPost", date: "May 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Custom-fit technology sourcing vs. off-the-rack disasters.", category: "tech" },
  { title: "IT Services Markets Crumble — Driving Detroit's Rut, Is the Media Business Next?", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The parallels between collapsing auto and IT markets.", category: "tech" },
  { title: "Why Good Service Is About Trust — Why Buy MacMall In An Apple Store World", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Trust beats convenience. Every time.", category: "trust" },

  // HuffPost — Media & Culture
  { title: "Amazon to Beat All Suitors For Hulu?", publication: "HuffPost", date: "2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Called the streaming wars before they had a name.", category: "media" },
  { title: "Jumping Through Hoops With Hulu: Will Hollywood Studios Kill Their Offspring Again?", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Hollywood's pattern of eating its own children.", category: "media" },
  { title: "Break Out the Buggy Whips: Is This the Tipping Point for Streaming Video?", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The moment streaming stopped being optional.", category: "media" },
  { title: "The Google/Verizon Walled Garden Plan: No Substantive Impact on Net Neutrality", publication: "HuffPost", date: "2010", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Net neutrality theater vs. the real power play.", category: "media" },
  { title: "When Valuations Don't Mean Valuable", publication: "HuffPost", date: "2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The gap between what something costs and what it's worth.", category: "tech" },
  { title: "Save the Entrepreneur — Big Business Keeps Buying Startups, And Killing 'Em", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Acquisition as assassination. The startup graveyard.", category: "tech" },
  { title: "The Myth of the RFP for Everything at Half Price", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The peasants were getting restless. The RFP was a lie.", category: "tech" },
  { title: "A Cynic Predicts IT and Media in 2011", publication: "HuffPost", date: "2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Predictions from someone who'd rather be wrong.", category: "tech" },
  { title: "The 2011 Cynic Measures His Predictions", publication: "HuffPost", date: "2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The scorecard. Spoiler: the cynic was mostly right.", category: "tech" },

  // HuffPost — Lifestyle
  { title: "Building a Community In a Weekend", publication: "HuffPost", date: "May 2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "What happens when you stop networking and start connecting.", category: "culture" },
  { title: "My Other Car Is a Bentley...Not (I Want My Car to Leaf Me Alone)", publication: "HuffPost", date: "2012", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The electric vehicle manifesto, before it was cool.", category: "culture" },
  { title: "Are You Going Green or Going for the Green?", publication: "HuffPost", date: "2010", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The uncomfortable intersection of environmentalism and profit.", category: "impact" },
  { title: "The Tug of War — Ethical vs. Economic 'Green' Decisions", publication: "HuffPost", date: "2010", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "When doing good and doing well pull in opposite directions.", category: "impact" },
  { title: "Surfing the WWC (The Worldwide Wine Club)", publication: "HuffPost", date: "2010", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Wine as a lens for understanding global community.", category: "culture" },
  { title: "Trust Your Tongue: The Only Wine And Spirits Critic Who Matters", publication: "HuffPost", date: "May 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "Your palate is the only authority. Trust it.", category: "culture" },
  { title: "Scrubbing Our Lives Clean From Dr. Bronner's to Pressure Cookers", publication: "HuffPost", date: "May 2011", url: "https://www.huffpost.com/author/tony-greenberg", teaser: "The objects that clean us tell us who we are.", category: "culture" },

  // Medium — Blockchain
  { title: "A Historical Perspective on Blockchain", publication: "Medium", date: "Mar 2018", url: "https://medium.com/coinmonks/a-historical-perspective-on-blockchain-c28ab92db0f1", teaser: "Blockchain isn't the first decentralization movement. What can it learn from P2P?", category: "blockchain" },
  { title: "The Ball and Blockchain: Obstacles to a World-Changing Trajectory", publication: "Medium", date: "2018", url: "https://medium.com/@ramprate", teaser: "The forces trying to slow down the most disruptive technology since the internet.", category: "blockchain" },
  { title: "From Supply Chain to the Blockchain: Heal the Body, Mind, Earth", publication: "Medium", date: "Oct 2018", url: "https://medium.com/@ramprate/from-supply-chain-to-the-blockchain-heal-the-body-mind-earth-4ac2a201a17c", teaser: "Firms using blockchain to reconfigure business, democratize finance, and change healthcare.", category: "blockchain" },
  { title: "Microsoft's Underwater Data Centers (Really?)", publication: "Medium", date: "2018", url: "https://medium.com/@ramprate/microsofts-underwater-data-centers-really-3c39ff010483", teaser: "Something about the water keeps attracting data center builders.", category: "tech" },

  // MediaVillage
  { title: "Business At The Speed Of Light — What is a Millisecond Worth?", publication: "MediaVillage", date: "Mar 2012", url: "https://www.mediavillage.com/article/business-at-the-speed-of-light-what-is-millisecond-worth-tony-greenberg/", teaser: "Low-latency computing is turning financial markets, news, and media inside out.", category: "tech" },
  { title: "Clout vs. Klout", publication: "MediaVillage", date: "2012", url: "https://www.mediavillage.com/author/tony-greenberg/", teaser: "Real influence vs. algorithmic vanity metrics.", category: "culture" },
];

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Technology & Markets",
  trust: "Trust & Philosophy",
  culture: "Culture & Life",
  blockchain: "Blockchain & Web3",
  media: "Media & Entertainment",
  impact: "Impact & Sustainability",
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: "#2563eb",
  trust: "#8B6914",
  culture: "#7c3aed",
  blockchain: "#059669",
  media: "#dc2626",
  impact: "#0891b2",
};

export default function Published() {
  const categories = Object.keys(CATEGORY_LABELS);
  const totalArticles = ARTICLES.length;

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Published — Tony Greenberg"
        description="Bylines across HuffPost, Medium, MediaVillage, and more. 28+ articles on technology, trust, blockchain, and the human condition."
        indexable={true}
      />

      {/* ── HERO ── */}
      <Section>
        <FadeIn>
          <div style={{ height: "3rem" }} />

          <Link href="/">
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              color: "#8B6914",
              cursor: "pointer",
              textTransform: "uppercase",
            }}>
              ← BACK TO THE BROADSHEET
            </span>
          </Link>

          <div style={{ height: "2rem" }} />

          <Eyebrow>THE BYLINES</Eyebrow>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#0A0A10",
            marginBottom: "1.5rem",
            maxWidth: "700px",
          }}>
            Published<br />
            Elsewhere
          </h1>

          <p style={{
            fontFamily: "'Source Serif 4', 'Playfair Display', serif",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            color: "#444",
            maxWidth: "640px",
            marginBottom: "2rem",
          }}>
            {totalArticles} articles across HuffPost, Medium, and MediaVillage.
            Technology, trust, blockchain, and the uncomfortable questions
            nobody else was asking at the time.
          </p>

          {/* ── PUBLICATION BADGES ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "3rem",
          }}>
            {PUBLICATIONS.map((pub) => (
              <div key={pub.name} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.8rem 1.2rem",
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "4px",
                transition: "all 0.2s",
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: pub.color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}>
                  {pub.logo}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#111",
                  }}>{pub.name}</div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    color: "#888",
                    letterSpacing: "0.02em",
                  }}>{pub.count} pieces · {pub.tagline}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── ARTICLES BY CATEGORY ── */}
          {categories.map((cat) => {
            const catArticles = ARTICLES.filter((a) => a.category === cat);
            if (catArticles.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: "3rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.8rem",
                  borderBottom: `2px solid ${CATEGORY_COLORS[cat]}20`,
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[cat],
                  }} />
                  <h2 style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: CATEGORY_COLORS[cat],
                    margin: 0,
                  }}>
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#aaa",
                  }}>({catArticles.length})</span>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                  gap: "1rem",
                }}>
                  {catArticles.map((article, i) => (
                    <a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "1.4rem 1.6rem",
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: "4px",
                        textDecoration: "none",
                        transition: "all 0.25s ease",
                        borderLeft: `3px solid ${CATEGORY_COLORS[cat]}30`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = CATEGORY_COLORS[cat];
                        e.currentTarget.style.transform = "translateX(4px)";
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = `${CATEGORY_COLORS[cat]}30`;
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                      }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          color: CATEGORY_COLORS[cat],
                          textTransform: "uppercase",
                        }}>
                          {article.publication}
                        </span>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.68rem",
                          color: "#aaa",
                        }}>
                          {article.date}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: "#111",
                        marginBottom: "0.5rem",
                      }}>
                        {article.title}
                      </h3>
                      <p style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.88rem",
                        lineHeight: 1.6,
                        color: "#666",
                        margin: 0,
                      }}>
                        {article.teaser}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── SPEAKING & PODCAST ── */}
          <div style={{
            marginTop: "2rem",
            padding: "2rem",
            background: "linear-gradient(135deg, rgba(139,105,20,0.04) 0%, rgba(139,105,20,0.01) 100%)",
            borderLeft: "3px solid #8B6914",
            borderRadius: "0 4px 4px 0",
          }}>
            <h2 style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: "1.2rem",
            }}>
              SPEAKING & PODCAST
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { title: "\"Boiling the Human\" — Harvard Summit with Ray Kurzweil", year: "2010", desc: "Co-presented on the transhuman services market at Harvard's Humanity+ summit" },
                { title: "Become An Innovator and Change The World", year: "2022", desc: "YouTube talk on impact-driven entrepreneurship and transparency" },
                { title: "Innovation Meets Impact — Enterprise Radio", year: "2016", desc: "How to think when $100M's are on the line" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    color: "#8B6914",
                    minWidth: "50px",
                  }}>{item.year}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111",
                      marginBottom: "0.25rem",
                    }}>{item.title}</div>
                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.88rem",
                      color: "#666",
                    }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{
            marginTop: "3rem",
            textAlign: "center",
            padding: "2.5rem",
            background: "#0A0A10",
            borderRadius: "4px",
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              
              color: "#D4B96A",
              marginBottom: "1rem",
            }}>
              "The best articles are the ones that make you uncomfortable enough to act."
            </p>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              color: "#888",
              letterSpacing: "0.08em",
              marginBottom: "1.5rem",
            }}>
              86 more essays live on this site. Start with the ones that landed hardest.
            </p>
            <Link href="/">
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                letterSpacing: "0.12em",
                color: "#8B6914",
                textTransform: "uppercase",
                cursor: "pointer",
                borderBottom: "1px solid rgba(139,105,20,0.3)",
                paddingBottom: "2px",
              }}>
                ENTER THE BROADSHEET →
              </span>
            </Link>
          </div>

          <div style={{ height: "4rem" }} />
        </FadeIn>
      </Section>
    </div>
  );
}
