import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GemsparkJsonLd } from "@/components/gemspark/gemspark-json-ld";

describe("GemsparkJsonLd", () => {
  it("renders the page's JSON-LD and escapes '<'", () => {
    const { container } = render(<GemsparkJsonLd version="short" headline="A </script>" description="x" />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script.innerHTML)["@graph"][0].headline).toBe("A </script>");
  });
});
