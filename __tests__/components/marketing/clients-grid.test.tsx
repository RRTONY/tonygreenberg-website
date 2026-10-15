import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientsGrid, type Client } from "@/components/marketing/clients-grid";

const CLIENTS: Client[] = [
  { name: "Zeta Bank", industry: "Finance", hawkins: 320, tier: 2 },
  { name: "Alpha Tech", industry: "Technology", hawkins: 410, tier: 1 },
  { name: "Mid Media", industry: "Media", hawkins: 200, tier: 3 },
];
const names = () => screen.getAllByText(/^(Zeta Bank|Alpha Tech|Mid Media)$/).map((n) => n.textContent);

describe("ClientsGrid", () => {
  it("lists every client, sorted by consciousness score first", () => {
    render(<ClientsGrid clients={CLIENTS} />);
    expect(screen.getByRole("button", { name: "All (3)" })).toBeInTheDocument();
    expect(names()).toEqual(["Alpha Tech", "Zeta Bank", "Mid Media"]);
    expect(screen.getByText("Enlightened")).toBeInTheDocument();
    expect(screen.getByText("Courage")).toBeInTheDocument();
  });

  it("filters by industry", async () => {
    render(<ClientsGrid clients={CLIENTS} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Finance (1)" }));
    expect(names()).toEqual(["Zeta Bank"]);
  });

  it("sorts by name and by industry", async () => {
    const user = userEvent.setup();
    render(<ClientsGrid clients={CLIENTS} />);
    await user.click(screen.getByRole("button", { name: "name" }));
    expect(names()).toEqual(["Alpha Tech", "Mid Media", "Zeta Bank"]);
    await user.click(screen.getByRole("button", { name: "industry" }));
    expect(names()).toEqual(["Zeta Bank", "Mid Media", "Alpha Tech"]);
  });
});
