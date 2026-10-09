"use server";

import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/auth";
import { visitorSessionId } from "@/lib/visitor-session";
import { esc, sendEmail } from "@/lib/email";

// The site's one-off forms, ported back to "save it and tell Tony" like the
// legacy app's pri.submitConsent / pri.submitCorrection / manifesto.submit /
// cheshire.submit / facilitatorIndex.submit / spam.submit routers (owner's
// yes, 2026-10-10). Tables: supabase/migrations/0006_site_forms.sql. Every
// field is validated and clipped here, whatever the browser sent. If saving
// fails the form shows the error with an "email Tony directly" link, so
// nothing is lost. Tony gets an email for every submission except the PRI
// consent (an audit log, as on legacy).

const OWNER_EMAIL = "tony@tonygreenberg.com";
const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This couldn't be saved just now. Please try again in a minute.";
const BAD_EMAIL = "That email address doesn't look right.";

export type FormResult = { ok: boolean; error?: string };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s);
const orNull = (s: string) => s || null;

type Table =
  | "pri_consents"
  | "pri_corrections"
  | "manifesto_responses"
  | "cheshire_submissions"
  | "facilitator_submissions"
  | "spam_reports"
  | "brewsoul_submissions";

// Saves one row, after a light flood guard (at most `limit` rows per browser
// per 10 minutes in that table).
async function save(table: Table, row: Record<string, unknown>, limit = 5): Promise<FormResult> {
  if (!isServiceRoleConfigured()) return { ok: false, error: UNAVAILABLE };
  const sid = await visitorSessionId(true);
  const db = createServiceRoleClient();
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const recent = await db.from(table).select("id", { count: "exact", head: true }).eq("session_id", sid).gte("created_at", since);
  if ((recent.count ?? 0) >= limit) return { ok: false, error: "Thanks, we have this already. Please wait a few minutes before sending more." };
  const { error } = await db.from(table).insert({ ...row, session_id: sid });
  if (error) {
    console.error(`[forms] ${table} insert failed:`, error.message);
    return { ok: false, error: UNAVAILABLE };
  }
  return { ok: true };
}

