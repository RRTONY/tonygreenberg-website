import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DisclaimerPage, { metadata } from "@/app/psychedelic-readiness-index/disclaimer/page";
import sitemap from "@/app/sitemap";
import { ACKNOWLEDGE, COUNCIL_REMINDER, LEGAL, SCORE_CAN_TELL, TONY_NOTE, WHAT_THIS_IS } from "@/lib/content/pri-disclaimer";

describe("/psychedelic-readiness-index/disclaimer", () => {
  // PR #49 (2026-11-13): the PRI pages 307 to psychedelicreadiness.com and left the sitemap.
  it("has its own title, description and canonical, and is out of the sitemap while it redirects", async () => {
    expect(String(metadata.title)).toMatch(/^Full Disclaimer/);
    expect(metadata.description).toMatch(/licensed clinician/);
    expect(metadata.alternates?.canonical).toBe("/psychedelic-readiness-index/disclaimer");
    expect((await sitemap()).map((e: { url: string }) => e.url)).not.toContain("https://tonygreenberg.com/psychedelic-readiness-index/disclaimer");
  });

  it("renders one H1 and every section of the full disclaimer", () => {
    render(<DisclaimerPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Full Disclaimer");
    expect(screen.getByText(COUNCIL_REMINDER.title)).toBeInTheDocument();
    for (const t of [SCORE_CAN_TELL.title, TONY_NOTE.title, WHAT_THIS_IS.title, ACKNOWLEDGE.title, LEGAL.title]) {
      expect(screen.getByRole("heading", { level: 2, name: t })).toBeInTheDocument();
    }
    for (const p of [...SCORE_CAN_TELL.paragraphs, ...WHAT_THIS_IS.items, ...ACKNOWLEDGE.items, ...LEGAL.paragraphs]) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
    expect(screen.getByText(/not medical advice/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to the Index/ })).toHaveAttribute("href", "/psychedelic-readiness-index");
  });
});
