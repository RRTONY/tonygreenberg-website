import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addPriceAlert,
  addTastingEntry,
  createTradeListing,
  deletePriceAlert,
  deleteTastingEntry,
  deleteTradeListing,
  getMyBusinessProfile,
  getSoulsmokeMember,
  listPriceAlerts,
  listTastingEntries,
  listTradeListings,
  saveBusinessProfile,
  sendTradeMessage,
  wantBottle,
} from "@/app/soul-smoke/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { sendEmail } from "@/lib/email";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";

type Result = { data?: unknown; error?: unknown; count?: number | null };

// Every awaited query (a plain await, .single() or .maybeSingle()) takes the next result, in order.
function seq(...results: Result[]) {
  const queue = [...results];
  const next = () => ({ data: null, error: null, count: null, ...(queue.shift() ?? {}) });
  const chain = fakeSupabase.chain;
  chain.then = (resolve, reject) => Promise.resolve(next()).then(resolve, reject);
  chain.single.mockImplementation(async () => next());
  chain.maybeSingle.mockImplementation(async () => next());
}

const ME = { id: "me-uuid", email: "me@example.com" };
function signIn() {
  fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: ME }, error: null } as never);
}
function withOwner(email: string | null) {
  const getUserById = vi.fn(async () => ({ data: { user: email ? { email } : null }, error: null }));
  Object.assign(fakeSupabase.auth, { admin: { getUserById } });
  return getUserById;
}
const emailArgs = () => vi.mocked(sendEmail).mock.calls[0] as unknown as [string, string, string];

const tastingRow = {
  id: 7,
  mezcal_name: "Tobala",
  producer: null,
  agave_type: "tobala",
  region: null,
  abv: "48%",
  rating: 5,
  notes: null,
  smoke_level: 2,
  sweetness_level: null,
  complexity_level: 4,
  would_buy_again: true,
  tasted_at: "2026-11-10T00:00:00Z",
};

const listingRow = {
  id: 12,
  user_id: ME.id,
  mezcal_name: "Pechuga",
  producer: "Real Minero",
  agave_type: null,
  abv: null,
  bottle_size: "750ml",
  condition: "sealed",
  fill_level: null,
  listing_type: "sell",
  asking_price: 9900,
  seeking_bottles: null,
  description: null,
  location: "Austin",
  created_at: "2026-11-10T00:00:00Z",
};

const profileRow = {
  id: 3,
  business_type: "bar",
  business_name: "Agave Bar",
  contact_name: null,
  contact_email: "bar@example.com",
  phone: null,
  website: null,
  city: "Oaxaca",
  state: null,
  country: "MX",
  license_type: null,
  annual_volume: null,
  focus_categories: null,
  bio: null,
  is_verified: false,
  created_at: "2026-11-10T00:00:00Z",
};

const profileInput = { businessType: "bar" as const, businessName: "Agave Bar", contactEmail: "bar@example.com", city: "Oaxaca", country: "MX" };

describe("getSoulsmokeMember", () => {
  it("says whether a member is signed in", async () => {
    await expect(getSoulsmokeMember()).resolves.toEqual({ signedIn: false });
    signIn();
    await expect(getSoulsmokeMember()).resolves.toEqual({ signedIn: true });
  });
});

