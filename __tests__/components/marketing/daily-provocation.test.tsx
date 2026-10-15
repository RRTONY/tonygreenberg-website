import { describe, expect, it, vi } from "vitest";
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
});
