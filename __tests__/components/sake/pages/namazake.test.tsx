import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeNamazake } from "@/components/sake/pages/namazake";
import { SakeProviders, useMode } from "@/components/sake/sake-providers";
import { namazakeBottles, namazakeSubtypes } from "@/lib/content/sake/exv-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function ModeToggle() {
  const { toggleMode } = useMode();
  return (
    <button type="button" onClick={toggleMode}>
      toggle mode
    </button>
  );
}

const renderPage = () =>
  render(
    <SakeProviders>
      <ModeToggle />
      <SakeNamazake />
    </SakeProviders>,
  );

describe("SakeNamazake", () => {
  it("renders every section, subtype and bottle, with no stray footers", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Namazake" })).toBeInTheDocument();
    for (const h of ["The Science of Being Alive", "The Three Lives of Nama", "The Living Collection", "The Natural Wine Bridge", "On Drinking Something Alive"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    for (const sub of namazakeSubtypes) expect(screen.getByText(sub.name)).toBeInTheDocument();
    for (const b of namazakeBottles) expect(screen.getByText(b.name)).toBeInTheDocument();
    // Collapsed text is still in the page.
    expect(screen.getByText(namazakeBottles[0].story, { selector: "p" })).not.toBeVisible();
    expect(container.querySelector("footer")).toBeNull();
  });

  it("opens a subtype and a bottle, filters by subtype, and shows the connoisseur note", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const sub = namazakeSubtypes[0];
    const subButton = container.querySelector<HTMLButtonElement>(`button[aria-controls="sk-nama-${sub.key}"]`)!;
    await user.click(subButton);
    expect(subButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(sub.character)).toBeVisible();
    await user.click(subButton);
    expect(subButton).toHaveAttribute("aria-expanded", "false");

    const bottle = namazakeBottles[0];
    const bottleButton = container.querySelector<HTMLButtonElement>(`button[aria-controls="sk-nama-bottle-${bottle.id}"]`)!;
    await user.click(bottleButton);
    expect(screen.getByText(bottle.story, { selector: "p" })).toBeVisible();
    await user.click(bottleButton);

    await user.click(screen.getByRole("button", { name: /Namazume 生詰/ }));
    const shown = namazakeBottles.filter((b) => b.subtype === "namazume");
    for (const b of namazakeBottles) {
      if (shown.includes(b)) expect(screen.getByText(b.name)).toBeInTheDocument();
      else expect(screen.queryByText(b.name)).toBeNull();
    }
    await user.click(screen.getByRole("button", { name: "All" }));

    expect(screen.queryByText("Connoisseur: Enzyme Dynamics")).toBeNull();
    await user.click(screen.getByRole("button", { name: "toggle mode" }));
    expect(screen.getByText("Connoisseur: Enzyme Dynamics")).toBeInTheDocument();
  });
});
