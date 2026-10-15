import { describe, expect, it, vi } from "vitest";

// The archive is the real one unless a test empties it.
const archive = vi.hoisted(() => ({ empty: false }));
vi.mock("@/lib/content/daily-provocations", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/content/daily-provocations")>();
  return {
    ...real,
    get DAILY_PROVOCATIONS() {
      return archive.empty ? [] : real.DAILY_PROVOCATIONS;
    },
  };
});
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyProvocation } from "@/components/marketing/daily-provocation";
import { DAILY_PROVOCATIONS } from "@/lib/content/daily-provocations";

describe("DailyProvocation", () => {
  it("shows the newest provocation", () => {
    render(<DailyProvocation />);
    expect(screen.getByText(`"${DAILY_PROVOCATIONS[0].text}"`)).toBeInTheDocument();
  });

  it("search finds past provocations (2+ characters) and says when none match", async () => {
    const user = userEvent.setup();
    render(<DailyProvocation />);
    const box = screen.getByLabelText("Search Daily Provocations", { selector: "input" });
    await user.type(box, "t");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    await user.clear(box);
    await user.type(box, "trust");
    const list = screen.getByRole("list");
    const expected = DAILY_PROVOCATIONS.filter((p) => p.text.toLowerCase().includes("trust")).slice(0, 6);
    expect(list.children).toHaveLength(expected.length);
    await user.clear(box);
    await user.type(box, "zzqqxx");
    expect(screen.getByText(/No provocations match/)).toBeInTheDocument();
  });

  it("shares with the native share sheet when available", async () => {
    const share = vi.fn(async () => {});
    vi.stubGlobal("navigator", { ...navigator, share });
    render(<DailyProvocation />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Share today’s provocation" }));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining(DAILY_PROVOCATIONS[0].text) }));
  });

  it("falls back to an X share link without the share sheet", async () => {
    const open = vi.fn();
    vi.stubGlobal("open", open);
    render(<DailyProvocation />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Share today’s provocation" }));
    expect(open.mock.calls[0][0]).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?text=/);
    expect(open.mock.calls[0][1]).toBe("_blank");
  });

  it("falls back to the X share link when the share sheet fails for a reason other than cancel", async () => {
    const share = vi.fn(async () => {
      throw new Error("NotAllowedError");
    });
    const open = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, share });
    vi.stubGlobal("open", open);
    render(<DailyProvocation />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Share today’s provocation" }));
    expect(share).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledTimes(1);
    const shared = new URL(open.mock.calls[0][0] as string);
    expect(shared.searchParams.get("text")).toBe(`Daily Provocation: “${DAILY_PROVOCATIONS[0].text}”`);
    expect(shared.searchParams.get("url")).toBe(window.location.href);
    expect(open.mock.calls[0][2]).toBe("noopener,noreferrer");
  });

  it("does nothing more when the person cancels the share sheet", async () => {
    const share = vi.fn(async () => {
      // Browsers reject with an AbortError (jsdom's DOMException isn't an Error subclass, so build one).
      throw Object.assign(new Error("cancelled"), { name: "AbortError" });
    });
    const open = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, share });
    vi.stubGlobal("open", open);
    render(<DailyProvocation />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Share today’s provocation" }));
    expect(share).toHaveBeenCalledTimes(1);
    expect(open).not.toHaveBeenCalled();
  });

  it("caps search results at six", async () => {
    const user = userEvent.setup();
    render(<DailyProvocation />);
    // A common two-letter string matches many entries in the real archive.
    const matches = DAILY_PROVOCATIONS.filter((p) => p.text.toLowerCase().includes("th"));
    expect(matches.length).toBeGreaterThan(6);
    await user.type(screen.getByLabelText("Search Daily Provocations", { selector: "input" }), "th");
    expect(screen.getByRole("list").children).toHaveLength(6);
  });

  it("renders nothing when the archive is empty", () => {
    archive.empty = true;
    try {
      const { container } = render(<DailyProvocation />);
      expect(container).toBeEmptyDOMElement();
    } finally {
      archive.empty = false;
    }
  });
});
