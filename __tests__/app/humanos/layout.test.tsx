import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HumanosRootLayout from "@/app/humanos/layout";

// The shared next/font/google fake is a Proxy that also answers `then`, so awaiting the
// mocked module never settles (the test hangs). Fake the page-fonts module instead.
vi.mock("@/lib/fonts/page-fonts", () => ({ pageFontVariables: "font-vars-test" }));

describe("/humanos layout", () => {
  it("wraps every HumanOS page in its own nav, main and footer", () => {
    render(
      <HumanosRootLayout params={Promise.resolve({})}>
        <p>Page body</p>
      </HumanosRootLayout>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Human Operating System");
  });

  it("points the heading font at Space Grotesk for this subtree", () => {
    const { container } = render(
      <HumanosRootLayout params={Promise.resolve({})}>
        <p>x</p>
      </HumanosRootLayout>,
    );
    expect(container.firstElementChild!.className).toContain("[--font-display:var(--font-space-grotesk)");
  });
});
