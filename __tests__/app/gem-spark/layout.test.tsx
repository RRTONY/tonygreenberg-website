import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GemSparkLayout from "@/app/gem-spark/layout";

describe("/gem-spark layout", () => {
  it("wraps the section in its scoped root (fonts and keyframes live under .gemspark-root)", () => {
    render(
      <GemSparkLayout params={Promise.resolve({})}>
        <p>Story</p>
      </GemSparkLayout>,
    );
    expect(screen.getByText("Story").parentElement).toHaveClass("gemspark-root");
  });
});
