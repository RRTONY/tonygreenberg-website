import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareRail } from "@/components/america-unbundled/share-rail";

function setNavigator(extra: Record<string, unknown>) {
  for (const [k, v] of Object.entries(extra)) Object.defineProperty(navigator, k, { value: v, configurable: true, writable: true });
}

describe("ShareRail", () => {
  it("has real X and LinkedIn links to the article in the HTML", () => {
    render(<ShareRail />);
    expect(screen.getByRole("link", { name: /^X/ }).getAttribute("href")).toContain("twitter.com/intent/tweet");
    expect(screen.getByRole("link", { name: /^X/ }).getAttribute("href")).toContain("url=https%3A%2F%2Ftonygreenberg.com%2Famerica-unbundled");
    expect(screen.getByRole("link", { name: /LinkedIn/ }).getAttribute("href")).toContain("linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Ftonygreenberg.com%2Famerica-unbundled");
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("target", "_blank");
  });

  it("copies the article link", async () => {
    const writeText = vi.fn(async () => {});
    setNavigator({ clipboard: { writeText } });
    render(<ShareRail />);
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://tonygreenberg.com/america-unbundled");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("says copy is unavailable when the browser blocks it", async () => {
    setNavigator({ clipboard: { writeText: vi.fn(async () => Promise.reject(new Error("no"))) } });
    render(<ShareRail />);
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(screen.getByRole("button", { name: "Copy unavailable" })).toBeInTheDocument();
  });

  it("opens the share sheet with the title, text and URL", async () => {
    const share = vi.fn(async () => {});
    setNavigator({ share });
    render(<ShareRail />);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ title: "AI Does Not Have a Candidate: Politics for the AI Age", url: "https://tonygreenberg.com/america-unbundled" }));
  });

  it("falls back to 'Use Copy link' when there's no share sheet", async () => {
    setNavigator({ share: undefined });
    render(<ShareRail />);
    await userEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("button", { name: "Use Copy link" })).toBeInTheDocument();
  });
});
