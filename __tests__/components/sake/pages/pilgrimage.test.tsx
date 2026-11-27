import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakePilgrimage } from "@/components/sake/pages/pilgrimage";
import { pilgrimageRoutes } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakePilgrimage />
    </SakeProviders>,
  );

describe("SakePilgrimage", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Pilgrimage Routes/ })).toBeInTheDocument();
    for (const r of pilgrimageRoutes) expect(screen.getByText(r.description)).toBeInTheDocument();
    expect(screen.getAllByText("Stop 1").length).toBe(pilgrimageRoutes.length);
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("shows one panel at a time and switches on click", async () => {
    const user = userEvent.setup();
    renderPage();
    const [first, second] = pilgrimageRoutes;
    expect(screen.getByRole("button", { name: new RegExp(first.name) })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(first.name, { selector: "h2" }).closest("div[hidden]")).toBeNull();
    expect(screen.getByText(second.name, { selector: "h2" }).closest("div[hidden]")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: new RegExp(second.name) }));
    expect(screen.getByRole("button", { name: new RegExp(second.name) })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(second.name, { selector: "h2" }).closest("div[hidden]")).toBeNull();
    expect(screen.getByText(first.name, { selector: "h2" }).closest("div[hidden]")).not.toBeNull();
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
        <SakePilgrimage />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /巡礼の道/ })).toBeInTheDocument();
  });
});
