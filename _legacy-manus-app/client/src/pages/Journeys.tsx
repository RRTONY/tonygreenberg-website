/*
 * DESIGN: Curated Journeys — guided paths through the site
 * Each journey threads specific sections across pages into a coherent experience
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  Section,
  SectionTitle,
  Eyebrow,
  FadeIn,
  Divider,
  Spacer,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import SEO from "@/components/SEO";

interface JourneyStop {
  page: string;
  href: string;
  section: string;
  teaser: string;
}

interface Journey {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  mood: string;
  stops: JourneyStop[];
}

const journeys: Journey[] = [
  {
    id: "the-thinker",
    icon: "🧠",
    title: "The Thinker's Thread",
    subtitle: "For the philosophically restless",
    description:
      "You read Harari on the plane and Rushkoff in the bath. You suspect that the collapse in Meaning is structural, not psychological. This path connects the dots between consciousness research, decentralized governance, and why a guy who benchmarks data centers also invests in psychedelic medicine.",
    duration: "~20 min read",
    mood: "Contemplative. Occasionally unsettling.",
    stops: [
      { page: "The Letter", href: "/", section: "Why Now?", teaser: "The collapse in Meaning — and why this document exists" },
      { page: "Walk Through", href: "/walk-through", section: "Door 03: Psychedelic Medicine", teaser: "Six investments in consciousness infrastructure" },
      { page: "Walk Through", href: "/walk-through", section: "Door 07: Decentralized Governance", teaser: "The anonymous healthcare wallet and self-sovereign identity" },
      { page: "The Nightstand", href: "/the-nightstand", section: "The 'How Did We Get Here' Shelf", teaser: "Nexus, The Great Simplification, Recapture the Rapture" },
      { page: "The Nightstand", href: "/the-nightstand", section: "The 'How Do I Not Lose My Mind' Shelf", teaser: "Sand Talk, The Immortality Key, Team Human" },
      { page: "The Territory", href: "/the-territory", section: "The Most Important Thing I've Learned", teaser: "What being of service really means — and why it took embarrassingly long" },
    ],
  },
  {
    id: "the-operator",
    icon: "⚙️",
    title: "The Operator's Playbook",
    subtitle: "For builders who need the objective lever",
    description:
      "You run a company. You're bleeding on vendor contracts. You need someone who's sat across the table from Microsoft, Disney, and Goldman Sachs for 25 years and can tell you which rooms are worth entering. This path is the business case — RampRate, the SPY Index, the advisory board, and the data center elephant in the room.",
    duration: "~15 min read",
    mood: "Sharp. Practical. Occasionally profane.",
    stops: [
      { page: "Walk Through", href: "/walk-through", section: "Door 01: Enterprise Technology & AI", teaser: "$10B+ benchmarked. 1M+ data points. The objective lever." },
      { page: "Engine Room", href: "/engine-room", section: "The Advisory Board", teaser: "Not advisors — co-conspirators. Voltron assembled." },
      { page: "Engine Room", href: "/engine-room", section: "The Elephant Not in the Room", teaser: "Data centers, Dean Nelson, and the positions that pay the mortgage" },
      { page: "Under NDA", href: "/under-nda", section: "The Corridor", teaser: "Four payment companies. $5B-$15B annually. Under NDA." },
      { page: "The Nightstand", href: "/the-nightstand", section: "AI Alignment Prompts", teaser: "Paste these into your AI and find where our worlds overlap" },
      { page: "Pick Up the Phone", href: "/pick-up-the-phone", section: "Contact", teaser: "Reach out. He actually responds." },
    ],
  },
  {
    id: "the-impact-soul",
    icon: "🌱",
    title: "The Impact Trail",
    subtitle: "For regenerative capitalists and reluctant optimists",
    description:
      "You believe profit and purpose shouldn't be different departments. You've heard about tokenization but you're not sure if it's real or just crypto bros in Patagonia vests. This path walks you through ImpactSoul's ABIT model, the live token ecosystems, the grants engine, and why a dinosaur skeleton might fund a school in rural India.",
    duration: "~18 min read",
    mood: "Hopeful. Structurally rigorous. Weird in the best way.",
    stops: [
      { page: "Walk Through", href: "/walk-through", section: "Door 02: Social Impact & Tokenization", teaser: "ImpactSoul — Certified B Corp. Four live ecosystems." },
      { page: "Engine Room", href: "/engine-room", section: "What ImpactSoul Is Actually Building", teaser: "Join a community. Drive impact. See & be seen." },
      { page: "Engine Room", href: "/engine-room", section: "The Grants & Capital Deployment Engine", teaser: "Not grant brokers — deployment partners." },
      { page: "Engine Room", href: "/engine-room", section: "Live Token Ecosystems", teaser: "BEYOND, REX, SPACE, BEING — each with a partner NGO" },
      { page: "Under NDA", href: "/under-nda", section: "Plot Twist: I'm Raising Money Now", teaser: "The weird stuff: dinosaurs, satellites, ocean cleanup, sacred springs" },
      { page: "The Web", href: "/the-web", section: "The Full Ecosystem", teaser: "Every site, every project, all linked" },
    ],
  },
  {
    id: "the-body-electric",
    icon: "⚡",
    title: "The Body Electric",
    subtitle: "For the biohacker who wants receipts",
    description:
      "You own an Oura Ring. You've Googled 'peptides' at 2am. You suspect your doctor knows less about your blood than you do. This path connects the health investments, the alt therapy scorecard, the psychedelic medicine portfolio, and the longevity protocols — with the measurement framework that makes it science, not woo-woo.",
    duration: "~12 min read",
    mood: "Clinical. Personal. Occasionally evangelical.",
    stops: [
      { page: "Walk Through", href: "/walk-through", section: "Door 05: Health & Longevity", teaser: "Peptides, exosomes, and the 5-dimension evaluation framework" },
      { page: "Walk Through", href: "/walk-through", section: "Door 03: Psychedelic Medicine", teaser: "MycoMedica, AtaiBeckley, and four more" },
      { page: "The Body", href: "/the-body", section: "Why I Now Know More About Your Blood Than Your Doctor", teaser: "The full health deep-dive — peptides to psychedelics" },
      { page: "The Territory", href: "/the-territory", section: "Life Between the Deals", teaser: "Antarctica, grief, and why the body is the engine" },
      { page: "The Nightstand", href: "/the-nightstand", section: "The 'How Do I Not Lose My Mind' Shelf", teaser: "The Immortality Key, Stealing Fire" },
    ],
  },
  {
    id: "the-crusade",
    icon: "🔥",
    title: "The Crusade Files",
    subtitle: "For the righteously pissed off",
    description:
      "You've been screwed by a company with dark patterns and fake reviews. You didn't write a Yelp review — you wanted to burn the building down (metaphorically). This path is for the consumer advocates, the whistleblowers, and anyone who believes that when a company offends your principles, the crusade IS the product.",
    duration: "~10 min read",
    mood: "Furious. Documented. Legally airtight.",
    stops: [
      { page: "Walk Through", href: "/walk-through", section: "Door 06: Consumer Advocacy", teaser: "Dark patterns, fake reviews, exploited workers. Filed with FTC." },
      { page: "The Web", href: "/the-web", section: "Homeaglow Exposed", teaser: "The flagship crusade — investigative site, regulatory complaints" },
      { page: "Blog", href: "/blog", section: "DMN8 Gym Exposé", teaser: "The most beautiful (crooked) gym in the world" },
      { page: "Blog", href: "/blog", section: "Luz Lounge", teaser: "Where loyalty goes to die — and Groupon deals are lipstick on a pig" },
      { page: "Blog", href: "/blog", section: "Hiding Fees & Tips", teaser: "Bad business in the transparent age" },
    ],
  },
  {
    id: "the-relationship-circuit",
    icon: "💫",
    title: "The Relationship Circuit",
    subtitle: "For anyone who suspects love has a science — and a sacred geometry",
    description:
      "A friend texted from Jerusalem: 'Do you know any Jewish men in their 50s who'd want to marry my friend?' That text was the spark that lit years of accumulated research on fire. This path traces the full arc — from the neuroscience of magnetic partnership, through the arithmetic of mutual value, the decay of modern communication, and the ties that bind us in a century that keeps trying to untie everything. Along the way, it connects to the measurement frameworks and flow states that make relationships — like teams, like water, like everything worth studying — a matter of coherence, not luck.",
    duration: "~25 min read",
    mood: "Intimate. Scientific. Occasionally devastating.",
    stops: [
      { page: "Blog", href: "/blog/love-as-dharma-a-science-based-playbook-for-magnetic-partnership", section: "Love as Dharma", teaser: "Applied neuroscience for magnetic partnership — attachment theory, polyvagal safety, and the signal your nervous system sends" },
      { page: "Blog", href: "/blog/the-ties-that-bind-interpersonal-relationships", section: "The Ties That Bind", teaser: "The full anatomy of modern interpersonal connection — and where it fractures" },
      { page: "Blog", href: "/blog/the-arithmetic-of-relationships", section: "The Arithmetic of Relationships", teaser: "What if we treated relationships with the rigor we apply to business? The ledger of mutual value." },
      { page: "Blog", href: "/blog/the-decay-of-modern-day-communication", section: "The Decay of Communication", teaser: "When the tools we built to bring us closer become instruments of avoidance and emotional cowardice" },
      { page: "The Flow Circuit", href: "/flow-circuit", section: "Flow States & Team Coherence", teaser: "The same circuitry that makes teams perform makes partnerships thrive — mapped and measured" },
      { page: "Sacred Waters", href: "https://aqwaterqpr-wvzsc3ph.manus.space", section: "Sacred Geometry of Connection", teaser: "Water remembers. So do relationships. The structural memory that holds everything together." },
      { page: "Recent Creations", href: "/recent-creations", section: "The Full Portfolio", teaser: "Every site built as a measurement of something worth understanding" },
    ],
  },
  {
    id: "the-whole-catastrophe",
    icon: "🌀",
    title: "The Whole Catastrophe",
    subtitle: "Read everything. Miss nothing.",
    description:
      "You have time. You have curiosity. You want the full Zorba — catharsis and communion, the cracking open that lets the light in. This is the linear path through every page, in the order it was meant to be read. The letter, the doors, the territory, the engine, the secrets, the body, the books, the web, and finally — the phone number.",
    duration: "~60 min read",
    mood: "Everything. All of it. The beautiful mess.",
    stops: [
      { page: "The Letter", href: "/", section: "Start Here", teaser: "I have something to show you." },
      { page: "Walk Through", href: "/walk-through", section: "The Seven Doors", teaser: "Seven worlds. The magic happens at the intersections." },
      { page: "The Territory", href: "/the-territory", section: "Life Between the Deals", teaser: "The business is the exhaust. The life is the engine." },
      { page: "Engine Room", href: "/engine-room", section: "ImpactSoul + Advisors", teaser: "What we're actually building — and who's building it" },
      { page: "Under NDA", href: "/under-nda", section: "The Corridor + Capital", teaser: "The parts under NDA and the parts that keep me up at night" },
      { page: "The Body", href: "/the-body", section: "Health & Longevity", teaser: "Peptides, psychedelics, and measurement-driven wellness" },
      { page: "The Nightstand", href: "/the-nightstand", section: "Reading + AI Prompts", teaser: "The books, the travel, and three prompts to find alignment" },
      { page: "The Web", href: "/the-web", section: "Full Ecosystem", teaser: "Every site, every project, the complete digital footprint" },
      { page: "Pick Up the Phone", href: "/pick-up-the-phone", section: "Contact", teaser: "With a full heart and an open door" },
    ],
  },
];

export default function Journeys() {
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

  return (
    <div>
      <SEO title="Journeys" description="Tony Greenberg's travels, experiences, and the places that shaped his thinking. From Santa Monica to the world." path="/journeys"
        indexable={true} />
      <Section>
        <FadeIn>
          <Eyebrow>Choose Your Own Adventure</Eyebrow>
          <SectionTitle>Guided Journeys</SectionTitle>
          <p style={{ color: "#222", lineHeight: 1.85, marginBottom: "1rem" }}>
            This site has a lot of rooms. You could wander — and wandering is beautiful. But if you know what you're looking for, or if you want to be surprised in a specific direction, pick a path. Each journey threads sections from across the site into a coherent experience built for a particular kind of curiosity.
          </p>
          <p style={{ color: "#555", fontSize: "1rem", lineHeight: 1.7 }}>
            Think of these as curated playlists for your attention. Some are short. One is everything.
          </p>
        </FadeIn>
      </Section>

      <Divider />
      <Spacer />

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        {journeys.map((journey, idx) => (
          <FadeIn key={journey.id} delay={idx * 0.06}>
            <div
              style={{
                marginBottom: "2rem",
                border: expandedJourney === journey.id
                  ? "1.5px solid #8B6914"
                  : "1px solid rgba(0,0,0,0.08)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                background: expandedJourney === journey.id
                  ? "linear-gradient(135deg, #FDFCF8 0%, #F7F3EA 100%)"
                  : "#FDFCF8",
                boxShadow: expandedJourney === journey.id
                  ? "0 4px 30px rgba(139,105,20,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.03)",
              }}
            >
              {/* Journey Header */}
              <button
                onClick={() =>
                  setExpandedJourney(
                    expandedJourney === journey.id ? null : journey.id
                  )
                }
                style={{
                  width: "100%",
                  padding: "2rem 2.5rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: "0.2rem",
                  }}
                >
                  {journey.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#111",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {journey.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: "#8B6914",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {journey.subtitle}
                  </div>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#444",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    <AutoLinkedText>{journey.description}</AutoLinkedText>
                  </p>
                  <div
                    className="flex gap-4 mt-3"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#888",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>{journey.duration}</span>
                    <span>&bull;</span>
                    <span>{journey.stops.length} stops</span>
                    <span>&bull;</span>
                    <span style={{  }}>{journey.mood}</span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "#8B6914",
                    transform: expandedJourney === journey.id ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.3s ease",
                    flexShrink: 0,
                    marginTop: "0.5rem",
                  }}
                >
                  ▾
                </div>
              </button>

              {/* Expanded Stops */}
              {expandedJourney === journey.id && (
                <div
                  style={{
                    padding: "0 2.5rem 2rem",
                    borderTop: "1px solid rgba(139,105,20,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "#8B6914",
                      padding: "1.5rem 0 1rem",
                    }}
                  >
                    Your Route
                  </div>
                  {journey.stops.map((stop, si) => {
                    const isExternal = stop.href.startsWith("http");
                    const Wrapper = isExternal ? "a" : Link;
                    const wrapperProps = isExternal
                      ? { href: stop.href, target: "_blank", rel: "noopener noreferrer" }
                      : { href: stop.href };
                    return (
                    <Wrapper
                      key={si}
                      {...wrapperProps}
                      className="block no-underline transition-all duration-200"
                      style={{
                        padding: "1rem 0 1rem 2.5rem",
                        borderLeft: "2px solid #E8DFC4",
                        position: "relative",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                        (e.currentTarget.style.borderLeftColor = "#8B6914");
                        (e.currentTarget.style.paddingLeft = "3rem");
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                        (e.currentTarget.style.borderLeftColor = "#E8DFC4");
                        (e.currentTarget.style.paddingLeft = "2.5rem");
                      }}
                    >
                      {/* Stop number dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-6px",
                          top: "1.3rem",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#D4B96A",
                          border: "2px solid #FDFCF8",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.78rem",
                          letterSpacing: "0.08em",
                          color: "#999",
                          textTransform: "uppercase" as const,
                          marginBottom: "0.2rem",
                        }}
                      >
                        Stop {si + 1} &bull; {stop.page}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          color: "#111",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {stop.section}
                      </div>
                      <div
                        style={{
                          fontSize: "1.05rem",
                          color: "#555",
                          lineHeight: 1.5,
                        }}
                      >
                        <AutoLinkedText>{stop.teaser}</AutoLinkedText>
                      </div>
                    </Wrapper>
                    );
                  })}

                  <div className="text-center pt-6">
                    {(() => {
                      const firstHref = journey.stops[0].href;
                      const isExt = firstHref.startsWith("http");
                      const btnStyle = {
                        background: "linear-gradient(135deg, #8B6914 0%, #A07A16 100%)",
                        color: "#fff",
                        padding: "0.7rem 2rem",
                        borderRadius: "24px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        textDecoration: "none",
                        boxShadow: "0 2px 10px rgba(139,105,20,0.2)",
                      };
                      return isExt ? (
                        <a href={firstHref} target="_blank" rel="noopener noreferrer" className="inline-block no-underline transition-all duration-200 hover:scale-105" style={btnStyle}>Begin This Journey</a>
                      ) : (
                        <Link href={firstHref} className="inline-block no-underline transition-all duration-200 hover:scale-105" style={btnStyle}>Begin This Journey</Link>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
