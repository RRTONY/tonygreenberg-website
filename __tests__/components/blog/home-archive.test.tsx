import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeArchive } from "@/components/blog/home-archive";
import { summarizeArchive, type ArchivePost } from "@/lib/content/essay-archive";

// 15 essays, newest first (the order the archive JSON comes in).
function post(i: number, extra: Partial<ArchivePost> = {}): ArchivePost {
  const year = i < 5 ? "2025" : i < 10 ? "2024" : "2023";
  return {
    _id: `p${i}`,
    title: `Essay ${i}`,
    slug: `essay-${i}`,
    publishedAt: `${year}-0${(i % 9) + 1}-01T00:00:00Z`,
    readTime: i % 3 === 0 ? 3 : i % 3 === 1 ? 7 : 15,
    tags: i % 2 === 0 ? ["Coffee", "AI"] : ["AI"],
    category: i < 6 ? { title: "Tech", slug: "tech" } : { title: "Life", slug: "life" },
    ...extra,
  };
}
const ALL = Array.from({ length: 15 }, (_, i) => post(i));
const archive = summarizeArchive(ALL);
const mostRead = { fromAnalytics: true, posts: [{ slug: "essay-1", title: "Essay 1" }] };

let fetchMock: ReturnType<typeof vi.fn>;

function titles() {
  return screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

async function pick(user: ReturnType<typeof userEvent.setup>, trigger: string, option: string) {
  await user.click(screen.getByRole("combobox", { name: trigger }));
  await user.click(await screen.findByRole("option", { name: option }));
}

function renderArchive() {
  render(<HomeArchive archive={archive} mostRead={mostRead} />);
  return userEvent.setup();
}

describe("HomeArchive", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async (url: string) =>
      url === "/essays-archive.json" ? new Response(JSON.stringify(ALL)) : new Response(JSON.stringify({ posts: [] })),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows the first 12 essays and counts without loading anything", () => {
    renderArchive();
    expect(screen.getByRole("heading", { name: "Full Archive — All 15 Essays" })).toBeInTheDocument();
    expect(titles()).toHaveLength(12);
    expect(screen.getByRole("button", { name: "All (15)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tech (6)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Life (9)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show all 15 essays/i })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("'Show all' loads the full list once and shows every essay", async () => {
    const user = renderArchive();
    await user.click(screen.getByRole("button", { name: /show all 15 essays/i }));
    await waitFor(() => expect(titles()).toHaveLength(15));
    expect(fetchMock.mock.calls.filter(([u]) => u === "/essays-archive.json")).toHaveLength(1);
  });

  it("a category button narrows to that category and toggles off again", async () => {
    const user = renderArchive();
    await user.click(screen.getByRole("button", { name: "Tech (6)" }));
    await waitFor(() => expect(titles()).toHaveLength(6));
    expect(titles()).toEqual(["Essay 0", "Essay 1", "Essay 2", "Essay 3", "Essay 4", "Essay 5"]);
    expect(screen.getByRole("button", { name: "Tech (6)" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Tech (6)" }));
    await waitFor(() => expect(titles()).toHaveLength(12));
  });

  it("typing filters on title, and shows the empty state when nothing matches", async () => {
    const user = renderArchive();
    const box = screen.getByRole("combobox", { name: "Search essays" });
    await user.type(box, "Essay 14");
    await waitFor(() => expect(titles()).toEqual(["Essay 14"]));
    await user.clear(box);
    await user.type(box, "no such essay");
    expect(await screen.findByText("No essays match your search.")).toBeInTheDocument();
  });

  it("sort, year, reading time and topic each narrow the list", async () => {
    const user = renderArchive();
    await pick(user, "Sort essays", "Oldest first");
    await waitFor(() => expect(titles()[0]).toBe("Essay 14"));

    await pick(user, "Filter by year", "2024");
    await waitFor(() => expect(titles()).toEqual(["Essay 9", "Essay 8", "Essay 7", "Essay 6", "Essay 5"]));

    await pick(user, "Filter by reading time", "Under 5 min");
    await waitFor(() => expect(titles()).toEqual(["Essay 9", "Essay 6"]));

    await pick(user, "Filter by topic", "Coffee (8)");
    await waitFor(() => expect(titles()).toEqual(["Essay 6"]));

    expect(screen.getByRole("button", { name: /filters \(4\)/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    await waitFor(() => expect(titles()).toHaveLength(12));
    expect(titles()[0]).toBe("Essay 0");
  });

  it("shows a spinner while the full list loads, and a retry when it fails", async () => {
    let fail = true;
    fetchMock.mockImplementation(async () => (fail ? new Response("", { status: 500 }) : new Response(JSON.stringify(ALL))));
    const user = renderArchive();
    await user.click(screen.getByRole("button", { name: "Life (9)" }));
    const status = await screen.findByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("Couldn't load the full archive."));
    fail = false;
    await user.click(within(status).getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(titles()).toHaveLength(9));
  });

  it("a curated journey filters to its essays and can be cleared", async () => {
    const slugs = ["how-to-alienate-a-loyal-vegan", "bread-stuck-with-no-customer-service"];
    const withJourney = [...ALL, post(20, { slug: slugs[0], title: "Vegan" }), post(21, { slug: slugs[1], title: "Bread" })];
    fetchMock.mockImplementation(async () => new Response(JSON.stringify(withJourney)));
    render(<HomeArchive archive={summarizeArchive(withJourney)} mostRead={mostRead} />);
    const user = userEvent.setup();
    const journey = screen.getByRole("button", { name: /the crusade files/i });
    expect(journey).toHaveTextContent("2 posts");
    await user.click(journey);
    await waitFor(() => expect(titles()).toEqual(["Vegan", "Bread"]));
    expect(screen.getByRole("heading", { name: /curated journey — the crusade files/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /show all essays/i }));
    await waitFor(() => expect(titles()).toHaveLength(12));
  });

  it("lists Most Read with the analytics note and links", () => {
    renderArchive();
    expect(screen.getByText("Past 12 months")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /essay 1$/i }).some((a) => a.getAttribute("href") === "/blog/essay-1")).toBe(true);
  });
});
