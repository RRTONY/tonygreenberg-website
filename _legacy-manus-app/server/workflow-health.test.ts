import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";
import { appRouter } from "./routers";
import { postInterventionAssessments } from "../drizzle/schema";

describe("reader workflow health", () => {
  it("exposes a public newsletter subscription contract with configured Kit credentials", () => {
    expect(appRouter._def.procedures).toHaveProperty("subscribe.add");
    expect(ENV.kitApiSecret || ENV.kitApiKey).toBeTruthy();
    expect(ENV.kitFormId).toBeTruthy();
  });

  it("exposes the post-intervention submission contract with a configured owner-alert endpoint", () => {
    expect(appRouter._def.procedures).toHaveProperty("postIntervention.submit");
    expect(ENV.googleAppsScriptUrl).toBeTruthy();
    expect(postInterventionAssessments.notified).toBeDefined();
  });
});
