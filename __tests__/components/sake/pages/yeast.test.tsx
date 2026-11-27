import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeYeast } from "@/components/sake/pages/yeast";
import { yeastStrains } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeYeast />
    </SakeProviders>,
  );

describe("SakeYeast", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Yeast Strains/ })).toBeInTheDocument();
    for (const y of yeastStrains) expect(screen.getByText(y.name)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("opens and closes an item's detail", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const first = yeastStrains[0];
    const panel = container.querySelector(`#sake-yeast-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.character);
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
        <SakeYeast />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /酵母の世界/ })).toBeInTheDocument();
  });
});
