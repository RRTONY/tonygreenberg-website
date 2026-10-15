import { describe, expect, it, vi } from "vitest";
import { createBrowserClient } from "@supabase/ssr";

vi.unmock("@/lib/supabase/client");
vi.mock("@supabase/ssr", () => ({ createBrowserClient: vi.fn(() => ({ kind: "browser" })) }));

import { createClient } from "@/lib/supabase/client";

describe("supabase browser createClient", () => {
  it("builds the browser client from the public URL and anon key", () => {
    expect(createClient()).toEqual({ kind: "browser" });
    expect(createBrowserClient).toHaveBeenCalledWith("https://supabase.test", "test-anon-key");
  });

  it("never passes the service-role key to the browser", () => {
    createClient();
    expect(JSON.stringify(vi.mocked(createBrowserClient).mock.calls)).not.toContain("test-service-key");
  });
});
