import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SoulsmokeJsonLd } from "@/components/soulsmoke/soulsmoke-json-ld";

describe("SoulsmokeJsonLd", () => {
  it("renders the page's JSON-LD and escapes '<' so the script can't be closed early", () => {
    const { container } = render(<SoulsmokeJsonLd path="/library" title="A </script> | SoulSmoke" description="x" />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toContain("</script>");
    const data = JSON.parse(script.innerHTML);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"][0].name).toBe("A </script>");
  });
});
