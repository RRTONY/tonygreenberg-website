import { Link } from "wouter";
import SEO from "@/components/SEO";
import ManifestoLayout, {
  C,
  GlassCard,
  SectionLabel,
  SectionTitle,
  SectionIntro,
  PullQuote,
  CrusadeDivider,
  HeroSection,
  EmberParticles,
} from "./ManifestoLayout";
import {
  ArrowLeft,
  Flame,
  Shield,
  Trash2,
  Mail,
  UserX,
  Clock,
  FileWarning,
  Share2,
  Scale,
  Megaphone,
  Zap,
  ArrowRight,
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/manifesto-hero-weapons_7f34787b.jpg";

const WEAPONS = [
  {
    num: "01", icon: Trash2, title: "Never Respond", subtitle: "The Zero-Engagement Protocol",
    desc: "Every response \u2014 even \"unsubscribe\" \u2014 validates their model. It confirms a live address, an engaged human, a potential mark. The first weapon is absolute silence. Not \"no thank you.\" Not \"remove me.\" Nothing. Let their messages fall into the void.",
    action: "Delete without opening. Mark as spam. Move on.",
  },
  {
    num: "02", icon: Shield, title: "Deploy AI Blockers", subtitle: "Fight Fire With Fire",
    desc: "If they\u2019re using AI to attack, use AI to defend. Tools like SaneBox, Clean Email, and Superhuman use machine learning to identify and quarantine spam before it reaches your attention. The arms race is real \u2014 be on the right side of it.",
    action: "Take the Blocker Finder quiz to get your personalized arsenal.",
    link: "/attention-theft/blocker-finder",
  },
  {
    num: "03", icon: Mail, title: "Use Email Aliases", subtitle: "The Disposable Identity Strategy",
    desc: "Services like SimpleLogin and AnonAddy let you create unlimited email aliases. Give each service a unique alias. When one gets compromised, kill it. Your real address stays pristine. This is the digital equivalent of a P.O. box \u2014 and it works.",
    action: "Set up SimpleLogin or AnonAddy today.",
  },
  {
    num: "04", icon: UserX, title: "Public Shame", subtitle: "Name Them. Document Them. Share Them.",
    desc: "Spammers operate in the dark. They count on anonymity. When you receive egregious spam, screenshot it, name the company, and share it publicly. Tag them on social media. Write about them. Make the social cost of spamming higher than the economic benefit.",
    action: "Use our Report A Spammer form to build the public database.",
    link: "/attention-theft/report",
  },
  {
    num: "05", icon: Clock, title: "Time-Block Your Inbox", subtitle: "Reclaim Your Attention Architecture",
    desc: "Check email twice a day. Not continuously. Not reactively. Set specific windows \u2014 10am and 3pm, for example \u2014 and close your email client the rest of the time. This doesn\u2019t stop spam, but it limits its blast radius on your attention.",
    action: "Set two email windows today. Close the tab between them.",
  },
  {
    num: "06", icon: FileWarning, title: "Report to Authorities", subtitle: "Make It Official",
    desc: "File complaints with the FTC (reportfraud.ftc.gov), the FCC, and your state attorney general. Most people don\u2019t bother. That\u2019s why enforcement is weak. Volume of complaints drives regulatory action. Be the volume.",
    action: "File an FTC complaint at reportfraud.ftc.gov",
  },
  {
    num: "07", icon: Share2, title: "Share This Manifesto", subtitle: "Carry The Baton",
    desc: "Every person who reads this and acts on it reduces the ROI of spam by one more unit. Share it with your team, your company, your network. The economics of spam only work when recipients are passive. Make them active.",
    action: "Send this page to 5 people who are drowning in spam.",
  },
  {
    num: "08", icon: Scale, title: "Demand Better Laws", subtitle: "The Legislative Front",
    desc: "The CAN-SPAM Act is a joke \u2014 it doesn\u2019t even require opt-in consent. Contact your representatives and demand legislation modeled on GDPR and CASL. Real penalties. Real enforcement. Real consent requirements.",
    action: "Use our letter template in the Legal Database.",
    link: "/attention-theft/legal",
  },
  {
    num: "09", icon: Megaphone, title: "Organize Your Company", subtitle: "Institutional Defense",
    desc: "If you\u2019re in a leadership position, implement company-wide email hygiene policies. Deploy enterprise-grade spam filtering. Train your team on the economics of attention theft. Make \"inbox defense\" part of your operational culture.",
    action: "Propose an email hygiene policy at your next team meeting.",
  },
  {
    num: "10", icon: Zap, title: "Change Your Email", subtitle: "The Nuclear Option",
    desc: "If your current email is beyond saving \u2014 if the spam volume has made it unusable \u2014 start fresh. Migrate to a new address with strict alias protocols from day one. Yes, it\u2019s painful. But it\u2019s less painful than losing 65+ hours of productivity every day to digital sewage.",
    action: "Consider Hey.com or Proton Mail for a fresh start with built-in protection.",
  },
];

export default function TenWeapons() {
  return (
    <>
    <SEO
        title="Ten Weapons — The Manifesto"
        description="Ten tools and tactics to defend your attention from the attention economy."
        path="/manifesto/ten-weapons"
        keywords="Tony Greenberg, attention defense, inbox tools, spam weapons, attention economy"
        indexable={true}
      />
      <ManifestoLayout>
      {/* ═══ HERO ═══ */}
      <HeroSection
        image={HERO_IMG}
        label="Your Arsenal"
        title={<>The 10 <span style={{ color: C.red }}>Weapons</span></>}
        subtitle="You don't need to do all ten. But every weapon you deploy makes the economics of spam worse for the attacker and better for you. Pick three. Start today."
      >
        <Link
          href="/attention-theft"
          className="inline-flex items-center gap-1.5 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: C.ink }}
        >
          <ArrowLeft size={16} /> Back to Manifesto
        </Link>
      </HeroSection>

      {/* ═══ WEAPONS GRID ═══ */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: C.parchment }}>
        <EmberParticles count={25} color={C.red} />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(232,54,42,0.3) 2px, rgba(232,54,42,0.3) 4px)",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid gap-6">
            {WEAPONS.map((w, idx) => (
              <GlassCard
                key={w.num}
                variant={idx < 3 ? "danger" : "default"}
                glow={idx === 0}
                className="relative overflow-hidden"
              >
                {/* Number watermark */}
                <div
                  className="absolute top-0 right-4 font-bold pointer-events-none select-none"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "7rem",
                    color: idx < 3 ? C.red : C.ink,
                    opacity: idx < 3 ? 0.06 : 0.03,
                    lineHeight: 1,
                  }}
                >
                  {w.num}
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: idx < 3 ? "rgba(232,54,42,0.15)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${idx < 3 ? "rgba(232,54,42,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <w.icon size={26} style={{ color: idx < 3 ? C.red : C.ink, filter: idx < 3 ? `drop-shadow(0 0 8px rgba(232,54,42,0.4))` : "none" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                        style={{
                          backgroundColor: idx < 3 ? `${C.red}20` : "rgba(255,255,255,0.06)",
                          color: idx < 3 ? C.red : C.ink,
                          border: `1px solid ${idx < 3 ? `${C.red}30` : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        Weapon {w.num}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold mb-0.5"
                      style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
                    >
                      {w.title}
                    </h3>
                    <p className="text-sm font-medium mb-3" style={{ color: C.teal }}>
                      {w.subtitle}
                    </p>
                    <p className="text-base leading-relaxed mb-4" style={{ color: C.muted, lineHeight: 1.8 }}>
                      {w.desc}
                    </p>
                    <div
                      className="flex items-start gap-2 p-3 rounded-xl"
                      style={{
                        backgroundColor: "rgba(232,54,42,0.06)",
                        border: "1px solid rgba(200,22,26,0.06)",
                      }}
                    >
                      <Flame size={16} className="mt-0.5 shrink-0" style={{ color: C.ember, filter: "drop-shadow(0 0 4px rgba(232,54,42,0.3))" }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.ink }}>
                          {w.action}
                        </p>
                        {w.link && (
                          <Link
                            href={w.link}
                            className="text-sm font-bold mt-1 inline-flex items-center gap-1 hover:underline"
                            style={{ color: C.teal }}
                          >
                            Go <ArrowRight size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <PullQuote color={C.red}>
            &ldquo;You don&apos;t have to win the war in a day. You just have to make their economics worse every day until the system collapses.&rdquo;
          </PullQuote>
        </div>
      </section>

      {/* ═══ JOIN THE CRUSADE CTA ═══ */}
      <section
        className="relative px-5 py-16 md:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${C.sand} 0%, rgba(200,22,26,0.06) 50%, ${C.sand} 100%)`,
        }}
      >
        <EmberParticles count={40} color={C.ember} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,22,26,0.06) 0%, transparent 60%)" }}
        />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="mb-6">
            <Flame
              size={56}
              className="mx-auto"
              style={{
                color: C.red,
                filter: "drop-shadow(0 0 20px rgba(232,54,42,0.5))",
              }}
            />
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Fraunces', serif", color: C.ink }}
          >
            Join The Crusade
          </h2>
          <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: C.muted, lineHeight: 1.8 }}>
            Share this manifesto. Deploy the weapons. Report the spammers. Every action you take makes the economics of attention theft worse for the attacker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/attention-theft/report"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{
                backgroundColor: C.red,
                color: "#fff",
                boxShadow: `0 0 30px rgba(232,54,42,0.4)`,
              }}
            >
              <Megaphone size={18} /> Report A Spammer
            </Link>
            <Link
              href="/attention-theft"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.04)",
                color: C.ink,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              Read The Full Manifesto
            </Link>
          </div>
        </div>
      </section>
    </ManifestoLayout>
    </>);
}
