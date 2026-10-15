import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollectionExplorer } from "@/components/brewsoul/collection-explorer";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";

const KEY = "brewsoul-collection";
const quickAdd = () => screen.getByLabelText("Quick add a coffee to your collection") as HTMLSelectElement;
const saved = () => JSON.parse(localStorage.getItem(KEY) ?? "[]");

describe("CollectionExplorer", () => {
  it("shows the empty state with a link to the catalog", () => {
    render(<CollectionExplorer coffees={BREWSOUL_COFFEES} />);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "catalog" })).toHaveAttribute("href", "/brewsoul/browse");
    expect(quickAdd().options).toHaveLength(BREWSOUL_COFFEES.length + 1);
  });

  it("quick-adds a coffee, saves it in the browser and links to its page", async () => {
    const user = userEvent.setup();
    render(<CollectionExplorer coffees={BREWSOUL_COFFEES} />);
    const c = BREWSOUL_COFFEES[3];
    await user.selectOptions(quickAdd(), c.id);
    expect(saved()).toEqual([c.id]);
    expect(screen.getByRole("heading", { level: 3, name: c.name }).closest("a")).toHaveAttribute("href", `/brewsoul/coffee/${c.id}`);
    expect(Array.from(quickAdd().options).map((o) => o.value)).not.toContain(c.id);
  });

  it("restores a saved collection and removes a coffee with the heart button", async () => {
    const [a, b] = BREWSOUL_COFFEES;
    localStorage.setItem(KEY, JSON.stringify([a.id, b.id]));
    const user = userEvent.setup();
    render(<CollectionExplorer coffees={BREWSOUL_COFFEES} />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([a.name, b.name]);
    await user.click(screen.getByRole("button", { name: `Remove ${a.name} from your collection` }));
    expect(saved()).toEqual([b.id]);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([b.name]);
  });

  it("treats broken saved data as an empty collection", () => {
    localStorage.setItem(KEY, "{not json");
    render(<CollectionExplorer coffees={BREWSOUL_COFFEES} />);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });
});
