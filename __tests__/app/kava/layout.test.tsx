import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import KavaRootLayout from "@/app/kava/layout";

// The shared next/font/google fake is a Proxy that also answers `then`, so awaiting the
// mocked module never settles (the test hangs). Fake the page-fonts module instead.
vi.mock("@/lib/fonts/page-fonts", () => ({ pageFontVariables: "font-vars-test" }));

describe("/kava layout", () => {
  it("wraps every Kava page in the Kava nav, main and footer", () => {
    render(
      <KavaRootLayout params={Promise.resolve({})}>
        <p>Page body</p>
      </KavaRootLayout>,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("PRI KAVA");
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("PRI Kava Framework v2.0");
  });

  it("uses the Kava sand background and the Fraunces heading face", () => {
    const { container } = render(
      <KavaRootLayout params={Promise.resolve({})}>
        <p>x</p>
      </KavaRootLayout>,
    );
    expect(container.firstElementChild!.className).toContain("bg-kava-sand");
    expect(container.firstElementChild!.className).toContain("--font-fraunces-face");
  });
});
