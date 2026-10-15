import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";

vi.unmock("@/lib/supabase/service-role");
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn(() => ({ kind: "service" })) }));

import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";

describe("service-role Supabase client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is configured only when both the URL and service key are set", () => {
    expect(isServiceRoleConfigured()).toBe(true);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(isServiceRoleConfigured()).toBe(false);
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(isServiceRoleConfigured()).toBe(false);
  });

  it("creates a client with the service key and no session persistence", () => {
    expect(createServiceRoleClient()).toEqual({ kind: "service" });
    expect(createClient).toHaveBeenCalledWith("https://supabase.test", "test-service-key", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });
});
