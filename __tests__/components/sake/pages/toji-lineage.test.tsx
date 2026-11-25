import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeTojiLineage } from "@/components/sake/pages/toji-lineage";
import { tojiGuilds } from "@/lib/content/sake/deep-data";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeTojiLineage />
    </SakeProviders>,
  );

describe("SakeTojiLineage", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Toji Lineage/ })).toBeInTheDocument();
    for (const g of tojiGuilds) expect(screen.getByText(g.philosophy)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manuscdn/);
  });

  it("shows one panel at a time and switches on click", async () => {
    const user = userEvent.setup();
    renderPage();
    const [first, second] = tojiGuilds;
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
        <SakeTojiLineage />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /杜氏の系譜/ })).toBeInTheDocument();
  });
});
