import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Eyebrow, FadeIn, Section } from "@/components/Editorial";

const TOPICS = [
  {
    number: "01",
    title: "Trust is infrastructure",
    copy: "Every market, platform, and relationship is a trust system in disguise. Tony follows the seams where that system breaks, then asks the useful question: what would make it worthy of the people inside it?",
    color: "#8B6914",
  },
  {
    number: "02",
    title: "Capital has a job to do",
    copy: "Capital is not neutral. It can make extraction more efficient or make repair possible. This is a conversation about what happens when the people moving money decide to care where it lands.",
    color: "#4A1D5E",
  },
  {
    number: "03",
    title: "The human operating system",
    copy: "Technology keeps accelerating. The nervous system running the technology has not received the same upgrade. Tony connects attention, incentives, identity, and the daily choices that decide whether a system helps or hollows us out.",
    color: "#276B6B",
  },
  {
    number: "04",
    title: "What comes after the broken thing",
    copy: "The point is not to complain more elegantly. The point is to name the hidden mechanism, build a better one, and leave the room with somewhere specific to begin.",
    color: "#A86616",
  },
];

const FORMATS = [
  ["Keynote", "A clear provocation with a practical way through it."],
  ["Fireside", "An honest conversation that can follow the interesting thread."],
  ["Executive offsite", "A room built for strategic friction, not another slide deck."],
  ["Workshop", "A working session for teams ready to examine the system they are inside."],
];

export default function Speaking() {
  return (
    <main style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Speaking and Conversations | Tony Greenberg"
        description="Keynotes, firesides, offsites, and working sessions with Tony Greenberg on trust, capital, technology, and the human operating system."
        path="/speaking"
        keywords="Tony Greenberg speaker, keynote speaker, trust infrastructure, impact futurist, technology speaker, capital and impact"
        indexable={true}
      />

      <section style={{ background: "#0A0A10", color: "#F5F0E0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(4rem, 10vw, 7.5rem) clamp(1.35rem, 5vw, 4rem) clamp(3.25rem, 7vw, 5.5rem)", position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", width: "460px", height: "460px", top: "-180px", right: "-170px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,185,106,0.32) 0%, rgba(74,29,94,0.24) 34%, transparent 70%)", filter: "blur(2px)" }} />
          <FadeIn>
            <Link href="/about" style={{ display: "inline-block", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.14em", color: "#D4B96A", textDecoration: "none", textTransform: "uppercase" }}>
              ← The Story
            </Link>
            <div style={{ height: "2.25rem" }} />
            <Eyebrow>Speaking and Conversations</Eyebrow>
            <h1 style={{ fontFamily: "'Playfair Display', serif", maxWidth: "850px", margin: "1rem 0 1.5rem", color: "#F5F0E0", fontSize: "clamp(2.65rem, 7vw, 5.6rem)", fontWeight: 400, lineHeight: 0.98, textWrap: "balance" }}>
              A room changes when someone names what everyone can already feel.
            </h1>
            <p style={{ maxWidth: "690px", color: "rgba(245,240,224,0.76)", fontFamily: "'Source Serif 4', 'Playfair Display', serif", fontSize: "clamp(1.18rem, 2vw, 1.45rem)", lineHeight: 1.65, textWrap: "pretty" }}>
              Tony Greenberg speaks about trust, capital, technology, and the human systems beneath them. The work is not a polished keynote about disruption. It is a live search for the lever that makes a broken system behave differently.
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginTop: "2rem" }}>
            {["Davos", "Harvard H+ Summit", "UCLA", "Paris Blockchain Week"].map((room) => (
              <span key={room} style={{ border: "1px solid rgba(212,185,106,0.32)", borderRadius: "999px", padding: "0.45rem 0.75rem", color: "rgba(245,240,224,0.82)", fontFamily: "'DM Mono', monospace", fontSize: "0.69rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{room}</span>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1.22fr)", gap: "clamp(2rem, 7vw, 6rem)", alignItems: "start" }}>
            <div>
              <Eyebrow>What the room gets</Eyebrow>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.45rem)", lineHeight: 1.06, fontWeight: 400, color: "#111", margin: "0.85rem 0 1rem", textWrap: "balance" }}>
                A serious point of view, with a pulse.
              </h2>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#484848", margin: 0, textWrap: "pretty" }}>
                Tony has spent twenty five years inside the intermediary layer between buyers and sellers, managing more than $10 billion in transactions. He has also built ventures around regeneration, cultural value, and the inconvenient fact that human beings are not spreadsheets. The conversation moves between those worlds because the underlying question is the same: what is this system actually rewarding?
              </p>
            </div>
            <div style={{ display: "grid", gap: "0.9rem" }}>
              {TOPICS.map((topic) => (
                <article key={topic.number} style={{ background: "#fff", border: "1px solid rgba(17,17,17,0.09)", borderLeft: `4px solid ${topic.color}`, borderRadius: "5px", padding: "1.15rem clamp(1rem, 3vw, 1.45rem)" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.16em", color: topic.color, marginBottom: "0.35rem" }}>{topic.number}</div>
                  <h3 style={{ color: "#151515", fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1.35rem", margin: "0 0 0.4rem", lineHeight: 1.2 }}>{topic.title}</h3>
                  <p style={{ color: "#555", fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>{topic.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <section style={{ background: "#EEE9DF", borderTop: "1px solid rgba(139,105,20,0.12)", borderBottom: "1px solid rgba(139,105,20,0.12)" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "clamp(2.75rem, 6vw, 4.75rem) clamp(1.35rem, 5vw, 4rem)" }}>
          <Eyebrow>Formats</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.9rem", marginTop: "1rem" }}>
            {FORMATS.map(([title, copy]) => (
              <div key={title} style={{ padding: "1.15rem", border: "1px solid rgba(17,17,17,0.09)", borderRadius: "5px", background: "rgba(250,250,247,0.74)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#111", margin: "0 0 0.45rem", fontSize: "1.25rem" }}>{title}</h3>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#5B5B5B", margin: 0, lineHeight: 1.55 }}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <FadeIn>
          <div style={{ maxWidth: "760px", textAlign: "center", margin: "0 auto" }}>
            <Eyebrow>The first question</Eyebrow>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#111", fontSize: "clamp(2rem, 4.5vw, 3.55rem)", fontWeight: 400, lineHeight: 1.08, margin: "0.8rem 0 1rem", textWrap: "balance" }}>
              What is the room trying to make possible?
            </h2>
            <p style={{ fontSize: "1.12rem", color: "#555", lineHeight: 1.75, margin: "0 auto 1.5rem", maxWidth: "620px", textWrap: "pretty" }}>
              Send the audience, the moment, and the question the room cannot quite ask itself. If there is a fit, Tony will help shape the conversation from there.
            </p>
            <a href="mailto:tony@tonygreenberg.com?subject=Speaking%20Invitation" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "44px", padding: "0.75rem 1.2rem", borderRadius: "3px", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.11em", textTransform: "uppercase", color: "#0A0A10", background: "#D4B96A", textDecoration: "none" }}>
              Start a conversation →
            </a>
          </div>
        </FadeIn>
      </Section>
    </main>
  );
}
