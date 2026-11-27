import { describe, expect, it } from "vitest";
import {
  emailCaptureSchema,
  notifySchema,
  partnerSchema,
  passphraseSchema,
  sinnerSchema,
  tastingNoteSchema,
  tastingSchema,
  type PartnerValues,
} from "@/lib/content/liquidsun/forms";

// Every rule of every LiquidSun form, valid and each invalid case, in English and Spanish.

async function errorOf(schema: { validate: (v: unknown) => Promise<unknown> }, value: unknown) {
  try {
    await schema.validate(value);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

describe("emailCaptureSchema", () => {
  it("accepts a valid email, trimmed", async () => {
    expect(await emailCaptureSchema().validate({ email: "  me@example.com " })).toEqual({ email: "me@example.com" });
  });

  it.each([
    ["", "Enter a valid email address", "Ingresa un correo válido"],
    ["not-an-email", "Enter a valid email address", "Ingresa un correo válido"],
    [`${"a".repeat(315)}@x.com`, "Keep the email under 320 characters.", "El correo debe tener menos de 320 caracteres."],
  ])("rejects %j", async (email, en, es) => {
    expect(await errorOf(emailCaptureSchema("en"), { email })).toBe(en);
    expect(await errorOf(emailCaptureSchema("es"), { email })).toBe(es);
  });
});

const partner: PartnerValues = {
  brandName: "Fortaleza",
  contactName: "Guillermo",
  contactEmail: "g@fortaleza.mx",
  nom: "1493",
  website: "https://fortaleza.mx",
  message: "Tahona.",
  tierInterest: "featured",
};

describe("partnerSchema", () => {
  it("accepts a full inquiry and one with every optional field empty (rule 17)", async () => {
    await expect(partnerSchema().validate(partner)).resolves.toBeTruthy();
    await expect(partnerSchema().validate({ ...partner, nom: "", website: "", message: "" })).resolves.toBeTruthy();
    await expect(partnerSchema().validate({ ...partner, website: "http://a.co" })).resolves.toBeTruthy();
  });

  it.each<[string, Partial<PartnerValues>, string, string]>([
    ["brand required", { brandName: "  " }, "Please fill in all required fields.", "Completa todos los campos obligatorios."],
    ["contact required", { contactName: "" }, "Please fill in all required fields.", "Completa todos los campos obligatorios."],
    ["email required", { contactEmail: "" }, "Enter a valid email address", "Ingresa un correo válido"],
    ["email format", { contactEmail: "nope" }, "Enter a valid email address", "Ingresa un correo válido"],
    ["brand length", { brandName: "x".repeat(257) }, "Keep this under 256 characters.", "Debe tener menos de 256 caracteres."],
    ["contact length", { contactName: "x".repeat(257) }, "Keep this under 256 characters.", "Debe tener menos de 256 caracteres."],
    ["NOM length", { nom: "1".repeat(33) }, "Keep this under 32 characters.", "Debe tener menos de 32 caracteres."],
    [
      "website scheme",
      { website: "fortaleza.mx" },
      "Start the website with http:// or https://",
      "El sitio debe empezar con http:// o https://",
    ],
    [
      "website length",
      { website: `https://a.co/${"x".repeat(510)}` },
      "Keep this under 512 characters.",
      "Debe tener menos de 512 caracteres.",
    ],
    ["message length", { message: "x".repeat(5001) }, "Keep this under 5,000 characters.", "Debe tener menos de 5,000 caracteres."],
  ])("%s", async (_label, change, en, es) => {
    expect(await errorOf(partnerSchema("en"), { ...partner, ...change })).toBe(en);
    expect(await errorOf(partnerSchema("es"), { ...partner, ...change })).toBe(es);
  });

  it("rejects an unknown tier and a missing one", async () => {
    expect(await errorOf(partnerSchema(), { ...partner, tierInterest: "gold" })).toBeTruthy();
    expect(await errorOf(partnerSchema(), { ...partner, tierInterest: undefined })).toBeTruthy();
  });
});

describe("tastingSchema", () => {
  it("accepts a rating alone, a note alone, or both", async () => {
    await expect(tastingSchema().validate({ producerId: "fortaleza-blanco", rating: 4, notes: "" })).resolves.toBeTruthy();
    await expect(tastingSchema().validate({ producerId: "fortaleza-blanco", rating: 0, notes: "Olive" })).resolves.toBeTruthy();
    await expect(tastingSchema().validate({ producerId: "fortaleza-blanco", rating: 5, notes: "Olive" })).resolves.toBeTruthy();
  });

  it.each<[string, object, string, string]>([
    ["unknown spirit", { producerId: "vodka", rating: 3, notes: "" }, "Choose a spirit from the list.", "Elige un destilado de la lista."],
    ["missing spirit", { rating: 3, notes: "" }, "Choose a spirit from the list.", "Elige un destilado de la lista."],
    [
      "neither rating nor note",
      { producerId: "fortaleza-blanco", rating: 0, notes: "  " },
      "Add a rating or a note first.",
      "Agrega una calificación o una nota.",
    ],
    [
      "note too long",
      { producerId: "fortaleza-blanco", rating: 2, notes: "x".repeat(5001) },
      "Keep this under 5,000 characters.",
      "Debe tener menos de 5,000 caracteres.",
    ],
  ])("%s", async (_label, value, en, es) => {
    expect(await errorOf(tastingSchema("en"), value)).toBe(en);
    expect(await errorOf(tastingSchema("es"), value)).toBe(es);
  });

  it("keeps the rating between 0 and 5 whole stars", async () => {
    expect(await errorOf(tastingSchema(), { producerId: "fortaleza-blanco", rating: 6, notes: "x" })).toBeTruthy();
    expect(await errorOf(tastingSchema(), { producerId: "fortaleza-blanco", rating: -1, notes: "x" })).toBeTruthy();
    expect(await errorOf(tastingSchema(), { producerId: "fortaleza-blanco", rating: 2.5, notes: "x" })).toBeTruthy();
  });
});

describe("passphraseSchema", () => {
  it("needs a passphrase", async () => {
    await expect(passphraseSchema().validate({ password: "agave" })).resolves.toBeTruthy();
    expect(await errorOf(passphraseSchema("en"), { password: " " })).toBe("Enter the passphrase.");
    expect(await errorOf(passphraseSchema("es"), { password: "" })).toBe("Ingresa la contraseña.");
  });
});

describe("notifySchema", () => {
  it("accepts US and international numbers", async () => {
    await expect(notifySchema().validate({ phone: "(555) 555-5555" })).resolves.toBeTruthy();
    await expect(notifySchema().validate({ phone: "+52 33 1234 5678" })).resolves.toBeTruthy();
  });

  it.each([
    ["", "Enter your phone number.", "Ingresa tu número de teléfono."],
    ["555-CALL-NOW", "Use digits only, like (555) 555-5555.", "Usa solo dígitos, como (555) 555-5555."],
    ["12345", "Enter a full phone number.", "Ingresa un número completo."],
    ["1234567890123456", "Enter a full phone number.", "Ingresa un número completo."],
  ])("rejects %j", async (phone, en, es) => {
    expect(await errorOf(notifySchema("en"), { phone })).toBe(en);
    expect(await errorOf(notifySchema("es"), { phone })).toBe(es);
  });
});

describe("tastingNoteSchema", () => {
  it("allows an empty note and up to 2,000 characters", async () => {
    await expect(tastingNoteSchema().validate({ note: "" })).resolves.toBeTruthy();
    await expect(tastingNoteSchema().validate({ note: "x".repeat(2000) })).resolves.toBeTruthy();
    expect(await errorOf(tastingNoteSchema("en"), { note: "x".repeat(2001) })).toBe("Keep this under 2,000 characters.");
    expect(await errorOf(tastingNoteSchema("es"), { note: "x".repeat(2001) })).toBe("Debe tener menos de 2,000 caracteres.");
  });
});

describe("sinnerSchema", () => {
  it("needs a brand, allows any listed crimes and an empty evidence box", async () => {
    await expect(sinnerSchema().validate({ brandName: "Casamigos", crimes: [], evidence: "" })).resolves.toBeTruthy();
    await expect(
      sinnerSchema().validate({ brandName: "818", crimes: ["Diffuser", "Additives", "Lies", "Celebrity"], evidence: "Vanilla" }),
    ).resolves.toBeTruthy();
  });

  it.each<[string, object, string | null, string | null]>([
    ["missing brand", { brandName: " ", crimes: [], evidence: "" }, "Name the brand.", "Nombra la marca."],
    ["long brand", { brandName: "x".repeat(257), crimes: [], evidence: "" }, "Keep this under 256 characters.", "Debe tener menos de 256 caracteres."],
    ["long evidence", { brandName: "X", crimes: [], evidence: "x".repeat(2001) }, "Keep this under 2,000 characters.", "Debe tener menos de 2,000 caracteres."],
    ["unknown crime", { brandName: "X", crimes: ["Arson"], evidence: "" }, null, null],
  ])("%s", async (_label, value, en, es) => {
    const enErr = await errorOf(sinnerSchema("en"), value);
    const esErr = await errorOf(sinnerSchema("es"), value);
    expect(enErr).toBeTruthy();
    expect(esErr).toBeTruthy();
    if (en) expect(enErr).toBe(en);
    if (es) expect(esErr).toBe(es);
  });
});
