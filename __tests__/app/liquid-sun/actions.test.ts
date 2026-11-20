import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addLogEntry,
  deleteLogEntry,
  getLiquidsunMember,
  listLogEntries,
  openBillingPortal,
  startPremiumCheckout,
  submitPartnerInquiry,
} from "@/app/liquid-sun/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { headerJar } from "@tests/helpers/next";
import { sendEmail } from "@/lib/email";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";
import {
  createCheckoutSession,
  createCustomer,
  createPortalSession,
  getPlanPriceId,
  isStripeConfigured,
} from "@/lib/stripe";
import type { PartnerValues } from "@/lib/content/liquidsun/forms";

vi.mock("@/lib/stripe", () => ({
  isStripeConfigured: vi.fn(() => true),
  createCustomer: vi.fn(async () => ({ id: "cus_new" })),
  getPlanPriceId: vi.fn(async () => "price_123"),
  createCheckoutSession: vi.fn(async () => "https://checkout.stripe.com/c/pay/cs_test_1"),
  createPortalSession: vi.fn(async () => "https://billing.stripe.com/p/session/test_1"),
}));

type Result = { data?: unknown; error?: unknown; count?: number | null };

// Plain awaits, .single() and .maybeSingle() each take the next result from their own queue,
// so parallel queries (Promise.all) don't depend on the order microtasks run in.
function results({ then = [], single = [], maybe = [] }: { then?: Result[]; single?: Result[]; maybe?: Result[] }) {
  const fill = (r?: Result) => ({ data: null, error: null, count: null, ...(r ?? {}) });
  const chain = fakeSupabase.chain;
  chain.then = (resolve, reject) => Promise.resolve(fill(then.shift())).then(resolve, reject);
  chain.single.mockImplementation(async () => fill(single.shift()));
  chain.maybeSingle.mockImplementation(async () => fill(maybe.shift()));
}

const ME = { id: "9b2f4a1e-1111-4222-8333-444455556666", email: "me@example.com" };
function signIn(user: { id: string; email?: string | null } = ME) {
  fakeSupabase.auth.getUser.mockResolvedValue({ data: { user }, error: null } as never);
}

const partner: PartnerValues = {
  brandName: "Fortaleza <b>",
  contactName: "Guillermo",
  contactEmail: "g@fortaleza.mx",
  nom: "1493",
  website: "https://fortaleza.mx",
  message: "We use a tahona.",
  tierInterest: "spotlight",
};

const future = new Date(Date.now() + 86_400_000).toISOString();
const past = new Date(Date.now() - 86_400_000).toISOString();

beforeEach(() => {
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(isStripeConfigured).mockReturnValue(true);
  vi.mocked(createCustomer).mockResolvedValue({ id: "cus_new" });
  vi.mocked(getPlanPriceId).mockResolvedValue("price_123");
  vi.mocked(createCheckoutSession).mockResolvedValue("https://checkout.stripe.com/c/pay/cs_test_1");
  vi.mocked(createPortalSession).mockResolvedValue("https://billing.stripe.com/p/session/test_1");
  vi.mocked(sendEmail).mockResolvedValue(true);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getLiquidsunMember", () => {
  it("is signed out without a session", async () => {
    expect(await getLiquidsunMember()).toEqual({
      signedIn: false,
      isPremium: false,
      subscriptionStatus: null,
      currentPeriodEnd: null,
      hasCustomer: false,
    });
  });

  it("is only signed in when the database isn't configured", async () => {
    signIn();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await getLiquidsunMember()).toMatchObject({ signedIn: true, isPremium: false });
  });

  it("is Premium with an active subscription that hasn't ended", async () => {
    signIn();
    results({
      then: [{ data: [{ status: "active", current_period_end: future }] }],
      maybe: [{ data: { stripe_customer_id: "cus_1" } }],
    });
    expect(await getLiquidsunMember()).toEqual({
      signedIn: true,
      isPremium: true,
      subscriptionStatus: "active",
      currentPeriodEnd: future,
      hasCustomer: true,
    });
    expect(fakeSupabase.from).toHaveBeenCalledWith("liquidsun_subscriptions");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
  });

  it("counts a trial and a row without an end date", async () => {
    signIn();
    results({ then: [{ data: [{ status: "trialing", current_period_end: null }] }] });
    expect(await getLiquidsunMember()).toMatchObject({ isPremium: true, subscriptionStatus: "trialing", hasCustomer: false });
  });

  it("is not Premium when the period has ended or the subscription is canceled", async () => {
    signIn();
    results({ then: [{ data: [{ status: "active", current_period_end: past }] }] });
    expect(await getLiquidsunMember()).toMatchObject({ isPremium: false, subscriptionStatus: "active" });

    results({ then: [{ data: [{ status: "canceled", current_period_end: future }] }] });
    expect(await getLiquidsunMember()).toMatchObject({ isPremium: false, subscriptionStatus: "canceled" });

    results({ then: [{ data: null }] });
    expect(await getLiquidsunMember()).toMatchObject({ isPremium: false, subscriptionStatus: null });
  });
});

