import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GatewayShowcase } from "@/components/liquidsun/home/gateway-showcase";
import { getCheapestBuyLink, getGateway } from "@/lib/content/liquidsun/producers";

describe("GatewayShowcase", () => {
  it("lists every Gateway bottle with its open price link and links to the Flavor Matrix", () => {
    render(<GatewayShowcase />);
    const gateway = getGateway();
    expect(screen.getByRole("heading", { name: "Start Here" })).toBeInTheDocument();
    for (const p of gateway) expect(screen.getByRole("heading", { name: p.brand })).toBeInTheDocument();
    const withLinks = gateway.filter((p) => getCheapestBuyLink(p));
    expect(screen.getAllByRole("link", { name: /^\$\d+$/ })).toHaveLength(withLinks.length);
    expect(screen.getByRole("link", { name: /Explore All Bottles on the Flavor Matrix/ })).toHaveAttribute("href", "/liquid-sun/quadrant");
  });
});
