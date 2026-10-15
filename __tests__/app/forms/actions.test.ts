import { describe, expect, it } from "vitest";
import { submitStory, submitPriConsent } from "@/app/forms/actions";
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
