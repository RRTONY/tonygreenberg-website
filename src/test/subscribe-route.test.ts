import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => path.join(process.cwd(), relativePath);

describe("public subscribe route", () => {
  it("uses the shared server-backed newsletter form and keeps paid checkout deferred", () => {
    const route = fs.readFileSync(projectFile("src/app/subscribe/page.tsx"), "utf8");

    expect(route).toContain("NewsletterSignupForm");
    expect(route).toContain("secure checkout is reviewed separately");
    expect(route).not.toContain("StripeCheckoutButton");
  });

  it("submits through the verified newsletter endpoint and stores returning state server-side", () => {
    const form = fs.readFileSync(
      projectFile("src/components/marketing/newsletter-signup-form.tsx"),
      "utf8",
    );

    expect(form).toContain('fetch("/api/subscribe"');
    expect(form).toContain('writeVisitorState("newsletter"');
    expect(form).not.toContain("localStorage");
    expect(form).not.toContain("sessionStorage");
  });
});
