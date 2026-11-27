import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeHomeIzakaya } from "@/components/sake/pages/home-izakaya";
import { homeIzakayaElements } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeHomeIzakaya />
    </SakeProviders>,
  );

describe("SakeHomeIzakaya", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Home Izakaya Builder/ })).toBeInTheDocument();
    for (const s of homeIzakayaElements) expect(screen.getByRole("heading", { level: 2, name: s.title })).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText(homeIzakayaElements[0].tips[0])).toBeInTheDocument();
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
        <SakeHomeIzakaya />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /自宅居酒屋ビルダー/ })).toBeInTheDocument();
  });
});
