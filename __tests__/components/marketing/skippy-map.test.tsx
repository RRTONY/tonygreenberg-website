import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkippyMap } from "@/components/marketing/skippy-map";
import { SKIPPY_STORAGE_KEY, TENTACLES, TOTAL_STOPS } from "@/lib/content/skippy-map";

const featured = TENTACLES.find((t) => t.id === "featured")!;
const stat = (label: string) => screen.getByText(label, { selector: "div" }).previousElementSibling!.textContent;

describe("SkippyMap", () => {
  it("starts at zero with one checkbox per stop and one H1", () => {
    render(<SkippyMap />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome, Skippy.");
    expect(stat("Completed")).toBe("0");
    expect(stat("Remaining")).toBe(String(TOTAL_STOPS));
    expect(screen.getAllByRole("checkbox")).toHaveLength(TOTAL_STOPS);
    expect(screen.getByRole("progressbar", { name: "Journey progress" })).toHaveAttribute("aria-valuenow", "0");
  });

  it("checking a stop updates the counts and saves to this browser", async () => {
    const user = userEvent.setup();
    render(<SkippyMap />);
    const stop = featured.stops[0];
    const box = screen.getByRole("checkbox", { name: `Mark ${stop.label} as visited` });
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
    expect(stat("Completed")).toBe("1");
    expect(JSON.parse(localStorage.getItem(SKIPPY_STORAGE_KEY)!)).toEqual([stop.id]);
    await user.click(screen.getByRole("checkbox", { name: `Mark ${stop.label} as not visited` }));
    expect(stat("Completed")).toBe("0");
  });

  it("restores saved progress and ignores junk in storage", () => {
    localStorage.setItem(SKIPPY_STORAGE_KEY, JSON.stringify([featured.stops[0].id, 42]));
    const { unmount } = render(<SkippyMap />);
    expect(stat("Completed")).toBe("1");
    unmount();
    localStorage.setItem(SKIPPY_STORAGE_KEY, "{not json");
    render(<SkippyMap />);
    expect(stat("Completed")).toBe("0");
  });

  it("celebrates when everything is visited, and Reset clears it", async () => {
    localStorage.setItem(SKIPPY_STORAGE_KEY, JSON.stringify(TENTACLES.flatMap((t) => t.stops.map((s) => s.id))));
    render(<SkippyMap />);
    expect(screen.getByText("You've been through everything.")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Reset progress" }));
    expect(localStorage.getItem(SKIPPY_STORAGE_KEY)).toBeNull();
    expect(stat("Completed")).toBe("0");
  });

  it("stops with a page link to it; the rest say Coming Soon", () => {
    const { container } = render(<SkippyMap />);
    const linked = TENTACLES.flatMap((t) => t.stops).filter((s) => s.href);
    for (const s of linked) expect(container.querySelector(`a[href="${s.href}"]`)).not.toBeNull();
    expect(screen.queryAllByText("Coming Soon")).toHaveLength(TOTAL_STOPS - linked.length);
  });
});
