import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AqueousNotFound } from "@/components/aqueous/pages/not-found";

describe("AqueousNotFound", () => {
  it("shows the 404 with ripples and links back into Aqueous", () => {
    const { container } = render(<AqueousNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lost in the Current" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to the source/ })).toHaveAttribute("href", "/aqueous");
    expect(screen.getByRole("link", { name: /Explore Waters/ })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: /Site Directory/ })).toHaveAttribute("href", "/aqueous/directory");
    expect(screen.getByRole("link", { name: "See Your AWI Rankings" })).toHaveAttribute("href", "/aqueous/awi");
    const ripples = container.querySelectorAll(".aq-ripple");
    expect(ripples).toHaveLength(3);
    expect(ripples[1]).toHaveClass("delay-1000!");
    expect(ripples[2]).toHaveClass("delay-2000!");
    expect(container.querySelector("main")).toBeNull();
  });
});
