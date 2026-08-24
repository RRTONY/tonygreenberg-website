/*
 * DESIGN: "The Folio" — Heroes & Gratitude page
 * People who shaped Tony's journey
 */

import {
  Section,
  SectionTitle,
  Eyebrow,
  Pullquote,
  NextPage,
  FadeIn,
  Divider,
  Spacer,
} from "@/components/Editorial";
import AutoLinkedText from "@/components/AutoLinkedText";
import SEO from "@/components/SEO";

const heroes = [
  { name: "Arnold Patent", role: "Teacher, Author", note: "Taught me that abundance isn't something you acquire — it's something you tune into. His book 'You Can Have It All' rewired how I think about value, exchange, and what it means to receive." },
  { name: "Buckminster Fuller", role: "Architect, Systems Thinker", note: "'You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.' Read that at 22. Never recovered." },
  { name: "Ram Dass", role: "Spiritual Teacher", note: "'Be here now.' Three words that took me twenty years to understand. His bridge between Eastern wisdom and Western psychology is the operating system underneath everything I build. 'Be Love Now' is the sequel your soul didn't know it needed." },
  { name: "Donella Meadows", role: "Systems Scientist, Author", note: "'Thinking in Systems' is the most dangerous book I've ever read — dangerous because once you see leverage points, you can't unsee them. She proved that the most powerful place to intervene in a system is the mindset out of which it arises." },
  { name: "Rick Doblin", role: "Founder, MAPS", note: "Spent 40 years getting MDMA through FDA trials. That's not persistence — that's a calling. He taught me what real conviction looks like." },
  { name: "Margaret Wheatley", role: "Systems Thinker, Author", note: "'Leadership and the New Science' taught me that organizations are living systems, not machines. You don't control them — you create the conditions for them to self-organize. That insight saved me from a decade of bad management." },
  { name: "Joanna Macy", role: "Buddhist Scholar, Systems Thinker", note: "The woman who married Buddhism with systems theory and told the rest of us to stop looking away. Her 'Work That Reconnects' is the emotional infrastructure for anyone trying to build something that matters while the world burns." },
  { name: "Matt Mochary", role: "CEO Coach, Author", note: "What Matt built is a phenomenon — the operating system for the most important, most skilled companies on the planet. 'The Great CEO Within' should be the operating Bible for anyone building a product company. Full stop. We occupy different terrain: RampRate lives at the extremes — Fortune 500 giants and tiny emerging companies just finding their footing. Matt owns the specific middle with surgical precision. He's the best in the world at what he does. We're the best in the world at what we do. That mutual recognition is rare, and it's the criteria by which we choose who to work with." },
  { name: "Clarisse Abelarde", role: "Artist, Partner, Muse", note: "A constant source of inspiration for creativity and love for humankind. Her art reminds me daily that the most important things can't be measured, benchmarked, or tokenized." },
  { name: "The RampRate Team", role: "25 Years Deep", note: "The people who stayed. Who built. Who believed in the mission when the market didn't. Every company is only as good as the people who refuse to leave." },
];

export default function Territory() {
  return (
    <div>
      <SEO title="The Territory" description="The heroes, influences, and intellectual lineage that shaped Tony Greenberg's worldview. From Arnold Patent to Ram Dass to systems thinking." path="/the-territory"
        indexable={true} />
      <Section>
        <FadeIn>
          <Eyebrow>Gratitude</Eyebrow>
          <SectionTitle>Heroes & Influences</SectionTitle>
          <p style={{ color: "#222", marginBottom: "2rem" }}>
            None of this was built alone. These are the people and ideas that shaped how I think, what I build, and why I bother. Some are mentors. Some are partners. Some are ideas that hit me like a truck and never let go.
          </p>
        </FadeIn>

        {heroes.map((hero, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div
              style={{
                padding: "2rem 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  {hero.name}
                </h3>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "#8B6914",
                  }}
                >
                  {hero.role}
                </span>
              </div>
              <p style={{ color: "#333", fontSize: "1.05rem", lineHeight: 1.8 }}>
                <AutoLinkedText>{hero.note}</AutoLinkedText>
              </p>
            </div>
          </FadeIn>
        ))}

        <Divider />
        <Spacer />

        <FadeIn>
          <Pullquote>
            The people in your life are not resources to be managed. They are mirrors. They show you who you are when you're not performing. Pay attention to the ones who stay when the show is over.
          </Pullquote>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <SectionTitle>Operating Philosophy</SectionTitle>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            I'm a satisficer, not a maximizer. I don't need the best deal — I need the right deal. I don't need the most connections — I need the real ones. This distinction has saved me from more bad decisions than any spreadsheet ever could.
          </p>
          <p style={{ color: "#222", marginBottom: "1.5rem" }}>
            My companies operate on "rolling closes" — never stop building, never stop connecting, never stop iterating. The moment you think you're done is the moment you start dying. Every conversation is a potential collaboration. Every problem is a potential product.
          </p>
          <p style={{ color: "#222" }}>
            Radical transparency, obsessive documentation, and the power of showing up. Half of success is being in the room. The other half is knowing which room.
          </p>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div
            style={{
              padding: "1.5rem",
              borderLeft: "3px solid #8B6914",
              background: "rgba(212,185,106,0.06)",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                marginBottom: "0.5rem",
              }}
            >
              The Lesson
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#222" }}>
              The people who shape you most are rarely the ones with the biggest titles. They're the ones who stayed when the show was over, who told you the truth when the truth was expensive, and who modeled what conviction looks like across decades, not quarters.
            </p>
          </div>
        </FadeIn>
      </Section>

      <NextPage href="/engine-room" label="Continue to The Engine Room" />
    </div>
  );
}
