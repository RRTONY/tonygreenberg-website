import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TheIndexExplorer } from "@/components/the-index/the-index-explorer";
import { getIndexNextReads, searchIndexBodies } from "@/app/the-index/actions";
import { INDEX_CONCEPTS, type IndexItem } from "@/lib/content/the-index";

vi.mock("@/app/the-index/actions", () => ({ searchIndexBodies: vi.fn(), getIndexNextReads: vi.fn() }));

function item(over: Partial<IndexItem>): IndexItem {
  return {
    id: "x",
    kind: "essay",
    title: "X",
    href: "/blog/x",
    date: "2025-01-01",
    category: "Essay",
    summary: "",
    formatTag: null,
    image: null,
    tags: [],
    ...over,
  };
}

const ITEMS: IndexItem[] = [
  item({ id: "only-time-buys-trust", title: "Only Time Buys Trust", href: "/blog/only-time-buys-trust", date: "2025-03-01", summary: "Trust takes years." }),
  item({ id: "kava-guide", title: "The Kava Guide", href: "/blog/kava-guide", date: "2025-02-01", summary: "Roots and ritual." }),
  item({ id: "deep-body", title: "Hidden Body Match", href: "/blog/deep-body", date: "2024-01-01", summary: "Nothing obvious here." }),
];

function setup() {
  render(<TheIndexExplorer items={ITEMS} charityCount={42} />);
  return userEvent.setup();
}

describe("TheIndexExplorer", () => {
  beforeEach(() => {
    vi.mocked(searchIndexBodies).mockResolvedValue([]);
    vi.mocked(getIndexNextReads).mockResolvedValue([{ id: "n1", title: "Next One", href: "/blog/next-one" }] as never);
  });

  it("lists the newest items first before any search", () => {
    setup();
    expect(screen.getByText("RECENTLY ADDED TO THE INDEX")).toBeInTheDocument();
    const titles = screen.getAllByRole("button", { expanded: false }).map((b) => b.textContent);
    expect(titles[0]).toContain("Only Time Buys Trust");
    expect(titles[1]).toContain("The Kava Guide");
  });

  it("typing filters by title and shows the result count", async () => {
    const user = setup();
    await user.type(screen.getByLabelText("Search the Index"), "kava");
    expect(screen.getByText("1 RESULT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The Kava Guide/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Only Time Buys Trust/ })).not.toBeInTheDocument();
  });

  it("adds essays whose full text matches (server search)", async () => {
    vi.mocked(searchIndexBodies).mockResolvedValue(["deep-body"]);
    const user = setup();
    await user.type(screen.getByLabelText("Search the Index"), "zebrafish");
    expect(await screen.findByRole("button", { name: /Hidden Body Match/ }, { timeout: 5000 })).toBeInTheDocument();
    expect(searchIndexBodies).toHaveBeenCalledWith("zebrafish");
  });

  it("shows the no-results message and the clear button resets", async () => {
    const user = setup();
    await user.type(screen.getByLabelText("Search the Index"), "qqqqzz");
    expect(await screen.findByText(/No essays found for/, {}, { timeout: 5000 })).toHaveTextContent("qqqqzz");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByLabelText("Search the Index")).toHaveValue("");
    expect(screen.getByText("RECENTLY ADDED TO THE INDEX")).toBeInTheDocument();
  });

  it("a concept chip filters to that concept's essays", async () => {
    const user = setup();
    const trust = INDEX_CONCEPTS.find((c) => c.key === "trust")!;
    const chip = screen.getByRole("button", { name: new RegExp(trust.label.replace("&", "\\&")) });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(trust.description)).toBeInTheDocument();
    expect(screen.getByText("1 RESULT")).toBeInTheDocument();
  });

  it("opening an item shows its TLDR, next reads and a Read link", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: /Only Time Buys Trust/ }));
    const preview = screen.getByRole("complementary", { name: "Only Time Buys Trust preview" });
    expect(preview).toHaveTextContent("Trust takes years.");
    expect(await screen.findByRole("link", { name: "Next One" }, { timeout: 5000 })).toHaveAttribute("href", "/blog/next-one");
    expect(screen.getByRole("link", { name: "Read Only Time Buys Trust" })).toHaveAttribute("href", "/blog/only-time-buys-trust");
    expect(getIndexNextReads).toHaveBeenCalledWith("only-time-buys-trust");
  });
});
