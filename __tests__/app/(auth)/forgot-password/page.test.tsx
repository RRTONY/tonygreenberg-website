import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ForgotPasswordPage, { metadata } from "@/app/(auth)/forgot-password/page";

vi.mock("@/app/(auth)/actions", () => ({ requestPasswordReset: vi.fn() }));

describe("/forgot-password", () => {
  it("is kept out of search with its own title and canonical", () => {
    expect(metadata.title).toBe("Reset your password");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/forgot-password");
  });

  it("renders one H1, the email form and a link back to sign in", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Reset your password");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute("href", "/login");
  });
});
