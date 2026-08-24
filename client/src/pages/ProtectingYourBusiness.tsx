/**
 * FRAUD REPORT: KRISTI KLAWITER — CONVICTED EMBEZZLER
 * Documented Case File — All Claims Sourced to Public Records
 * by Tony Greenberg
 *
 * Legal framework: Every factual claim cites a specific court case number,
 * police report, signed agreement, or direct correspondence. Opinion is
 * clearly labeled. No private identifying information (SSN, DOB, home
 * address) is published. Protected speech under the First Amendment as
 * a matter of public concern regarding documented fraud.
 */
import { useState } from "react";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";

const PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/kristi-klawiter-photo_99e64f14.jpeg";

const C = {
  bg: "#FAFAF7",
  white: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#4A4A4A",
  textLight: "#6B7280",
  // Deep purple accent palette
  red: "#4A1D6B",          // was #B91C1C — now deep purple (primary accent)
  redBg: "#F3EDF8",        // was #FEF2F2 — now light purple tint
  redBorder: "#D4B8EB",    // was #FECACA — now soft purple border
  redDark: "#2D1045",      // was #7F1D1D — now darkest purple
  // Olive secondary accents
  amber: "#556B2F",        // was #92400E — now dark olive
  amberBg: "#F5F7F0",      // was #FFFBEB — now light olive tint
  amberBorder: "#C5D4A0",  // was #FDE68A — now soft olive border
  green: "#3D5A1E",        // was #166534 — now forest olive
  greenBg: "#F0F4E8",      // was #F0FDF4 — now pale olive
  border: "#E5E7EB",
  borderDark: "#D1D5DB",
  cardBg: "#FFFFFF",
  badgeRed: "#5C2D82",     // was #DC2626 — now medium purple (badge)
  badgeAmber: "#6B7B3A",   // was #D97706 — now olive (badge)
  parchment: "#FAFAF7",
};

const F = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif",
  mono: "'DM Mono', 'Fira Code', 'Courier New', monospace",
  editorial: "'Playfair Display', 'Georgia', serif",
};

/* ═══════════════════════════════════════════════════════════
   SHARE COMPONENT
   ═══════════════════════════════════════════════════════════ */
function ShareButtons({ variant = "outline" }: { variant?: "outline" | "filled" }) {
  const url = typeof window !== "undefined" ? window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com") : "https://tonygreenberg.com/protecting-your-business";
  const text = "Convicted embezzler Kristi Klawiter stole $46,795 through 11 unauthorized invoices. Prior theft & forgery guilty pleas in NJ (Monmouth Co. 17-005347, Morris Co. 16-002436). Full documented case:";
  const isFilled = variant === "filled";
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { label: "𝕏 Post", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
        { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
        { label: "Email", href: `mailto:?subject=${encodeURIComponent("Convicted Embezzler: Kristi Klawiter — Documented Case File")}&body=${encodeURIComponent(text + "\n\n" + url)}` },
        { label: "Copy Link", href: "#" },
      ].map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.label === "Copy Link" || s.label === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          onClick={s.label === "Copy Link" ? (e) => { e.preventDefault(); navigator.clipboard.writeText(url); alert("Link copied."); } : undefined}
          style={{
            fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.08em",
            color: isFilled ? "#fff" : C.red, background: isFilled ? C.badgeRed : "transparent",
            padding: "0.5rem 1rem", borderRadius: "6px", textDecoration: "none",
            fontWeight: 600, border: `1.5px solid ${isFilled ? C.badgeRed : C.redBorder}`,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.badgeRed; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = isFilled ? C.badgeRed : "transparent"; e.currentTarget.style.color = isFilled ? "#fff" : C.red; }}
        >{s.label}</a>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════ */
function SectionHeader({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ scrollMarginTop: "72px", marginBottom: "1.5rem", marginTop: "3.5rem" }}>
      <div style={{
        fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.2em",
        color: C.red, textTransform: "uppercase", marginBottom: "0.4rem",
        fontWeight: 600,
      }}>{label}</div>
      <h2 style={{
        fontFamily: F.heading, fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
        fontWeight: 800, color: C.text, lineHeight: 1.25, margin: 0,
      }}>{children}</h2>
      <div style={{ width: "50px", height: "3px", background: C.red, marginTop: "0.75rem", borderRadius: "2px" }} />
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: F.body, fontSize: "1.1rem", lineHeight: 1.85,
      color: C.textMuted, marginBottom: "1.5rem", maxWidth: "65ch",
      textWrap: "pretty" as any,
    }}>{children}</p>
  );
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.redBg, border: `1px solid ${C.redBorder}`,
      borderLeft: `4px solid ${C.red}`, borderRadius: "8px",
      padding: "1.25rem 1.5rem", margin: "1.5rem 0",
      fontFamily: F.body, fontSize: "1.05rem", lineHeight: 1.8,
      color: C.redDark,
    }}>{children}</div>
  );
}

/** Clearly marks opinion vs. fact */
function OpinionBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.amberBg, border: `1px solid ${C.amberBorder}`,
      borderLeft: `4px solid ${C.badgeAmber}`, borderRadius: "8px",
      padding: "1.25rem 1.5rem", margin: "1.5rem 0",
    }}>
      <div style={{
        fontFamily: F.mono, fontSize: "0.6rem", letterSpacing: "0.2em",
        color: C.amber, textTransform: "uppercase", marginBottom: "0.5rem",
        fontWeight: 700,
      }}>Author's Opinion</div>
      <div style={{
        fontFamily: F.body, fontSize: "1.05rem", lineHeight: 1.8,
        color: C.amber,
        textWrap: "pretty" as any,
      }}>{children}</div>
    </div>
  );
}

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div style={{
      background: C.amberBg, border: `1px solid ${C.amberBorder}`,
      borderLeft: `4px solid ${C.badgeAmber}`, borderRadius: "8px",
      padding: "1.5rem 1.75rem", margin: "1.5rem 0",
    }}>
      <div style={{
        fontFamily: F.body, fontSize: "1.15rem", lineHeight: 1.75,
        color: C.amber, marginBottom: "0.75rem",
        textWrap: "pretty" as any,
      }}>"{quote}"</div>
      <div style={{
        fontFamily: F.mono, fontSize: "0.72rem", letterSpacing: "0.1em",
        color: C.amber, textTransform: "uppercase",
      }}>— {attribution}</div>
    </div>
  );
}

function NumberedItem({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <span style={{
        fontFamily: F.mono, fontSize: "0.75rem", color: "#fff",
        background: C.badgeRed, borderRadius: "50%",
        width: "32px", height: "32px", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, fontWeight: 700, marginTop: "2px",
      }}>{String(num).padStart(2, "0")}</span>
      <div style={{ minWidth: 0 }}>
        <h3 style={{
          fontFamily: F.heading, fontSize: "1.1rem", fontWeight: 700,
          color: C.text, marginBottom: "0.4rem",
        }}>{title}</h3>
        <div style={{
          fontFamily: F.body, fontSize: "1.05rem", lineHeight: 1.85, color: C.textMuted,
          textWrap: "pretty" as any,
        }}>{children}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: C.border, margin: "3rem 0" }} />;
}

