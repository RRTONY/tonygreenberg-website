import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { config, proxy } from "@/proxy";

const getUser = vi.fn(async () => ({ data: { user: null } }));
vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn() }));

function req(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://tonygreenberg.com${path}`, { headers });
}
const visitCookie = (res: Response) => (res as unknown as { cookies: { get(n: string): { value: string } | undefined } }).cookies.get("tg_visit_count")?.value;

afterEach(() => {

  vi.unstubAllEnvs();

});
describe("proxy", () => {
  it("fails open when Supabase env vars are missing (no client, request passes through)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const res = await proxy(req("/blog", { cookie: "sb-x-auth-token=1" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(createServerClient).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    await proxy(req("/blog", { cookie: "sb-x-auth-token=1" }));
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("still counts home visits when Supabase isn't configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(visitCookie(await proxy(req("/", { "sec-fetch-dest": "document", cookie: "tg_visit_count=2" })))).toBe("3");
  });

  it("skips Supabase entirely for anonymous visitors", async () => {
    const res = await proxy(req("/blog"));
    expect(res.status).toBe(200);
    expect(createServerClient).not.toHaveBeenCalled();
  });

  it("refreshes the session for a signed-in visitor and keeps the visit cookie", async () => {
    vi.mocked(createServerClient).mockImplementation(((_u: string, _k: string, opts: { cookies: { setAll: (c: { name: string; value: string; options?: object }[]) => void } }) => {
      getUser.mockImplementation(async () => {
        opts.cookies.setAll([{ name: "sb-p-auth-token", value: "fresh", options: { path: "/" } }]);
        return { data: { user: null } };
      });
      return { auth: { getUser } };
    }) as never);
    const res = await proxy(req("/", { cookie: "sb-p-auth-token.0=old", "sec-fetch-dest": "document" }));
    expect(createServerClient).toHaveBeenCalledWith("https://supabase.test", "test-anon-key", expect.any(Object));
    expect(getUser).toHaveBeenCalled();
    expect((res as unknown as { cookies: { get(n: string): { value: string } } }).cookies.get("sb-p-auth-token").value).toBe("fresh");
    expect(visitCookie(res)).toBe("1");
  });

  it("counts only real page loads of /", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(visitCookie(await proxy(req("/")))).toBe("1");
    expect(visitCookie(await proxy(req("/", { "sec-fetch-dest": "empty" })))).toBeUndefined();
    expect(visitCookie(await proxy(req("/", { rsc: "1" })))).toBeUndefined();
    expect(visitCookie(await proxy(req("/?_rsc=abc")))).toBeUndefined();
    expect(visitCookie(await proxy(req("/blog", { "sec-fetch-dest": "document" })))).toBeUndefined();
  });

  it("the matcher skips static assets and images", () => {
    const re = new RegExp(`^${config.matcher[0]}$`);
    expect(re.test("/blog/five-cups")).toBe(true);
    expect(re.test("/_next/static/chunk.js")).toBe(false);
    expect(re.test("/images/a.png")).toBe(false);
  });
});