describe("The Log", () => {
  const row = { id: 4, producer_id: "fortaleza-blanco", rating: 5, notes: null, created_at: "2026-11-21T00:00:00Z" };

  it("needs a signed-in member and a configured database", async () => {
    expect(await listLogEntries()).toEqual({ ok: false, error: "Please sign in first.", signedOut: true });
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await listLogEntries()).toMatchObject({ ok: false, error: expect.stringContaining("couldn't be saved") });
  });

  it("lists the member's own entries", async () => {
    signIn();
    results({ then: [{ data: [row] }] });
    expect(await listLogEntries()).toEqual({
      ok: true,
      data: [{ id: "4", producerId: "fortaleza-blanco", rating: 5, notes: "", date: "2026-11-21T00:00:00Z" }],
    });
    expect(fakeSupabase.from).toHaveBeenCalledWith("liquidsun_tasting_entries");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
  });

  it("reports a database error without details", async () => {
    signIn();
    results({ then: [{ error: { message: "boom" } }] });
    expect(await listLogEntries()).toEqual({ ok: false, error: expect.stringContaining("couldn't be saved") });
  });

  it("re-checks each entry on the server", async () => {
    signIn();
    expect(await addLogEntry({ producerId: "not-a-bottle", rating: 3, notes: "" })).toEqual({
      ok: false,
      error: "Choose a spirit from the list.",
    });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 0, notes: "   " })).toEqual({
      ok: false,
      error: "Add a rating or a note first.",
    });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 9, notes: "x" })).toMatchObject({ ok: false });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 2, notes: "x".repeat(5001) })).toMatchObject({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("refuses a signed-out visitor after validation", async () => {
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 3, notes: "" })).toMatchObject({ signedOut: true });
  });

  it("stops a flood of entries", async () => {
    signIn();
    results({ then: [{ count: 30 }] });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 3, notes: "" })).toEqual({
      ok: false,
      error: expect.stringContaining("a lot at once"),
    });
  });

  it("saves an entry scoped to the member", async () => {
    signIn();
    results({ then: [{ count: 0 }], single: [{ data: { ...row, notes: "Olive" } }] });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 5, notes: "  Olive " })).toMatchObject({
      ok: true,
      data: { id: "4", notes: "Olive" },
    });
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ user_id: ME.id, producer_id: "fortaleza-blanco", rating: 5, notes: "Olive" });
  });

  it("stores an empty note as null and reports insert errors", async () => {
    signIn();
    results({ then: [{ count: 0 }], single: [{ error: { message: "nope" } }] });
    expect(await addLogEntry({ producerId: "fortaleza-blanco", rating: 2, notes: "" })).toMatchObject({ ok: false });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ notes: null }));
  });

  it("deletes only the member's own row", async () => {
    expect(await deleteLogEntry("abc")).toMatchObject({ ok: false });
    expect(await deleteLogEntry("4")).toMatchObject({ signedOut: true });
    signIn();
    results({ then: [{}] });
    expect(await deleteLogEntry("4")).toEqual({ ok: true, data: null });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("id", "4");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
    results({ then: [{ error: { message: "x" } }] });
    expect(await deleteLogEntry("4")).toMatchObject({ ok: false });
  });
});

