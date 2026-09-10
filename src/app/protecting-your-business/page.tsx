import { BackIcon, ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CaseShareButtons } from "@/components/marketing/case-share-buttons";

// Ported from legacy client/src/pages/ProtectingYourBusiness.tsx — a
// documented fraud case file (Kristi Klawiter, convicted of theft and
// forgery in New Jersey, embezzled $46,795 from the author through 11
// unauthorized invoices). This is real, already-published content: every
// factual claim in the original is cited to a specific court case number,
// bank record, or signed document, opinion is explicitly labeled apart
// from fact throughout, no private identifying information (SSN, DOB, home
// address) appears, and the source includes its own legal-notice section
// framing this as protected speech on a matter of public concern. Ported
// verbatim, preserving the fact/opinion separation and every citation.
//
// Not ported: the "Submit Your Story" form (a `trpc.cheshire.submit`
// mutation with no client-side logic of its own — a lead-intake backend
// feature out of scope) — replaced with a real mailto invitation. Also
// dropped the closing SEO keyword-stuffing footer (a bare list of the
// subject's name repeated many times with no informational content) —
// that pattern is actively penalized by modern search engines, so
// removing it is a real SEO improvement, not a content cut; the same
// keyword targeting already lives correctly in this page's metadata.
// The complex floating hamburger/TOC overlay is simplified to a plain
// inline "jump to section" list — same real navigation, less machinery.
const PHOTO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/kristi-klawiter-photo_99e64f14.jpeg";

export const metadata: Metadata = {
  title: "Convicted Embezzler Kristi Klawiter — $46,795 Stolen, Prior NJ Guilty Pleas",
  description:
    "Kristi Klawiter, convicted of theft and forgery in New Jersey (Monmouth County 17-005347, Morris County 16-002436), embezzled $46,795 through 11 unauthorized invoices. Full documented case with court records, FBI report, and signed admissions.",
  alternates: { canonical: "/protecting-your-business" },
  keywords: [
    "Kristi Klawiter",
    "Kristi Klawiter convicted",
    "Kristi Klawiter embezzlement",
    "Kristi Klawiter fraud",
    "Kris Management LLC fraud",
    "embezzlement case study",
    "contractor fraud",
    "invoice fraud",
    "fraud red flags",
  ],
};

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
  { id: "reading", label: "Further Reading" },
];

const TIMELINE = [
  {
    date: "2016–2019",
    event:
      "Guilty pleas: theft (Monmouth Co. 17-005347) and forgery (Morris Co. 16-002436). Three years probation, $300/month restitution.",
    badge: "Convicted",
    source: "NJ court records",
  },
  {
    date: "May 2025",
    event:
      "Hired through Braintrust. Presented Kris Management, LLC. No disclosure of criminal history.",
    badge: "Hired",
    source: "Braintrust contract",
  },
  {
    date: "May–Oct 2025",
    event:
      "Submitted 11 unauthorized invoices totaling $46,795, structured below approval thresholds.",
    badge: "Theft",
    source: "Braintrust payment records",
  },
  {
    date: "Oct 2025",
    event: "Irregularities discovered in routine financial review. Confronted with evidence.",
    badge: "Caught",
    source: "Internal audit",
  },
  {
    date: "Nov 2025",
    event: "Returned $20,000. Signed promissory note for remaining $26,795.",
    badge: "Partial Return",
    source: "Bank records; signed note",
  },
  {
    date: "Nov 2025–Apr 2026",
    event: "Systematic default. Missed payments, hardship claims, wrong-account excuses.",
    badge: "Default",
    source: "Correspondence records",
  },
  {
    date: "Early 2026",
    event: "FBI IC3 report filed. Santa Monica PD report filed. Braintrust and Upwork notified.",
    badge: "FBI Report",
    source: "IC3 filing; SMPD report",
  },
  {
    date: "Apr 13, 2026",
    event: "Email promising payment within 48 hours. No payment received.",
    badge: "Broken Promise",
    source: "Email correspondence",
  },
  {
    date: "Apr 2026",
    event: "Subsequent employer contacted and warned.",
    badge: "Employer Warned",
    source: "Correspondence records",
  },
];

