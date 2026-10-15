import { describe, expect, it } from "vitest";
import NotFound, { metadata } from "@/app/not-found";
import { NotFoundRedirect } from "@/components/not-found-redirect";

describe("404 page", () => {
  it("has the 'Page not found' title the dynamic routes match", () => {
    expect(metadata.title).toBe("Page not found");
  });

  it("renders the countdown-home component", () => {
    expect(NotFound().type).toBe(NotFoundRedirect);
  });
});
