import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeExvSystem } from "@/components/sake/pages/exv-system";
import { SakeProviders } from "@/components/sake/sake-providers";
import { calculateEXV, exvDimensions, exvTiers, namazakeBottles } from "@/lib/content/sake/exv-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeExvSystem />
    </SakeProviders>,
  );

describe("SakeExvSystem", () => {
  it("renders the sections, ranks the namazake by EXV, and lists every tier", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "The EXV System" })).toBeInTheDocument();
    for (const h of ["The Problem with Points", "Seven Dimensions of Experience", "Six Tiers of Experience", "EXV in Action", "The Shape IS the Rating"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    const ranked = [...namazakeBottles].sort((a, b) => calculateEXV(b.exv) - calculateEXV(a.exv));
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(ranked[0].name);
    expect(items).toHaveLength(namazakeBottles.length);
    for (const tier of exvTiers) expect(screen.getByRole("button", { name: new RegExp(tier.name) })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /EXV soul print/ })).toBeInTheDocument();
  });

  it("shows a dimension on hover or focus and opens a tier", async () => {
    const user = userEvent.setup();
    renderPage();
    const dim = exvDimensions[0];
    const card = screen.getByRole("button", { name: new RegExp(dim.question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
    fireEvent.mouseEnter(card);
    expect(screen.getByText(dim.description)).toBeInTheDocument();
    fireEvent.mouseLeave(card);
    expect(screen.queryByText(dim.description)).toBeNull();
    fireEvent.focus(card);
    expect(screen.getByText(dim.description)).toBeInTheDocument();
    fireEvent.blur(card);

    const point = screen.getByRole("img", { name: /EXV soul print/ }).querySelector("circle[tabindex]")!;
    fireEvent.focus(point);
    expect(screen.getByText(dim.description)).toBeInTheDocument();
    fireEvent.blur(point);
    fireEvent.mouseEnter(point);
    expect(screen.getByText(dim.description)).toBeInTheDocument();
    fireEvent.mouseLeave(point);

    const tier = exvTiers[0];
    const tierButton = screen.getByRole("button", { name: new RegExp(tier.name) });
    expect(screen.getByText(tier.description)).not.toBeVisible();
    await user.click(tierButton);
    expect(screen.getByText(tier.description)).toBeVisible();
    await user.click(tierButton);
    expect(tierButton).toHaveAttribute("aria-expanded", "false");
  });
});
