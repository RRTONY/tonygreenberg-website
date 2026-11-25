import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeGift } from "@/components/sake/pages/gift";
import { giftOccasions } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeGift />
    </SakeProviders>,
  );

describe("SakeGift", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Gift Protocol/ })).toBeInTheDocument();
    for (const g of giftOccasions) expect(screen.getByRole("heading", { level: 2, name: g.occasion })).toBeInTheDocument();
    expect(screen.getAllByText("Wrapping")).toHaveLength(giftOccasions.length);
    expect(container.innerHTML).not.toMatch(/manuscdn/);
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
        <SakeGift />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /贈答の作法/ })).toBeInTheDocument();
  });
});
