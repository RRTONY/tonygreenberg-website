import { describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";
import { sanityFetch } from "@/lib/sanity/client";

// The shared next/font/google fake (a Proxy) has no `has` trap, so vitest
// reports its named exports as missing; list the fonts used here instead.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "font-test", variable: "--font-test", style: { fontFamily: "test" } });
  return { Playfair_Display: font, DM_Mono: font, Source_Sans_3: font };
});

vi.mock("react-dom", async (importOriginal) => ({ ...(await importOriginal<typeof import("react-dom")>()), preconnect: vi.fn() }));

type El = ReactElement<{ lang?: string; className?: string; children: ReactNode }>;

async function renderLayout(children: ReactNode) {
  const html = (await RootLayout({ children } as Parameters<typeof RootLayout>[0])) as El;
  const body = html.props.children as El;
  render(<div>{body.props.children}</div>);
  return html;
}

describe("root layout", () => {
  it("sets the site-wide title template, description and share defaults", () => {
    expect(metadata.title).toEqual({ default: "Tony Greenberg | Strategist, Author & CEO of RampRate", template: "%s | Tony Greenberg" });
    expect(metadata.description).toMatch(/CEO of RampRate/);
    expect(metadata.metadataBase?.toString()).toBe("https://tonygreenberg.com/");
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.twitter).toBeDefined();
  });

  it("is an English document", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(42 as never);
    const html = await renderLayout(<p>page</p>);
    expect(html.type).toBe("html");
    expect(html.props.lang).toBe("en");
  });

  it("puts the page inside <main id=main-content> with a skip link to it", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(42 as never);
    await renderLayout(<p>The page content</p>);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveTextContent("The page content");
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
  });

  it("adds the site's structured data and asks Sanity for the essay count", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(42 as never);
    await renderLayout(<p>x</p>);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent || "{}"));
    expect(ld.length).toBeGreaterThanOrEqual(2);
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["post"] }));
  });
});
