// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/pri-research/export/route";
import { fakeSupabase } from "@tests/helpers/supabase";
import { getPriResearch } from "@/lib/pri-research";

vi.mock("@/lib/pri-research", () => ({ getPriResearch: vi.fn() }));
const asUser = (email: string) => fakeSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u", email } }, error: null } as never);

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /pri-research/export", () => {
  it("answers 404 to a signed-out visitor and to a non-admin", async () => {
    vi.stubEnv("ADMIN_EMAILS", "boss@example.com");
    expect((await GET()).status).toBe(404);
    asUser("someone@example.com");
    expect((await GET()).status).toBe(404);
    expect(getPriResearch).not.toHaveBeenCalled();
  });

  it("gives an admin a CSV download with quotes escaped", async () => {
    vi.stubEnv("ADMIN_EMAILS", " Boss@Example.com , other@example.com");
    asUser("boss@example.com");
    vi.mocked(getPriResearch).mockResolvedValue({
      total: 1,
      optIn: 1,
      rows: [{ id: 1, created_at: "2026-10-01", rankings: ["a", "b"], dim_scores: { x: 1 }, pairwise_choices: [] }],
    });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(res.headers.get("content-disposition")).toContain("pri-research-data.csv");
    const [header, row] = (await res.text()).split("\n");
    expect(header).toBe("id,date,rankings,dimScores,pairwiseChoices");
    expect(row).toBe('"1","2026-10-01","[""a"",""b""]","{""x"":1}","[]"');
  });
});
