import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AttentionTheftLayout from "@/app/attention-theft/layout";

// The shared next/font/google fake (a Proxy) doesn't report its named exports,
// so vitest refuses to import Fraunces etc. from it. Local fake for the faces
// src/lib/fonts/page-fonts.ts uses.
vi.mock("next/font/google", () => {
  const font = () => ({ className: "font-test", variable: "--font-test", style: { fontFamily: "test" } });
  return { Fraunces: font, Space_Grotesk: font, Cormorant_Garamond: font };
});

function renderLayout() {
  return render(
    <AttentionTheftLayout params={Promise.resolve({})}>
      <p>Page body</p>
    </AttentionTheftLayout>,
  );
}

describe("/attention-theft layout", () => {
  it("wraps the page in its own main landmark", () => {
    renderLayout();
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
  });

  it("uses the manifesto's own nav with a way back to the main site", () => {
    renderLayout();
    expect(screen.getAllByRole("link", { name: "Back to TonyGreenberg.com" })[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
  });

  it("points nav items at in-page anchors so they work without JavaScript", () => {
    renderLayout();
    const anchors = screen.getAllByRole("link").map((a) => a.getAttribute("href")).filter((h) => h?.startsWith("#"));
    expect(anchors.length).toBeGreaterThan(0);
  });
});
