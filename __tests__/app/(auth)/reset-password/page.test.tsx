import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import ResetPasswordPage, { metadata } from "@/app/(auth)/reset-password/page";
import { fakeSupabase } from "@tests/helpers/supabase";

vi.mock("@/app/(auth)/actions", () => ({ updatePassword: vi.fn() }));

describe("/reset-password", () => {
  it("is noindex with its own canonical", () => {
    expect(metadata.title).toBe("Choose a new password");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/reset-password");
  });

  it("sends a signed-out visitor to sign in first", async () => {
    await expect(ResetPasswordPage()).rejects.toThrow("NEXT_REDIRECT:/login?next=%2Freset-password");
  });

  it("shows the new-password form to a signed-in member", async () => {
    fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1", email: "me@example.com" } }, error: null } as never);
    await renderServer(ResetPasswordPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Choose a new password");
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
  });
});
