import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MyHuntList } from "@/components/soulsmoke/pages/my-hunt-list";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";

const us = allMezcals.find((m) => m.market === "us")!;
const mx = allMezcals.find((m) => m.market === "mexico")!;
const both = allMezcals.find((m) => m.market === "both");

const renderWith = (ids: string[]) => {
  window.localStorage.setItem("mezcal-favorites", JSON.stringify(ids));
  return render(
    <SoulsmokeProviders>
      <MyHuntList />
    </SoulsmokeProviders>,
  );
};

describe("MyHuntList", () => {
  it("shows the empty state with a link to the Quadrant", () => {
    renderWith([]);
    expect(screen.getByRole("heading", { level: 1, name: "Your Hunt List is Empty" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the Quadrant" })).toHaveAttribute("href", "/soul-smoke/quadrant");
  });

  it("splits the list by market with totals and guide links", () => {
    const ids = [us.id, mx.id, ...(both ? [both.id] : [])];
    renderWith(ids);
    expect(screen.getByRole("heading", { level: 1, name: "My Hunt List" })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${ids.length} extraordinary bottles`))).toBeInTheDocument();
    const total = allMezcals.filter((m) => ids.includes(m.id)).reduce((s, m) => s + m.price, 0);
    expect(screen.getByText(`$${total}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Hunt in the US/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Source in Mexico/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open US Hunt Guide" })).toHaveAttribute("href", "/soul-smoke/us-hunt");
    expect(screen.getByRole("link", { name: "Open Mexico Source Guide" })).toHaveAttribute("href", "/soul-smoke/mexico-source");
  });

  it("uses one bottle wording and removes from the card heart", () => {
    renderWith([us.id]);
    expect(screen.getByText(/1 extraordinary bottle on/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: `Remove ${us.brand} ${us.name} from hunt list` }));
    expect(screen.getByRole("heading", { level: 1, name: "Your Hunt List is Empty" })).toBeInTheDocument();
  });

  it("opens the detail modal by click and keyboard, links to the right guide and removes", () => {
    renderWith([us.id, mx.id]);
    fireEvent.keyDown(screen.getByRole("button", { name: `${mx.brand} ${mx.name}` }), { key: "Enter" });
    expect(screen.getByRole("dialog", { name: `${mx.brand} ${mx.name}` })).toBeInTheDocument();
    expect(screen.getByText(mx.story)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mexico Source Guide" })).toHaveAttribute("href", "/soul-smoke/mexico-source");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(screen.getByRole("button", { name: `${us.brand} ${us.name}` }), { key: "x" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: `${us.brand} ${us.name}` }));
    expect(screen.getByRole("link", { name: "US Hunt Guide" })).toHaveAttribute("href", "/soul-smoke/us-hunt");
    fireEvent.click(screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: "Remove from List" }));
    expect(JSON.parse(window.localStorage.getItem("mezcal-favorites")!)).toEqual([mx.id]);
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("copies the list and clears it after confirming", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderWith([us.id, mx.id]);
    fireEvent.click(screen.getByRole("button", { name: "Copy List" }));
    await waitFor(() => expect(alert).toHaveBeenCalledWith("Hunt list copied to clipboard!"));
    expect(writeText.mock.calls[0][0]).toContain(`${us.brand} ${us.name}`);

    writeText.mockRejectedValueOnce(new Error("blocked"));
    fireEvent.click(screen.getByRole("button", { name: "Copy List" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
    expect(alert).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Clear All" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear All" }));
    fireEvent.click(screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear All" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Clear All" })[1]);
    expect(screen.getByRole("heading", { level: 1, name: "Your Hunt List is Empty" })).toBeInTheDocument();
  });
});
