import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientsPage, { metadata } from "@/app/clients/page";

function clientCount(container: HTMLElement) {
  const m = (container.textContent ?? "").match(/(\d+) companies across 25 years/);
  return Number(m?.[1]);
}

describe("/clients", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Clients");
    expect(metadata.description).toMatch(/Microsoft, Disney, Goldman Sachs, Nike/);
    expect(metadata.alternates?.canonical).toBe("/clients");
  });

  it("renders one H1, the real copy and stats", () => {
    const { container } = render(<ClientsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Rolodex");
    expect(container).toHaveTextContent("This is who trusts RampRate with their infrastructure.");
    expect(container).toHaveTextContent(`${clientCount(container)}+Clients Served`);
    expect(container).toHaveTextContent("$10B+Benchmarked");
    expect(screen.getByRole("heading", { level: 2, name: "Consciousness Calibration" })).toBeInTheDocument();
  });

  it("filters the grid by industry", async () => {
    const user = userEvent.setup();
    render(<ClientsPage />);
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Finance \(\d+\)$/ }));
    expect(screen.getByText("Goldman Sachs")).toBeInTheDocument();
    expect(screen.queryByText("Microsoft")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^All \(\d+\)$/ }));
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
  });

  it("links back home, to RampRate and to Recent Creations", () => {
    render(<ClientsPage />);
    expect(screen.getByRole("link", { name: /Back to The Broadsheet/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Visit RampRate/ })).toHaveAttribute("href", "https://ramprate.com");
    expect(screen.getByRole("link", { name: /Recent Creations/ })).toHaveAttribute("href", "/recent-creations");
  });

  // The page counts its own list (79) but the search description promises 90+.
  it.fails("BUG: the meta description's client count matches the list on the page (src/app/clients/page.tsx:14)", () => {
    const { container } = render(<ClientsPage />);
    expect(metadata.description).toContain(`${clientCount(container)}+`);
  });
});