const RED_FLAGS = [
  {
    title: "They Deflect Interview Questions to Reconnaissance",
    text: "Instead of answering questions about qualifications, they redirect to learn about your financial systems, approval workflows, and who signs off on payments. They are not interviewing for a job. They are casing the joint.",
  },
  {
    title: "Vague Deliverables, Impressive Titles",
    text: '"Strategic operations," "growth infrastructure" — but when you ask what they actually delivered, the answers dissolve into generalities. Thieves need ambiguity the way fish need water.',
  },
  {
    title: "Suspicious Availability and Eagerness",
    text: "Available immediately. Flexible on rate. No competing offers. Legitimate professionals have schedules and market-rate expectations. Desperation to access your systems is not flattering. It is diagnostic.",
  },
  {
    title: "References That Only Exist on Their Own List",
    text: "Every reference is someone they chose. None verifiable through independent channels. Real professionals leave footprints that do not require their permission to find.",
  },
  {
    title: "Fast Moves Toward Financial Access",
    text: "Within weeks, asking for login credentials, payment platform access, or direct invoice submission. Framed as efficiency — actually removing barriers between them and your money. Efficiency is a wonderful word for theft.",
  },
  {
    title: "Contract Language They Introduced That Is Not in the Agreement",
    text: 'They reference terms that do not appear in the signed contract. "Discussed verbally" or "understood." If it is not in writing, it does not exist. This is not legal advice. This is arithmetic.',
  },
  {
    title: "Performed Remorse vs. Genuine Accountability",
    text: "When caught, they cry and invoke personal hardship. What they do not do is immediately return the money. I have now learned the difference between these two things. It cost me $46,795 in tuition.",
  },
  {
    title: "The Repayment Plan as an Escape Hatch",
    text: "They propose a repayment plan — then default. The plan itself is the strategy. It buys time and convinces the victim to delay legal action. I fell for this. You do not have to.",
  },
  {
    title: "Absence of Time Tracking and Documentation",
    text: "They resist any system that creates a verifiable record. No time tracking, no project management tool, no status reports. They need the gap between promise and delivery to be unmeasurable.",
  },
  {
    title: "The Prior History Someone Stayed Quiet About",
    text: "A prior criminal record for theft and forgery. A previous employer who discovered the same behavior but chose not to prosecute. The pattern repeats because no one breaks the silence. I am breaking it now.",
  },
];

const COST_ROWS = [
  { label: "Direct theft (11 unauthorized invoices)", amount: "$46,795", color: "text-red-800" },
  { label: "Recovered (partial restitution)", amount: "($20,000)", color: "text-green-700" },
  { label: "Net outstanding principal", amount: "$26,795", color: "text-red-800" },
  { label: "Contractual interest (1.5%/mo, ~6 months)", amount: "~$2,400", color: "text-red-800" },
  {
    label: "Legal fees (filing, correspondence, collections)",
    amount: "$5,000–$15,000",
    color: "text-amber-700",
  },
  { label: "Platform dispute resolution time", amount: "40+ hours", color: "text-amber-700" },
  {
    label: "Credit disruption (Amex relationship impact)",
    amount: "Unquantifiable",
    color: "text-muted-foreground",
  },
  {
    label: "Management distraction and emotional cost",
    amount: "Unquantifiable",
    color: "text-muted-foreground",
  },
  {
    label: "Opportunity cost of diverted attention",
    amount: "Unquantifiable",
    color: "text-muted-foreground",
  },
];

const REQUIRED_CHECKS = [
  "Multi-state criminal court record search (actual courthouse records, not databases)",
  "Civil judgment search across all relevant jurisdictions",
  "Employment gap verification — call every employer, not just the ones they list",
  "License and credential verification for any claimed certifications",
  "Platform history verification — Braintrust, Upwork, Fiverr for flags or disputes",
  "Network reference calls — people who worked with them that they did NOT provide",
  "Social media and public records cross-reference for inconsistencies",
];

const BG_CHECK_SERVICES = [
  ["Checkr Pro", "$75–$200", "Yes — multi-state", "Tech companies"],
  ["Sterling", "$80–$200", "Yes — comprehensive", "Enterprise"],
  ["HireRight", "$50–$150", "Yes — county-level", "Mid-market"],
  ["GoodHire", "$30–$100", "Database + county add-on", "Small business"],
  ["BeenVerified", "$1–$30", "Database only", "Preliminary only"],
  ["CourtDirect", "$15–$50/county", "Direct courthouse", "Targeted searches"],
];

const CHECKLIST = [
  {
    phase: "Before You Hire",
    items: [
      "Run a multi-state criminal background check through a service that searches actual courthouse records — not databases.",
      "Verify employment history independently — call the companies, not just the references they provide.",
      "Search court records in every state where they have lived for civil judgments, liens, and bankruptcies.",
      "Check freelance platform histories for disputes, flags, or account terminations.",
    ],
  },
  {
    phase: "Ongoing Financial Controls",
    items: [
      "Require dual approval for all invoices above $500. (I did not have this. Now I do.)",
      "Use a financial control platform (Ramp, Brex, Bill.com) that creates an automatic audit trail.",
      "Mandate time tracking with a tool that logs hours against specific deliverables.",
      "Run monthly reconciliation of all contractor invoices against approved scope of work.",
    ],
  },
  {
    phase: "Response and Recovery",
    items: [
      "Document everything immediately — screenshots, emails, invoices — before the person knows you are investigating.",
      "File reports with all relevant authorities: FBI IC3, local police, state AG, and platforms involved.",
      "Notify the person's subsequent employer — silence enables repetition. (This is the hard one. Do it anyway.)",
      "Consult an attorney about civil recovery options including promissory notes and wage garnishment.",
    ],
  },
];

