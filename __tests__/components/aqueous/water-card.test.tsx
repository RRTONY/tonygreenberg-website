import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WaterCard } from "@/components/aqueous/water-card";
import { bottledWaters, getPackagingLabel, getSourceTypeLabel } from "@/lib/content/aqueous/water-data";
import { calculateAWI, defaultProfile } from "@/lib/content/aqueous/awi-engine";

describe("WaterCard", () => {
  const water = bottledWaters[0];

  it("links to the water's page and shows its AWI score", () => {
    const { container } = render(<WaterCard water={water} index={2} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/aqueous/water/${water.id}`);
    expect(screen.getByRole("img", { name: water.name })).toBeInTheDocument();
    expect(screen.getAllByText(String(calculateAWI(water, defaultProfile).personalScore)).length).toBeGreaterThan(0);
    expect(screen.getByText(getSourceTypeLabel(water.type))).toBeInTheDocument();
    expect(screen.getByText(getPackagingLabel(water.packaging))).toBeInTheDocument();
    expect(screen.getByText(`$${water.pricePerGallon.toFixed(2)}`)).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).style.animationDelay).toBe("0.16s");
  });

  it("uses the visitor's profile when given", () => {
    render(<WaterCard water={water} profile={{ ...defaultProfile }} />);
    expect(screen.getByRole("heading", { name: water.name })).toBeInTheDocument();
  });
});
