import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScrollRow } from "@/components/ui/scroll-row";

function setSize(scrollWidth: number, clientWidth: number) {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scrollWidth);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(clientWidth);
}

const renderRow = () =>
  render(
    <ScrollRow label="concepts">
      <button type="button">One</button>
      <button type="button">Two</button>
    </ScrollRow>,
  );

describe("ScrollRow", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shows its buttons in a labelled group and no arrows when everything fits", () => {
    setSize(300, 300);
    renderRow();
    expect(screen.getByRole("group", { name: "concepts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Scroll concepts right" })).toBeNull();
  });

  it("shows arrows when the row overflows: left greyed out at the start, right scrolls", async () => {
    setSize(1200, 400);
    const scrollBy = vi.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    renderRow();
    expect(screen.getByRole("button", { name: "Scroll concepts left" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Scroll concepts right" }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 320, behavior: "smooth" });
  });

  it("greys out the right arrow at the end", () => {
    setSize(1200, 400);
    renderRow();
    const group = screen.getByRole("group", { name: "concepts" });
    vi.spyOn(group, "scrollLeft", "get").mockReturnValue(800);
    fireEvent.scroll(group);
    expect(screen.getByRole("button", { name: "Scroll concepts right" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Scroll concepts left" })).toBeEnabled();
  });
});
