import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeSpeaking } from "@/components/sake/pages/speaking";
import { sakeVocabulary } from "@/lib/content/sake/education-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeSpeaking />
    </SakeProviders>,
  );

describe("SakeSpeaking", () => {
  it("filters by category and opens a word's usage", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Speak Sake/ })).toBeInTheDocument();
    const tasting = sakeVocabulary.filter((w) => w.category === "tasting");
    expect(screen.getByText(tasting[0].term)).toBeInTheDocument();
    const word = tasting[0];
    await user.click(screen.getByText(word.term).closest("button")!);
    expect(screen.getByText(word.usageEn)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Culture" }));
    const culture = sakeVocabulary.filter((w) => w.category === "culture");
    expect(screen.getByText(culture[0].term)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Culture" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelectorAll("[aria-expanded=true]")).toHaveLength(0);
  });
});
