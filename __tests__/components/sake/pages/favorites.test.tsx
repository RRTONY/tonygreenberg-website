import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeFavorites, favoriteHref } from "@/components/sake/pages/favorites";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const KEY = "sake-favorites-v1";

const seed = () =>
  window.localStorage.setItem(
    KEY,
    JSON.stringify([
      { id: "fav-dassai-23", type: "sake", name: "Dassai 23", nameJa: "獺祭 23", path: "/sake/bottle/dassai-23", addedAt: 2, note: "Birthday" },
      { id: "page-rice", type: "page", name: "Rice Encyclopedia", nameJa: "米の百科事典", path: "/rice", addedAt: 1 },
    ]),
  );

describe("favoriteHref", () => {
  it("keeps /sake paths and prefixes the app's root paths", () => {
    expect(favoriteHref("/sake/bottle/x")).toBe("/sake/bottle/x");
    expect(favoriteHref("/sake")).toBe("/sake");
    expect(favoriteHref("/rice")).toBe("/sake/rice");
  });
});

describe("SakeFavorites", () => {
  beforeEach(() => window.localStorage.clear());

  it("shows the empty state", () => {
    renderSake(<SakeFavorites />);
    expect(screen.getByRole("heading", { level: 1, name: "Favorites" })).toBeInTheDocument();
    expect(screen.getByText("Your journey begins here")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the Collection" })).toHaveAttribute("href", "/sake/collection");
  });

  it("lists, filters, annotates, removes and clears saved items", async () => {
    seed();
    const user = userEvent.setup();
    renderSake(<SakeFavorites />);
    expect(screen.getByRole("link", { name: "Dassai 23" })).toHaveAttribute("href", "/sake/bottle/dassai-23");
    expect(screen.getByRole("link", { name: "Rice Encyclopedia" })).toHaveAttribute("href", "/sake/rice");
    expect(screen.getByRole("link", { name: /View & Buy/ })).toHaveAttribute("href", "/sake/bottle/dassai-23");
    expect(screen.getByText("“Birthday”")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Page (1)" }));
    expect(screen.queryByRole("link", { name: "Dassai 23" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "All (2)" }));

    await user.click(screen.getAllByRole("button", { name: "Add note" })[0]);
    const input = screen.getByRole("textbox", { name: "Add a personal note..." });
    await user.clear(input);
    await user.type(input, "Gift for Dad");
    await user.click(screen.getByRole("button", { name: "Save note" }));
    expect(screen.getByText("“Gift for Dad”")).toBeInTheDocument();
    expect(window.localStorage.getItem(KEY)).toContain("Gift for Dad");

    await user.click(screen.getAllByRole("button", { name: "Remove" })[1]);
    expect(screen.queryByRole("link", { name: "Rice Encyclopedia" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Clear All" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Clear All" }));
    await user.click(screen.getByRole("button", { name: "Yes, clear all" }));
    expect(screen.getByText("Your journey begins here")).toBeInTheDocument();
  });

  it("cancels a note edit and uses the Austere look", async () => {
    seed();
    const user = userEvent.setup();
    const { container } = renderSake(<SakeFavorites />);
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".text-\\[oklch\\(0\\.52_0\\.19_30\\)\\]")).not.toBeNull();
    await user.click(screen.getAllByRole("button", { name: "Add note" })[0]);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
