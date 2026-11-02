import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogShareBar } from "@/components/blog/blog-share-bar";

const URL_ = "https://tonygreenberg.com/blog/five-cups";

async function openMenu(path = "/x", title = "T") {
  const user = userEvent.setup();
  render(<BlogShareBar path={path} title={title} />);
  await user.click(screen.getByRole("button", { name: "Share this essay" }));
  return user;
}

describe("BlogShareBar", () => {
  it("shows one Share button and keeps the options in a closed menu", () => {
    render(<BlogShareBar path="/x" title="T" />);
    expect(screen.getByRole("button", { name: "Share this essay" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Share on X" })).not.toBeInTheDocument();
  });

  it("builds every share link from the production URL", async () => {
    await openMenu("/blog/five-cups", "Five Cups & More");
    expect(screen.getByRole("link", { name: "Share on X" })).toHaveAttribute(
      "href",
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(URL_)}&text=${encodeURIComponent("Five Cups & More")}`,
    );
    expect(screen.getByRole("link", { name: "Share on LinkedIn" }).getAttribute("href")).toContain(encodeURIComponent(URL_));
    expect(decodeURIComponent(screen.getByRole("link", { name: "Share by email" }).getAttribute("href")!)).toContain(URL_);
    expect(screen.queryByRole("link", { name: /Facebook/ })).not.toBeInTheDocument();
  });

  it("hides the device share option when the browser has no share sheet", async () => {
    await openMenu();
    expect(screen.queryByRole("button", { name: "More ways to share" })).not.toBeInTheDocument();
  });

  it("opens the device share sheet when there is one", async () => {
    const share = vi.fn(async () => {});
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    const user = await openMenu();
    await user.click(screen.getByRole("button", { name: "More ways to share" }));
    expect(share).toHaveBeenCalledWith({ title: "T", url: "https://tonygreenberg.com/x" });
    delete (navigator as { share?: unknown }).share;
  });

  it("copies the link and says so for two seconds", async () => {
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const user = await openMenu();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://tonygreenberg.com/x");
    expect(await screen.findByRole("button", { name: "Link copied" })).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(2100));
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});
