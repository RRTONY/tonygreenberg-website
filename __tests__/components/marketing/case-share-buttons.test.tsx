import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseShareButtons } from "@/components/marketing/case-share-buttons";

const url = `${window.location.origin}/cases/alex`;

describe("CaseShareButtons", () => {
  it("builds the share links for X, Facebook, LinkedIn and email", () => {
    render(<CaseShareButtons path="/cases/alex" shareText="Read this case" />);
    const enc = encodeURIComponent(url);
    expect(screen.getByRole("link", { name: "X / Twitter" })).toHaveAttribute(
      "href",
      `https://twitter.com/intent/tweet?text=${encodeURIComponent("Read this case")}&url=${enc}`,
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${enc}`);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`);
    const email = screen.getByRole("link", { name: "Email" });
    expect(email.getAttribute("href")).toMatch(/^mailto:\?subject=/);
    expect(email).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute("target", "_blank");
  });

  it("Copy Link copies the page address", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CaseShareButtons path="/cases/alex" shareText="x" />);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(writeText).toHaveBeenCalledWith(url);
  });

  it("filled style uses the solid red buttons", () => {
    render(<CaseShareButtons filled path="/a" shareText="x" />);
    expect(screen.getByRole("button", { name: "Copy Link" })).toHaveClass("bg-red-800");
  });
});