describe("member-only actions when signed out or not set up", () => {
  const calls = [
    () => listTastingEntries(),
    () => addTastingEntry({ mezcalName: "X", wouldBuyAgain: false }),
    () => deleteTastingEntry("1"),
    () => listPriceAlerts(),
    () => addPriceAlert({ mezcalName: "X", targetPrice: null }),
    () => deletePriceAlert("1"),
    () => createTradeListing({ mezcalName: "X", condition: "sealed", listingType: "both" }),
    () => deleteTradeListing("1"),
    () => sendTradeMessage({ listingId: "1", message: "hi" }),
    () => getMyBusinessProfile(),
    () => saveBusinessProfile(profileInput),
    () => wantBottle({ bottleId: "b1", bottleName: "B", interestType: "consumer", quantity: "", notes: "" }),
  ];

  it("asks a signed-out visitor to sign in and touches nothing", async () => {
    for (const call of calls) await expect(call()).resolves.toEqual({ ok: false, error: "Please sign in first.", signedOut: true });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("says it can't save when the service-role key isn't set up", async () => {
    signIn();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    for (const call of calls) await expect(call()).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/couldn't be saved/) });
    await expect(listTradeListings()).resolves.toMatchObject({ ok: false });
  });
});

describe("tasting journal", () => {
  beforeEach(() => {
    signIn();
  });

  it("lists the member's own entries, mapped to the page's shape", async () => {
    seq({ data: [tastingRow] });
    const res = await listTastingEntries();
    expect(fakeSupabase.from).toHaveBeenCalledWith("soulsmoke_tasting_entries");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
    expect(res).toEqual({
      ok: true,
      data: [
        {
          id: "7",
          mezcalName: "Tobala",
          producer: undefined,
          agaveType: "tobala",
          region: undefined,
          abv: "48%",
          rating: 5,
          notes: undefined,
          smokeLevel: 2,
          sweetnessLevel: undefined,
          complexityLevel: 4,
          wouldBuyAgain: true,
          tastedAt: "2026-11-10T00:00:00Z",
        },
      ],
    });
  });

  it("adds an entry, dropping out-of-range levels and trimming text", async () => {
    seq({ count: 0 }, { data: tastingRow });
    const res = await addTastingEntry({
      mezcalName: "  Tobala ",
      producer: "  ",
      rating: 9,
      smokeLevel: 2,
      sweetnessLevel: 2.5,
      wouldBuyAgain: true,
    });
    expect(res).toMatchObject({ ok: true, data: { id: "7", mezcalName: "Tobala" } });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: ME.id, mezcal_name: "Tobala", producer: null, rating: null, smoke_level: 2, sweetness_level: null, would_buy_again: true }),
    );
  });

  it("needs a name, and stops a flood", async () => {
    await expect(addTastingEntry({ mezcalName: "   ", wouldBuyAgain: false })).resolves.toEqual({ ok: false, error: "Mezcal name is required" });
    seq({ count: 30 });
    await expect(addTastingEntry({ mezcalName: "X", wouldBuyAgain: false })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait a few minutes/) });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("deletes only the member's own entry, and refuses a bad id", async () => {
    seq({});
    await expect(deleteTastingEntry("7")).resolves.toEqual({ ok: true, data: null });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("id", "7");
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
    await expect(deleteTastingEntry("abc")).resolves.toMatchObject({ ok: false });
  });

  it("returns the generic error when the database fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ error: { message: "down" } });
    await expect(listTastingEntries()).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/couldn't be saved/) });
    seq({ count: 0 }, { error: { message: "down" } });
    await expect(addTastingEntry({ mezcalName: "X", wouldBuyAgain: false })).resolves.toMatchObject({ ok: false });
    seq({ error: { message: "down" } });
    await expect(deleteTastingEntry("7")).resolves.toMatchObject({ ok: false });
  });
});

describe("price alerts", () => {
  beforeEach(() => {
    signIn();
  });

  const alertRow = { id: 4, mezcal_name: "Tepeztate", target_price: 12000, created_at: "2026-11-10T00:00:00Z" };

  it("lists active alerts and adds one in whole cents", async () => {
    seq({ data: [alertRow] });
    await expect(listPriceAlerts()).resolves.toEqual({
      ok: true,
      data: [{ id: "4", mezcalName: "Tepeztate", targetPrice: 12000, createdAt: "2026-11-10T00:00:00Z" }],
    });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("is_active", true);
    seq({ count: 0 }, { data: alertRow });
    await expect(addPriceAlert({ mezcalName: "Tepeztate", targetPrice: 11999.6 })).resolves.toMatchObject({ ok: true, data: { id: "4" } });
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ user_id: ME.id, mezcal_name: "Tepeztate", target_price: 12000 });
  });

  it("drops a negative price, needs a name, and stops a flood", async () => {
    seq({ count: 0 }, { data: alertRow });
    await addPriceAlert({ mezcalName: "X", targetPrice: -5 });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ target_price: null }));
    await expect(addPriceAlert({ mezcalName: "", targetPrice: null })).resolves.toEqual({ ok: false, error: "Mezcal name is required" });
    seq({ count: 30 });
    await expect(addPriceAlert({ mezcalName: "X", targetPrice: null })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait/) });
  });

  it("deletes the member's own alert, refuses a bad id, and reports database errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seq({});
    await expect(deletePriceAlert("4")).resolves.toEqual({ ok: true, data: null });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
    await expect(deletePriceAlert("4; drop")).resolves.toMatchObject({ ok: false });
    seq({ error: { message: "down" } });
    await expect(deletePriceAlert("4")).resolves.toMatchObject({ ok: false });
    seq({ error: { message: "down" } });
    await expect(listPriceAlerts()).resolves.toMatchObject({ ok: false });
    seq({ count: 0 }, { error: { message: "down" } });
    await expect(addPriceAlert({ mezcalName: "X", targetPrice: null })).resolves.toMatchObject({ ok: false });
  });
});

