import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ThemedBackground } from "@/components/assessments/themed-background";

describe("ThemedBackground", () => {
  it("uses the theme's own gradient and stays behind the page without catching clicks", () => {
    const { container } = render(<ThemedBackground theme="coffee" />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el.className).toContain("from-[#F0E4D4]");
    expect(el.className).toContain("pointer-events-none");
    expect(el.className).toContain("-z-10");
  });

  it("falls back to the self-portrait gradient for an unknown theme", () => {
    const { container } = render(<ThemedBackground theme="nope" />);
    expect(container.firstElementChild!.className).toContain("from-[#F0E8D8]");
  });
});