// A plain two-column summary for Tony's email. Empty answers are left out.
function emailHtml(intro: string, rows: [string, string | null | undefined][], link?: string): string {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v as string)}</td></tr>`,
    )
    .join("");
  return `<p>${esc(intro)}</p><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${body}</table>${
    link ? `<p><a href="${SITE}${link}">${SITE}${link}</a></p>` : ""
  }`;
}

async function userId() {
  return (await getUser())?.id ?? null;
}

// ── PRI consent ("Before You Go In") ──
export async function submitPriConsent(input: { initials: string }): Promise<FormResult> {
  const initials = clip(input.initials, 10).toUpperCase();
  if (initials.length < 2) return { ok: false, error: "Type your initials to confirm." };
  return save("pri_consents", { initials, consent_version: "1.0", user_id: await userId() }, 20);
}

// ── PRI "Suggest a Correction" ──
const PRI_FIELDS = [
  "overview",
  "therapeutic",
  "tradition",
  "contraindications",
  "sideEffects",
  "drugInteractions",
  "safetyWarning",
  "legalStatus",
  "pricing",
  "providers",
];

export async function submitPriCorrection(input: {
  medicineId: string;
  medicineName: string;
  fieldName: string;
  fieldLabel: string;
  currentContent?: string;
  suggestedContent: string;
  sourceUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
  website?: string; // honeypot
}): Promise<FormResult> {
  if (input.website) return { ok: true };
  const medicineId = clip(input.medicineId, 64);
  const fieldName = clip(input.fieldName, 64);
  const suggested = clip(input.suggestedContent, 5000);
  const sourceUrl = clip(input.sourceUrl, 512);
  const name = clip(input.submitterName, 256);
  const email = clip(input.submitterEmail, 320);
  if (!/^[a-z0-9-]{1,64}$/.test(medicineId) || !PRI_FIELDS.includes(fieldName)) return { ok: false, error: "Something went wrong." };
  if (!suggested) return { ok: false, error: "Describe the correction first." };
  if (sourceUrl && !isUrl(sourceUrl)) return { ok: false, error: "The source should be a web address starting with http." };
  if (email && !isEmail(email)) return { ok: false, error: BAD_EMAIL };

  const res = await save("pri_corrections", {
    medicine_id: medicineId,
    field_name: fieldName,
    current_content: orNull(clip(input.currentContent, 5000)),
    suggested_content: suggested,
    source_url: orNull(sourceUrl),
    submitter_name: orNull(name),
    submitter_email: orNull(email),
    user_id: await userId(),
  });
  if (!res.ok) return res;
  const medicine = clip(input.medicineName, 128) || medicineId;
  const section = clip(input.fieldLabel, 64) || fieldName;
  await sendEmail(
    OWNER_EMAIL,
    `PRI correction: ${medicine} (${section})`,
    emailHtml(
      "Someone suggested a correction on the Psychedelic Readiness Index. It's saved in Supabase (pri_corrections) as pending.",
      [
        ["Medicine", medicine],
        ["Section", section],
        ["Suggested", suggested],
        ["Source", sourceUrl],
        ["From", name || "Anonymous"],
        ["Email", email],
      ],
      "/psychedelic-readiness-index",
    ),
  );
  return { ok: true };
}

// ── /living-declaration "Submit My Blueprint" ──
const BLUEPRINT_KEYS = ["biggestChallenge", "whatToMeasure", "referenceSites", "newIndices", "howToParticipate", "abundantLife"] as const;
export type BlueprintKey = (typeof BLUEPRINT_KEYS)[number];

export async function submitBlueprint(input: {
  answers: Record<BlueprintKey, string>;
  labels: Record<BlueprintKey, string>;
  name?: string;
  email?: string;
  website?: string; // honeypot
}): Promise<FormResult> {
  if (input.website) return { ok: true };
  const a = Object.fromEntries(BLUEPRINT_KEYS.map((k) => [k, clip(input.answers?.[k], 5000)])) as Record<BlueprintKey, string>;
  const name = clip(input.name, 256);
  const email = clip(input.email, 320);
  if (!BLUEPRINT_KEYS.some((k) => a[k])) return { ok: false, error: "Answer at least one question first." };
  if (email && !isEmail(email)) return { ok: false, error: BAD_EMAIL };

  const res = await save("manifesto_responses", {
    name: orNull(name),
    email: orNull(email),
    biggest_challenge: orNull(a.biggestChallenge),
    what_to_measure: orNull(a.whatToMeasure),
    reference_sites: orNull(a.referenceSites),
    new_indices: orNull(a.newIndices),
    how_to_participate: orNull(a.howToParticipate),
    abundant_life: orNull(a.abundantLife),
    user_id: await userId(),
  });
  if (!res.ok) return res;
  await sendEmail(
    OWNER_EMAIL,
    `Living Declaration blueprint${name ? ` from ${name}` : ""}`,
    emailHtml(
      "A new blueprint came in from A Living Declaration. It's saved in Supabase (manifesto_responses).",
      [
        ["Name", name || "Not given"],
        ["Email", email || "Not given"],
        ...BLUEPRINT_KEYS.map((k): [string, string] => [clip(input.labels?.[k], 300) || k, a[k]]),
      ],
      "/living-declaration",
    ),
  );
  return { ok: true };
}

// ── "Submit Your Story" (/protecting-your-business, /alex-azzi) ──
const STORY_PAGES = ["protecting-your-business", "alex-azzi"];
const PAYMENT_LABELS: Record<string, string> = { no: "No", partial: "Partially", yes: "Yes" };

export async function submitStory(input: {
  sourcePage: string;
  relationship: string;
  city?: string;
  dateRange?: string;
  promisedVsDelivered: string;
  receivedPayment: string;
  amountOwed?: string;
  hasDocumentation?: string;
  willingToContact?: boolean;
  contactEmail?: string;
  website?: string; // honeypot
}): Promise<FormResult> {
  if (input.website) return { ok: true };
  const page = STORY_PAGES.includes(input.sourcePage) ? input.sourcePage : null;
  const relationship = clip(input.relationship, 128);
  const story = clip(input.promisedVsDelivered, 10000);
  const payment = input.receivedPayment;
  const email = clip(input.contactEmail, 320);
  if (!page || !(payment in PAYMENT_LABELS)) return { ok: false, error: "Something went wrong." };
  if (!relationship) return { ok: false, error: "Add your relationship to the person." };
  if (story.length < 50) return { ok: false, error: "Please describe what happened in at least 50 characters." };
  if (email && !isEmail(email)) return { ok: false, error: BAD_EMAIL };
  const row = {
    source_page: page,
    relationship,
    city: orNull(clip(input.city, 256)),
    date_range: orNull(clip(input.dateRange, 128)),
    promised_vs_delivered: story,
    received_payment: payment,
    amount_owed: orNull(clip(input.amountOwed, 64)),
    has_documentation: orNull(clip(input.hasDocumentation, 256)),
    willing_to_contact: input.willingToContact === true,
    contact_email: orNull(email),
  };
  const res = await save("cheshire_submissions", row);
  if (!res.ok) return res;
  await sendEmail(
    OWNER_EMAIL,
    `New story submitted (${relationship}${row.city ? `, ${row.city}` : ""})`,
    emailHtml(
      `Someone submitted their story from /${page}. It's saved in Supabase (cheshire_submissions) as new.`,
      [
        ["Relationship", relationship],
        ["City / state", row.city],
        ["Date range", row.date_range],
        ["What happened", story],
        ["Paid what was owed?", PAYMENT_LABELS[payment]],
        ["Amount owed", row.amount_owed],
        ["Documentation", row.has_documentation],
        ["Willing to be contacted", row.willing_to_contact ? "Yes" : "No"],
        ["Contact email", email],
      ],
      `/${page}`,
    ),
  );
  return { ok: true };
}

