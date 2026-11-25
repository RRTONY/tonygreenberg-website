import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeTasteProfile } from "@/components/sake/pages/taste-profile/taste-profile";
import { archetypeFor } from "@/components/sake/pages/taste-profile/hook/use-taste-profile";
import { archetypes } from "@/components/sake/pages/taste-profile/data/taste-profile.data";
import { tasteQuestions } from "@/lib/content/sake/education-data";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("taste profile data", () => {
  it("links only bottles that have a sake page", () => {
    const ids = new Set(qprSakeDatabase.map((s) => s.id));
    for (const a of Object.values(archetypes)) for (const b of a.bottles) if (b.sakeId) expect(ids.has(b.sakeId)).toBe(true);
  });

  it("scores answers into an archetype", () => {
    expect(archetypeFor(tasteQuestions.map(() => 0))).toBe(archetypes.purist);
    expect(archetypeFor([])).toBe(archetypes.purist);
  });
});

describe("SakeTasteProfile", () => {
  it("asks the questions, shows the archetype and retakes", async () => {
    const user = userEvent.setup();
    renderSake(<SakeTasteProfile />);
    expect(screen.getByRole("heading", { level: 1, name: /Your Sake\s*Taste Profile/ })).toBeInTheDocument();
    for (let i = 0; i < tasteQuestions.length; i++) {
      expect(screen.getByText(`Question ${i + 1} of ${tasteQuestions.length}`)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: tasteQuestions[i].options[0].labelEn }));
    }
    expect(screen.getByRole("heading", { level: 2, name: archetypes.purist.archetype })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dassai 23/ })).toHaveAttribute("href", "/sake/bottle/dassai-23");
    expect(screen.queryByRole("link", { name: /Juyondai Ryusen/ })).toBeNull();
    expect(screen.getByText("Juyondai Ryusen")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Retake the Test/ }));
    expect(screen.getByText(`Question 1 of ${tasteQuestions.length}`)).toBeInTheDocument();
  });

  it("uses the Austere look and Japanese", async () => {
    const user = userEvent.setup();
    renderSake(<SakeTasteProfile />);
    await user.click(screen.getByTestId("toggle-austere"));
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("汝自身を知れ").className).toContain("text-red-800");
  });
});