function Badge({ children, color = C.badgeRed }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: F.mono, fontSize: "0.62rem", letterSpacing: "0.15em",
      textTransform: "uppercase", color: "#fff", background: color,
      padding: "0.3rem 0.65rem", borderRadius: "4px", fontWeight: 700,
    }}>{children}</span>
  );
}

/** Source citation inline — ties every claim to evidence */
function Source({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: F.mono, fontSize: "0.72rem", color: C.textLight,
      background: "rgba(0,0,0,0.04)", padding: "0.15rem 0.4rem",
      borderRadius: "3px", marginLeft: "0.25rem",
    }}>[{children}]</span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBMIT YOUR STORY FORM
   ═══════════════════════════════════════════════════════════ */
function SubmitStoryForm() {
  const [formData, setFormData] = useState({
    relationship: "",
    city: "",
    dateRange: "",
    promisedVsDelivered: "",
    receivedPayment: "no" as "yes" | "partial" | "no",
    amountOwed: "",
    hasDocumentation: "",
    willingToContact: false,
    contactEmail: "",
    howHeard: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.cheshire.submit.useMutation({
    onSuccess: () => { setSubmitted(true); setSubmitting(false); },
    onError: () => { setSubmitting(false); alert("Submission failed. Please try again."); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.promisedVsDelivered.length < 50) {
      alert("Please provide at least 50 characters describing what happened.");
      return;
    }
    setSubmitting(true);
    submitMutation.mutate({
      ...formData,
      contactEmail: formData.contactEmail || "",
    });
  };

  if (submitted) {
    return (
      <div style={{
        background: C.greenBg, border: `1px solid #BBF7D0`,
        borderRadius: "12px", padding: "2.5rem 2rem", textAlign: "center",
        margin: "2rem 0",
      }}>
        <div style={{
          fontFamily: F.heading, fontSize: "1.3rem", fontWeight: 700,
          color: C.green, marginBottom: "0.5rem",
        }}>Your story has been received.</div>
        <div style={{
          fontFamily: F.body, fontSize: "1rem", color: C.textMuted,
          lineHeight: 1.8, maxWidth: "45ch", margin: "0 auto",
          textWrap: "pretty" as any,
        }}>
          Every submission is reviewed personally. If you
          provided contact information, you may hear from
          us. Thank you for breaking the silence.
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.7rem 0.9rem",
    fontFamily: F.body, fontSize: "1rem",
    border: `1px solid ${C.border}`, borderRadius: "6px",
    background: C.white, outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: C.white, borderRadius: "12px", padding: "2rem",
      margin: "2rem 0", border: `1px solid ${C.border}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.2em",
        color: C.red, textTransform: "uppercase", marginBottom: "0.5rem",
        fontWeight: 600,
      }}>Submit Your Story</div>
      <div style={{
        fontFamily: F.heading, fontSize: "1.3rem", fontWeight: 700,
        color: C.text, marginBottom: "0.5rem",
      }}>Has This Happened to You?</div>
      <div style={{
        fontFamily: F.body, fontSize: "1rem", color: C.textMuted,
        lineHeight: 1.8, marginBottom: "1.5rem",
        textWrap: "pretty" as any,
      }}>
        If you have been defrauded by a contractor, employee,
        or business partner, your story matters. Anonymous
        submissions are accepted. All information is reviewed
        personally and kept confidential unless you
        authorize otherwise.
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
            Your relationship to the person *
          </label>
          <input
            required
            style={inputStyle}
            placeholder="e.g., Employer, Client, Business Partner"
            value={formData.relationship}
            onChange={e => setFormData(p => ({ ...p, relationship: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.red; }}
            onBlur={e => { e.target.style.borderColor = C.border; }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>City / State</label>
            <input
              style={inputStyle}
              placeholder="e.g., Santa Monica, CA"
              value={formData.city}
              onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = C.red; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
          </div>
          <div>
            <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>Date Range</label>
            <input
              style={inputStyle}
              placeholder="e.g., Jan 2024 – Jun 2024"
              value={formData.dateRange}
              onChange={e => setFormData(p => ({ ...p, dateRange: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = C.red; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
            What happened? What was promised vs. what was delivered? *
          </label>
          <textarea
            required
            minLength={50}
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Describe the situation in detail. What were you promised? What actually happened? Include amounts, dates, and any documentation you have. (Minimum 50 characters)"
            value={formData.promisedVsDelivered}
            onChange={e => setFormData(p => ({ ...p, promisedVsDelivered: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.red; }}
            onBlur={e => { e.target.style.borderColor = C.border; }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
              Were you paid what was owed? *
            </label>
            <select
              required
              style={inputStyle}
              value={formData.receivedPayment}
              onChange={e => setFormData(p => ({ ...p, receivedPayment: e.target.value as any }))}
            >
              <option value="no">No</option>
              <option value="partial">Partially</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>Amount Owed</label>
            <input
              style={inputStyle}
              placeholder="e.g., $15,000"
              value={formData.amountOwed}
              onChange={e => setFormData(p => ({ ...p, amountOwed: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = C.red; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
            Do you have documentation? (invoices, emails, contracts)
          </label>
          <input
            style={inputStyle}
            placeholder="e.g., Yes — emails, signed contract, bank records"
            value={formData.hasDocumentation}
            onChange={e => setFormData(p => ({ ...p, hasDocumentation: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.red; }}
            onBlur={e => { e.target.style.borderColor = C.border; }}
          />
        </div>

        <div>
          <label style={{ fontFamily: F.mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textLight, textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
            Contact email (optional — for follow-up only)
          </label>
          <input
            type="email"
            style={inputStyle}
            placeholder="your@email.com"
            value={formData.contactEmail}
            onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.red; }}
            onBlur={e => { e.target.style.borderColor = C.border; }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={formData.willingToContact}
            onChange={e => setFormData(p => ({ ...p, willingToContact: e.target.checked }))}
            style={{ accentColor: C.red }}
          />
          <label style={{ fontFamily: F.body, fontSize: "0.95rem", color: C.textMuted }}>
            I am willing to be contacted about this submission
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            fontFamily: F.mono, fontSize: "0.78rem", letterSpacing: "0.12em",
            textTransform: "uppercase", fontWeight: 700,
            color: "#fff", background: submitting ? C.textLight : C.badgeRed,
            padding: "0.85rem 2rem", borderRadius: "6px",
            border: "none", cursor: submitting ? "not-allowed" : "pointer",
            transition: "all 0.2s", marginTop: "0.5rem",
          }}
          onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.redDark; }}
          onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = C.badgeRed; }}
        >
          {submitting ? "Submitting..." : "Submit Your Story"}
        </button>
      </div>

      <div style={{
        fontFamily: F.mono, fontSize: "0.65rem", color: C.textLight,
        marginTop: "1rem", lineHeight: 1.7,
        textWrap: "pretty" as any,
      }}>
        All submissions are confidential. Anonymous submissions
        are accepted. Your story will not be published without
        your explicit written consent. We are not attorneys and
        this is not legal advice.
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   TABLE OF CONTENTS
   ═══════════════════════════════════════════════════════════ */
const TOC = [
  { id: "case", label: "The Case" },
  { id: "timeline", label: "Timeline" },
  { id: "manipulation", label: "The Playbook" },
  { id: "red-flags", label: "10 Red Flags" },
  { id: "damage", label: "The Real Cost" },
  { id: "background-checks", label: "Background Checks" },
  { id: "protection", label: "12-Point Checklist" },
  { id: "tools", label: "Prevention Tools" },
  { id: "reporting", label: "Report Fraud" },
  { id: "why-this-exists", label: "Why I Published This" },
  { id: "path-to-removal", label: "Path to Removal" },
  { id: "submit", label: "Submit Your Story" },
  { id: "reading", label: "Further Reading" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ProtectingYourBusiness() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ═══ STICKY NAV BAR ═══ */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.25rem", height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: C.badgeRed, animation: "pulse 2s infinite",
          }} />
          <span style={{
            fontFamily: F.mono, fontSize: "0.72rem", letterSpacing: "0.15em",
            color: C.red, textTransform: "uppercase", fontWeight: 700,
          }}>Convicted Embezzler — Public Record</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none", border: `1.5px solid ${C.border}`,
            color: C.textMuted, fontFamily: F.mono, fontSize: "0.7rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.45rem 0.9rem", borderRadius: "6px", cursor: "pointer",
          }}
        >
          {menuOpen ? "Close" : "Sections"}
        </button>
      </div>

      {/* ═══ SECTION MENU OVERLAY ═══ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <nav style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{
              fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.25em",
              color: C.red, marginBottom: "2rem", textTransform: "uppercase",
            }}>Case File Sections</div>
            {TOC.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", fontFamily: F.heading, fontSize: "1.15rem",
                  fontWeight: 600, color: C.textMuted, textDecoration: "none",
                  padding: "0.65rem 2rem", transition: "color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.red; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; }}
              >
                <span style={{ fontFamily: F.mono, fontSize: "0.65rem", marginRight: "0.75rem", color: C.red }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <SEO
        title="Convicted Embezzler Kristi Klawiter — $46,795 Stolen, Prior NJ Guilty Pleas"
        description="Kristi Klawiter, convicted of theft and forgery in New Jersey (Monmouth County 17-005347, Morris County 16-002436), embezzled $46,795 through 11 unauthorized invoices. Full documented case with court records, FBI report, and signed admissions."
        path="/protecting-your-business"
        image="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/klawiter-og-image-Ay33ChnmKwrEZ69NtktCJB.png"
        type="article"
        publishDate="2026-04-13"
        author="Tony Greenberg"
        category="Fraud Report"
        keywords="Kristi Klawiter, Kristi Klawiter convicted, Kristi Klawiter embezzlement, Kristi Klawiter fraud, Kristi Klawiter theft, Kristi Klawiter forgery, Kristi Klawiter guilty plea, Kristi Klawiter criminal record, Kristi Klawiter New Jersey, Kristi Klawiter Kris Management, Kristi Klawiter Asbury NJ, Kristi Klawiter Braintrust, Kristi Klawiter Monmouth County, Kristi Klawiter Morris County, Kris Management LLC fraud, embezzlement case study, contractor fraud, invoice fraud, convicted embezzler, business fraud, fraud red flags, con artist, small business embezzlement, Kristi Klawiter conviction, Kristi Klawiter restitution"
        indexable={true}
      />

      {/* ═══ ANIMATIONS ═══ */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800;900&display=swap');
      `}</style>

      {/* ═══════════════════════════════════════════════════════
         HERO — CONVICTED EMBEZZLER LABEL ON PHOTO
         ═══════════════════════════════════════════════════════ */}
      <div style={{ paddingTop: "56px" }}>
        <div style={{
          maxWidth: "920px", margin: "0 auto", padding: "2.5rem 1.5rem 2rem",
        }}>
          {/* FRAUD ALERT BANNER */}
          <div style={{
            background: C.redBg, color: C.red, textAlign: "center",
            padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "2rem",
            fontFamily: F.mono, fontSize: "0.72rem", letterSpacing: "0.2em",
            textTransform: "uppercase", fontWeight: 700,
            border: `1px solid ${C.redBorder}`,
          }}>
            Documented Fraud Case — Court Records &amp; Guilty Pleas on File
          </div>

          {/* ── PERSUASIVE TITLE ── */}
          <h1 style={{
            fontFamily: F.editorial, fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900, color: C.text, lineHeight: 1.12,
            textAlign: "center", marginBottom: "0.75rem",
            maxWidth: "720px", margin: "0 auto 0.75rem",
            textWrap: "balance" as any,
          }}>
            She Had Two Theft Convictions. I Hired
            Her Anyway. She Stole $46,795.
          </h1>
          <p style={{
            fontFamily: F.body, fontSize: "1.15rem", lineHeight: 1.7,
            color: C.textMuted, textAlign: "center",
            maxWidth: "600px", margin: "0 auto 2rem",
            textWrap: "pretty" as any,
          }}>
            The documented case of Kristi Klawiter — convicted
            of theft and forgery in New Jersey, hired through
            Braintrust, and caught submitting 11 unauthorized
            invoices. This is the record I wish someone had
            published before I wrote the check.
          </p>

          {/* SUBJECT CARD */}
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
            borderRadius: "12px", overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            {/* Photo + Name row */}
            <div style={{
              display: "flex", flexWrap: "wrap", alignItems: "stretch",
            }}>
              {/* PHOTO — WITH CONVICTED EMBEZZLER LABEL */}
              <div style={{
                width: "300px", minHeight: "340px", flexShrink: 0,
                position: "relative", overflow: "hidden",
                background: "#f3f4f6",
              }}>
                <img
                  src={PHOTO}
                  alt="Kristi Klawiter — Convicted of theft and forgery in New Jersey, documented embezzler"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* CONVICTED EMBEZZLER LABEL */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  background: "rgba(185,28,28,0.92)", backdropFilter: "blur(4px)",
                  padding: "0.6rem 0.8rem",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: F.mono, fontSize: "0.82rem", letterSpacing: "0.25em",
                    textTransform: "uppercase", fontWeight: 800,
                    color: "#fff",
                  }}>Convicted Embezzler</div>
                  <div style={{
                    fontFamily: F.mono, fontSize: "0.58rem", letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.8)", marginTop: "0.15rem",
                  }}>NJ Guilty Pleas: Theft &amp; Forgery</div>
                </div>
              </div>

              {/* INFO PANEL */}
              <div style={{
                flex: 1, minWidth: "280px", padding: "2rem 2rem",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <h2 style={{
                  fontFamily: F.heading, fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
                  fontWeight: 900, color: C.text, lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}>
                  Kristi Klawiter
                </h2>
                <div style={{
                  fontFamily: F.mono, fontSize: "0.75rem", letterSpacing: "0.1em",
                  color: C.textLight, marginBottom: "1.25rem",
                }}>
                  Kris Management, LLC &bull; Asbury, NJ
                </div>

                {/* CHARGES */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  <Badge>Convicted — Theft</Badge>
                  <Badge>Convicted — Forgery</Badge>
                  <Badge>Embezzlement</Badge>
                  <Badge color={C.badgeAmber}>Guilty Pleas on Record</Badge>
                </div>

                {/* KEY FACTS */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
                }}>
                  {[
                    { label: "Amount Stolen", value: "$46,795", highlight: true, source: "Braintrust invoices" },
                    { label: "Recovered", value: "$20,000", highlight: false, source: "Bank records" },
                    { label: "Outstanding", value: "$26,795+", highlight: true, source: "Promissory note" },
                    { label: "Unauthorized Invoices", value: "11", highlight: false, source: "Platform records" },
                    { label: "Prior NJ Cases", value: "2 Guilty Pleas", highlight: false, source: "17-005347, 16-002436" },
                    { label: "FBI Report", value: "Filed", highlight: false, source: "IC3 submission" },
                  ].map((f) => (
                    <div key={f.label}>
                      <div style={{
                        fontFamily: F.mono, fontSize: "0.6rem", letterSpacing: "0.15em",
                        color: C.textLight, textTransform: "uppercase",
                      }}>{f.label}</div>
                      <div style={{
                        fontFamily: F.heading, fontSize: "1.15rem", fontWeight: 700,
                        color: f.highlight ? C.red : C.text,
                      }}>{f.value}</div>
                      <div style={{
                        fontFamily: F.mono, fontSize: "0.55rem", color: C.textLight,
                        marginTop: "0.1rem",
                      }}>Source: {f.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CASE SUMMARY BAR */}
            <div style={{
              background: C.redBg, borderTop: `1px solid ${C.redBorder}`,
              padding: "1.25rem 2rem",
            }}>
              <div style={{
                fontFamily: F.body, fontSize: "1rem", lineHeight: 1.8, color: C.redDark,
                textWrap: "pretty" as any,
              }}>
                Eleven unauthorized invoices. $46,795 stolen. A promissory note
                signed and broken. Two prior guilty pleas in New Jersey. An FBI
                wire fraud report on file. This is not an allegation. This is
                a paper trail.
              </div>
            </div>
          </div>

          {/* SHARE BAR */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <div style={{
              fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.2em",
              color: C.red, textTransform: "uppercase", marginBottom: "0.75rem",
              fontWeight: 600,
            }}>Share This — The Next Employer Deserves to Know</div>
            <ShareButtons />
          </div>

          {/* BYLINE */}
          <div style={{
            textAlign: "center", marginTop: "1.5rem", paddingBottom: "1rem",
            fontFamily: F.mono, fontSize: "0.72rem", letterSpacing: "0.1em",
            color: C.textLight,
          }}>
            Documented by Tony Greenberg &bull; April 2026 &bull; Updated Continuously
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         MAIN CONTENT
         ═══════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>

        {/* ── A NOTE ON EMBARRASSMENT ── */}
        <div style={{
          background: C.amberBg, border: `1px solid ${C.amberBorder}`,
          borderRadius: "10px", padding: "1.5rem 1.75rem", margin: "0 0 2.5rem",
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.2em",
            color: C.amber, textTransform: "uppercase", marginBottom: "0.5rem",
            fontWeight: 700,
          }}>A Note From the Author</div>
          <div style={{
            fontFamily: F.body, fontSize: "1.1rem", lineHeight: 1.75,
            color: C.amber, fontWeight: 500,
            textWrap: "pretty" as any,
          }}>
            I got taken. Twenty-five years in enterprise technology,
            $10 billion benchmarked, and a woman with two theft
            convictions walked through my door and I handed her the
            keys. The duty to warn you is bigger than my ego. If I
            stay quiet, the next victim is on me.
          </div>
        </div>

        {/* ── SECTION 1: THE CASE ── */}
        <SectionHeader id="case" label="Section 01">The Case Against
          Kristi Klawiter</SectionHeader>

        <Para>
          In May 2025, <strong style={{ color: C.text }}>Kristi Klawiter</strong> was
          hired through Braintrust as a remote operations contractor.
          <Source>Braintrust contract records</Source> She presented
          Kris Management, LLC and references that checked out on
          the surface. She was good at this. That is, after all,
          what convicted forgers do.
        </Para>
        <Para>
          Over five months she submitted <strong style={{ color: C.red }}>11
          unauthorized invoices</strong> totaling <strong style={{ color: C.red }}>$46,795</strong>,
          each structured below approval thresholds and timed to
          periods of high activity.
          <Source>Braintrust payment records</Source> This was not
          impulsive. This was architecture.
        </Para>
        <Para>
          Confronted with the evidence, she returned <strong
          style={{ color: C.text }}>$20,000</strong><Source>Bank transfer records</Source> and
          then stopped. She signed a promissory note for the
          remaining $26,795<Source>Signed promissory note, Nov 2025</Source> and
          immediately defaulted. The promissory note, it turned out,
          was just another forgery — of good faith.
        </Para>
        <Para>
          <strong style={{ color: C.text }}>What a courthouse search
          would have revealed:</strong> prior guilty pleas for theft
          and forgery in New Jersey — Monmouth County 17-005347 and
          Morris County 16-002436. Three years probation.
          Court-ordered restitution at $300 per month.
          <Source>NJ court records</Source> She never disclosed them.
          I never found them. That is the $75 background check I
          did not run.
        </Para>

        <OpinionBox>
          The pattern — prior convictions, structured invoices
          below detection thresholds, fabricated justifications,
          signed-then-broken promises — suggests a deliberate,
          practiced methodology. Reasonable people can draw their
          own conclusions from the documented record.
        </OpinionBox>

        <Divider />

        {/* ── SECTION 2: TIMELINE ── */}
        <SectionHeader id="timeline" label="Section 02">Chronological Timeline:
          Every Date, Every Document</SectionHeader>

        <div style={{ position: "relative", paddingLeft: "2rem", marginBottom: "2rem" }}>
          <div style={{
            position: "absolute", left: "8px", top: 0, bottom: 0, width: "2px",
            background: `linear-gradient(180deg, ${C.red}, ${C.badgeAmber}, ${C.border})`,
          }} />

          {[
            { date: "2016\u20132019", event: "Guilty pleas: theft (Monmouth Co. 17-005347) and forgery (Morris Co. 16-002436). Three years probation, $300/month restitution.", badge: "Convicted", source: "NJ court records" },
            { date: "May 2025", event: "Hired through Braintrust. Presented Kris Management, LLC. No disclosure of criminal history.", badge: "Hired", source: "Braintrust contract" },
            { date: "May\u2013Oct 2025", event: "Submitted 11 unauthorized invoices totaling $46,795, structured below approval thresholds.", badge: "Theft", source: "Braintrust payment records" },
            { date: "Oct 2025", event: "Irregularities discovered in routine financial review. Confronted with evidence.", badge: "Caught", source: "Internal audit" },
            { date: "Nov 2025", event: "Returned $20,000. Signed promissory note for remaining $26,795.", badge: "Partial Return", source: "Bank records; signed note" },
            { date: "Nov 2025\u2013Apr 2026", event: "Systematic default. Missed payments, hardship claims, wrong-account excuses.", badge: "Default", source: "Correspondence records" },
            { date: "Early 2026", event: "FBI IC3 report filed. Santa Monica PD report filed. Braintrust and Upwork notified.", badge: "FBI Report", source: "IC3 filing; SMPD report" },
            { date: "Apr 13, 2026", event: "Email promising payment within 48 hours. No payment received.", badge: "Broken Promise", source: "Email correspondence" },
            { date: "Apr 2026", event: "Subsequent employer contacted and warned.", badge: "Employer Warned", source: "Correspondence records" },].map((item, i) => (
            <div key={i} style={{
              position: "relative", marginBottom: "1.75rem", paddingLeft: "1.5rem",
            }}>
              <div style={{
                position: "absolute", left: "-2rem", top: "4px", width: "18px", height: "18px",
                borderRadius: "50%", background: C.white, border: `2.5px solid ${C.red}`, zIndex: 1,
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: F.mono, fontSize: "0.72rem", letterSpacing: "0.1em",
                  color: C.amber, textTransform: "uppercase", fontWeight: 600,
                }}>{item.date}</span>
                <Badge>{item.badge}</Badge>
              </div>
              <div style={{
                fontFamily: F.body, fontSize: "1.02rem", lineHeight: 1.8, color: C.textMuted,
                textWrap: "pretty" as any,
              }}>{item.event}</div>
              <div style={{
                fontFamily: F.mono, fontSize: "0.6rem", color: C.textLight,
                marginTop: "0.25rem",
              }}>Source: {item.source}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── SECTION 3: MANIPULATION PLAYBOOK ── */}
        <SectionHeader id="manipulation" label="Section 03">The Playbook:
          What She Did When She Got Caught</SectionHeader>

        <Para>
          Every business owner who catches a thief will face
          the same script. Knowing the playbook in advance is
          worth more than any background check. The following
          tactics are documented in emails, text messages, and
          recorded conversations.<Source>Correspondence archive</Source>
        </Para>

        <QuoteBlock
          quote="I have a husband and children who depend on me. If you pursue this, you will be destroying an entire family."
          attribution="Kristi Klawiter, in written correspondence after being confronted with evidence of 11 unauthorized invoices (Source: email correspondence, Oct 2025). The existence of this family has not been independently verified."
        />

        <NumberedItem num={1} title="The Fabricated Family">
          Klawiter immediately invoked a husband and children whose
          existence has not been independently confirmed.<Source>Email
          correspondence</Source> Brilliant, in the way a pickpocket's
          misdirection is brilliant. You are suddenly defending yourself
          for wanting your own money back.
        </NumberedItem>

        <NumberedItem num={2} title="Mental Illness as a Shield">
          Klawiter claimed mental health struggles not as genuine
          vulnerability but as a tactical shield.<Source>Text
          messages</Source> The message: "if you hold me accountable,
          you are punishing someone who is mentally ill." The
          emotional equivalent of a human shield.
        </NumberedItem>

        <QuoteBlock
          quote="If you don't stop, I don't know what I'll do to myself."
          attribution="Kristi Klawiter, in a message sent after being informed that legal proceedings would move forward (Source: text message, Nov 2025). This is documented emotional blackmail designed to halt accountability."
        />

        <NumberedItem num={3} title="Self-Harm Threats as Leverage">
          The most dangerous tactic: threatening self-harm to halt
          accountability.<Source>Text message, Nov 2025</Source>
          The correct response, and the one I followed: contact
          emergency services (988 Suicide &amp; Crisis Lifeline) and
          continue your legal process. You are not a therapist.
          You are a fraud victim. Those are different jobs.
        </NumberedItem>

        <NumberedItem num={4} title="The Perpetual Payment Promise">
          "I'll have a plan within 48 hours." "The money was sent
          to the wrong account." "I'm working on it."
          <Source>Email correspondence, Nov 2025\u2013Apr 2026</Source>{" "}
          The promissory note she signed was itself a tactic: the
          appearance of good faith from someone with no intention
          of honoring it. Not once. Not partially. Not ever.
        </NumberedItem>

        <NumberedItem num={5} title="Performed Remorse Without Restitution">
          She cried. She apologized.<Source>Recorded conversation</Source>
          What she did not do is return the money. A useful heuristic
          I learned the expensive way: genuine remorse arrives with
          a cashier's check. Performed remorse arrives with tears
          and a request for more time.
        </NumberedItem>

        <NumberedItem num={6} title="Identity Obfuscation Across Platforms">
          Kris Management, LLC in Florida. Criminal records in
          New Jersey. Profiles on Braintrust, Upwork, LinkedIn,
          and 9am.works \u2014 each with a slightly different
          professional history.<Source>Platform profile records</Source>
          Deliberate obfuscation, in my opinion, designed to
          prevent employers from connecting the dots. It worked on me.
        </NumberedItem>

        <AlertBox>
          <strong>The six-month pattern:</strong> fabricate sympathy,
          weaponize vulnerability, promise payment, delay indefinitely,
          hope the victim gives up. I did not.
        </AlertBox>

        <Divider />

        {/* ── SECTION 4: 10 RED FLAGS ── */}
        <SectionHeader id="red-flags" label="Section 04">10 Ways to Spot a Thief
          Before They Spot Your Checkbook</SectionHeader>

        <Para>
          Every one of these appeared in this case. Field notes
          from a man who missed all ten. If you see three or more,
          stop everything and audit immediately.
        </Para>

        {[
          { title: "They Deflect Interview Questions to Reconnaissance", text: "Instead of answering questions about qualifications, they redirect to learn about your financial systems, approval workflows, and who signs off on payments. They are not interviewing for a job. They are casing the joint." },
          { title: "Vague Deliverables, Impressive Titles", text: "\"Strategic operations,\" \"growth infrastructure\" — but when you ask what they actually delivered, the answers dissolve into generalities. Thieves need ambiguity the way fish need water." },
          { title: "Suspicious Availability and Eagerness", text: "Available immediately. Flexible on rate. No competing offers. Legitimate professionals have schedules and market-rate expectations. Desperation to access your systems is not flattering. It is diagnostic." },
          { title: "References That Only Exist on Their Own List", text: "Every reference is someone they chose. None verifiable through independent channels. Real professionals leave footprints that do not require their permission to find." },
          { title: "Fast Moves Toward Financial Access", text: "Within weeks, asking for login credentials, payment platform access, or direct invoice submission. Framed as efficiency — actually removing barriers between them and your money. Efficiency is a wonderful word for theft." },
          { title: "Contract Language They Introduced That Is Not in the Agreement", text: "They reference terms that do not appear in the signed contract. \"Discussed verbally\" or \"understood.\" If it is not in writing, it does not exist. This is not legal advice. This is arithmetic." },
          { title: "Performed Remorse vs. Genuine Accountability", text: "When caught, they cry and invoke personal hardship. What they do not do is immediately return the money. I have now learned the difference between these two things. It cost me $46,795 in tuition." },
          { title: "The Repayment Plan as an Escape Hatch", text: "They propose a repayment plan — then default. The plan itself is the strategy. It buys time and convinces the victim to delay legal action. I fell for this. You do not have to." },
          { title: "Absence of Time Tracking and Documentation", text: "They resist any system that creates a verifiable record. No time tracking, no project management tool, no status reports. They need the gap between promise and delivery to be unmeasurable." },
          { title: "The Prior History Someone Stayed Quiet About", text: "A prior criminal record for theft and forgery. A previous employer who discovered the same behavior but chose not to prosecute. The pattern repeats because no one breaks the silence. I am breaking it now." },
        ].map((item, i) => (
          <NumberedItem key={i} num={i + 1} title={item.title}>{item.text}</NumberedItem>
        ))}

        <Divider />

        {/* ── SECTION 5: DOWNSTREAM DAMAGE ── */}
        <SectionHeader id="damage" label="Section 05">The Real Cost:
          It Is Never Just the Money</SectionHeader>

        <Para>
          $46,795 is the headline number. The real cost includes
          everything that breaks downstream when someone detonates
          a fraud bomb inside your business.
        </Para>

        <div style={{
          background: C.white, borderRadius: "10px", padding: "1.5rem",
          margin: "1.5rem 0", border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          {[
            { label: "Direct theft (11 unauthorized invoices)", amount: "$46,795", color: C.red, source: "Braintrust records" },
            { label: "Recovered (partial restitution)", amount: "($20,000)", color: C.green, source: "Bank records" },
            { label: "Net outstanding principal", amount: "$26,795", color: C.red, source: "Promissory note" },
            { label: "Contractual interest (1.5%/mo, ~6 months)", amount: "~$2,400", color: C.red, source: "Note terms" },
            { label: "Legal fees (filing, correspondence, collections)", amount: "$5,000–$15,000", color: C.amber, source: "Estimate" },
            { label: "Platform dispute resolution time", amount: "40+ hours", color: C.amber, source: "Internal records" },
            { label: "Credit disruption (Amex relationship impact)", amount: "Unquantifiable", color: C.textLight, source: "" },
            { label: "Management distraction and emotional cost", amount: "Unquantifiable", color: C.textLight, source: "" },
            { label: "Opportunity cost of diverted attention", amount: "Unquantifiable", color: C.textLight, source: "" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "0.7rem 0",
              borderBottom: i < 8 ? `1px solid ${C.border}` : "none",
              fontFamily: F.body, fontSize: "1rem", color: C.textMuted,
            }}>
              <span>{item.label}</span>
              <span style={{
                fontFamily: F.mono, fontSize: "0.88rem", color: item.color, fontWeight: 600,
              }}>{item.amount}</span>
            </div>
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            padding: "1rem 0 0", marginTop: "0.5rem",
            borderTop: `2px solid ${C.red}`,
            fontFamily: F.heading, fontSize: "1.1rem", color: C.text, fontWeight: 700,
          }}>
            <span>Estimated total cost of doing nothing</span>
            <span style={{ color: C.red }}>$46,795+</span>
          </div>
        </div>

        <OpinionBox>
          The money is recoverable in theory. The six months of
          distraction, the erosion of trust in your own judgment,
          the conversations you did not have because you were
          dealing with a thief \u2014 those do not come back.
        </OpinionBox>

        <Divider />

        {/* ── SECTION 6: BACKGROUND CHECKS ── */}
        <SectionHeader id="background-checks" label="Section 06">The $75 Background Check
          I Did Not Run</SectionHeader>

        <Para>
          Standard background checks search databases, not
          courthouses. Many courts \u2014 especially in New Jersey,
          where Klawiter's convictions were filed \u2014 do not report
          automatically.<Source>Industry documentation</Source>
          The database said she was fine. The courthouse said
          she was not.
        </Para>

        <div style={{
          background: C.white, borderRadius: "10px", padding: "1.5rem",
          margin: "1.5rem 0", border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.2em",
            color: C.red, textTransform: "uppercase", marginBottom: "1rem",
            fontWeight: 600,
          }}>Required Checks for Anyone Who Touches Your Money</div>
          {[
            "Multi-state criminal court record search (actual courthouse records, not databases)",
            "Civil judgment search across all relevant jurisdictions",
            "Employment gap verification — call every employer, not just the ones they list",
            "License and credential verification for any claimed certifications",
            "Platform history verification — Braintrust, Upwork, Fiverr for flags or disputes",
            "Network reference calls — people who worked with them that they did NOT provide",
            "Social media and public records cross-reference for inconsistencies",
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
              marginBottom: "0.7rem", fontFamily: F.body, fontSize: "1rem",
              lineHeight: 1.8, color: C.textMuted,
            }}>
              <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <AlertBox>
          <strong>The arithmetic:</strong> Cost of a thorough
          background check: $75 to $200. Cost of not running one:
          $46,795. I am not a mathematician, but I can do
          this particular calculation now.
        </AlertBox>

        {/* Background Check Comparison Table */}
        <div style={{ overflowX: "auto", margin: "1.5rem 0", borderRadius: "10px", border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.body, fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: C.redBg }}>
                {["Service", "Price", "Court Records", "Best For"].map(h => (
                  <th key={h} style={{
                    padding: "0.8rem 1rem", textAlign: "left", color: C.red,
                    fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.12em",
                    textTransform: "uppercase", borderBottom: `1px solid ${C.redBorder}`,
                    fontWeight: 700,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Checkr Pro", "$75–$200", "Yes — multi-state", "Tech companies"],
                ["Sterling", "$80–$200", "Yes — comprehensive", "Enterprise"],
                ["HireRight", "$50–$150", "Yes — county-level", "Mid-market"],
                ["GoodHire", "$30–$100", "Database + county add-on", "Small business"],
                ["BeenVerified", "$1–$30", "Database only", "Preliminary only"],
                ["CourtDirect", "$15–$50/county", "Direct courthouse", "Targeted searches"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.bg }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "0.7rem 1rem", color: C.textMuted,
                      borderBottom: `1px solid ${C.border}`,
                      fontWeight: j === 0 ? 600 : 400,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Divider />

        {/* ── SECTION 7: 12-POINT CHECKLIST ── */}
        <SectionHeader id="protection" label="Section 07">The 12-Point Checklist
          I Built After Getting Robbed</SectionHeader>

        {[
          { phase: "Before You Hire", items: [
            "Run a multi-state criminal background check through a service that searches actual courthouse records — not databases.",
            "Verify employment history independently — call the companies, not just the references they provide.",
            "Search court records in every state where they have lived for civil judgments, liens, and bankruptcies.",
            "Check freelance platform histories for disputes, flags, or account terminations.",
          ]},
          { phase: "Ongoing Financial Controls", items: [
            "Require dual approval for all invoices above $500. (I did not have this. Now I do.)",
            "Use a financial control platform (Ramp, Brex, Bill.com) that creates an automatic audit trail.",
            "Mandate time tracking with a tool that logs hours against specific deliverables.",
            "Run monthly reconciliation of all contractor invoices against approved scope of work.",
          ]},
          { phase: "Response and Recovery", items: [
            "Document everything immediately — screenshots, emails, invoices — before the person knows you are investigating.",
            "File reports with all relevant authorities: FBI IC3, local police, state AG, and platforms involved.",
            "Notify the person's subsequent employer — silence enables repetition. (This is the hard one. Do it anyway.)",
            "Consult an attorney about civil recovery options including promissory notes and wage garnishment.",
          ]},
        ].map((section) => (
          <div key={section.phase}>
            <div style={{
              fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.2em",
              color: C.red, textTransform: "uppercase", margin: "1.5rem 0 1rem",
              fontWeight: 600,
            }}>{section.phase}</div>
            {section.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.75rem",
                marginBottom: "0.85rem", fontFamily: F.body, fontSize: "1.02rem",
                lineHeight: 1.8, color: C.textMuted,
              }}>
                <span style={{ color: C.red, fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}>&#9744;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}

        <Divider />

        {/* ── SECTION 8: TOOLS ── */}
        <SectionHeader id="tools" label="Section 08">Prevention Tools vs.
          the Cost of Trusting the Wrong Person</SectionHeader>

        <div style={{ overflowX: "auto", margin: "1.5rem 0", borderRadius: "10px", border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F.body, fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: C.redBg }}>
                {["Tool", "Category", "Cost", "Prevents"].map(h => (
                  <th key={h} style={{
                    padding: "0.8rem 1rem", textAlign: "left", color: C.red,
                    fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.12em",
                    textTransform: "uppercase", borderBottom: `1px solid ${C.redBorder}`,
                    fontWeight: 700,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Ramp", "Expense mgmt", "$0 (free)", "Unauthorized spending"],
                ["Brex", "Corporate cards", "$0–$12/user", "Uncontrolled spending"],
                ["Bill.com", "AP automation", "$45+/mo", "Invoice manipulation"],
                ["Clockify", "Time tracking", "$0 (free)", "Phantom hours"],
                ["1Password", "Credentials", "$8/user/mo", "Unauthorized access"],
                ["Checkr", "Background checks", "$30–$200", "Hiring convicted forgers"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.bg }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "0.7rem 1rem", color: C.textMuted,
                      borderBottom: `1px solid ${C.border}`,
                      fontWeight: j === 0 ? 600 : 400,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          background: C.white, borderRadius: "10px", padding: "1.5rem",
          margin: "1.5rem 0", textAlign: "center", border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontFamily: F.mono, fontSize: "0.68rem", letterSpacing: "0.2em", color: C.red, textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 600 }}>The Math</div>
          <div style={{ fontFamily: F.heading, fontSize: "1.3rem", color: C.text }}>
            Annual cost of every prevention tool: <strong style={{ color: C.green }}>~$3,600</strong>
          </div>
          <div style={{ fontFamily: F.body, fontSize: "1rem", color: C.textLight, marginTop: "0.3rem" }}>
            Cost of one convicted embezzler who got past the door: <strong style={{ color: C.red }}>$46,795+</strong>
          </div>
        </div>

        <Divider />

        {/* ── SECTION 9: REPORTING ── */}
        <SectionHeader id="reporting" label="Section 09">Where to
          Report Fraud</SectionHeader>

        <Para>
          File everywhere. No single agency will solve it \u2014 but
          the cumulative paper trail makes it impossible for the
          next employer to miss.
        </Para>

        <div style={{ marginBottom: "1.5rem" }}>
          {[
            { name: "FBI Internet Crime Complaint Center (IC3)", url: "https://www.ic3.gov/", note: "Interstate wire fraud, online fraud, cyber-enabled financial crimes" },
            { name: "Local Police Department", url: "", note: "File in the jurisdiction where fraud occurred — creates a case number for civil recovery" },
            { name: "State Attorney General", url: "https://www.usa.gov/state-attorney-general", note: "Consumer protection — pattern fraud complaints trigger investigations" },
            { name: "ACFE", url: "https://www.acfe.com/", note: "Resources for documenting and investigating workplace fraud" },
            { name: "Platform Fraud Reporting", url: "", note: "Report to Braintrust, Upwork, etc. — they maintain internal fraud databases" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "0.85rem 0",
              borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ fontFamily: F.heading, fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                    color: C.text, textDecoration: "underline", textDecorationColor: C.red,
                    textUnderlineOffset: "3px",
                  }}>{item.name}</a>
                ) : item.name}
              </div>
              <div style={{ fontFamily: F.body, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.7 }}>{item.note}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── SECTION 10: WHY THIS EXISTS ── */}
        <SectionHeader id="why-this-exists" label="Section 10">Why I Published This
          (And Why It Was Hard)</SectionHeader>

        <Para>
          My first instinct was to absorb the loss quietly. That is
          what most business owners do. But the next company that
          hires Kristi Klawiter without knowing her history will
          lose money too. And they will ask: <strong style={{ color: C.text }}>did
          anyone know? Did anyone try to warn us?</strong>
        </Para>

        <AlertBox>
          You are complicit if you do not take people to the mat.
          As a business owner. As a human. As everything. Karma-wise,
          you are allowing others to get hurt. I am a protector
          by nature. You can be too.
        </AlertBox>

        <Para>
          <strong style={{ color: C.text }}>RampRate is a Certified
          B Corporation</strong>.<Source>B Lab certification</Source>
          In 25 years, we have <strong style={{ color: C.text }}>never
          sued anyone and never been sued</strong>. This article is
          not litigation \u2014 it is documentation.
        </Para>

        <OpinionBox>
          "Let it go, write it off, move on." That instinct
          protects your ego but endangers everyone who comes
          after you. I chose embarrassment over complicity.
        </OpinionBox>

        <Divider />

        {/* ── SECTION 11: PATH TO REMOVAL ── */}
        <SectionHeader id="path-to-removal" label="Section 11">Path to Removal: How Kristi Klawiter
          Can Get This Taken Down</SectionHeader>

        <Para>
          This article is permanent by default. Klawiter has the
          power to get it removed entirely. Redemption requires
          action, not promises. Every step below must be
          completed. This is not negotiable.
        </Para>

        <NumberedItem num={1} title="Full Financial Restitution With Interest">
          Pay the remaining <strong style={{ color: C.red }}>$26,795</strong> plus
          contractual interest at <strong style={{ color: C.red }}>1.5%
          per month</strong> from November 2025 through the date of
          payment.<Source>Promissory note terms</Source> As of April
          2026, the total exceeds $28,800. Wire transfer or
          cashier's check only. No payment plans. No installments.
          No promises. Money in the account, verified
          and cleared.
        </NumberedItem>

        <NumberedItem num={2} title="Teach a University Course on Embezzlement">
          Develop and deliver a semester-length course at an accredited
          university on the mechanics of workplace embezzlement,
          contractor fraud, and financial manipulation. Proof of
          completion required — syllabus, university confirmation,
          and student evaluations. Turn the expertise into
          something useful.
        </NumberedItem>

        <NumberedItem num={3} title="Write and Publish a Personal Account">
          Write a minimum 5,000-word article — published under her
          real name on a credible platform — detailing her path into
          financial crime, the specific decisions she made, the
          rationalizations she used, and what she has learned. Not
          a PR rehabilitation piece. A genuine,
          unflinching accounting.
        </NumberedItem>

        <NumberedItem num={4} title="Complete 200 Hours of Verified Community Service">
          Serve 200 hours with a verified nonprofit focused on
          financial literacy or fraud prevention. ACFE, local Legal
          Aid societies, or Small Business Development Centers
          qualify. Hours must be documented and verified
          by the organization.
        </NumberedItem>

        <NumberedItem num={5} title="Formal Written Apology to Every Affected Party">
          Write individual, specific apologies to every person and
          organization affected — not a form letter. Each must
          acknowledge the specific harm and take full responsibility
          without deflection, without invoking hardship, and
          without the word "but."
        </NumberedItem>

        <NumberedItem num={6} title="Complete a Certified Ethics Program">
          Enroll in and complete a nationally recognized ethics
          certification — such as the CCEP through the Society of
          Corporate Compliance and Ethics. Provide proof
          of certification.
        </NumberedItem>

        <NumberedItem num={7} title="Undergo a Forensic Psychological Evaluation">
          Complete a forensic psychological evaluation by a licensed
          professional specializing in financial crime behavior. Share
          the results with affected parties as evidence of genuine
          self-examination. This is not punishment. This is
          the beginning of understanding.
        </NumberedItem>

        <NumberedItem num={8} title="Mentor Three Small Business Owners on Fraud Prevention">
          Volunteer as a mentor to three small business owners through
          SCORE or similar, specifically teaching them how to protect
          themselves from the exact tactics she used. Each mentorship
          must last minimum six months with documented sessions.
          Teach what you know. Make it count.
        </NumberedItem>

        <div style={{
          background: C.redBg, border: `1px solid ${C.redBorder}`,
          borderRadius: "10px", padding: "1.75rem", margin: "2rem 0",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: F.heading, fontSize: "1.2rem", fontWeight: 700,
            color: C.red, marginBottom: "0.5rem",
          }}>When all eight steps are completed
            and verified</div>
          <div style={{
            fontFamily: F.body, fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8,
            textWrap: "pretty" as any,
          }}>
            This article will be removed within 30 days. Not edited.
            Not softened. Removed entirely. I mean that. This is not
            punishment. This is a path back.
          </div>
        </div>

        <Divider />

        {/* ── SECTION 12: SUBMIT YOUR STORY ── */}
        <SectionHeader id="submit" label="Section 12">Has This Happened
          to You?</SectionHeader>

        <Para>
          If you have been defrauded by a contractor, employee, or
          business partner \u2014 your story matters. The silence that
          protects thieves creates their next victim. You do not
          have to use your name. But you can start here.
        </Para>

        <SubmitStoryForm />

        <Divider />

        {/* ── SECTION 13: FURTHER READING ── */}
        <SectionHeader id="reading" label="Section 13">Further Reading</SectionHeader>

        <div style={{ marginBottom: "1.5rem" }}>
          {[
            { title: "ACFE Report to the Nations (2024)", url: "https://www.acfe.com/report-to-the-nations/2024/", desc: "The definitive global study on occupational fraud — median loss: $150,000." },
            { title: "IRS Small Business Fraud Prevention", url: "https://www.irs.gov/businesses/small-businesses-self-employed", desc: "Tax implications and IRS guidance on internal controls." },
            { title: "FTC Business Fraud Resources", url: "https://www.ftc.gov/business-guidance", desc: "Federal Trade Commission guidance on protecting your business." },
            { title: "\"The Confidence Game\" — Maria Konnikova", url: "https://www.amazon.com/dp/0143109855", desc: "The psychology of why we fall for con artists. I read it after. You should read it before." },
            { title: "\"Why They Do It\" — Eugene Soltes", url: "https://www.amazon.com/dp/1610397029", desc: "Why seemingly successful people commit financial crimes." },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "0.85rem 0",
              borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
            }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: F.heading, fontSize: "1.05rem", fontWeight: 700,
                color: C.text, textDecoration: "underline", textDecorationColor: C.red,
                textUnderlineOffset: "3px",
              }}>{item.title}</a>
              <div style={{
                fontFamily: F.body, fontSize: "0.95rem", color: C.textLight,
                lineHeight: 1.7, marginTop: "0.25rem",
              }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── BOTTOM SHARE CTA ── */}
        <div style={{
          background: C.redBg, borderRadius: "12px", padding: "2.5rem 2rem",
          margin: "2rem 0", textAlign: "center",
          border: `1px solid ${C.redBorder}`,
        }}>
          <div style={{
            fontFamily: F.heading, fontSize: "1.5rem", fontWeight: 800,
            color: C.red, marginBottom: "0.75rem",
          }}>Make Sure the Next Employer
            Finds This First</div>
          <div style={{
            fontFamily: F.body, fontSize: "1.05rem", color: C.textMuted,
            marginBottom: "1.25rem", lineHeight: 1.8, maxWidth: "50ch",
            margin: "0 auto 1.25rem", textWrap: "pretty" as any,
          }}>
            Every share makes it harder for a convicted embezzler
            to operate in the dark. Ten seconds.
          </div>
          <ShareButtons variant="filled" />
        </div>

        {/* ── AUTHOR BIO ── */}
        <div style={{
          background: C.white, borderRadius: "10px", padding: "1.75rem",
          margin: "2rem 0", border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.2em",
            color: C.red, textTransform: "uppercase", marginBottom: "0.5rem",
            fontWeight: 600,
          }}>Documented By</div>
          <div style={{
            fontFamily: F.heading, fontSize: "1.2rem", fontWeight: 700,
            color: C.text, marginBottom: "0.5rem",
          }}>Tony Greenberg</div>
          <div style={{
            fontFamily: F.body, fontSize: "1rem", lineHeight: 1.85, color: C.textMuted,
            textWrap: "pretty" as any,
          }}>
            Twenty-five years in enterprise technology. Author of
            "Boy in the Human." Built RampRate's SPY Index \u2014 1M+
            data points benchmarking $10B+ in technology spend.
            When someone steals from you, you document everything
            and turn it into something useful. This is that document.
          </div>
        </div>

        {/* ── LEGAL DISCLAIMER ── */}
        <div style={{
          background: C.white, borderRadius: "10px", padding: "1.5rem",
          margin: "2rem 0", border: `1px solid ${C.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: "0.65rem", letterSpacing: "0.2em",
            color: C.red, textTransform: "uppercase", marginBottom: "0.75rem",
            fontWeight: 600,
          }}>Legal Notice</div>
          <div style={{
            fontFamily: F.body, fontSize: "0.9rem", lineHeight: 1.85, color: C.textLight,
            textWrap: "pretty" as any,
          }}>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: C.textMuted }}>Factual basis:</strong> Every
              factual claim in this article is drawn from specific,
              identified sources: invoices and payment records from
              the Braintrust platform, a signed promissory note dated
              November 2025, New Jersey court records (Monmouth County
              case 17-005347 and Morris County case 16-002436), an FBI
              Internet Crime Complaint Center (IC3) filing, a Santa
              Monica Police Department report, bank transfer records,
              and direct email and text correspondence.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: C.textMuted }}>Opinion vs. fact:</strong> Statements
              of opinion are clearly labeled as such throughout this
              article using dedicated "Author's Opinion" callout boxes.
              All other statements are presented as documented facts
              with source citations.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: C.textMuted }}>Privacy:</strong> No private
              identifying information (Social Security number, date
              of birth, home address) is published. All information
              presented is drawn from public court records, business
              filings, publicly available platform profiles, or direct
              correspondence with the author.
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: C.textMuted }}>Constitutional protection:</strong> This
              article constitutes protected speech under the First
              Amendment of the United States Constitution as a matter
              of public concern regarding documented fraud and
              criminal convictions. It is published in good faith for
              the purpose of consumer protection and
              public awareness.
            </p>
            <p>
              <strong style={{ color: C.textMuted }}>Not legal advice:</strong> This
              article is informational and educational. It does not
              constitute legal advice. Consult a licensed attorney
              for guidance on your specific situation.
            </p>
          </div>
        </div>

        {/* ── SEO FOOTER ── */}
        <div style={{
          fontFamily: F.mono, fontSize: "0.68rem", lineHeight: 1.9,
          color: C.textLight, textAlign: "center", padding: "2rem 0 3rem",
          borderTop: `1px solid ${C.border}`,
        }}>
          <p>
            Kristi Klawiter &bull; Kristi Klawiter Convicted &bull;
            Kristi Klawiter Embezzlement &bull; Kristi Klawiter
            Fraud &bull; Kristi Klawiter Theft &bull; Kristi Klawiter
            Forgery &bull; Kristi Klawiter Guilty Plea &bull;
            Kris Management LLC
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            &copy; {new Date().getFullYear()} Tony Greenberg.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