// ── /facilitator-index: full 108-item paste-in and the Quick Intake ──
export async function submitFacilitatorIndex(input: {
  kind: "full" | "quick";
  codedIdentity?: string;
  archetype?: string;
  responses: string;
  referralConsent?: boolean;
  referralRegion?: string;
  referralContact?: string;
  locale?: string;
}): Promise<FormResult> {
  if (input.kind !== "full" && input.kind !== "quick") return { ok: false, error: "Something went wrong." };
  const responses = clip(input.responses, 50000);
  if (!responses) return { ok: false, error: "Paste your responses first." };
  const code = clip(input.codedIdentity, 128);
  const archetype = clip(input.archetype, 128);
  const region = clip(input.referralRegion, 256);
  const contact = clip(input.referralContact, 512);
  const referral = input.referralConsent === true;
  const res = await save("facilitator_submissions", {
    kind: input.kind,
    coded_identity: orNull(code),
    archetype: orNull(archetype),
    responses,
    referral_consent: referral,
    referral_region: orNull(region),
    referral_contact: orNull(contact),
    locale: orNull(clip(input.locale, 64)),
  });
  if (!res.ok) return res;
  const what = input.kind === "quick" ? "Quick Intake" : "full 108-item submission";
  await sendEmail(
    OWNER_EMAIL,
    `Facilitator Index: ${referral ? "introduction request" : what} from ${code || "anonymous"}`,
    emailHtml(
      `A new Facilitator Index ${what} came in. It's saved in Supabase (facilitator_submissions).`,
      [
        ["Code", code || "Anonymous"],
        ["Archetype", archetype],
        ["Wants an introduction", referral ? "Yes" : "No"],
        ["Region", region],
        ["Contact", contact],
        ["Responses", responses.slice(0, 20000)],
      ],
      "/facilitator-index",
    ),
  );
  return { ok: true };
}

