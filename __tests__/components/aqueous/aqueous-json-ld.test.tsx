import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AqueousJsonLd } from "@/components/aqueous/aqueous-json-ld";
import { aqueousJsonLd } from "@/lib/content/aqueous/structured-data";

describe("AqueousJsonLd", () => {
  it("puts the page's structured data in a JSON-LD script, titled as the page's <title>", () => {
    const { container } = render(<AqueousJsonLd path="/manifesto" title="Manifesto" description="Why we built it." />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const data = JSON.parse(script.innerHTML);
    expect(data).toEqual(aqueousJsonLd({ path: "/manifesto", title: "Manifesto | Aqueous", description: "Why we built it." }));
    expect(data["@graph"][1]).toMatchObject({ name: "Manifesto", url: "https://tonygreenberg.com/aqueous/manifesto" });
  });

  it("escapes '<' so the data can't close the script tag", () => {
    const { container } = render(<AqueousJsonLd path="/" title="Home" description="</script><b>x</b>" />);
    const script = container.querySelector("script")!;
    expect(script.innerHTML).not.toContain("</script>");
    expect(script.innerHTML).toContain("\\u003c/script>");
    expect(JSON.parse(script.innerHTML)["@graph"][1].description).toBe("</script><b>x</b>");
  });
});