const TOOLS = [
  ["Ramp", "Expense mgmt", "$0 (free)", "Unauthorized spending"],
  ["Brex", "Corporate cards", "$0–$12/user", "Uncontrolled spending"],
  ["Bill.com", "AP automation", "$45+/mo", "Invoice manipulation"],
  ["Clockify", "Time tracking", "$0 (free)", "Phantom hours"],
  ["1Password", "Credentials", "$8/user/mo", "Unauthorized access"],
  ["Checkr", "Background checks", "$30–$200", "Hiring convicted forgers"],
];

const REPORTING = [
  {
    name: "FBI Internet Crime Complaint Center (IC3)",
    url: "https://www.ic3.gov/",
    note: "Interstate wire fraud, online fraud, cyber-enabled financial crimes",
  },
  {
    name: "Local Police Department",
    url: "",
    note: "File in the jurisdiction where fraud occurred — creates a case number for civil recovery",
  },
  {
    name: "State Attorney General",
    url: "https://www.usa.gov/state-attorney-general",
    note: "Consumer protection — pattern fraud complaints trigger investigations",
  },
  {
    name: "ACFE",
    url: "https://www.acfe.com/",
    note: "Resources for documenting and investigating workplace fraud",
  },
  {
    name: "Platform Fraud Reporting",
    url: "",
    note: "Report to Braintrust, Upwork, etc. — they maintain internal fraud databases",
  },
];

const REMOVAL_STEPS = [
  {
    title: "Full Financial Restitution With Interest",
    text: "Pay the remaining $26,795 plus contractual interest at 1.5% per month from November 2025 through the date of payment. As of April 2026, the total exceeds $28,800. Wire transfer or cashier's check only. No payment plans. No installments. No promises. Money in the account, verified and cleared.",
  },
  {
    title: "Teach a University Course on Embezzlement",
    text: "Develop and deliver a semester-length course at an accredited university on the mechanics of workplace embezzlement, contractor fraud, and financial manipulation. Proof of completion required — syllabus, university confirmation, and student evaluations.",
  },
  {
    title: "Write and Publish a Personal Account",
    text: "Write a minimum 5,000-word article — published under her real name on a credible platform — detailing her path into financial crime, the specific decisions she made, the rationalizations she used, and what she has learned. Not a PR rehabilitation piece. A genuine, unflinching accounting.",
  },
  {
    title: "Complete 200 Hours of Verified Community Service",
    text: "Serve 200 hours with a verified nonprofit focused on financial literacy or fraud prevention. ACFE, local Legal Aid societies, or Small Business Development Centers qualify. Hours must be documented and verified by the organization.",
  },
  {
    title: "Formal Written Apology to Every Affected Party",
    text: 'Write individual, specific apologies to every person and organization affected — not a form letter. Each must acknowledge the specific harm and take full responsibility without deflection, without invoking hardship, and without the word "but."',
  },
  {
    title: "Complete a Certified Ethics Program",
    text: "Enroll in and complete a nationally recognized ethics certification — such as the CCEP through the Society of Corporate Compliance and Ethics. Provide proof of certification.",
  },
  {
    title: "Undergo a Forensic Psychological Evaluation",
    text: "Complete a forensic psychological evaluation by a licensed professional specializing in financial crime behavior. Share the results with affected parties as evidence of genuine self-examination. This is not punishment. This is the beginning of understanding.",
  },
  {
    title: "Mentor Three Small Business Owners on Fraud Prevention",
    text: "Volunteer as a mentor to three small business owners through SCORE or similar, specifically teaching them how to protect themselves from the exact tactics she used. Each mentorship must last minimum six months with documented sessions.",
  },
];

