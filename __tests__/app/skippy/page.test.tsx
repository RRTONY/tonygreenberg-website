import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkippyPage, { metadata } from "@/app/skippy/page";
import { SKIPPY_STORAGE_KEY, TENTACLES, TOTAL_STOPS } from "@/lib/content/skippy-map";

const LINKED = TENTACLES.flatMap((t) => t.stops).filter((s) => s.href);

function stat(label: string) {
  return screen.getByText(label).previousElementSibling!;
}

describe("/skippy", () => {
  it("has its own title, description and canonical, and stays out of search results", () => {
    expect(metadata.title).toBe("Skippy's Journey Map");
    expect(metadata.description).toBe("A personal map of every instrument, essay, and rabbit hole on tonygreenberg.com.");
    expect(metadata.alternates?.canonical).toBe("/skippy");
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("renders one H1, the welcome copy and both paths", () => {
    render(<SkippyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome, Skippy.");
    expect(screen.getByText(/You're pioneer #1 of 160\./)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Path A — The Psychedelic & Facilitator Track/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Path B — Ramp's Treasure Chest/ })).toBeInTheDocument();
  });

  it("starts with nothing checked and links every stop to a page on the site", () => {
    render(<SkippyPage />);
    expect(stat("Completed")).toHaveTextContent("0");
    expect(stat("Remaining")).toHaveTextContent(String(TOTAL_STOPS));
    const goLinks = screen.getAllByRole("link", { name: /^Go/ });
    expect(goLinks).toHaveLength(LINKED.length);
    expect(screen.getAllByText("Coming Soon")).toHaveLength(TOTAL_STOPS - LINKED.length);
    expect(goLinks[0]).toHaveAttribute("href", "/start-here");
    for (const a of goLinks) expect(a.getAttribute("href")).toMatch(/^\//);
  });

  it("Friend Gate and Post-Intervention link to their live pages", () => {
    render(<SkippyPage />);
    const hrefs = screen.getAllByRole("link", { name: /^Go/ }).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/friend-gate");
    expect(hrefs).toContain("/post-intervention");
  });

  it("checks a stop off, saves it in this browser, and resets", async () => {
    const user = userEvent.setup();
    render(<SkippyPage />);
    await user.click(screen.getByRole("checkbox", { name: "Mark Start Here as visited" }));

    expect(screen.getByRole("checkbox", { name: "Mark Start Here as not visited" })).toHaveAttribute("aria-checked", "true");
    expect(stat("Completed")).toHaveTextContent("1");
    expect(stat("Remaining")).toHaveTextContent(String(TOTAL_STOPS - 1));
    expect(screen.getByRole("progressbar", { name: "Journey progress" })).toHaveAttribute(
      "aria-valuenow",
      String(Math.round((1 / TOTAL_STOPS) * 100)),
    );
    expect(JSON.parse(localStorage.getItem(SKIPPY_STORAGE_KEY)!)).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Reset all progress" }));
    expect(stat("Completed")).toHaveTextContent("0");
    expect(localStorage.getItem(SKIPPY_STORAGE_KEY)).toBeNull();
  });

  it("picks up progress saved on an earlier visit", () => {
    localStorage.setItem(SKIPPY_STORAGE_KEY, JSON.stringify(["not-a-real-stop"]));
    render(<SkippyPage />);
    expect(stat("Completed")).toHaveTextContent("0");
  });
});
