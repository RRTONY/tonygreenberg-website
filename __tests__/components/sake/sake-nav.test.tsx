import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SakeNav } from "@/components/sake/sake-nav";
import { SakeProviders } from "@/components/sake/sake-providers";
import { getSakeMember } from "@/app/sake/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/sake/actions", () => ({ getSakeMember: vi.fn() }));

function renderNav() {
  return render(
    <SakeProviders>
      <SakeNav />
    </SakeProviders>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(getSakeMember).mockResolvedValue({ signedIn: false, id: null, email: null, name: null, isAdmin: false });
  navigation.pathname = "/sake";
});

describe("SakeNav", () => {
  it("links the logo and the main links under /sake, marking the current page", () => {
    navigation.pathname = "/sake/collection";
    renderNav();
    expect(screen.getAllByRole("link", { name: /Sake for Sake's Sake/ })[0]).toHaveAttribute("href", "/sake");
    const collection = screen.getByRole("link", { name: "Collection" });
    expect(collection).toHaveAttribute("href", "/sake/collection");
    expect(collection).toHaveAttribute("aria-current", "page");
    expect(collection).toHaveClass("text-(--sk-accent)");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /Subscribe/ })).toHaveAttribute("href", "/sake/subscription");
  });

  it("opens a menu on click, highlights it on one of its pages, and closes on Escape or outside tap", async () => {
    navigation.pathname = "/sake/rice";
    const user = userEvent.setup();
    renderNav();
    const knowledge = screen.getByRole("button", { name: /Knowledge/ });
    expect(knowledge).toHaveClass("text-(--sk-accent)");
    await user.click(knowledge);
    expect(knowledge).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Rice Encyclopedia" })).toHaveAttribute("href", "/sake/rice");
    expect(screen.getByRole("link", { name: "Rice Encyclopedia" })).toHaveAttribute("aria-current", "page");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(knowledge).toHaveAttribute("aria-expanded", "false");

    await user.click(knowledge);
    fireEvent.pointerDown(document.body);
    expect(knowledge).toHaveAttribute("aria-expanded", "false");

    // Clicking a link in a menu closes it; clicking the open menu's button closes it too.
    await user.click(screen.getByRole("button", { name: /QPR & Tools/ }));
    await user.click(screen.getByRole("link", { name: "Dollar Map" }));
    expect(screen.queryByRole("link", { name: "Dollar Map" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Ritual/ }));
    await user.click(screen.getByRole("button", { name: /Ritual/ }));
    expect(screen.queryByRole("link", { name: "Ceremony" })).not.toBeInTheDocument();
  });

  it("switches Austere, mode and language from the bar", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getByTitle("Switch to Austere (枯山水)"));
    expect(screen.getByTitle("Switch to Kintsugi Noir")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByText("酒のための酒").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /Beginner/ }));
    expect(screen.getByRole("button", { name: /Connoisseur/ })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "日本語に切り替え" }));
    expect(screen.getByRole("link", { name: "コレクション" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch to English" })).toBeInTheDocument();
  });

  it("shows the saved count on Favorites", () => {
    window.localStorage.setItem(
      "sake-favorites-v1",
      JSON.stringify([{ id: "a", type: "page", name: "A", nameJa: "A", path: "/sake/rice", addedAt: 1 }]),
    );
    renderNav();
    const favorites = screen.getByRole("link", { name: /Favorites/ });
    expect(within(favorites).getByText("1")).toBeInTheDocument();
  });

  it("opens the phone menu with every section, and closes it on a new page", async () => {
    const user = userEvent.setup();
    const { rerender } = renderNav();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    const place = screen.getAllByRole("button", { name: /Place/ }).at(-1)!;
    await user.click(place);
    expect(place).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "Fushimi" }).at(-1)).toHaveAttribute("href", "/sake/fushimi");
    await user.click(place);
    expect(place).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByRole("button", { name: "枯山水モード" }));
    expect(screen.getByRole("button", { name: "金継ぎモード" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Switch to Connoisseur" }));
    expect(screen.getByRole("button", { name: "Switch to Beginner" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Subscribe — Monthly Sake Box/ })).toHaveAttribute("href", "/sake/subscription");

    navigation.pathname = "/sake/fushimi";
    rerender(
      <SakeProviders>
        <SakeNav />
      </SakeProviders>,
    );
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens search from the button and toggles it with Cmd/Ctrl+K", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(document, { key: "k", metaKey: true });
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(document, { key: "K", ctrlKey: true });
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
