import * as Yup from "yup";
import type { LiquidsunLanguage } from "@/lib/content/liquidsun/translations";
import { producers } from "@/lib/content/liquidsun/producers";

// Every LiquidSun form's Yup schema, in one place so the browser (Formik) and the server actions
// (src/app/liquid-sun/actions.ts) check the same rules (owner, 2026-11-21: every form on Formik +
// Yup, re-checked on the server). Messages come in English and Spanish. Optional fields accept
// an empty string, which is what an untouched input sends (CONTRIBUTING rule 17).

type Lang = LiquidsunLanguage;
const msg = (lang: Lang, en: string, es: string) => (lang === "es" ? es : en);

// Same check the site's /api/subscribe uses, so the two never disagree.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailField = (lang: Lang) =>
  Yup.string()
    .trim()
    .max(320, msg(lang, "Keep the email under 320 characters.", "El correo debe tener menos de 320 caracteres."))
    .matches(EMAIL, { message: msg(lang, "Enter a valid email address", "Ingresa un correo válido"), excludeEmptyString: true })
    .required(msg(lang, "Enter a valid email address", "Ingresa un correo válido"));

const maxLen = (lang: Lang, n: number) =>
  msg(lang, `Keep this under ${n.toLocaleString("en-US")} characters.`, `Debe tener menos de ${n.toLocaleString("en-US")} caracteres.`);

/** Home "Join the Resistance" (EmailCapture). */
export function emailCaptureSchema(lang: Lang = "en") {
  return Yup.object({ email: emailField(lang) });
}
export type EmailCaptureValues = { email: string };

export const PARTNER_TIERS = ["featured", "spotlight", "altar"] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

/** /partner "Tell Us About Your Brand" (the app's partner.submit input). */
export function partnerSchema(lang: Lang = "en") {
  const required = msg(lang, "Please fill in all required fields.", "Completa todos los campos obligatorios.");
  return Yup.object({
    brandName: Yup.string().trim().max(256, maxLen(lang, 256)).required(required),
    contactName: Yup.string().trim().max(256, maxLen(lang, 256)).required(required),
    contactEmail: emailField(lang),
    nom: Yup.string().trim().max(32, maxLen(lang, 32)),
    website: Yup.string()
      .trim()
      .max(512, maxLen(lang, 512))
      .matches(/^https?:\/\/\S+\.\S+$/, {
        message: msg(lang, "Start the website with http:// or https://", "El sitio debe empezar con http:// o https://"),
        excludeEmptyString: true,
      }),
    message: Yup.string().trim().max(5000, maxLen(lang, 5000)),
    tierInterest: Yup.mixed<PartnerTier>().oneOf([...PARTNER_TIERS]).required(),
  });
}
export type PartnerValues = {
  brandName: string;
  contactName: string;
  contactEmail: string;
  nom: string;
  website: string;
  message: string;
  tierInterest: PartnerTier;
};

const PRODUCER_IDS = producers.map((p) => p.id);

/** /tasting-journal "New Entry". The app saved nothing unless there was a note or a rating. */
export function tastingSchema(lang: Lang = "en") {
  return Yup.object({
    producerId: Yup.string()
      .oneOf(PRODUCER_IDS, msg(lang, "Choose a spirit from the list.", "Elige un destilado de la lista."))
      .required(msg(lang, "Choose a spirit from the list.", "Elige un destilado de la lista.")),
    rating: Yup.number().integer().min(0).max(5).required(),
    notes: Yup.string()
      .trim()
      .max(5000, maxLen(lang, 5000))
      .test("note-or-rating", msg(lang, "Add a rating or a note first.", "Agrega una calificación o una nota."), function (notes) {
        return Boolean(notes?.trim()) || Number(this.parent.rating) > 0;
      }),
  });
}
export type TastingValues = { producerId: string; rating: number; notes: string };

/** /speakeasy passphrase box. */
export function passphraseSchema(lang: Lang = "en") {
  return Yup.object({
    password: Yup.string().trim().required(msg(lang, "Enter the passphrase.", "Ingresa la contraseña.")),
  });
}

/** Flavor Matrix "Get Notified" (a US-style phone number, 7 to 15 digits). */
export function notifySchema(lang: Lang = "en") {
  return Yup.object({
    phone: Yup.string()
      .trim()
      .required(msg(lang, "Enter your phone number.", "Ingresa tu número de teléfono."))
      .matches(/^\+?[\d\s().-]+$/, msg(lang, "Use digits only, like (555) 555-5555.", "Usa solo dígitos, como (555) 555-5555."))
      .test("digits", msg(lang, "Enter a full phone number.", "Ingresa un número completo."), (v) => {
        const digits = (v ?? "").replace(/\D/g, "").length;
        return digits >= 7 && digits <= 15;
      }),
  });
}

/** Flavor Matrix list view "My Notes". */
export function tastingNoteSchema(lang: Lang = "en") {
  return Yup.object({ note: Yup.string().max(2000, maxLen(lang, 2000)) });
}

export const SINNER_CRIMES = ["Diffuser", "Additives", "Lies", "Celebrity"] as const;

/** The Assholes "Submit a Sinner". */
export function sinnerSchema(lang: Lang = "en") {
  return Yup.object({
    brandName: Yup.string().trim().max(256, maxLen(lang, 256)).required(msg(lang, "Name the brand.", "Nombra la marca.")),
    crimes: Yup.array().of(Yup.string().oneOf([...SINNER_CRIMES]).required()).required(),
    evidence: Yup.string().trim().max(2000, maxLen(lang, 2000)),
  });
}
export type SinnerValues = { brandName: string; crimes: string[]; evidence: string };
