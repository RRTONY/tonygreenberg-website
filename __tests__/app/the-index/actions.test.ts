import { describe, expect, it, vi } from "vitest";
import { searchIndexBodies, getIndexNextReads } from "@/app/the-index/actions";
import { loadIndexBodies, loadIndexItems } from "@/app/the-index/index-data";
import type { IndexItem } from "@/lib/content/the-index";

vi.mock("@/app/the-index/index-data", () => ({ loadIndexBodies: vi.fn(), loadIndexItems: vi.fn() }));

const essay = (id: string, title: string): IndexItem =>
  ({ id, kind: "essay", title, href: `/blog/${id}`, date: null, category: "Business", summary: title, formatTag: null, image: null, tags: [] }) satisfies IndexItem;

describe("searchIndexBodies", () => {
  it("returns the slugs whose body text contains the query", async () => {
    vi.mocked(loadIndexBodies).mockResolvedValue(new Map([["a", "all about coffee rituals"], ["b", "nothing here"]]));
    await expect(searchIndexBodies("Coffee")).resolves.toEqual(["a"]);
  });

  it("returns nothing for an empty or non-string query without loading bodies", async () => {
    await expect(searchIndexBodies("   ")).resolves.toEqual([]);
    await expect(searchIndexBodies(42 as unknown as string)).resolves.toEqual([]);
    expect(loadIndexBodies).not.toHaveBeenCalled();
  });

  it("returns nothing (not an error) when Sanity fails", async () => {
    vi.mocked(loadIndexBodies).mockRejectedValue(new Error("down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(searchIndexBodies("coffee")).resolves.toEqual([]);
  });
});

describe("getIndexNextReads", () => {
  it("refuses an oversized id and an unknown one", async () => {
    await expect(getIndexNextReads("x".repeat(301))).resolves.toEqual([]);
    vi.mocked(loadIndexItems).mockResolvedValue({ items: [essay("a", "A")], essayCount: 1 });
    vi.mocked(loadIndexBodies).mockResolvedValue(new Map());
    await expect(getIndexNextReads("missing")).resolves.toEqual([]);
  });

  it("returns up to three links (only id/title/href/external), never the item itself", async () => {
    const items = ["a", "b", "c", "d", "e"].map((id) => essay(id, `Trust and coffee ${id}`));
    vi.mocked(loadIndexItems).mockResolvedValue({ items, essayCount: 5 });
    vi.mocked(loadIndexBodies).mockResolvedValue(new Map(items.map((i) => [i.id, "trust coffee"])));
    const reads = await getIndexNextReads("a");
    expect(reads.length).toBeGreaterThan(0);
    expect(reads.length).toBeLessThanOrEqual(3);
    for (const r of reads) {
      expect(r.id).not.toBe("a");
      expect(Object.keys(r).sort()).toEqual(["external", "href", "id", "title"]);
    }
  });

  it("returns nothing when loading fails", async () => {
    vi.mocked(loadIndexItems).mockRejectedValue(new Error("down"));
    vi.mocked(loadIndexBodies).mockResolvedValue(new Map());
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(getIndexNextReads("a")).resolves.toEqual([]);
  });
});
