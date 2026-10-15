import { describe, expect, it } from "vitest";
import { urlFor } from "@/lib/sanity/image";

const source = { asset: { _ref: "image-abc123-1200x630-jpg" } };

describe("urlFor", () => {
  it("builds a Sanity CDN URL for the project and dataset with auto format", () => {
    const url = urlFor(source).url();
    expect(url).toContain("https://cdn.sanity.io/images/test-project/test/abc123-1200x630.jpg");
    expect(url).toContain("auto=format");
  });

  it("lets callers chain a width", () => {
    expect(urlFor(source).width(600).url()).toContain("w=600");
  });

  it("never points at a Manus host", () => {
    expect(urlFor(source).url()).not.toMatch(/manuscdn|manus-storage|\/api\/img\//);
  });
});
