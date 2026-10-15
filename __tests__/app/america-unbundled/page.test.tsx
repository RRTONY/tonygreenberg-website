import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { defaultTwitter } from "@/lib/seo-defaults";
import AmericaUnbundledPage, { metadata } from "@/app/america-unbundled/page";

// A big page: give each render room on a busy machine.
vi.setConfig({ testTimeout: 45_000 });

type OG = { type?: string; siteName?: string; url?: string; images?: { url: string; width: number; height: number; alt: string }[] };

describe("/america-unbundled", () => {
  it("has an absolute title, description and canonical", () => {
    expect(metadata.title).toEqual({ absolute: "AI Does Not Have a Candidate: Politics for the AI Age" });
    expect(metadata.description).toMatch(/independent civic grid to govern AI, energy, and political power/);
    expect(metadata.alternates?.canonical).toBe("/america-unbundled");
  });

  it("shares as an article with its own 1200-wide hero image", () => {
    const og = metadata.openGraph as OG;
    expect(og.type).toBe("article");
    expect(og.siteName).toBe("Tony Greenberg");
    expect(og.url).toBe("/america-unbundled");
    expect(og.images?.[0].url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
    expect(og.images?.[0].width).toBeGreaterThanOrEqual(1200);
    expect(og.images?.[0].alt).toBeTruthy();
  });

  it.fails("BUG: the twitter card drops the shared @ThinkTony site/creator because it doesn't spread defaultTwitter (src/app/america-unbundled/page.tsx:45)", () => {
    expect(metadata.twitter).toMatchObject({ site: defaultTwitter.site, creator: defaultTwitter.creator });
  });

  it("renders one H1, the TL;DR and the article JSON-LD", () => {
    const { container } = render(<AmericaUnbundledPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/AI Does Not\s*Have a Candidate\./);
    expect(container).toHaveTextContent("Why America needs an independent civic grid to govern AI, energy, and power.");
    expect(screen.getByRole("heading", { level: 2, name: "AI is the warning." })).toBeInTheDocument();
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld).toMatchObject({ "@type": "Article", headline: "AI Does Not Have a Candidate: Politics for the AI Age" });
    expect(container.querySelector("#argument")).not.toBeNull();
    expect(container.querySelector("#sources")).not.toBeNull();
  });

  it("links to part two and its sources", () => {
    render(<AmericaUnbundledPage />);
    expect(screen.getAllByRole("link", { name: /Continue to the field guide/ })[0]).toHaveAttribute("href", "/america-unbundled-field-guide");
    expect(screen.getByRole("link", { name: /Continue to the ten independence questions/ })).toHaveAttribute(
      "href",
      "/america-unbundled-field-guide#questions",
    );
    expect(screen.getByRole("link", { name: /Stay with the question/ })).toHaveAttribute("href", "#argument");
    expect(screen.getAllByRole("link", { name: /45% identify independent/ })[0].getAttribute("href")).toMatch(/^https:\/\/news\.gallup\.com\//);
  });

  it("offers share links for this page", () => {
    render(<AmericaUnbundledPage />);
    expect(screen.getByRole("link", { name: "X" }).getAttribute("href")).toContain(encodeURIComponent("https://tonygreenberg.com/america-unbundled"));
    expect(screen.getByRole("link", { name: "LinkedIn" }).getAttribute("href")).toMatch(/^https:\/\/www\.linkedin\.com\/sharing\//);
  });
});
