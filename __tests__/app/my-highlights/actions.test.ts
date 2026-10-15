import { describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { saveHighlight, deleteHighlight } from "@/app/my-highlights/actions";
import { fakeSupabase, supabaseResult } from "@tests/helpers/supabase";

const signIn = () => fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null } as never);
const TEXT = "A passage worth keeping around.";

describe("saveHighlight", () => {
  it("asks a signed-out reader to sign in", async () => {
    await expect(saveHighlight({ postSlug: "five-cups", text: TEXT })).resolves.toEqual({ ok: false, needsLogin: true });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("refuses too-short or too-long text and a bad slug", async () => {
    signIn();
    await expect(saveHighlight({ postSlug: "five-cups", text: "  short  " })).resolves.toEqual({ ok: false });
    await expect(saveHighlight({ postSlug: "five-cups", text: "x".repeat(2001) })).resolves.toEqual({ ok: false });
    await expect(saveHighlight({ postSlug: "../admin", text: TEXT })).resolves.toEqual({ ok: false });
    expect(fakeSupabase.insert).not.toHaveBeenCalled();
  });

  it("saves the trimmed passage for this member and refreshes the page", async () => {
    signIn();
    await expect(saveHighlight({ postSlug: "five-cups", text: `  ${TEXT}  `, context: "  " })).resolves.toEqual({ ok: true });
    expect(fakeSupabase.from).toHaveBeenCalledWith("highlights");
    expect(fakeSupabase.insert).toHaveBeenCalledWith({ user_id: "u1", post_slug: "five-cups", text: TEXT, context: null });
    expect(revalidatePath).toHaveBeenCalledWith("/my-highlights");
  });

  it("reports a failed save", async () => {
    signIn();
    supabaseResult.error = { message: "rls" };
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(saveHighlight({ postSlug: "five-cups", text: TEXT })).resolves.toEqual({ ok: false });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("deleteHighlight", () => {
  it("deletes by numeric id only", async () => {
    const fd = new FormData();
    fd.set("id", "abc");
    await deleteHighlight(fd);
    expect(fakeSupabase.delete).not.toHaveBeenCalled();
    fd.set("id", "7");
    await deleteHighlight(fd);
    expect(fakeSupabase.delete).toHaveBeenCalled();
    expect(fakeSupabase.eq).toHaveBeenCalledWith("id", 7);
    expect(revalidatePath).toHaveBeenCalledWith("/my-highlights");
  });
});
