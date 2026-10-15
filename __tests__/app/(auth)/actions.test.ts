import { describe, expect, it } from "vitest";
import { signIn, signUp, requestPasswordReset, updatePassword, signOut } from "@/app/(auth)/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { headerJar } from "@tests/helpers/next";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("signIn", () => {
  it("refuses a bad email or a missing password without asking Supabase", async () => {
    await expect(signIn(undefined, form({ email: "nope", password: "x" }))).resolves.toEqual({ error: "Enter your email and password." });
    await expect(signIn(undefined, form({ email: "a@b.co", password: "" }))).resolves.toEqual({ error: "Enter your email and password." });
    expect(fakeSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("signs in with the trimmed email and goes to the safe next page", async () => {
    await expect(signIn(undefined, form({ email: "  me@example.com ", password: "secret123", next: "/blog" }))).rejects.toThrow(
      "NEXT_REDIRECT:/blog",
    );
    expect(fakeSupabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: "me@example.com", password: "secret123" });
  });

  it("never redirects off-site after sign-in", async () => {
    await expect(signIn(undefined, form({ email: "me@example.com", password: "x", next: "//evil.com" }))).rejects.toThrow(
      "NEXT_REDIRECT:/my-highlights",
    );
    await expect(signIn(undefined, form({ email: "me@example.com", password: "x", next: "https://evil.com" }))).rejects.toThrow(
      "NEXT_REDIRECT:/my-highlights",
    );
  });

  it("explains an unconfirmed email differently from a wrong password", async () => {
    fakeSupabase.auth.signInWithPassword.mockResolvedValueOnce({ data: {}, error: { message: "Email not confirmed" } } as never);
    await expect(signIn(undefined, form({ email: "me@example.com", password: "x" }))).resolves.toEqual({
      error: expect.stringMatching(/confirm your email first/),
    });
    fakeSupabase.auth.signInWithPassword.mockResolvedValueOnce({ data: {}, error: { message: "Invalid login credentials" } } as never);
    await expect(signIn(undefined, form({ email: "me@example.com", password: "x" }))).resolves.toEqual({
      error: "That email and password don't match.",
    });
  });
});

describe("signUp", () => {
  it("re-checks the email and password length on the server", async () => {
    await expect(signUp({ email: "bad", password: "longenough" })).resolves.toEqual({ error: "Enter a valid email address." });
    await expect(signUp({ email: "a@b.co", password: "short" })).resolves.toEqual({ error: "Use at least 8 characters for your password." });
    expect(fakeSupabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("sends a confirm link back to this site's callback and keeps the referral code", async () => {
    headerJar.set("host", "preview.netlify.app");
    const res = await signUp({ email: " me@example.com ", password: "longenough", next: "/my-impact", ref: "abc" });
    expect(res).toEqual({ message: expect.stringMatching(/Check your inbox/) });
    expect(fakeSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "me@example.com",
      password: "longenough",
      options: {
        emailRedirectTo: "https://preview.netlify.app/auth/callback?next=%2Fmy-impact",
        data: { referral_code: "abc" },
      },
    });
  });

  it("passes Supabase's error back to the form", async () => {
    fakeSupabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: { message: "User already registered" } } as never);
    await expect(signUp({ email: "me@example.com", password: "longenough" })).resolves.toEqual({ error: "User already registered" });
  });
});

describe("requestPasswordReset", () => {
  it("gives the same answer whether or not the account exists", async () => {
    await expect(requestPasswordReset(undefined, form({ email: "bad" }))).resolves.toEqual({ error: "Enter a valid email address." });
    const res = await requestPasswordReset(undefined, form({ email: "me@example.com" }));
    expect(res).toEqual({ message: "If that email has an account, a reset link is on its way." });
    expect(fakeSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("me@example.com", {
      redirectTo: "https://tonygreenberg.com/auth/callback?next=/reset-password",
    });
  });
});

describe("updatePassword", () => {
  it("needs 8+ characters, then saves and goes to My Highlights", async () => {
    await expect(updatePassword({ password: "short" })).resolves.toMatchObject({ error: expect.any(String) });
    await expect(updatePassword({ password: "longenough" })).rejects.toThrow("NEXT_REDIRECT:/my-highlights");
    expect(fakeSupabase.auth.updateUser).toHaveBeenCalledWith({ password: "longenough" });
  });

  it("says the link expired when Supabase refuses", async () => {
    fakeSupabase.auth.updateUser.mockResolvedValueOnce({ data: {}, error: { message: "session missing" } } as never);
    await expect(updatePassword({ password: "longenough" })).resolves.toEqual({ error: "That link has expired. Request a new reset link." });
  });
});

describe("signOut", () => {
  it("signs out and goes home", async () => {
    await expect(signOut()).rejects.toThrow("NEXT_REDIRECT:/");
    expect(fakeSupabase.auth.signOut).toHaveBeenCalled();
  });
});
