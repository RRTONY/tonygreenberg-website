import { describe, expect, it, vi } from "vitest";
import { getFeaturedSparks, getGemSparkCounts, submitGemSparkStory, trackGemSparkView } from "@/app/gem-spark/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { sendEmail } from "@/lib/email";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";

type Result = { data?: unknown; error?: unknown; count?: number | null };

// Every awaited query (a plain await or .single()) takes the next result, in order.
function seq(...results: Result[]) {
  const queue = [...results];
  const next = () => ({ data: null, error: null, count: null, ...(queue.shift() ?? {}) });
  const chain = fakeSupabase.chain;
  chain.then = (resolve, reject) => Promise.resolve(next()).then(resolve, reject);
  chain.single.mockImplementation(async () => next());
}

const STORY = "A wrong turn led me to the right person.";
const emailArgs = () => vi.mocked(sendEmail).mock.calls[0] as unknown as [string, string, string];

describe("submitGemSparkStory", () => {
  it("rejects a story under 10 characters or a bad email, touching nothing", async () => {
    await expect(submitGemSparkStory({ story: "   short  " })).resolves.toEqual({ ok: false, error: "Story must be at least 10 characters" });
    await expect(submitGemSparkStory({ story: STORY, email: "nope" })).resolves.toEqual({
      ok: false,
      error: "That email address doesn't look right.",
    });
    await expect(submitGemSparkStory({ story: 42 as unknown as string })).resolves.toMatchObject({ ok: false });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("says it can't send when the database isn't set up", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(submitGemSparkStory({ story: STORY })).resolves.toEqual({
      ok: false,
      error: "This couldn't be sent just now. Please try again in a minute.",
    });
  });

  it("saves the story with the visitor id and emails Tony, escaping it", async () => {
    seq({ count: 0 }, { data: { id: 9 } });
    await expect(submitGemSparkStory({ story: `${STORY} <b>`, email: " me@example.com " })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("gemspark_story_submissions");
    expect(fakeSupabase.chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ story: `${STORY} <b>`, email: "me@example.com", user_id: null, session_id: expect.any(String) }),
    );
    const [to, subject, html] = emailArgs();
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toMatch(/GemSpark/);
    expect(html).toContain("me@example.com");
    expect(html).toContain("&lt;b&gt;");
    expect(html).toContain("Submission: 9");
  });

  it("stores no email when none is given and says so to Tony", async () => {
    seq({ count: 0 }, { data: { id: 1 } });
    await submitGemSparkStory({ story: STORY });
    expect(fakeSupabase.chain.insert).toHaveBeenCalledWith(expect.objectContaining({ email: null }));
    expect(emailArgs()[2]).toContain("Not provided");
  });

  it("records the signed-in member when there is one", async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null } as never);
    seq({ count: 0 }, { data: { id: 2 } });
    await submitGemSparkStory({ story: STORY });
    expect(fakeSupabase.chain.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "u1" }));
  });

  it("stops a flood from one browser", async () => {
    seq({ count: 5 });
    await expect(submitGemSparkStory({ story: STORY })).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait a few minutes/) });
    expect(fakeSupabase.chain.insert).not.toHaveBeenCalled();
  });

  it("returns the generic error when saving fails, and sends no email", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ count: null }, { error: { message: "boom" } });
    await expect(submitGemSparkStory({ story: STORY })).resolves.toEqual({
      ok: false,
      error: "This couldn't be sent just now. Please try again in a minute.",
    });
    expect(sendEmail).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("trackGemSparkView", () => {
  it("records one read for a new visitor", async () => {
    seq({ count: 0 }, {});
    await trackGemSparkView("short-form");
    expect(fakeSupabase.chain.insert).toHaveBeenCalledWith({ page: "short-form", session_id: expect.any(String) });
  });

  it("doesn't count the same browser twice within 30 minutes", async () => {
    seq({ count: 1 });
    await trackGemSparkView("long-form");
    expect(fakeSupabase.chain.insert).not.toHaveBeenCalled();
  });

  it("ignores an unknown page or a missing database", async () => {
    await trackGemSparkView("admin" as never);
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await trackGemSparkView("long-form");
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("never throws, logging a failed insert or lookup", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ count: null }, { error: { message: "nope" } });
    await expect(trackGemSparkView("long-form")).resolves.toBeUndefined();
    fakeSupabase.chain.then = (_resolve, reject) => Promise.reject(new Error("down")).then(undefined, reject);
    await expect(trackGemSparkView("long-form")).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});

describe("getGemSparkCounts", () => {
  it("returns both read counts", async () => {
    seq({ count: 1200 }, { count: 7 });
    await expect(getGemSparkCounts()).resolves.toEqual({ longForm: 1200, shortForm: 7 });
  });

  it("treats a missing count as zero", async () => {
    seq({ count: null }, { count: null });
    await expect(getGemSparkCounts()).resolves.toEqual({ longForm: 0, shortForm: 0 });
  });

  it("returns null when the database is missing or fails", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(getGemSparkCounts()).resolves.toBeNull();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ count: 1 }, { error: { message: "x" } });
    await expect(getGemSparkCounts()).resolves.toBeNull();
    seq({ error: { message: "y" } }, { count: 1 });
    await expect(getGemSparkCounts()).resolves.toBeNull();
    spy.mockRestore();
  });
});

describe("getFeaturedSparks", () => {
  it("returns active sparks in order with string ids", async () => {
    seq({ data: [{ id: 4, name: "Ana", story: STORY, tagline: null, location: "LA" }] });
    await expect(getFeaturedSparks()).resolves.toEqual([{ id: "4", name: "Ana", story: STORY, tagline: null, location: "LA" }]);
    expect(fakeSupabase.chain.eq).toHaveBeenCalledWith("is_active", true);
    expect(fakeSupabase.chain.order).toHaveBeenCalledWith("display_order", { ascending: true });
  });

  it("returns an empty list when the database is missing or fails", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(getFeaturedSparks()).resolves.toEqual([]);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    seq({ error: { message: "x" } });
    await expect(getFeaturedSparks()).resolves.toEqual([]);
    spy.mockRestore();
  });
});
