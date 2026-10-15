import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbitWaitlistForm } from "@/components/marketing/abit-waitlist-form";

// The form hands off to the visitor's email app via window.location.href.
function captureLocation() {
  const loc = { href: "http://localhost/" };
  vi.stubGlobal("location", loc);
  return loc;
}

describe("AbitWaitlistForm", () => {
  it("shows the real label, a required email box and the Join button", () => {
    render(<AbitWaitlistForm />);
    expect(screen.getByText(/ABIT Waitlist — Asset-Backed Impact Tokens/)).toBeInTheDocument();
    const input = screen.getByPlaceholderText("your@email.com");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
    expect(screen.getByRole("button", { name: "Join Waitlist" })).toBeInTheDocument();
  });

  it("does nothing when submitted empty", async () => {
    const loc = captureLocation();
    render(<AbitWaitlistForm />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Join Waitlist" }));
    expect(loc.href).toBe("http://localhost/");
    expect(screen.getByRole("button", { name: "Join Waitlist" })).toBeInTheDocument();
  });

  it("opens a pre-filled email to Tony and shows the follow-up message", async () => {
    const loc = captureLocation();
    render(<AbitWaitlistForm />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(screen.getByRole("button", { name: "Join Waitlist" }));
    expect(loc.href.startsWith("mailto:tony@tonygreenberg.com?subject=ABIT%20Waitlist&body=")).toBe(true);
    expect(decodeURIComponent(loc.href)).toContain("Email: me@example.com");
    expect(screen.getByText(/Your email client should be open/)).toBeInTheDocument();
  });
});
