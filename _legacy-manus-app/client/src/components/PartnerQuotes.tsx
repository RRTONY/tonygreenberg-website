/**
 * PARTNER QUOTES — Rotating testimonials from real clients
 * Pulls from the same data as ThoughtCloud but rendered as
 * a compact, editorial-style quote carousel.
 */

import { useState, useEffect, useRef } from "react";
import { FadeIn } from "@/components/Editorial";

interface Quote {
  name: string;
  title: string;
  company: string;
  quote: string;
}

const allQuotes: Quote[] = [
  {
    name: "Paul Sams",
    title: "COO",
    company: "Blizzard Entertainment",
    quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast.",
  },
  {
    name: "Phil Wiser",
    title: "EVP & CTO",
    company: "ViacomCBS",
    quote: "They saved us millions, created agility and new budget out of thin air. They are a secret weapon in my tool box for truth, transparency and actionable direction.",
  },
  {
    name: "Dean Nelson",
    title: "VP of Global Foundation Services",
    company: "eBay",
    quote: "We can count on RampRate to be precise, timely and create millions in value. They are no-nonsense, data driven and responsive to a T.",
  },
  {
    name: "Robert Gonsalves",
    title: "Director of Production Operations",
    company: "Walt Disney Internet Group",
    quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney.",
  },
  {
    name: "Ian Rodgers",
    title: "CEO, Beats Music (acquired by Apple)",
    company: "Beats Music",
    quote: "Within 30 hours of our decision-making, we were fully installed and up and running. Not only did RampRate save us an incredible amount of time, resources, and money.",
  },
  {
    name: "Peter Borner",
    title: "Head of IT",
    company: "Sony Music",
    quote: "All in all, they made me look like a hero to my executive management. They are a secret weapon.",
  },
  {
    name: "Richard Titus",
    title: "EVP BBC / MD Razorfish LA",
    company: "BBC / Razorfish",
    quote: "I would recommend either he or his firm unequivocally for business planning, scale or cost containment. Globally astute consummate analysts and deal pros extraordinaire.",
  },
  {
    name: "Jay Samit",
    title: "Former EVP",
    company: "Sony Corporation of America",
    quote: "In a field filled with prognosticators who claim to know the next great thing, RampRate applies sound business judgment and analytics to assist senior management in making crucial, time-sensitive decisions.",
  },
  {
    name: "Gary Share",
    title: "Windows Marketing and Product",
    company: "Microsoft",
    quote: "RampRate is an invaluable partner for us. They helped us cut the clutter, gain insight and distill our team's thoughts for over 50 digital media, IT and product studies.",
  },
  {
    name: "Charles Butler",
    title: "Director of Network Operations",
    company: "AOL",
    quote: "WOW is the best I can say. They lowered overall prices between 17-36% and helped us achieve breakthrough innovative best-of-breed SLA coverage.",
  },
  {
    name: "Kipras Kazlauskas",
    title: "Co-Founder",
    company: "Syntropy",
    quote: "They paid for themselves by accelerating our growth by years and remain a vital resource for the team.",
  },
  {
    name: "Wulf Kaal",
    title: "Entrepreneur & Co-Founder",
    company: "Menagerie",
    quote: "Tony Greenberg is fun to work with even in highly contentious and stressful business environments. He has a unique ability to bring out the good and turn even the worst situations around.",
  },
  {
    name: "Blair Harrison",
    title: "CEO",
    company: "Frequency (formerly Viacom)",
    quote: "Using RampRate as a partner in these decisions is one of the smartest moves a business-minded CTO and management team can make!",
  },
  {
    name: "William Quigley",
    title: "Managing Director",
    company: "WAX / Clearstone Venture Partners",
    quote: "Tony and his team are very well connected in the global high-tech community. He is also a generous giver of his time and energy to worthy causes, driving impact to become measurable and reportable.",
  },
  {
    name: "Ryan Hughes",
    title: "Digital Operations",
    company: "National Hockey League",
    quote: "RampRate did an outstanding job helping us deliver content for a breakthrough pay-per-view feature the NHL is offering hockey fans.",
  },
  {
    name: "Andrew Robbins",
    title: "VP of New Media",
    company: "Miramax",
    quote: "They work fast, saved us over 40% and months of due diligence which we just didn't have.",
  },
  {
    name: "Niles Triget",
    title: "Operations",
    company: "Thomson Reuters / Delphion",
    quote: "RampRate was adaptable, brilliant and innovative. Their team stayed on schedule and stayed within the price. We saved millions.",
  },
  {
    name: "Ron Vaisbort",
    title: "Executive",
    company: "Intel / Ivalua / Blackberry",
    quote: "RampRate defines professionalism and they run a world-class team. They remain on the vanguard — staying on top of all the major digital media trends.",
  },
  {
    name: "Todd Miller",
    title: "CIO",
    company: "SF Chronicle — Hearst Corp",
    quote: "They bring uniquely rare data and a solid practice to the table. They opened my eyes to the possibilities of outsourcing on a broader scale.",
  },
];

