import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthDisclaimer, healthDisclaimerKind } from "@/components/blog/health-disclaimer";

describe("healthDisclaimerKind", () => {
  it("is null without a health tag", () => {
    expect(healthDisclaimerKind(undefined)).toBeNull();
    expect(healthDisclaimerKind(["public health", "coffee culture"])).toBeNull();
  });

  it("matches tags exactly, ignoring case and spaces", () => {
    expect(healthDisclaimerKind(["  Longevity "])).toBe("general");
    expect(healthDisclaimerKind(["longevity research"])).toBeNull();
  });

  it("uses the caffeine wording when any tag mentions coffee or caffeine", () => {
    expect(healthDisclaimerKind(["Caffeine"])).toBe("caffeine");
    expect(healthDisclaimerKind(["biomarkers", "coffee culture"])).toBe("caffeine");
  });
});

describe("HealthDisclaimer", () => {
  it("renders the right copy, or nothing", () => {
    const { rerender, container } = render(<HealthDisclaimer tags={["addiction"]} />);
    expect(screen.getByRole("complementary", { name: "Health disclaimer" })).toHaveTextContent(/diet, supplements or medication/);
    rerender(<HealthDisclaimer tags={["caffeine"]} />);
    expect(screen.getByRole("complementary")).toHaveTextContent(/caffeine intake/);
    rerender(<HealthDisclaimer tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