// ── "Report A Spammer" (/attention-theft) ──
const SPAM_TYPES: Record<string, string> = {
  "cold-outreach": "Cold Outreach / Sales Pitch",
  "unsolicited-newsletter": "Unsolicited Newsletter",
  "ai-generated-spam": "AI-Generated Personalized Spam",
  "phishing-scam": "Phishing / Scam",
};
const FREQUENCIES: Record<string, string> = {
  "one-time": "One-time",
  weekly: "Weekly",
  daily: "Daily",
  "multiple-daily": "Multiple times per day",
};

export async function submitSpamReport(input: {
  companyName: string;
  senderEmail: string;
  spamType: string;
  frequency: string;
  description: string;
  reporterEmail?: string;
  website?: string; // honeypot
}): Promise<FormResult> {
  if (input.website) return { ok: true };
  const company = clip(input.companyName, 256);
  const sender = clip(input.senderEmail, 320);
  const description = clip(input.description, 5000);
  const reporter = clip(input.reporterEmail, 320);
  if (!company) return { ok: false, error: "Add the company or sender name." };
  if (!isEmail(sender)) return { ok: false, error: "Add the sender's email address." };
  if (!(input.spamType in SPAM_TYPES) || !(input.frequency in FREQUENCIES)) return { ok: false, error: "Pick the type and how often." };
  if (description.length < 10) return { ok: false, error: "Describe what happened in at least 10 characters." };
  if (reporter && !isEmail(reporter)) return { ok: false, error: BAD_EMAIL };
  const res = await save("spam_reports", {
    company_name: company,
    sender_email: sender,
    spam_type: input.spamType,
    frequency: input.frequency,
    description,
    reporter_email: orNull(reporter),
    user_id: await userId(),
  });
  if (!res.ok) return res;
  await sendEmail(
    OWNER_EMAIL,
    `Spam report: ${company}`,
    emailHtml(
      "Someone reported a spammer on The Attention Theft Manifesto. It's saved in Supabase (spam_reports).",
      [
        ["Company / sender", company],
        ["Sender email", sender],
        ["Type", SPAM_TYPES[input.spamType]],
        ["How often", FREQUENCIES[input.frequency]],
        ["What happened", description],
        ["Reporter email", reporter || "Not given"],
      ],
      "/attention-theft",
    ),
  );
  return { ok: true };
}

// ── /brewsoul/submit: suggest a coffee or appeal a score ──
export async function submitBrewSoul(input: {
  kind: "submit" | "appeal";
  coffeeName: string;
  roaster?: string;
  url?: string;
  notes?: string;
  website?: string; // honeypot
}): Promise<FormResult> {
  if (input.website) return { ok: true };
  if (input.kind !== "submit" && input.kind !== "appeal") return { ok: false, error: "Something went wrong." };
  const coffee = clip(input.coffeeName, 256);
  const roaster = clip(input.roaster, 256);
  const url = clip(input.url, 512);
  const notes = clip(input.notes, 5000);
  if (!coffee) return { ok: false, error: "Add the coffee's name." };
  if (url && !isUrl(url)) return { ok: false, error: "The link should be a web address starting with http." };
  const res = await save("brewsoul_submissions", {
    kind: input.kind,
    coffee_name: coffee,
    roaster: orNull(roaster),
    url: orNull(url),
    notes: orNull(notes),
    user_id: await userId(),
  });
  if (!res.ok) return res;
  const appeal = input.kind === "appeal";
  await sendEmail(
    OWNER_EMAIL,
    appeal ? `BrewSoul score appeal: ${coffee}` : `BrewSoul coffee submission: ${coffee}`,
    emailHtml(
      `A new BrewSoul ${appeal ? "score appeal" : "coffee submission"} came in. It's saved in Supabase (brewsoul_submissions).`,
      [
        ["Coffee", coffee],
        ["Roaster", roaster],
        ["Link", url],
        [appeal ? "What we got wrong" : "Why it should be added", notes],
      ],
      "/brewsoul/submit",
    ),
  );
  return { ok: true };
}
