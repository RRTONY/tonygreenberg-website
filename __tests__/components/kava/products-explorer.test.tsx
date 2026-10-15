import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductsExplorer } from "@/components/kava/products-explorer";

describe("ProductsExplorer", () => {
  it("opens on ceremonial powders with tabs for all five categories", () => {
    render(<ProductsExplorer />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Ceremonial Grade Traditional Powder");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText("2-4-6-5-3-1 (heady-heavy balance)")).toBeInTheDocument();
  });

  it("tabs use the short title before the dash", () => {
    render(<ProductsExplorer />);
    expect(screen.getByRole("button", { name: "Fresh Frozen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kava Bars" })).toBeInTheDocument();
  });

  it("switching category shows its products and real buy links in a new tab", async () => {
    render(<ProductsExplorer />);
    await userEvent.click(screen.getByRole("button", { name: "RTD Beverages" }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("RTD Beverages");
    expect(screen.getByText(/WARNING: contains caffeine/)).toBeInTheDocument();
    const buy = screen.getAllByRole("link", { name: "Buy Now" });
    expect(buy).toHaveLength(4);
    expect(buy[0]).toHaveAttribute("href", "https://leilo.com");
    expect(buy[0]).toHaveAttribute("target", "_blank");
    expect(buy[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("bars without a website get no Buy Now button", async () => {
    render(<ProductsExplorer />);
    await userEvent.click(screen.getByRole("button", { name: "Kava Bars" }));
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: "Buy Now" })).toHaveLength(2);
    expect(document.querySelector('a[href="#"]')).toBeNull();
  });

  it("shows the PRI rating as text", () => {
    render(<ProductsExplorer />);
    expect(screen.getAllByText("PRI Rating: 5/5")).toHaveLength(2);
    expect(screen.getAllByText("PRI Rating: 4/5")).toHaveLength(2);
  });
});
