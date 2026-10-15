import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DecafFame } from "@/components/brewsoul/decaf-fame";
import { FAME } from "@/lib/content/brewsoul-decaf";

describe("DecafFame", () => {
  it("lists every clean decaf brand with its price per ounce", () => {
    render(<DecafFame />);
    expect(screen.getAllByRole("button")).toHaveLength(FAME.length);
    expect(screen.getByRole("button", { name: new RegExp(FAME[0].name) })).toHaveTextContent(`${FAME[0].perOz}/oz`);
  });

  it("opens a brand's notes, process and buy link, one brand at a time", async () => {
    const user = userEvent.setup();
    render(<DecafFame />);
    const [a, b] = FAME;
    await user.click(screen.getByRole("button", { name: new RegExp(a.name) }));
    expect(screen.getByText(a.notes)).toBeInTheDocument();
    const buy = screen.getByRole("link", { name: /Buy/ });
    expect(buy).toHaveAttribute("href", a.url);
    expect(buy).toHaveAttribute("target", "_blank");
    await user.click(screen.getByRole("button", { name: new RegExp(b.name) }));
    expect(screen.queryByText(a.notes)).not.toBeInTheDocument();
    expect(screen.getByText(b.notes)).toBeInTheDocument();
  });

  it("clicking the buy link doesn't collapse the brand", async () => {
    const user = userEvent.setup();
    render(<DecafFame />);
    await user.click(screen.getByRole("button", { name: new RegExp(FAME[0].name) }));
    const buy = screen.getByRole("link", { name: /Buy/ });
    buy.addEventListener("click", (e) => e.preventDefault());
    await user.click(buy);
    expect(screen.getByText(FAME[0].notes)).toBeInTheDocument();
  });

  it("every brand has a real https buy link", () => {
    for (const b of FAME) expect(b.url).toMatch(/^https:\/\//);
  });
});

describe("DecafFame markup", () => {
  it.fails("BUG: the Buy link is not nested inside the card's <button> (a link inside a button is invalid HTML and unreachable by keyboard)", async () => {
    const user = userEvent.setup();
    render(<DecafFame />);
    await user.click(screen.getByRole("button", { name: new RegExp(FAME[0].name) }));
    expect(screen.getByRole("link", { name: /Buy/ }).closest("button")).toBeNull();
  });
});
