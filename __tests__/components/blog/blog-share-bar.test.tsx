import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogShareBar } from "@/components/blog/blog-share-bar";

const URL_ = "https://tonygreenberg.com/blog/five-cups";

describe("BlogShareBar", () => {
  it("builds every share link from the production URL", () => {
    render(<BlogShareBar path="/blog/five-cups" title="Five Cups & More" />);
    expect(screen.getByRole("link", { name: "Share on X" })).toHaveAttribute(
      "href",
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(URL_)}&text=${encodeURIComponent("Five Cups & More")}`,
    );
    expect(screen.getByRole("link", { name: "Share on LinkedIn" }).getAttribute("href")).toContain(encodeURIComponent(URL_));
    expect(screen.getByRole("link", { name: "Share on Facebook" }).getAttribute("href")).toContain(encodeURIComponent(URL_));
    expect(decodeURIComponent(screen.getByRole("link", { name: "Share by email" }).getAttribute("href")!)).toContain(URL_);
  });

  it("hides the device share button when the browser has no share sheet", () => {
    render(<BlogShareBar path="/x" title="T" />);
    expect(screen.queryByRole("button", { name: "More ways to share" })).not.toBeInTheDocument();
  });

  it("opens the device share sheet when there is one", async () => {
    const share = vi.fn(async () => {});
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = userEvent.setup();
    render(<BlogShareBar path="/x" title="T" />);
    await user.click(screen.getByRole("button", { name: "More ways to share" }));
    expect(share).toHaveBeenCalledWith({ title: "T", url: "https://tonygreenberg.com/x" });
    delete (navigator as { share?: unknown }).share;
  });

  it("copies the link and says so for two seconds", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<BlogShareBar path="/x" title="T" />);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://tonygreenberg.com/x");
    expect(await screen.findByRole("button", { name: "Link copied" })).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(2100));
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});
