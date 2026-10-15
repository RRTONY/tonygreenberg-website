import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiSummaryLinks, SITE_URL } from "@/components/ai-summary-links";

const PROMPT = "Summarize https://tonygreenberg.com/blog/x & more";

describe("AiSummaryLinks", () => {
  it("uses the production domain", () => {
    expect(SITE_URL).toBe("https://tonygreenberg.com");
  });

  it("shows the heading and one tile per assistant with the prompt prefilled", () => {
    render(<AiSummaryLinks heading="Ask an AI" prompt={PROMPT} />);
    expect(screen.getByText("Ask an AI")).toBeInTheDocument();
    const q = encodeURIComponent(PROMPT);
    expect(screen.getByRole("link", { name: "Summarize with Claude" })).toHaveAttribute("href", `https://claude.ai/new?q=${q}`);
    expect(screen.getByRole("link", { name: "Summarize with Gemini" })).toHaveAttribute("href", `https://gemini.google.com/app?q=${q}`);
    expect(screen.getByRole("link", { name: "Summarize with Grok" })).toHaveAttribute("href", `https://grok.com/?q=${q}`);
    expect(screen.getByRole("link", { name: "Summarize with ChatGPT" })).toHaveAttribute("href", `https://chatgpt.com/?q=${q}`);
    expect(screen.getByRole("link", { name: "Summarize with Perplexity" })).toHaveAttribute("href", `https://www.perplexity.ai/search?q=${q}`);
  });

  it("opens each in a new tab safely and keeps the className", () => {
    const { container } = render(<AiSummaryLinks heading="H" prompt="p" className="mt-10" />);
    expect(container.firstElementChild?.className).toContain("mt-10");
    for (const a of screen.getAllByRole("link")) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
