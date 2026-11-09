import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TasteQuiz } from "@/components/soulsmoke/pages/taste-quiz/taste-quiz";
import { questions } from "@/components/soulsmoke/pages/taste-quiz/data/taste-quiz.data";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("TasteQuiz (end to end)", () => {
  it("walks all eight questions to the top 10 list, then Retake starts over", async () => {
    const user = userEvent.setup();
    render(
      <SoulsmokeProviders>
        <TasteQuiz />
      </SoulsmokeProviders>,
    );
    for (let i = 0; i < questions.length; i++) {
      expect(await screen.findByText(`Question ${i + 1} of ${questions.length}`)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: new RegExp(questions[i].options[2].label) }));
    }
    expect(await screen.findByRole("heading", { level: 1, name: "Your Top 10 Quest List" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(10);
    await user.click(screen.getByRole("button", { name: "Retake Quiz" }));
    expect(screen.getByText(`Question 1 of ${questions.length}`)).toBeInTheDocument();
  }, 30000);
});