describe("submitPartnerInquiry", () => {
  const invalid: [string, Partial<PartnerValues>][] = [
    ["missing brand", { brandName: " " }],
    ["missing contact", { contactName: "" }],
    ["missing email", { contactEmail: "" }],
    ["bad email", { contactEmail: "not-an-email" }],
    ["long brand", { brandName: "x".repeat(257) }],
    ["long NOM", { nom: "1".repeat(33) }],
    ["website without http", { website: "fortaleza.mx" }],
    ["long message", { message: "x".repeat(5001) }],
    ["unknown tier", { tierInterest: "gold" as never }],
  ];

  it.each(invalid)("re-checks the form on the server: %s", async (_label, change) => {
    signIn();
    const result = await submitPartnerInquiry({ ...partner, ...change });
    expect(result.ok).toBe(false);
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("needs a signed-in member", async () => {
    expect(await submitPartnerInquiry(partner)).toMatchObject({ signedOut: true });
  });

  it("stops a flood of inquiries", async () => {
    signIn();
    results({ then: [{ count: 5 }] });
    expect(await submitPartnerInquiry(partner)).toMatchObject({ ok: false, error: expect.stringContaining("a lot at once") });
  });

  it("saves the inquiry and emails Tony with the text escaped", async () => {
    signIn();
    results({ then: [{ count: 0 }, {}] });
    expect(await submitPartnerInquiry(partner)).toEqual({ ok: true, data: null });
    expect(fakeSupabase.from).toHaveBeenCalledWith("liquidsun_partner_inquiries");
    expect(fakeSupabase.insert).toHaveBeenCalledWith({
      user_id: ME.id,
      brand_name: "Fortaleza <b>",
      contact_name: "Guillermo",
      contact_email: "g@fortaleza.mx",
      nom: "1493",
      website: "https://fortaleza.mx",
      tier_interest: "spotlight",
      message: "We use a tahona.",
    });
    const [to, subject, html] = vi.mocked(sendEmail).mock.calls[0] as unknown as [string, string, string];
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toBe("LiquidSun: New Partner Inquiry: Fortaleza <b>");
    expect(html).toContain("Fortaleza &lt;b&gt;");
    expect(html).not.toContain("Fortaleza <b>");
    expect(html).toContain("SPOTLIGHT");
    expect(html).toContain("me@example.com");
    expect(html).toContain("https://tonygreenberg.com/liquid-sun/partner");
  });

  it("accepts empty optional fields and leaves them out of the email", async () => {
    signIn();
    results({ then: [{ count: 0 }, {}] });
    const result = await submitPartnerInquiry({ ...partner, nom: "", website: "", message: "" });
    expect(result.ok).toBe(true);
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ nom: null, website: null, message: null }));
    const html = vi.mocked(sendEmail).mock.calls[0][2] as string;
    expect(html).not.toContain(">NOM<");
  });

  it("reports a database error and sends no email", async () => {
    signIn();
    results({ then: [{ count: 0 }, { error: { message: "down" } }] });
    expect(await submitPartnerInquiry(partner)).toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("startPremiumCheckout", () => {
  it("refuses an unknown plan and an unconfigured Stripe", async () => {
    expect(await startPremiumCheckout("weekly" as never)).toMatchObject({ ok: false, error: expect.stringContaining("Checkout") });
    vi.mocked(isStripeConfigured).mockReturnValue(false);
    expect(await startPremiumCheckout("monthly")).toMatchObject({ ok: false });
  });

  it("needs a signed-in member", async () => {
    expect(await startPremiumCheckout("annual")).toMatchObject({ signedOut: true });
  });

  it("tells a Premium member they already are", async () => {
    signIn();
    results({ then: [{ data: [{ status: "active", current_period_end: future }] }] });
    expect(await startPremiumCheckout("annual")).toEqual({ ok: false, error: "You're already Premium." });
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("creates and saves a Stripe customer the first time, then a checkout link", async () => {
    signIn();
    headerJar.set("host", "localhost:3000");
    results({ then: [{ data: [] }, {}], maybe: [{ data: null }] });
    expect(await startPremiumCheckout("monthly")).toEqual({
      ok: true,
      data: { url: "https://checkout.stripe.com/c/pay/cs_test_1" },
    });
    expect(createCustomer).toHaveBeenCalledWith({ email: ME.email, userId: ME.id });
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ user_id: ME.id, stripe_customer_id: "cus_new" });
    expect(getPlanPriceId).toHaveBeenCalledWith("monthly");
    expect(createCheckoutSession).toHaveBeenCalledWith({
      customerId: "cus_new",
      priceId: "price_123",
      userId: ME.id,
      plan: "monthly",
      origin: "http://localhost:3000",
    });
  });

  it("reuses the saved customer and the forwarded host", async () => {
    signIn();
    headerJar.set("x-forwarded-host", "tonygreenberg.com");
    headerJar.set("x-forwarded-proto", "https");
    results({ then: [{ data: [] }], maybe: [{ data: { stripe_customer_id: "cus_old" } }] });
    await startPremiumCheckout("annual");
    expect(createCustomer).not.toHaveBeenCalled();
    expect(createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ customerId: "cus_old", plan: "annual", origin: "https://tonygreenberg.com" }),
    );
  });

  it("falls back to the site URL when the host header is odd", async () => {
    signIn();
    headerJar.set("host", "evil.com/<script>");
    results({ then: [{ data: [] }], maybe: [{ data: { stripe_customer_id: "cus_old" } }] });
    await startPremiumCheckout("annual");
    expect(createCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({ origin: "https://tonygreenberg.com" }));
  });

  it("reports a failed customer save", async () => {
    signIn();
    results({ then: [{ data: [] }, { error: { message: "dup" } }], maybe: [{ data: null }] });
    expect(await startPremiumCheckout("monthly")).toMatchObject({ ok: false, error: expect.stringContaining("couldn't be saved") });
  });

  it("turns a Stripe error into a friendly message", async () => {
    signIn();
    results({ then: [{ data: [] }], maybe: [{ data: { stripe_customer_id: "cus_old" } }] });
    vi.mocked(createCheckoutSession).mockRejectedValueOnce(new Error("No such price"));
    expect(await startPremiumCheckout("monthly")).toEqual({
      ok: false,
      error: "Checkout isn't available just now. Please try again in a minute.",
    });
    vi.mocked(getPlanPriceId).mockRejectedValueOnce("weird");
    results({ then: [{ data: [] }], maybe: [{ data: { stripe_customer_id: "cus_old" } }] });
    expect(await startPremiumCheckout("monthly")).toMatchObject({ ok: false });
  });
});

describe("openBillingPortal", () => {
  it("needs Stripe and a signed-in member", async () => {
    vi.mocked(isStripeConfigured).mockReturnValue(false);
    expect(await openBillingPortal()).toMatchObject({ ok: false });
    vi.mocked(isStripeConfigured).mockReturnValue(true);
    expect(await openBillingPortal()).toMatchObject({ signedOut: true });
  });

  it("needs a Stripe customer", async () => {
    signIn();
    results({ maybe: [{ data: null }] });
    expect(await openBillingPortal()).toEqual({ ok: false, error: "No Stripe customer found. Please subscribe first." });
  });

  it("opens the portal for the member's customer", async () => {
    signIn();
    headerJar.set("host", "tonygreenberg.com");
    results({ maybe: [{ data: { stripe_customer_id: "cus_1" } }] });
    expect(await openBillingPortal()).toEqual({ ok: true, data: { url: "https://billing.stripe.com/p/session/test_1" } });
    expect(createPortalSession).toHaveBeenCalledWith({ customerId: "cus_1", origin: "https://tonygreenberg.com" });
  });

  it("reports a portal failure", async () => {
    signIn();
    results({ maybe: [{ data: { stripe_customer_id: "cus_1" } }] });
    vi.mocked(createPortalSession).mockRejectedValueOnce(new Error("x"));
    expect(await openBillingPortal()).toEqual({ ok: false, error: "Failed to open billing portal" });
    results({ maybe: [{ data: { stripe_customer_id: "cus_1" } }] });
    vi.mocked(createPortalSession).mockRejectedValueOnce("y");
    expect(await openBillingPortal()).toMatchObject({ ok: false });
  });
});
