import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { ShanitaInterview, ShareRow } from "@/components/brewsoul/shanita-interview";

const questions = () => screen.getAllByRole("button").filter((b) => /^\d+/.test(b.textContent ?? ""));

describe("ShanitaInterview", () => {
  it("shows all 10 questions with only the first answer open", () => {
    render(<ShanitaInterview />);
    expect(questions()).toHaveLength(10);
    expect(screen.getByText(/Because Fair Trade was designed to make consumers feel better/)).toBeInTheDocument();
    expect(screen.getAllByText("Sources").filter((el) => el.closest("[hidden]") === null)).toHaveLength(1);
  });

  it("toggles a single question", async () => {
    const user = userEvent.setup();
    render(<ShanitaInterview />);
    await user.click(questions()[0]);
    expect(screen.getByText(/Because Fair Trade was designed/)).not.toBeVisible();
    expect(questions()[0]).toHaveAttribute("aria-expanded", "false");
    await user.click(questions()[1]);
    expect(questions()[1]).toHaveAttribute("aria-expanded", "true");
    expect(questions()[1].nextElementSibling).not.toHaveAttribute("hidden");
  });

  it("Expand All opens every answer and Collapse All closes them", async () => {
    const user = userEvent.setup();
    render(<ShanitaInterview />);
    await user.click(screen.getByRole("button", { name: "Expand All 10" }));
    for (const q of questions()) expect(q.nextElementSibling).not.toHaveAttribute("hidden");
    const external = screen.getAllByRole("link");
    expect(external.length).toBeGreaterThan(1);
    for (const a of external) expect(a).toHaveAttribute("target", "_blank");
    await user.click(screen.getByRole("button", { name: "Collapse All" }));
    for (const q of questions()) expect(q.nextElementSibling).toHaveAttribute("hidden");
  });

  it("every interview answer is in the server HTML (answers 2-10 only render after a click, so crawlers never see them)", async () => {
    const user = userEvent.setup();
    render(<ShanitaInterview />);
    await user.click(screen.getByRole("button", { name: "Expand All 10" }));
    const allParas = Array.from(document.querySelectorAll("p")).map((p) => p.textContent ?? "");
    const server = document.createElement("div");
    server.innerHTML = renderToString(<ShanitaInterview />);
    const serverText = server.textContent ?? "";
    for (const p of allParas) expect(serverText).toContain(p);
  });
});

describe("ShareRow", () => {
  it("links to X and LinkedIn with the article URL", () => {
    render(<ShareRow />);
    const url = encodeURIComponent("https://tonygreenberg.com/brewsoul/guest/shanita-nicholas");
    expect(screen.getByRole("link", { name: /Share on X/ }).getAttribute("href")).toContain(`url=${url}`);
    expect(screen.getByRole("link", { name: /Share on LinkedIn/ }).getAttribute("href")).toBe(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
  });

  it("copies the link and says so for 2 seconds", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    try {
      render(<ShareRow />);
      act(() => screen.getByRole("button", { name: /Copy Link/ }).click());
      expect(writeText).toHaveBeenCalledWith("https://tonygreenberg.com/brewsoul/guest/shanita-nicholas");
      expect(screen.getByRole("button", { name: /Copied!/ })).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(2000));
      expect(screen.getByRole("button", { name: /Copy Link/ })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
