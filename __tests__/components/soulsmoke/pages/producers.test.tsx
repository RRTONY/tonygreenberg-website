import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Producers, producers } from "@/components/soulsmoke/pages/producers";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderPage() {
  return render(
    <SoulsmokeProviders>
      <Producers />
    </SoulsmokeProviders>,
  );
}

describe("Producers", () => {
  it("opens Real Minero first and keeps the other stories in the page, hidden", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Makers");
    const [first, second] = producers;
    expect(screen.getByRole("button", { name: new RegExp(`^${first.name}`) })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(first.story[0])).toBeVisible();
    // Collapsed content is still rendered (crawlable), just hidden.
    expect(screen.getByText(second.story[0])).not.toBeVisible();
  });

  it("toggles a producer open and closed", () => {
    renderPage();
    const fane = screen.getByRole("button", { name: /^Fane Kantsini/ });
    fireEvent.click(fane);
    expect(fane).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(producers[1].story[0])).toBeVisible();
    expect(screen.getByText(producers[0].story[0])).not.toBeVisible();
    fireEvent.click(fane);
    expect(fane).toHaveAttribute("aria-expanded", "false");
  });

  it("saves a bottle as a favorite and links it to the Quadrant", () => {
    renderPage();
    const add = screen.getAllByRole("button", { name: /to favorites/ })[0];
    expect(add).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(add);
    const remove = screen.getAllByRole("button", { name: /from favorites/ })[0];
    expect(remove).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(window.localStorage.getItem("mezcal-favorites") ?? "[]")).toHaveLength(1);
    fireEvent.click(remove);
    expect(JSON.parse(window.localStorage.getItem("mezcal-favorites") ?? "[]")).toHaveLength(0);
    const quadrant = screen.getAllByRole("link", { name: /in the Quadrant/ })[0];
    expect(quadrant.getAttribute("href")).toMatch(/^\/soul-smoke\/quadrant\?bottle=/);
    expect(screen.getByRole("link", { name: "How to Get Allocated" })).toHaveAttribute(
      "href",
      "/soul-smoke/how-to-get-allocated",
    );
  });
});
