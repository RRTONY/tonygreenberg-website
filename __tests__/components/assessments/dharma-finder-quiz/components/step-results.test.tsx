import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepResults } from "@/components/assessments/dharma-finder-quiz/components/step-results";
import type { StepProps } from "@/components/assessments/dharma-finder-quiz/dharma-finder-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

function quiz(totalAnswered = 3) {
  return {
    profile: { archetypes: ["Creator / Builder", "Leader / Organizer"], coreValues: ["Love & Compassion"], completionDepth: 12, totalAnswered },
    retake: vi.fn(),
  } as unknown as StepProps["quiz"];
}

describe("dharma StepResults", () => {
  it("shows the roles, values and depth from the profile", () => {
    render(<StepResults quiz={quiz()} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Threads of Your Purpose");
    expect(screen.getByText("Creator / Builder")).toBeInTheDocument();
    expect(screen.getByText("Leader / Organizer")).toBeInTheDocument();
    expect(screen.getByText("Love & Compassion")).toBeInTheDocument();
    expect(screen.getByText("12% of questions explored")).toBeInTheDocument();
    expect(screen.getByText(/Based on your 3 responses/)).toBeInTheDocument();
  });

  it("uses the singular for one response", () => {
    render(<StepResults quiz={quiz(1)} />);
    expect(screen.getByText(/Based on your 1 response,/)).toBeInTheDocument();
  });

  it("saves the roles and values summary, and Retake calls retake", async () => {
    const q = quiz();
    const user = userEvent.setup();
    render(<StepResults quiz={q} />);
    expect(recordFinish).toHaveBeenCalledWith({
      assessment: "dharma-finder",
      summary: "Roles: Creator / Builder, Leader / Organizer; Values: Love & Compassion",
      score: undefined,
    });
    await user.click(screen.getByRole("button", { name: /retake assessment/i }));
    expect(q.retake).toHaveBeenCalled();
  });

  it("links to the next experiences", () => {
    render(<StepResults quiz={quiz()} />);
    expect(screen.getByRole("link", { name: /find your therapy/i })).toHaveAttribute("href", "/find-your-therapy");
    expect(screen.getByRole("link", { name: /back to find my/i })).toHaveAttribute("href", "/find-your-me");
  });
});
