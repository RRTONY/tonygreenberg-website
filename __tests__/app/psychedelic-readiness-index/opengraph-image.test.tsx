import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";

// next/og draws with WebAssembly, which jsdom can't run; this fake keeps what it was given.
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(
      public element: ReactElement,
      public options: unknown,
    ) {}
  },
}));

const { default: OpengraphImage, alt, size, contentType } = await import("@/app/psychedelic-readiness-index/opengraph-image");

describe("PRI share card", () => {
  it("is a 1200x630 PNG with alt text", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toMatch(/Talk to your psychedelic council/);
  });

  it("shows the council reminder, the disclaimer address and a QR code", () => {
    const res = OpengraphImage() as unknown as { element: ReactElement; options: unknown };
    expect(res.options).toEqual(size);
    const { container } = render(res.element);
    expect(container).toHaveTextContent("Psychedelic Readiness Index");
    expect(container).toHaveTextContent("Talk to your psychedelic council.");
    expect(container).toHaveTextContent("No medical clearance.");
    expect(container).toHaveTextContent("tonygreenberg.com/psychedelic-readiness-index/disclaimer");
    expect(container.querySelector("svg path")?.getAttribute("d")).toMatch(/^M0 0h7/);
  });
});
