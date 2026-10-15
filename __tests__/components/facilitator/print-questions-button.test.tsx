import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrintQuestionsButton } from "@/components/facilitator/print-questions-button";
import { FACILITATOR_BANDS } from "@/lib/content/facilitator-index-data";

describe("PrintQuestionsButton", () => {
  it("shows its label", () => {
    render(<PrintQuestionsButton label="Print All 108 Questions" />);
    expect(screen.getByRole("button", { name: "Print All 108 Questions" })).toBeInTheDocument();
  });

  it("writes every band and item from the page data into a print window and prints it", async () => {
    let html = "";
    const win = { document: { write: vi.fn((h: string) => (html = h)), close: vi.fn() }, focus: vi.fn(), print: vi.fn() };
    const open = vi.spyOn(window, "open").mockReturnValue(win as unknown as Window);
    const user = userEvent.setup();
    render(<PrintQuestionsButton label="Print" />);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(screen.getByRole("button", { name: "Print" }));
    expect(open).toHaveBeenCalledWith("", "_blank", "width=900,height=700");
    expect(win.document.close).toHaveBeenCalled();
    for (const band of FACILITATOR_BANDS) {
      expect(html).toContain(band.title);
      for (const item of band.items) expect(html).toContain(`${item.n}.</span>`);
    }
    expect(win.print).not.toHaveBeenCalled();
    vi.advanceTimersByTime(700);
    expect(win.print).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("does nothing when a pop-up blocker stops the window", async () => {
    vi.spyOn(window, "open").mockReturnValue(null);
    const user = userEvent.setup();
    render(<PrintQuestionsButton label="Print" />);
    await expect(user.click(screen.getByRole("button", { name: "Print" }))).resolves.toBeUndefined();
  });
});
