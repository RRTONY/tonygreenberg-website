import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeJournal } from "@/components/sake/pages/journal";
import { journalFields } from "@/lib/content/sake/deep-data2";
import { SakeProviders, useLanguage } from "@/components/sake/sake-providers";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeJournal />
    </SakeProviders>,
  );

describe("SakeJournal", () => {
  it("renders the hero and every item", () => {
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Sake Journal/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Sake Moment" })).toBeInTheDocument();
    for (const f of journalFields) expect(screen.getByText(f.label)).toBeInTheDocument();
    for (const f of journalFields.filter((x) => x.type === "select" && x.options)) expect(screen.getByText(f.options![0].en)).toBeInTheDocument();
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
        <SakeJournal />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByRole("heading", { level: 1, name: /酒の日記/ })).toBeInTheDocument();
  });
});
