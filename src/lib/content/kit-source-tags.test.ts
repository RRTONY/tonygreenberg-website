import { describe, expect, it } from "vitest";

import { resolveKitTag } from "./kit-source-tags";

describe("resolveKitTag", () => {
  it("returns the established tag for a known form source", () => {
    expect(resolveKitTag("footer")).toBe("Website Footer");
    expect(resolveKitTag("subscribe")).toBe("Newsletter: Throughline");
    expect(resolveKitTag("jewel-box:latest-essay")).toBe("Exit Intent: Jewel Box");
  });

  it("returns a clear source tag for an unknown form source", () => {
    expect(resolveKitTag("new-campaign")).toBe("Source: new-campaign");
  });
});
