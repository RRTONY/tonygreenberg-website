import { describe, expect, it, vi } from "vitest";
import { loadPostEngagement, addComment, react, rate, commit, askTony } from "@/app/blog/[slug]/engagement-actions";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";
import { cookieJar } from "@tests/helpers/next";
import { sendEmail } from "@/lib/email";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";

const SID = "11111111-2222-3333-4444-555555555555";
const comment = { slug: "five-cups", postTitle: "Five Cups", name: "Ann", email: "", content: "Loved this." };

describe("loadPostEngagement", () => {
  it("returns an empty, unavailable result for a bad slug or no database", async () => {
    await expect(loadPostEngagement("../etc")).resolves.toMatchObject({ available: false, comments: [] });
    vi.mocked(isServiceRoleConfigured).mockReturnValueOnce(false);
    await expect(loadPostEngagement("five-cups")).resolves.toMatchObject({ available: false });
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("counts reactions, keeps notes and spots this browser's own reaction and commitment", async () => {
    cookieJar.set("tg_sid", SID);
    supabaseResult.data = [
      { id: 1, name: "Ann", content: "Hi", created_at: "2026-10-01", reaction: "up", comment: "nice", session_id: SID, commitment: "Walk daily" },
      { id: 2, name: "Bo", content: "Yo", created_at: "2026-10-02", reaction: "down", comment: null, session_id: "other", commitment: "Read more" },
    ];
    const res = await loadPostEngagement("five-cups");
    expect(res.available).toBe(true);
    expect(res.reactions).toEqual({ up: 1, neutral: 0, down: 1, notes: [{ reaction: "up", comment: "nice" }] });
    expect(res.comments[0]).toEqual({ id: 1, name: "Ann", content: "Hi", createdAt: "2026-10-01" });
    expect(res.myReaction).toBe("up");
    expect(res.myCommitment).toBe(true);
    expect(res.commitments).toEqual(["Walk daily", "Read more"]);
    expect(fakeSupabase.eq).toHaveBeenCalledWith("hidden", false);
  });

  it("falls back to empty when a query fails", async () => {
    supabaseResult.error = { message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(loadPostEngagement("five-cups")).resolves.toMatchObject({ available: false });
  });
});

describe("addComment", () => {
  it("checks name, content and an optional email, and accepts an empty email", async () => {
    await expect(addComment({ ...comment, name: " " })).resolves.toEqual({ ok: false, error: "Add your name." });
    await expect(addComment({ ...comment, content: "" })).resolves.toEqual({ ok: false, error: "Write your thought first." });
    await expect(addComment({ ...comment, email: "nope" })).resolves.toMatchObject({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    await expect(addComment(comment)).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ email: null, name: "Ann" }));
  });

  it("saves the comment and emails Tony with the content escaped", async () => {
    await addComment({ ...comment, content: "<b>hi</b>", email: "ann@example.com" });
    expect(fakeSupabase.from).toHaveBeenCalledWith("blog_comments");
    expect(fakeSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({ post_slug: "five-cups", content: "<b>hi</b>", email: "ann@example.com", session_id: expect.any(String) }),
    );
    const [to, subject, html] = vi.mocked(sendEmail).mock.calls[0];
    expect(to).toBe("tony@tonygreenberg.com");
    expect(subject).toContain("Five Cups");
    expect(html).toContain("&lt;b&gt;hi&lt;/b&gt;");
    expect(html).toContain("https://tonygreenberg.com/blog/five-cups");
  });

  it("drops bots, refuses floods and reports a failed save", async () => {
    await expect(addComment({ ...comment, website: "spam" })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
    supabaseResult.count = 5;
    await expect(addComment(comment)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/wait a few minutes/) });
    supabaseResult.count = 0;
    supabaseResult.error = { message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(addComment(comment)).resolves.toMatchObject({ ok: false });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("react / rate / commit", () => {
  it("refuse unknown values", async () => {
    await expect(react({ slug: "five-cups", reaction: "love" as never })).resolves.toMatchObject({ ok: false });
    await expect(rate({ slug: "five-cups", rating: "meh" as never })).resolves.toMatchObject({ ok: false });
    await expect(commit({ slug: "five-cups", commitment: "  " })).resolves.toMatchObject({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("save one row per browser and treat a duplicate as fine", async () => {
    await expect(react({ slug: "five-cups", reaction: "up", comment: " so good " })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ reaction: "up", comment: "so good" }));
    supabaseResult.error = { code: "23505", message: "dupe" };
    await expect(rate({ slug: "five-cups", rating: "completely" })).resolves.toEqual({ ok: true });
  });

  it("report other database errors", async () => {
    supabaseResult.error = { code: "500", message: "down" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(react({ slug: "five-cups", reaction: "up" })).resolves.toMatchObject({ ok: false });
    await expect(commit({ slug: "five-cups", commitment: "Walk" })).resolves.toMatchObject({ ok: false });
  });
});

describe("askTony", () => {
  const q = { slug: "five-cups", postTitle: "Five Cups", name: "Ann", email: "", question: "Why?" };
  it("validates, then emails Tony without storing anything", async () => {
    await expect(askTony({ ...q, question: "" })).resolves.toMatchObject({ ok: false });
    await expect(askTony({ ...q, email: "bad" })).resolves.toMatchObject({ ok: false });
    await expect(askTony(q)).resolves.toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledWith("tony@tonygreenberg.com", expect.stringContaining("Direct question from Ann"), expect.stringContaining("Why?"));
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("says it's unavailable when the email can't be sent", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce(false);
    await expect(askTony(q)).resolves.toMatchObject({ ok: false });
  });
});
