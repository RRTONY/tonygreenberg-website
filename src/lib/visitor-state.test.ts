import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createVisitorId,
  isVisitorStateNamespace,
  VISITOR_STATE_MAX_AGE_SECONDS,
  visitorCookieOptions,
} from "./visitor-state";

describe("visitor-state server policy", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses an HttpOnly, production-secure cookie for returning visitors", () => {
    expect(visitorCookieOptions()).toEqual({
      httpOnly: true,
      maxAge: VISITOR_STATE_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  });

  it("accepts only the declared visitor-state namespaces and creates opaque identifiers", () => {
    expect(isVisitorStateNamespace("newsletter")).toBe(true);
    expect(isVisitorStateNamespace("unknown")).toBe(false);
    expect(createVisitorId()).toMatch(/^[a-f0-9]{32}$/);
  });
});