describe("trade board", () => {
  it("shows every active listing to anyone, marking none as theirs when signed out", async () => {
    seq({ data: [listingRow] });
    const res = await listTradeListings();
    expect(res).toMatchObject({
      ok: true,
      data: { signedIn: false, listings: [{ id: "12", mezcalName: "Pechuga", askingPrice: 9900, location: "Austin", isMine: false }] },
    });
    expect(JSON.stringify(res)).not.toContain(ME.id);
  });

  it("marks the signed-in member's own listings", async () => {
    signIn();
    seq({ data: [listingRow, { ...listingRow, id: 13, user_id: "someone-else" }] });
    const res = await listTradeListings();
    expect(res).toMatchObject({ ok: true, data: { signedIn: true, listings: [{ isMine: true }, { isMine: false }] } });
  });

  it("reports a database error on the public list", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ error: { message: "down" } });
    await expect(listTradeListings()).resolves.toMatchObject({ ok: false });
  });

  describe("signed in", () => {
    beforeEach(() => {
      signIn();
    });

    it("creates a listing, falling back to safe condition and type values", async () => {
      seq({ count: 0 }, { data: listingRow });
      const res = await createTradeListing({
        mezcalName: " Pechuga ",
        condition: "broken" as never,
        listingType: "swap" as never,
        askingPrice: 9900,
        location: "Austin",
      });
      expect(res).toMatchObject({ ok: true, data: { id: "12", isMine: true } });
      expect(fakeSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: ME.id, mezcal_name: "Pechuga", condition: "sealed", listing_type: "both", asking_price: 9900, producer: null }),
      );
    });

    it("needs a name, stops a flood and reports database errors", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      await expect(createTradeListing({ mezcalName: "", condition: "sealed", listingType: "both" })).resolves.toEqual({
        ok: false,
        error: "Mezcal name is required",
      });
      seq({ count: 10 });
      await expect(createTradeListing({ mezcalName: "X", condition: "sealed", listingType: "both" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait/) });
      seq({ count: 0 }, { error: { message: "down" } });
      await expect(createTradeListing({ mezcalName: "X", condition: "sealed", listingType: "both" })).resolves.toMatchObject({ ok: false });
    });

    it("deletes only the member's own listing", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      seq({});
      await expect(deleteTradeListing("12")).resolves.toEqual({ ok: true, data: null });
      expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
      await expect(deleteTradeListing("")).resolves.toMatchObject({ ok: false });
      seq({ error: { message: "down" } });
      await expect(deleteTradeListing("12")).resolves.toMatchObject({ ok: false });
    });
  });
});

