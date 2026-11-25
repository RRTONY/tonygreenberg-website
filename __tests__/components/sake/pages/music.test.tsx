import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeMusic } from "@/components/sake/pages/music";
import { musicPairings } from "@/lib/content/sake/deep-data";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeMusic />
    </SakeProviders>,
  );

describe("SakeMusic", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Sake × Music/ })).toBeInTheDocument();
    for (const m of musicPairings) expect(screen.getAllByText(m.track).length).toBeGreaterThan(0);
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("opens and closes an item's detail", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const first = musicPairings[0];
    const panel = container.querySelector(`#sake-music-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.why);
    const button = screen.getAllByRole("button", { expanded: false }).find((b) => b.getAttribute("aria-controls") === panel.id)!;
    await user.click(button);
    expect(panel).not.toHaveAttribute("hidden");
    expect(button).toHaveAttribute("aria-expanded", "true");
    await user.click(button);
    expect(panel).toHaveAttribute("hidden");
  });

  it("switches to Japanese with the language toggle", async () => {
    const user = userEvent.setup();
    function Toggle() {
      const { toggleLang } = useLanguage();
      return <button type="button" onClick={toggleLang}>lang</button>;
    }
    render(
      <SakeProviders>
        <Toggle />
        <SakeMusic />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /日本酒 × 音楽/ })).toBeInTheDocument();
  });
});
