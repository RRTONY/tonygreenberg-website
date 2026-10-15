import { describe, expect, it, vi } from "vitest";
import { createServerClient } from "@supabase/ssr";
import { cookieJar } from "@tests/helpers/next";
import { cookies } from "next/headers";

vi.unmock("@/lib/supabase/server");
vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn(() => ({ kind: "server" })) }));

import { createClient } from "@/lib/supabase/server";

type CookieOpts = {
  cookies: {
    getAll: () => { name: string; value: string }[];
    setAll: (c: { name: string; value: string; options?: object }[]) => void;
  };
};

function lastOptions(): CookieOpts {
  return vi.mocked(createServerClient).mock.calls.at(-1)![2] as unknown as CookieOpts;
}

describe("supabase server createClient", () => {
  it("builds a server client with the public URL and anon key", async () => {
    await expect(createClient()).resolves.toEqual({ kind: "server" });
    expect(createServerClient).toHaveBeenCalledWith("https://supabase.test", "test-anon-key", expect.any(Object));
  });

  it("reads the request cookies through getAll", async () => {
    cookieJar.set("sb-token", "abc");
    await createClient();
    expect(lastOptions().cookies.getAll()).toEqual([{ name: "sb-token", value: "abc" }]);
  });

  it("writes refreshed cookies through setAll", async () => {
    await createClient();
    lastOptions().cookies.setAll([{ name: "sb-token", value: "new" }]);
    expect(cookieJar.get("sb-token")).toBe("new");
  });

  it("ignores the error a Server Component throws when setting a cookie", async () => {
    const store = await cookies();
    vi.mocked(store.set).mockImplementation(() => {
      throw new Error("read-only");
    });
    await createClient();
    expect(() => lastOptions().cookies.setAll([{ name: "x", value: "1" }])).not.toThrow();
  });
});
