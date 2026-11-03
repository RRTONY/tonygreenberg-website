import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config redirects", () => {
  it("sends the short /united address to the United article, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/united",
      destination: "/blog/united-airlines-the-case-of-the-creamy-thing",
      permanent: true,
    });
  });

  it("sends /medicine to the medicine hub, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/medicine",
      destination: "/psychedelic-readiness-index",
      permanent: true,
    });
  });
});