const FURTHER_READING = [
  {
    title: "ACFE Report to the Nations (2024)",
    url: "https://www.acfe.com/report-to-the-nations/2024/",
    desc: "The definitive global study on occupational fraud — median loss: $150,000.",
  },
  {
    title: "IRS Small Business Fraud Prevention",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed",
    desc: "Tax implications and IRS guidance on internal controls.",
  },
  {
    title: "FTC Business Fraud Resources",
    url: "https://www.ftc.gov/business-guidance",
    desc: "Federal Trade Commission guidance on protecting your business.",
  },
  {
    title: '"The Confidence Game" — Maria Konnikova',
    url: "https://www.amazon.com/dp/0143109855",
    desc: "The psychology of why we fall for con artists. I read it after. You should read it before.",
  },
  {
    title: '"Why They Do It" — Eugene Soltes',
    url: "https://www.amazon.com/dp/1610397029",
    desc: "Why seemingly successful people commit financial crimes.",
  },
];

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mt-14 scroll-mt-20">
      <p className="mb-1.5 font-mono text-xs tracking-[0.2em] text-red-800 uppercase">
        Section {num}
      </p>
      <h2 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 max-w-prose leading-[1.85] text-foreground/80">{children}</p>;
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1 rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
      [{children}]
    </span>
  );
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-red-800/25 border-l-4 border-l-red-800 bg-red-800/5 p-6 leading-[1.8] text-red-950 dark:text-red-200">
      {children}
    </div>
  );
}

function OpinionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-md border border-amber-700/25 border-l-4 border-l-amber-700 bg-amber-700/5 p-6">
      <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-amber-800 uppercase">
        Author&apos;s Opinion
      </div>
      <div className="leading-[1.8] text-amber-950 dark:text-amber-200">{children}</div>
    </div>
  );
}

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <div className="my-6 rounded-md border border-amber-700/25 border-l-4 border-l-amber-700 bg-amber-700/5 p-7">
      <div className="mb-3 text-lg leading-relaxed text-amber-950 italic dark:text-amber-200">
        &quot;{quote}&quot;
      </div>
      <div className="font-mono text-xs tracking-wide text-amber-800 uppercase">
        — {attribution}
      </div>
    </div>
  );
}

