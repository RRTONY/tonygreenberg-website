// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { GET, dynamic } from "@/app/essays-archive.json/route";
import { sanityFetch } from "@/lib/sanity/client";

describe("/essays-archive.json", () => {
  it("is built statically", () => {
    expect(dynamic).toBe("force-static");
  });

  it("returns every essay from Sanity as JSON, kept out of search", async () => {
    const posts = [{ _id: "1", title: "Five Cups", slug: "five-cups" }];
    vi.mocked(sanityFetch).mockResolvedValue(posts as never);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(posts);
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
    expect(sanityFetch).toHaveBeenCalledWith(expect.objectContaining({ tags: ["post"] }));
  });
});
