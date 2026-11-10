import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SoulsmokeHomePage, { metadata } from "@/app/soul-smoke/page";
import SoulsmokeLayout from "@/app/soul-smoke/layout";

describe("/soul-smoke", () => {
  it("uses the SoulSmoke app's own title and description, with a canonical", () => {
    expect(metadata.title).toBe("SoulSmoke - The Miracle of Mezcal");
    expect(metadata.description).toMatch(/^Liquids that touch your mouth/);
    expect(metadata.alternates?.canonical).toBe("/soul-smoke");
  });

  it("renders inside SoulSmoke's own shell (its menu, not the site header)", () => {
    render(
      <SoulsmokeLayout params={Promise.resolve({})}>
        <SoulsmokeHomePage />
      </SoulsmokeLayout>,
    );
    expect(screen.getByRole("navigation", { name: "SoulSmoke" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { level: 1 }));
  });
});