function NumberedItem({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex gap-4">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-800 font-mono text-xs font-bold text-white">
        {String(num).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="mb-1.5 font-heading text-lg font-bold text-foreground">{title}</h3>
        <div className="leading-[1.85] text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

function Badge({
  children,
  variant = "red",
}: {
  children: React.ReactNode;
  variant?: "red" | "amber";
}) {
  return (
    <span
      className={`rounded-sm px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-wide text-white uppercase ${
        variant === "red" ? "bg-red-800" : "bg-amber-700"
      }`}
    >
      {children}
    </span>
  );
}

const SHARE_TEXT =
  "Convicted embezzler Kristi Klawiter stole $46,795 through 11 unauthorized invoices. Prior theft & forgery guilty pleas in NJ (Monmouth Co. 17-005347, Morris Co. 16-002436). Full documented case:";

export default function ProtectingYourBusinessPage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div className="mb-6 rounded-md bg-red-800/10 py-3 text-center font-mono text-xs font-bold tracking-[0.2em] text-red-800 uppercase">
          Documented Fraud Case — Court Records &amp; Guilty Pleas on File
        </div>

        <h1 className="mx-auto mb-3 max-w-2xl text-center font-heading text-3xl leading-tight font-black text-foreground sm:text-4xl">
          She Had Two Theft Convictions. I Hired Her Anyway. She Stole $46,795.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-center text-foreground/70">
          The documented case of Kristi Klawiter — convicted of theft and forgery in New Jersey,
          hired through Braintrust, and caught submitting 11 unauthorized invoices. This is the
          record I wish someone had published before I wrote the check.
        </p>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap">
            <div className="relative h-85 w-full shrink-0 sm:w-75">
              <Image
                src={PHOTO}
                alt="Kristi Klawiter — convicted of theft and forgery in New Jersey, documented embezzler"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 top-0 bg-red-800/90 py-2.5 text-center backdrop-blur-sm">
                <div className="font-mono text-sm font-extrabold tracking-[0.2em] text-white uppercase">
                  Convicted Embezzler
                </div>
                <div className="mt-0.5 font-mono text-[0.6rem] tracking-wide text-white/80">
                  NJ Guilty Pleas: Theft &amp; Forgery
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center p-8">
              <h2 className="mb-1 font-heading text-3xl font-black text-foreground">
                Kristi Klawiter
              </h2>
              <div className="mb-5 font-mono text-xs text-muted-foreground">
                Kris Management, LLC &bull; Asbury, NJ
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge>Convicted — Theft</Badge>
                <Badge>Convicted — Forgery</Badge>
                <Badge>Embezzlement</Badge>
                <Badge variant="amber">Guilty Pleas on Record</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Amount Stolen",
                    value: "$46,795",
                    highlight: true,
                    source: "Braintrust invoices",
                  },
                  {
                    label: "Recovered",
                    value: "$20,000",
                    highlight: false,
                    source: "Bank records",
                  },
                  {
                    label: "Outstanding",
                    value: "$26,795+",
                    highlight: true,
                    source: "Promissory note",
                  },
                  {
                    label: "Unauthorized Invoices",
                    value: "11",
                    highlight: false,
                    source: "Platform records",
                  },
                  {
                    label: "Prior NJ Cases",
                    value: "2 Guilty Pleas",
                    highlight: false,
                    source: "17-005347, 16-002436",
                  },
                  {
                    label: "FBI Report",
                    value: "Filed",
                    highlight: false,
                    source: "IC3 submission",
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">
                      {f.label}
                    </div>
                    <div
                      className={`font-heading text-lg font-bold ${f.highlight ? "text-red-800" : "text-foreground"}`}
                    >
                      {f.value}
                    </div>
                    <div className="font-mono text-[0.55rem] text-muted-foreground">
                      Source: {f.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-red-800/20 bg-red-800/5 px-8 py-5 leading-[1.8] text-red-950 dark:text-red-200">
            Eleven unauthorized invoices. $46,795 stolen. A promissory note signed and broken. Two
            prior guilty pleas in New Jersey. An FBI wire fraud report on file. This is not an
            allegation. This is a paper trail.
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
            Share This — The Next Employer Deserves to Know
          </p>
          <CaseShareButtons path="/protecting-your-business" shareText={SHARE_TEXT} />
        </div>

        <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
          Documented by Tony Greenberg &bull; April 2026 &bull; Updated Continuously
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-6 sm:px-10">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-y border-border py-4 text-center">
          {TOC.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="font-mono text-xs text-brand-gold">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-16 sm:px-10">
        <div className="mb-10 rounded-md border border-amber-700/25 bg-amber-700/5 p-7">
          <div className="mb-2 font-mono text-xs font-bold tracking-[0.2em] text-amber-800 uppercase">
            A Note From the Author
          </div>
          <div className="text-lg leading-relaxed font-medium text-amber-950 dark:text-amber-200">
            I got taken. Twenty-five years in enterprise technology, $10 billion benchmarked, and a
            woman with two theft convictions walked through my door and I handed her the keys. The
            duty to warn you is bigger than my ego. If I stay quiet, the next victim is on me.
          </div>
        </div>

        <Section id="case" num="01" title="The Case Against Kristi Klawiter">
          <P>
            In May 2025, <strong className="text-foreground">Kristi Klawiter</strong> was hired
            through Braintrust as a remote operations contractor.
            <Cite>Braintrust contract records</Cite> She presented Kris Management, LLC and
            references that checked out on the surface. She was good at this. That is, after all,
            what convicted forgers do.
          </P>
          <P>
            Over five months she submitted{" "}
            <strong className="text-red-800">11 unauthorized invoices</strong> totaling{" "}
            <strong className="text-red-800">$46,795</strong>, each structured below approval
            thresholds and timed to periods of high activity.
            <Cite>Braintrust payment records</Cite> This was not impulsive. This was architecture.
          </P>
          <P>
            Confronted with the evidence, she returned{" "}
            <strong className="text-foreground">$20,000</strong>
            <Cite>Bank transfer records</Cite> and then stopped. She signed a promissory note for
            the remaining $26,795<Cite>Signed promissory note, Nov 2025</Cite> and immediately
            defaulted. The promissory note, it turned out, was just another forgery — of good faith.
          </P>
          <P>
            <strong className="text-foreground">
              What a courthouse search would have revealed:
            </strong>{" "}
            prior guilty pleas for theft and forgery in New Jersey — Monmouth County 17-005347 and
            Morris County 16-002436. Three years probation. Court-ordered restitution at $300 per
            month.<Cite>NJ court records</Cite> She never disclosed them. I never found them. That
            is the $75 background check I did not run.
          </P>
          <OpinionBox>
            The pattern — prior convictions, structured invoices below detection thresholds,
            fabricated justifications, signed-then-broken promises — suggests a deliberate,
            practiced methodology. Reasonable people can draw their own conclusions from the
            documented record.
          </OpinionBox>
        </Section>

        <Section id="timeline" num="02" title="Chronological Timeline: Every Date, Every Document">
          <div className="relative border-l-2 border-red-800/30 pl-6">
            {TIMELINE.map((item) => (
              <div key={item.date} className="relative mb-7">
                <div className="absolute top-1 -left-[1.9rem] size-4 rounded-full border-2 border-red-800 bg-background" />
                <div className="mb-1.5 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-semibold tracking-wide text-amber-800 uppercase">
                    {item.date}
                  </span>
                  <Badge>{item.badge}</Badge>
                </div>
                <p className="mb-1 leading-[1.8] text-foreground/80">{item.event}</p>
                <p className="font-mono text-[0.65rem] text-muted-foreground">
                  Source: {item.source}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="manipulation" num="03" title="The Playbook: What She Did When She Got Caught">
          <P>
            Every business owner who catches a thief will face the same script. Knowing the playbook
            in advance is worth more than any background check. The following tactics are documented
            in emails, text messages, and recorded conversations.
            <Cite>Correspondence archive</Cite>
          </P>
          <QuoteBlock
            quote="I have a husband and children who depend on me. If you pursue this, you will be destroying an entire family."
            attribution="Kristi Klawiter, in written correspondence after being confronted with evidence of 11 unauthorized invoices (Source: email correspondence, Oct 2025). The existence of this family has not been independently verified."
          />
          <NumberedItem num={1} title="The Fabricated Family">
            Klawiter immediately invoked a husband and children whose existence has not been
            independently confirmed.<Cite>Email correspondence</Cite> Brilliant, in the way a
            pickpocket&apos;s misdirection is brilliant. You are suddenly defending yourself for
            wanting your own money back.
          </NumberedItem>
          <NumberedItem num={2} title="Mental Illness as a Shield">
            Klawiter claimed mental health struggles not as genuine vulnerability but as a tactical
            shield.<Cite>Text messages</Cite> The message: &quot;if you hold me accountable, you are
            punishing someone who is mentally ill.&quot; The emotional equivalent of a human shield.
          </NumberedItem>
          <QuoteBlock
            quote="If you don't stop, I don't know what I'll do to myself."
            attribution="Kristi Klawiter, in a message sent after being informed that legal proceedings would move forward (Source: text message, Nov 2025). This is documented emotional blackmail designed to halt accountability."
          />
          <NumberedItem num={3} title="Self-Harm Threats as Leverage">
            The most dangerous tactic: threatening self-harm to halt accountability.
            <Cite>Text message, Nov 2025</Cite> The correct response, and the one I followed:
            contact emergency services (988 Suicide &amp; Crisis Lifeline) and continue your legal
            process. You are not a therapist. You are a fraud victim. Those are different jobs.
          </NumberedItem>
          <NumberedItem num={4} title="The Perpetual Payment Promise">
            &quot;I&apos;ll have a plan within 48 hours.&quot; &quot;The money was sent to the wrong
            account.&quot; &quot;I&apos;m working on it.&quot;
            <Cite>Email correspondence, Nov 2025–Apr 2026</Cite> The promissory note she signed was
            itself a tactic: the appearance of good faith from someone with no intention of honoring
            it. Not once. Not partially. Not ever.
          </NumberedItem>
          <NumberedItem num={5} title="Performed Remorse Without Restitution">
            She cried. She apologized.<Cite>Recorded conversation</Cite> What she did not do is
            return the money. A useful heuristic I learned the expensive way: genuine remorse
            arrives with a cashier&apos;s check. Performed remorse arrives with tears and a request
            for more time.
          </NumberedItem>
          <NumberedItem num={6} title="Identity Obfuscation Across Platforms">
            Kris Management, LLC in Florida. Criminal records in New Jersey. Profiles on Braintrust,
            Upwork, LinkedIn, and 9am.works — each with a slightly different professional history.
            <Cite>Platform profile records</Cite> Deliberate obfuscation, in my opinion, designed to
            prevent employers from connecting the dots. It worked on me.
          </NumberedItem>
          <AlertBox>
            <strong>The six-month pattern:</strong> fabricate sympathy, weaponize vulnerability,
            promise payment, delay indefinitely, hope the victim gives up. I did not.
          </AlertBox>
        </Section>

        <Section
          id="red-flags"
          num="04"
          title="10 Ways to Spot a Thief Before They Spot Your Checkbook"
        >
          <P>
            Every one of these appeared in this case. Field notes from a man who missed all ten. If
            you see three or more, stop everything and audit immediately.
          </P>
          {RED_FLAGS.map((item, i) => (
            <NumberedItem key={item.title} num={i + 1} title={item.title}>
              {item.text}
            </NumberedItem>
          ))}
        </Section>

        <Section id="damage" num="05" title="The Real Cost: It Is Never Just the Money">
          <P>
            $46,795 is the headline number. The real cost includes everything that breaks downstream
            when someone detonates a fraud bomb inside your business.
          </P>
          <div className="my-6 rounded-md border border-border bg-card p-6">
            {COST_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between py-2.5 ${i < COST_ROWS.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <span className="text-foreground/80">{row.label}</span>
                <span className={`font-mono text-sm font-semibold ${row.color}`}>{row.amount}</span>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between border-t-2 border-red-800 pt-4 font-heading text-lg font-bold text-foreground">
              <span>Estimated total cost of doing nothing</span>
              <span className="text-red-800">$46,795+</span>
            </div>
          </div>
          <OpinionBox>
            The money is recoverable in theory. The six months of distraction, the erosion of trust
            in your own judgment, the conversations you did not have because you were dealing with a
            thief — those do not come back.
          </OpinionBox>
        </Section>

        <Section id="background-checks" num="06" title="The $75 Background Check I Did Not Run">
          <P>
            Standard background checks search databases, not courthouses. Many courts — especially
            in New Jersey, where Klawiter&apos;s convictions were filed — do not report
            automatically.<Cite>Industry documentation</Cite> The database said she was fine. The
            courthouse said she was not.
          </P>
          <div className="my-6 rounded-md border border-border bg-card p-6">
            <div className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
              Required Checks for Anyone Who Touches Your Money
            </div>
            {REQUIRED_CHECKS.map((item, i) => (
              <div key={item} className="mb-3 flex gap-3 text-foreground/80">
                <span className="shrink-0 font-bold text-red-800">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <AlertBox>
            <strong>The arithmetic:</strong> Cost of a thorough background check: $75 to $200. Cost
            of not running one: $46,795. I am not a mathematician, but I can do this particular
            calculation now.
          </AlertBox>
          <div className="my-6 overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-800/5">
                  {["Service", "Price", "Court Records", "Best For"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-xs tracking-wide text-red-800 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BG_CHECK_SERVICES.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td
                        key={cell}
                        className={`px-4 py-2.5 text-foreground/80 ${j === 0 ? "font-semibold text-foreground" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="protection"
          num="07"
          title="The 12-Point Checklist I Built After Getting Robbed"
        >
          {CHECKLIST.map((section) => (
            <div key={section.phase} className="mb-6">
              <div className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
                {section.phase}
              </div>
              {section.items.map((item) => (
                <div key={item} className="mb-3 flex gap-3 text-foreground/80">
                  <span className="mt-0.5 shrink-0 text-red-800">☐</span>
                  <span className="leading-[1.8]">{item}</span>
                </div>
              ))}
            </div>
          ))}
        </Section>

        <Section
          id="tools"
          num="08"
          title="Prevention Tools vs. the Cost of Trusting the Wrong Person"
        >
          <div className="mb-6 overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-800/5">
                  {["Tool", "Category", "Cost", "Prevents"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-xs tracking-wide text-red-800 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td
                        key={cell}
                        className={`px-4 py-2.5 text-foreground/80 ${j === 0 ? "font-semibold text-foreground" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-md border border-border bg-card p-6 text-center">
            <div className="mb-2 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
              The Math
            </div>
            <div className="font-heading text-lg text-foreground">
              Annual cost of every prevention tool:{" "}
              <strong className="text-green-700">~$3,600</strong>
            </div>
            <div className="mt-1 text-muted-foreground">
              Cost of one convicted embezzler who got past the door:{" "}
              <strong className="text-red-800">$46,795+</strong>
            </div>
          </div>
        </Section>

        <Section id="reporting" num="09" title="Where to Report Fraud">
          <P>
            File everywhere. No single agency will solve it — but the cumulative paper trail makes
            it impossible for the next employer to miss.
          </P>
          {REPORTING.map((item) => (
            <div key={item.name} className="border-b border-border py-3 last:border-b-0">
              <div className="mb-1 font-heading text-base font-bold text-foreground">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-red-800 underline-offset-2"
                  >
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </div>
              <div className="text-sm text-muted-foreground">{item.note}</div>
            </div>
          ))}
        </Section>

        <Section id="why-this-exists" num="10" title="Why I Published This (And Why It Was Hard)">
          <P>
            My first instinct was to absorb the loss quietly. That is what most business owners do.
            But the next company that hires Kristi Klawiter without knowing her history will lose
            money too. And they will ask:{" "}
            <strong className="text-foreground">did anyone know? Did anyone try to warn us?</strong>
          </P>
          <AlertBox>
            You are complicit if you do not take people to the mat. As a business owner. As a human.
            As everything. Karma-wise, you are allowing others to get hurt. I am a protector by
            nature. You can be too.
          </AlertBox>
          <P>
            <strong className="text-foreground">RampRate is a Certified B Corporation</strong>.
            <Cite>B Lab certification</Cite> In 25 years, we have{" "}
            <strong className="text-foreground">never sued anyone and never been sued</strong>. This
            article is not litigation — it is documentation.
          </P>
          <OpinionBox>
            &quot;Let it go, write it off, move on.&quot; That instinct protects your ego but
            endangers everyone who comes after you. I chose embarrassment over complicity.
          </OpinionBox>
        </Section>

        <Section
          id="path-to-removal"
          num="11"
          title="Path to Removal: How Kristi Klawiter Can Get This Taken Down"
        >
          <P>
            This article is permanent by default. Klawiter has the power to get it removed entirely.
            Redemption requires action, not promises. Every step below must be completed. This is
            not negotiable.
          </P>
          {REMOVAL_STEPS.map((step, i) => (
            <NumberedItem key={step.title} num={i + 1} title={step.title}>
              {step.text}
            </NumberedItem>
          ))}
          <div className="my-8 rounded-md border border-red-800/25 bg-red-800/5 p-7 text-center">
            <div className="mb-2 font-heading text-xl font-bold text-red-800">
              When all eight steps are completed and verified
            </div>
            <div className="leading-[1.8] text-foreground/80">
              This article will be removed within 30 days. Not edited. Not softened. Removed
              entirely. I mean that. This is not punishment. This is a path back.
            </div>
          </div>
        </Section>

        <div className="mt-14 rounded-md border border-red-800/20 bg-red-800/5 p-6 text-center">
          <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
            Has This Happened to You?
          </h2>
          <p className="mx-auto mb-4 max-w-md text-foreground/70">
            If you have been defrauded by a contractor, employee, or business partner, your story
            matters. The silence that protects thieves creates their next victim.
          </p>
          <a
            href="mailto:tony@ramprate.com?subject=Fraud%20Story%20Submission"
            className="inline-block rounded-md bg-red-800 px-6 py-2.5 font-mono text-xs font-semibold tracking-wide text-white uppercase"
          >
            Share Your Story <ForwardIcon aria-hidden="true" />
          </a>
        </div>

        <Section id="reading" num="12" title="Further Reading">
          {FURTHER_READING.map((item) => (
            <div key={item.title} className="border-b border-border py-3 last:border-b-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-base font-bold text-foreground underline decoration-red-800 underline-offset-2"
              >
                {item.title}
              </a>
              <div className="mt-0.5 text-sm text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </Section>

        <div className="mt-12 rounded-md border border-red-800/25 bg-red-800/5 p-8 text-center">
          <div className="mb-2 font-heading text-xl font-black text-red-800">
            Make Sure the Next Employer Finds This First
          </div>
          <p className="mx-auto mb-5 max-w-md text-foreground/80">
            Every share makes it harder for a convicted embezzler to operate in the dark. Ten
            seconds.
          </p>
          <CaseShareButtons filled path="/protecting-your-business" shareText={SHARE_TEXT} />
        </div>

        <div className="mt-8 rounded-md border border-border bg-card p-7">
          <div className="mb-2 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
            Documented By
          </div>
          <div className="mb-2 font-heading text-lg font-bold text-foreground">Tony Greenberg</div>
          <p className="leading-[1.85] text-foreground/80">
            Twenty-five years in enterprise technology. Author of &quot;Boy in the Human.&quot;
            Built RampRate&apos;s SPY Index — 1M+ data points benchmarking $10B+ in technology
            spend. When someone steals from you, you document everything and turn it into something
            useful. This is that document.
          </p>
        </div>

        <div className="mt-6 rounded-md border border-border bg-card p-6">
          <div className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-red-800 uppercase">
            Legal Notice
          </div>
          <div className="space-y-3 text-sm leading-[1.85] text-muted-foreground">
            <p>
              <strong className="text-foreground/80">Factual basis:</strong> Every factual claim in
              this article is drawn from specific, identified sources: invoices and payment records
              from the Braintrust platform, a signed promissory note dated November 2025, New Jersey
              court records (Monmouth County case 17-005347 and Morris County case 16-002436), an
              FBI Internet Crime Complaint Center (IC3) filing, a Santa Monica Police Department
              report, bank transfer records, and direct email and text correspondence.
            </p>
            <p>
              <strong className="text-foreground/80">Opinion vs. fact:</strong> Statements of
              opinion are clearly labeled as such throughout this article using dedicated
              &quot;Author&apos;s Opinion&quot; callout boxes. All other statements are presented as
              documented facts with source citations.
            </p>
            <p>
              <strong className="text-foreground/80">Privacy:</strong> No private identifying
              information (Social Security number, date of birth, home address) is published. All
              information presented is drawn from public court records, business filings, publicly
              available platform profiles, or direct correspondence with the author.
            </p>
            <p>
              <strong className="text-foreground/80">Constitutional protection:</strong> This
              article constitutes protected speech under the First Amendment of the United States
              Constitution as a matter of public concern regarding documented fraud and criminal
              convictions. It is published in good faith for the purpose of consumer protection and
              public awareness.
            </p>
            <p>
              <strong className="text-foreground/80">Not legal advice:</strong> This article is
              informational and educational. It does not constitute legal advice. Consult a licensed
              attorney for guidance on your specific situation.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/" className="font-mono text-sm tracking-wide text-brand-gold">
          <BackIcon aria-hidden="true" /> Back to the Essays
        </Link>
      </div>
    </div>
  );
}
