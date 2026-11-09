import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScentFinder } from "@/components/soulsmoke/pages/scent-finder/scent-finder";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderFinder() {
  return render(
    <SoulsmokeProviders>
      <ScentFinder />
    </SoulsmokeProviders>,
  );
}

describe("ScentFinder (end to end)", () => {
  it("picks notes, shows the matches, then Try Again starts over", async () => {
    const user = userEvent.setup();
    renderFinder();
    expect(screen.getByRole("heading", { level: 1, name: "Scent-to-Agave Finder" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/soul-smoke");
    await user.click(screen.getByRole("button", { name: "Charcoal" }));
    await user.click(screen.getByRole("button", { name: "Leather" }));
    await user.click(screen.getByRole("button", { name: /Find My Agave \(2 notes selected\)/ }));

    expect(screen.getByRole("heading", { level: 2, name: "Your Agave Matches" })).toBeInTheDocument();
    expect(screen.getByText("Charcoal, Leather")).toBeInTheDocument();
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(["Sierra Negra", "Jabalí"]);
    expect(screen.getByText("MATCH #1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try Again" }));
    expect(screen.getByRole("button", { name: /Find My Agave \(0 notes selected\)/ })).toBeDisabled();
  });

  it("speaks Spanish when the visitor chose it", () => {
    localStorage.setItem("soulsmoke-language", JSON.stringify("es"));
    renderFinder();
    expect(screen.getByRole("heading", { level: 1, name: "Buscador Aroma-Agave" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Encuentra Mi Agave \(0 notas\)/ })).toBeInTheDocument();
  });
});