describe("sendTradeMessage", () => {
  beforeEach(() => {
    signIn();
  });

  const listing = { id: 12, user_id: "seller-uuid", mezcal_name: "Pechuga", is_active: true };

  it("saves the message and emails the seller with the sender's email to reply to", async () => {
    const getUserById = withOwner("seller@example.com");
    seq({ data: listing }, { count: 0 }, {});
    await expect(sendTradeMessage({ listingId: "12", message: "  Still available? " })).resolves.toEqual({ ok: true, data: null });
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ listing_id: 12, sender_id: ME.id, receiver_id: "seller-uuid", message: "Still available?" });
    expect(getUserById).toHaveBeenCalledWith("seller-uuid");
    const [to, subject, html] = emailArgs();
    expect(to).toBe("seller@example.com");
    expect(subject).toContain("Pechuga");
    expect(html).toContain("Still available?");
    expect(html).toContain(ME.email);
  });

  it("sends no email when the seller has no email address", async () => {
    withOwner(null);
    seq({ data: listing }, { count: 0 }, {});
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toEqual({ ok: true, data: null });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("refuses a blank message, a bad id, a missing or inactive listing, and the member's own listing", async () => {
    await expect(sendTradeMessage({ listingId: "12", message: "  " })).resolves.toEqual({ ok: false, error: "Message is required" });
    await expect(sendTradeMessage({ listingId: "x", message: "hi" })).resolves.toMatchObject({ ok: false });
    seq({ data: null });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toEqual({ ok: false, error: "This listing is no longer available." });
    seq({ data: { ...listing, is_active: false } });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toEqual({ ok: false, error: "This listing is no longer available." });
    seq({ data: { ...listing, user_id: ME.id } });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toEqual({ ok: false, error: "This is your own listing." });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("stops a flood and reports database errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ data: listing }, { count: 10 });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait/) });
    seq({ error: { message: "down" } });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toMatchObject({ ok: false });
    seq({ data: listing }, { count: 0 }, { error: { message: "down" } });
    await expect(sendTradeMessage({ listingId: "12", message: "hi" })).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("business profiles", () => {
  beforeEach(() => {
    signIn();
  });

  it("reads the member's profile, or null when there is none", async () => {
    seq({ data: profileRow });
    await expect(getMyBusinessProfile()).resolves.toMatchObject({
      ok: true,
      data: { businessType: "bar", businessName: "Agave Bar", contactEmail: "bar@example.com", city: "Oaxaca", contactName: undefined, isVerified: false },
    });
    expect(fakeSupabase.eq).toHaveBeenCalledWith("user_id", ME.id);
    seq({ data: null });
    await expect(getMyBusinessProfile()).resolves.toEqual({ ok: true, data: null });
  });

  it("creates a profile and emails Tony about the new business", async () => {
    seq({ data: null }, { data: profileRow });
    await expect(saveBusinessProfile(profileInput)).resolves.toMatchObject({ ok: true, data: { businessName: "Agave Bar" } });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: ME.id, business_type: "bar", business_name: "Agave Bar", phone: null }));
    const [to, subject, html] = emailArgs();
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toContain("Agave Bar");
    expect(html).toContain("Oaxaca, MX");
  });

  it("falls back to the member's sign-in email in Tony's email", async () => {
    seq({ data: null }, { data: profileRow });
    await saveBusinessProfile({ ...profileInput, contactEmail: "" });
    expect(emailArgs()[2]).toContain(ME.email);
  });

  it("updates an existing profile without emailing Tony again", async () => {
    seq({ data: { id: 3 } }, { data: profileRow });
    await expect(saveBusinessProfile(profileInput)).resolves.toMatchObject({ ok: true });
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ business_name: "Agave Bar", updated_at: expect.any(String) }));
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("checks the name, type and email on the server", async () => {
    await expect(saveBusinessProfile({ ...profileInput, businessName: " " })).resolves.toEqual({ ok: false, error: "Business name is required" });
    await expect(saveBusinessProfile({ ...profileInput, businessType: "casino" as never })).resolves.toEqual({ ok: false, error: "Choose a business type" });
    await expect(saveBusinessProfile({ ...profileInput, contactEmail: "nope" })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/email/) });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("reports database errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ error: { message: "down" } });
    await expect(getMyBusinessProfile()).resolves.toMatchObject({ ok: false });
    seq({ data: null }, { error: { message: "down" } });
    await expect(saveBusinessProfile(profileInput)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("wantBottle", () => {
  beforeEach(() => {
    signIn();
  });

  const want = { bottleId: "us-1", bottleName: "Pechuga", interestType: "retailer" as const, quantity: "1 case", notes: "  For the bar " };

  it("saves the request, links the member's business profile and emails Tony", async () => {
    seq({ count: 0 }, { data: { id: 3 } }, {});
    await expect(wantBottle(want)).resolves.toEqual({ ok: true, data: null });
    expect(fakeSupabase.from).toHaveBeenCalledWith("soulsmoke_bottle_interests");
    expect(fakeSupabase.insert).toHaveBeenCalledWith({
      user_id: ME.id,
      business_profile_id: 3,
      bottle_id: "us-1",
      bottle_name: "Pechuga",
      interest_type: "retailer",
      quantity: "1 case",
      notes: "For the bar",
    });
    const [to, subject, html] = emailArgs();
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toContain("Pechuga");
    expect(html).toContain("Pechuga (us-1)");
    expect(html).toContain(ME.email);
  });

  it("works without a business profile and an unknown type becomes consumer", async () => {
    seq({ count: 0 }, { data: null }, {});
    await wantBottle({ ...want, interestType: "whale" as never, quantity: "", notes: "" });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ business_profile_id: null, interest_type: "consumer", quantity: null, notes: null }));
    expect(emailArgs()[2]).toContain("1 bottle");
  });

  it("refuses a missing bottle, stops a flood and reports database errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(wantBottle({ ...want, bottleId: " " })).resolves.toMatchObject({ ok: false });
    await expect(wantBottle({ ...want, bottleName: "" })).resolves.toMatchObject({ ok: false });
    seq({ count: 20 });
    await expect(wantBottle(want)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait/) });
    seq({ count: 0 }, { data: null }, { error: { message: "down" } });
    await expect(wantBottle(want)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
