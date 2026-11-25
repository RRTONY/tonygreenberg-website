import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeSommelierCard } from "@/components/sake/pages/sommelier-card/sommelier-card";
import { matchProfile } from "@/components/sake/pages/sommelier-card/hook/use-sommelier-card";
import { sommelierCardData } from "@/components/sake/pages/sommelier-card/data/sommelier-card.data";
import { sommelierProfiles } from "@/lib/content/sake/qpr-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("matchProfile", () => {
  it("picks the most-chosen profile, falling back to the first", () => {
    const answers = sommelierCardData.questions.map((q) => ({ questionId: q.id, answerId: "d" }));
    expect(matchProfile(answers).id).toBe("scholar");
    expect(matchProfile([]).id).toBe(sommelierProfiles[0].id);
  });
});

describe("SakeSommelierCard", () => {
  it("runs the quiz, shows the card, copies the phrase and retakes", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    renderSake(<SakeSommelierCard />);
    expect(screen.getByRole("heading", { level: 1, name: /Sommelier\s*Card/ })).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
    for (const q of sommelierCardData.questions) {
      await user.click(screen.getByRole("button", { name: new RegExp(q.answers[0].text[0].slice(0, 20)) }));
    }
    const purist = sommelierProfiles.find((p) => p.id === "purist")!;
    expect(screen.getByRole("heading", { level: 2, name: purist.name })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Copy/ }));
    expect(writeText).toHaveBeenCalled();
    expect(await screen.findByText("Copied!")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Your name (optional)" }), "Aiko");
    expect(screen.getAllByText("Aiko").length).toBeGreaterThan(0);
    for (const link of screen.queryAllByRole("link")) expect(link.getAttribute("href")).toMatch(/^\/sake\/bottle\//);
    expect(screen.getByText("You")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Retake Quiz/ }));
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
  });

  it("switches to the Austere look and Japanese", async () => {
    const user = userEvent.setup();
    renderSake(<SakeSommelierCard />);
    await user.click(screen.getByTestId("toggle-austere"));
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("質問 1 / 5")).toBeInTheDocument();
    expect(screen.getByText("あなたの酒のアイデンティティ").className).toContain("text-red-800");
  });
});
