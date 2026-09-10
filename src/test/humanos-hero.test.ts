import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Human OS hero parity", () => {
  it("uses the verified live visual through next/image with readable overlay treatment", () => {
    const route = fs.readFileSync(path.join(process.cwd(), "src/app/humanos/page.tsx"), "utf8");

    expect(route).toContain("HUMANOS_HERO_IMAGE");
    expect(route).toContain("https://tonygreenberg.com/api/img/humanos-hero-hand_73f45c74.jpg");
    expect(route).toContain('alt="Hand breaking through glass with golden flowers"');
    expect(route).toContain("fill");
    expect(route).toContain("priority");
    expect(route).toContain("unoptimized");
    expect(route).toContain(
      "bg-linear-to-b from-neutral-950/20 via-neutral-950/35 to-neutral-950/90",
    );
  });

  it("uses semantic direction icons instead of raw arrow glyphs in interface content", () => {
    const route = fs.readFileSync(path.join(process.cwd(), "src/app/humanos/page.tsx"), "utf8");

    expect(route).toContain("ForwardIcon");
    expect(route).not.toContain("&rarr;");
  });
});