/**
 * Shuffled selection of N quotes, stable per mount.
 */
function useShuffledQuotes(count: number): Quote[] {
  const [selected] = useState(() => {
    const shuffled = [...allQuotes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  });
  return selected;
}

/* ═══════════════════════════════════════════════════════
   VARIANT 1: Rotating single-quote spotlight
   Shows one quote at a time with a slow crossfade.
   ═══════════════════════════════════════════════════════ */
export function QuoteSpotlight({ count = 5, interval = 6000 }: { count?: number; interval?: number }) {
  const quotes = useShuffledQuotes(count);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quotes.length, interval]);

  const q = quotes[active];

  return (
    <FadeIn>
      <div
        style={{
          padding: "3rem clamp(1.5rem, 5vw, 4rem)",
          background: "linear-gradient(180deg, rgba(139,105,20,0.04) 0%, rgba(139,105,20,0.01) 100%)",
          borderTop: "1px solid rgba(139,105,20,0.1)",
          borderBottom: "1px solid rgba(139,105,20,0.1)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Decorative quote mark */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "4rem",
            color: "rgba(139,105,20,0.12)",
            lineHeight: 1,
            marginBottom: "-0.5rem",
            userSelect: "none",
          }}
        >
          &ldquo;
        </div>

        {/* Quote text with crossfade */}
        <div
          key={active}
          style={{
            maxWidth: "680px",
            animation: "quoteIn 0.8s ease both",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              fontWeight: 400,
              color: "#222",
              lineHeight: 1.7,
              fontStyle: "italic",
              margin: "0 0 1.2rem",
            }}
          >
            {q.quote}
          </p>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "#8B6914",
            }}
          >
            — {q.name}, {q.title}
          </div>
          <div
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.82rem",
              color: "#999",
              marginTop: "0.2rem",
            }}
          >
            {q.company}
          </div>
        </div>

        {/* Dots indicator */}
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.5rem" }}>
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "18px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === active ? "#8B6914" : "rgba(139,105,20,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>

        <style>{`
          @keyframes quoteIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 2: Three-column quote grid
   Shows 3 quotes side by side (stacks on mobile).
   ═══════════════════════════════════════════════════════ */
export function QuoteGrid({ count = 3 }: { count?: number }) {
  const quotes = useShuffledQuotes(count);

  return (
    <FadeIn>
      <div style={{ padding: "2rem 0" }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8B6914",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          WHAT THEY SAY
        </div>
        <div
          className="stagger-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {quotes.map((q, i) => (
            <div
              key={i}
              className="card-lift"
              style={{
                padding: "1.5rem",
                background: "#fff",
                border: "1px solid rgba(139,105,20,0.12)",
                borderRadius: "4px",
                position: "relative",
              }}
            >
              {/* Gold accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "3px",
                  height: "100%",
                  background: "linear-gradient(180deg, #D4B96A 0%, rgba(212,185,106,0.2) 100%)",
                  borderRadius: "4px 0 0 4px",
                }}
              />
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  color: "#333",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  margin: "0 0 1rem",
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </p>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  color: "#8B6914",
                  letterSpacing: "0.04em",
                }}
              >
                {q.name}
              </div>
              <div
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.78rem",
                  color: "#999",
                }}
              >
                {q.title}, {q.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 3: Compact inline quote (for sidebars/blog)
   ═══════════════════════════════════════════════════════ */
export function InlineQuote() {
  const [q] = useShuffledQuotes(1);

  return (
    <div
      style={{
        borderLeft: "2px solid rgba(139,105,20,0.3)",
        paddingLeft: "1rem",
        margin: "1.5rem 0",
      }}
    >
      <p
        style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.9rem",
          color: "#555",
          lineHeight: 1.6,
          fontStyle: "italic",
          margin: "0 0 0.4rem",
        }}
      >
        &ldquo;{q.quote}&rdquo;
      </p>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          color: "#8B6914",
        }}
      >
        — {q.name}, {q.company}
      </div>
    </div>
  );
}
