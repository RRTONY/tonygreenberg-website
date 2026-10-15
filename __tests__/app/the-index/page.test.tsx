import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import TheIndexPage, { metadata } from "@/app/the-index/page";
import { loadIndexItems } from "@/app/the-index/index-data";
import type { IndexItem } from "@/lib/content/the-index";

vi.mock("@/app/the-index/index-data", () => ({ loadIndexItems: vi.fn(), loadIndexBodies: vi.fn() }));
vi.mock("@/app/the-index/actions", () => ({ searchIndexBodies: vi.fn(async () => []), getIndexNextReads: vi.fn(async () => []) }));

const item = (id: string, kind: "essay" | "page"): IndexItem =>
  ({ id, kind, title: `Title ${id}`, href: kind === "essay" ? `/blog/${id}` : `/${id}`, date: null, category: "Business", summary: "s", formatTag: null, image: null, tags: [] }) as IndexItem;

describe("/the-index", () => {
  it("has an absolute title, description, canonical and share tags", () => {
    expect(metadata.title).toEqual({ absolute: "The Index — Searchable Idea Database" });
    expect(metadata.alternates?.canonical).toBe("/the-index");
    expect(metadata.openGraph).toMatchObject({ url: "/the-index" });
    expect(metadata.twitter).toMatchObject({ title: "The Index — Searchable Idea Database | Tony Greenberg" });
  });

  it("renders one H1 and the real essay and resource counts", async () => {
    vi.mocked(loadIndexItems).mockResolvedValue({ items: [item("a", "essay"), item("b", "essay"), item("about", "page")], essayCount: 2 });
    await renderServer(TheIndexPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Search the Thinking");
    expect(screen.getByText("Essays").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("Site Resources").nextSibling).toHaveTextContent("1");
  });
});
