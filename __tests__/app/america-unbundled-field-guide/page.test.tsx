import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { defaultTwitter } from "@/lib/seo-defaults";
import AmericaUnbundledFieldGuidePage, { metadata } from "@/app/america-unbundled-field-guide/page";

// A big page: give each render room on a busy machine.
vi.setConfig({ testTimeout: 45_000 });

type OG = { type?: string; siteName?: string; url?: string; images?: { url: string; width: number }[] };

describe("/america-unbundled-field-guide", () => {
  it("has an absolute title, description and canonical", () => {
    expect(metadata.title).toEqual({ absolute: "America, Unbundled | Independent Political Infrastructure & INC 2026" });
    expect(metadata.description).toMatch(/Independent National Convention 2026/);
    expect(metadata.alternates?.canonical).toBe("/america-unbundled-field-guide");
  });

  it("shares as an article with its own hero image", () => {
    const og = metadata.openGraph as OG;
    expect(og.type).toBe("article");
    expect(og.siteName).toBe("Tony Greenberg");
    expect(og.url).toBe("/america-unbundled-field-guide");
    expect(og.images?.[0].width).toBeGreaterThanOrEqual(1200);
  });

  it("the twitter card keeps the shared @ThinkTony site/creator (spreads defaultTwitter)", () => {
    expect(metadata.twitter).toMatchObject({ site: defaultTwitter.site, creator: defaultTwitter.creator });
  });

  it("renders one H1, the real copy and the JSON-LD", () => {
    const { container } = render(<AmericaUnbundledFieldGuidePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/America Is Unbundled\.\s*The Field Guide/);
    expect(container).toHaveTextContent("We have enough labels. Independence needs rules, receipts, and a way to take power back when it fails.");
    expect(screen.getByRole("heading", { level: 2, name: "Start with the objections." })).toBeInTheDocument();
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld).toMatchObject({ "@type": "Article", headline: "America, Unbundled" });
  });

  it("includes the ten independence questions with their save tools", () => {
    const { container } = render(<AmericaUnbundledFieldGuidePage />);
    expect(container.querySelector("#questions")).not.toBeNull();
    expect(container).toHaveTextContent("When the side you usually agree with is wrong, will you say so?");
    expect(container).toHaveTextContent("What future are you willing to build with people outside your tribe?");
    expect(container.querySelectorAll("textarea")).toHaveLength(10);
    expect(screen.getByRole("button", { name: /Save privately/ })).toBeInTheDocument();
  });

  it("links back to part one, the convention and the receipts", () => {
    render(<AmericaUnbundledFieldGuidePage />);
    expect(screen.getByRole("link", { name: /Read Part One: AI Does Not Have a Candidate/ })).toHaveAttribute("href", "/america-unbundled");
    expect(screen.getByRole("link", { name: /Attend the convention/ })).toHaveAttribute("href", "https://independentnationalconvention.com/");
    expect(screen.getByRole("link", { name: /Open the bibliography and receipts/ })).toHaveAttribute("href", "/america-unbundled#sources");
  });
});
