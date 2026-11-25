import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeManifesto } from "@/components/sake/pages/manifesto";
import { manifestoSections } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeManifesto />
    </SakeProviders>,
  );

describe("SakeManifesto", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Anti-Score Manifesto/ })).toBeInTheDocument();
    for (const s of manifestoSections) expect(screen.getByRole("heading", { level: 2, name: s.title })).toBeInTheDocument();
    expect(screen.getByText("酒")).toHaveClass("hanko");
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
        <SakeManifesto />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /アンチスコア宣言/ })).toBeInTheDocument();
  });
});
