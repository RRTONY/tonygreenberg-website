import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/sake/motion";
import { SakeJsonLd } from "@/components/sake/sake-json-ld";

describe("Sake Reveal", () => {
  it("renders its children through the shared reveal helper", () => {
    render(
      <Reveal enter="animate-in fade-in">
        <p>Kura</p>
      </Reveal>,
    );
    expect(screen.getByText("Kura")).toBeInTheDocument();
  });
});

describe("SakeJsonLd", () => {
  it("writes the page's structured data with < escaped", () => {
    const { container } = render(<SakeJsonLd path="/rice" title="Rice <Encyclopedia>" description="Rice" />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toContain("<Encyclopedia>");
    const data = JSON.parse(script.innerHTML);
    expect(data["@graph"][1].name).toBe("Rice <Encyclopedia>");
  });
});
