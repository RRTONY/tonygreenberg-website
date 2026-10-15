import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EyebrowLabel } from "@/components/marketing/eyebrow-label";

describe("EyebrowLabel", () => {
  it("is a div (so the article drop-cap skips it) with the default style", () => {
    render(<EyebrowLabel>The Premise</EyebrowLabel>);
    const el = screen.getByText("The Premise");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("uppercase", "text-brand-gold");
  });

  it("can replace the style", () => {
    render(<EyebrowLabel className="text-red-500">X</EyebrowLabel>);
    expect(screen.getByText("X")).toHaveClass("text-red-500");
    expect(screen.getByText("X")).not.toHaveClass("text-brand-gold");
  });
});
