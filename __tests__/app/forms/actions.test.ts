import { describe, expect, it } from "vitest";
import {
  submitStory,
  submitPriConsent,
  submitPriCorrection,
  submitBlueprint,
  submitFacilitatorIndex,
  submitSpamReport,
  submitBrewSoul,
} from "@/app/forms/actions";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { sendEmail } from "@/lib/email";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { vi } from "vitest";

const STORY = "They promised a finished product by March and delivered nothing, then stopped answering.";
const valid = { sourcePage: "alex-azzi", relationship: "Client", promisedVsDelivered: STORY, receivedPayment: "no" };

describe("submitStory (server side)", () => {
  it("saves a valid story to cheshire_submissions and emails Tony", async () => {
    await expect(submitStory({ ...valid, city: "  LA  " })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("cheshire_submissions");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ source_page: "alex-azzi", relationship: "Client", city: "LA", willing_to_contact: false }),
    );
    expect(sendEmail).toHaveBeenCalledWith("tony@tonygreenberg.com", expect.stringContaining("Client, LA"), expect.any(String));
  });

  it("re-checks every rule on the server, whatever the browser sent", async () => {
    await expect(submitStory({ ...valid, sourcePage: "somewhere-else" })).resolves.toMatchObject({ ok: false });
    await expect(submitStory({ ...valid, relationship: "   " })).resolves.toMatchObject({ ok: false });
    await expect(submitStory({ ...valid, promisedVsDelivered: "short" })).resolves.toMatchObject({ ok: false });
    await expect(submitStory({ ...valid, contactEmail: "nope" })).resolves.toMatchObject({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("quietly accepts and drops a bot that filled the hidden field", async () => {
    await expect(submitStory({ ...valid, website: "http://spam" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("refuses more than 5 stories from one browser in 10 minutes", async () => {
    supabaseResult.count = 5;
    await expect(submitStory(valid)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait a few minutes/) });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("says it couldn't save (and sends no email) when the database is down or not set up", async () => {
    supabaseResult.error = { message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(submitStory(valid)).resolves.toMatchObject({ ok: false });
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(submitStory(valid)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitPriConsent", () => {
  it("needs at least two initials and stores them upper-cased", async () => {
    await expect(submitPriConsent({ initials: "a" })).resolves.toMatchObject({ ok: false });
    await expect(submitPriConsent({ initials: "ab" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ initials: "AB" }));
  });
});

const emailCall = () => vi.mocked(sendEmail).mock.calls[0] as unknown as [string, string, string];

describe("submitStory email details", () => {
  it("lists every answer Tony needs, escapes HTML and links back to the page", async () => {
    await submitStory({
      ...valid,
      sourcePage: "protecting-your-business",
      receivedPayment: "partial",
      dateRange: "2024",
      amountOwed: "$5,000",
      hasDocumentation: "Emails",
      willingToContact: true,
      contactEmail: "me@example.com",
      relationship: "<b>Partner</b>",
    });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ willing_to_contact: true, contact_email: "me@example.com", amount_owed: "$5,000", city: null }),
    );
    const [to, subject, html] = emailCall();
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toBe("New story submitted (<b>Partner</b>)");
    expect(html).toContain("Partially");
    expect(html).toContain("&lt;b&gt;Partner&lt;/b&gt;");
    expect(html).not.toContain("<b>Partner</b>");
    expect(html).toContain("Willing to be contacted</td><td style=\"padding:6px 0;white-space:pre-wrap\">Yes");
    expect(html).toContain('href="https://tonygreenberg.com/protecting-your-business"');
    expect(html).not.toContain("City / state");
  });

  it("refuses an unknown payment answer", async () => {
    await expect(submitStory({ ...valid, receivedPayment: "maybe" })).resolves.toEqual({ ok: false, error: "Something went wrong." });
  });
});

describe("submitPriCorrection", () => {
  const ok = {
    medicineId: "iboga",
    medicineName: "Iboga",
    fieldName: "sideEffects",
    fieldLabel: "Side effects",
    suggestedContent: "Add bradycardia.",
  };

  it("saves a pending correction and emails Tony with the medicine and section", async () => {
    supabaseResult.data = null;
    await expect(
      submitPriCorrection({ ...ok, sourceUrl: "https://example.com/paper", submitterEmail: "a@b.co", submitterName: "Ann", currentContent: "  " }),
    ).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("pri_corrections");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        medicine_id: "iboga",
        field_name: "sideEffects",
        current_content: null,
        suggested_content: "Add bradycardia.",
        source_url: "https://example.com/paper",
        submitter_name: "Ann",
        submitter_email: "a@b.co",
        user_id: null,
      }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("PRI correction: Iboga (Side effects)");
    expect(html).toContain("Ann");
    expect(html).toContain("/psychedelic-readiness-index");
  });

  it("falls back to the id and field name, and 'Anonymous', when labels are missing", async () => {
    await submitPriCorrection({ ...ok, medicineName: "", fieldLabel: "" });
    const [, subject, html] = emailCall();
    expect(subject).toBe("PRI correction: iboga (sideEffects)");
    expect(html).toContain("Anonymous");
  });

  it("records the signed-in user's id", async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null } as never);
    await submitPriCorrection(ok);
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "user-1" }));
  });

  it("refuses bad ids, unknown fields, empty text, bad links and bad emails", async () => {
    await expect(submitPriCorrection({ ...ok, medicineId: "Iboga!" })).resolves.toEqual({ ok: false, error: "Something went wrong." });
    await expect(submitPriCorrection({ ...ok, fieldName: "secret" })).resolves.toEqual({ ok: false, error: "Something went wrong." });
    await expect(submitPriCorrection({ ...ok, suggestedContent: "   " })).resolves.toEqual({ ok: false, error: "Describe the correction first." });
    await expect(submitPriCorrection({ ...ok, sourceUrl: "example.com" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/http/) });
    await expect(submitPriCorrection({ ...ok, submitterEmail: "nope" })).resolves.toEqual({ ok: false, error: "That email address doesn't look right." });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("drops honeypot submissions and sends no email when saving fails", async () => {
    await expect(submitPriCorrection({ ...ok, website: "x" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    supabaseResult.count = 5;
    await expect(submitPriCorrection(ok)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitBlueprint", () => {
  const empty = { biggestChallenge: "", whatToMeasure: "", referenceSites: "", newIndices: "", howToParticipate: "", abundantLife: "" };
  const labels = { ...empty, biggestChallenge: "Biggest challenge?" };

  it("saves the answers (empty ones as null) and emails them with their question labels", async () => {
    await expect(
      submitBlueprint({ answers: { ...empty, biggestChallenge: "  Time  ", abundantLife: "Family" }, labels, name: "Kim", email: "k@x.io" }),
    ).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("manifesto_responses");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Kim", email: "k@x.io", biggest_challenge: "Time", what_to_measure: null, abundant_life: "Family" }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("Living Declaration blueprint from Kim");
    expect(html).toContain("Biggest challenge?");
    expect(html).toContain("abundantLife");
    expect(html).not.toContain("whatToMeasure");
    expect(html).toContain("/living-declaration");
  });

  it("says 'Not given' when the person stays anonymous", async () => {
    await submitBlueprint({ answers: { ...empty, newIndices: "More" }, labels });
    const [, subject, html] = emailCall();
    expect(subject).toBe("Living Declaration blueprint");
    expect(html).toContain("Not given");
  });

  it("needs at least one answer and a valid email, and ignores the honeypot", async () => {
    await expect(submitBlueprint({ answers: empty, labels })).resolves.toEqual({ ok: false, error: "Answer at least one question first." });
    await expect(submitBlueprint({ answers: { ...empty, newIndices: "x" }, labels, email: "bad" })).resolves.toMatchObject({ ok: false });
    await expect(submitBlueprint({ answers: empty, labels, website: "bot" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("sends no email when saving fails", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(submitBlueprint({ answers: { ...empty, newIndices: "x" }, labels })).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitFacilitatorIndex", () => {
  it("saves a quick intake with a referral request and flags it in the subject", async () => {
    await expect(
      submitFacilitatorIndex({
        kind: "quick",
        codedIdentity: "FX-12",
        archetype: "Guide",
        responses: "1,2,3",
        referralConsent: true,
        referralRegion: "Oregon",
        referralContact: "fx@example.com",
        locale: "en",
      }),
    ).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("facilitator_submissions");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "quick", coded_identity: "FX-12", referral_consent: true, referral_region: "Oregon", locale: "en" }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("Facilitator Index: introduction request from FX-12");
    expect(html).toContain("Quick Intake");
    expect(html).toContain("Oregon");
  });

  it("names a full anonymous submission and stores missing fields as null", async () => {
    await submitFacilitatorIndex({ kind: "full", responses: "all 108" });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "full", coded_identity: null, referral_consent: false, locale: null }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("Facilitator Index: full 108-item submission from anonymous");
    expect(html).toContain("Anonymous");
  });

  it("refuses an unknown kind or empty responses, and sends no email when saving fails", async () => {
    await expect(submitFacilitatorIndex({ kind: "other" as "full", responses: "x" })).resolves.toEqual({ ok: false, error: "Something went wrong." });
    await expect(submitFacilitatorIndex({ kind: "full", responses: "   " })).resolves.toEqual({ ok: false, error: "Paste your responses first." });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    supabaseResult.count = 9;
    await expect(submitFacilitatorIndex({ kind: "full", responses: "x" })).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitSpamReport", () => {
  const ok = {
    companyName: "Acme Leads",
    senderEmail: "sales@acme.io",
    spamType: "cold-outreach",
    frequency: "daily",
    description: "Five emails a day for a week.",
  };

  it("saves the report and emails Tony the readable type and frequency", async () => {
    await expect(submitSpamReport({ ...ok, reporterEmail: "me@x.io" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("spam_reports");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ company_name: "Acme Leads", sender_email: "sales@acme.io", spam_type: "cold-outreach", reporter_email: "me@x.io" }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("Spam report: Acme Leads");
    expect(html).toContain("Cold Outreach / Sales Pitch");
    expect(html).toContain("Daily");
    expect(html).toContain("me@x.io");
  });

  it("says 'Not given' for an anonymous reporter", async () => {
    await submitSpamReport(ok);
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ reporter_email: null }));
    expect(emailCall()[2]).toContain("Not given");
  });

  it("checks every field on the server", async () => {
    await expect(submitSpamReport({ ...ok, companyName: " " })).resolves.toEqual({ ok: false, error: "Add the company or sender name." });
    await expect(submitSpamReport({ ...ok, senderEmail: "acme" })).resolves.toEqual({ ok: false, error: "Add the sender's email address." });
    await expect(submitSpamReport({ ...ok, spamType: "other" })).resolves.toEqual({ ok: false, error: "Pick the type and how often." });
    await expect(submitSpamReport({ ...ok, frequency: "hourly" })).resolves.toEqual({ ok: false, error: "Pick the type and how often." });
    await expect(submitSpamReport({ ...ok, description: "short" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/10 characters/) });
    await expect(submitSpamReport({ ...ok, reporterEmail: "bad" })).resolves.toEqual({ ok: false, error: "That email address doesn't look right." });
    await expect(submitSpamReport({ ...ok, website: "bot" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("sends no email when saving fails", async () => {
    supabaseResult.count = 5;
    await expect(submitSpamReport(ok)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitBrewSoul", () => {
  it("saves a coffee suggestion and emails it as a submission", async () => {
    await expect(
      submitBrewSoul({ kind: "submit", coffeeName: "Ethiopia Guji", roaster: "Onyx", url: "https://onyx.coffee", notes: "Bright" }),
    ).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("brewsoul_submissions");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "submit", coffee_name: "Ethiopia Guji", roaster: "Onyx", url: "https://onyx.coffee", notes: "Bright" }),
    );
    const [, subject, html] = emailCall();
    expect(subject).toBe("BrewSoul coffee submission: Ethiopia Guji");
    expect(html).toContain("Why it should be added");
    expect(html).toContain("/brewsoul/submit");
  });

  it("labels a score appeal as an appeal", async () => {
    await submitBrewSoul({ kind: "appeal", coffeeName: "House Blend", notes: "Wrong origin" });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ kind: "appeal", roaster: null, url: null }));
    const [, subject, html] = emailCall();
    expect(subject).toBe("BrewSoul score appeal: House Blend");
    expect(html).toContain("What we got wrong");
    expect(html).toContain("score appeal");
  });

  it("refuses an unknown kind, a missing name or a bad link, and drops the honeypot", async () => {
    await expect(submitBrewSoul({ kind: "x" as "submit", coffeeName: "A" })).resolves.toEqual({ ok: false, error: "Something went wrong." });
    await expect(submitBrewSoul({ kind: "submit", coffeeName: "  " })).resolves.toEqual({ ok: false, error: "Add the coffee's name." });
    await expect(submitBrewSoul({ kind: "submit", coffeeName: "A", url: "onyx.coffee" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/http/) });
    await expect(submitBrewSoul({ kind: "submit", coffeeName: "A", website: "bot" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("sends no email when saving fails", async () => {
    supabaseResult.error = { message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(submitBrewSoul({ kind: "submit", coffeeName: "A" })).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
