import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuestions } from "@/components/friend-survey/components/step-questions";
import { useFriendSurvey } from "@/components/friend-survey/hook/use-friend-survey";
import { submitFriendSurvey } from "@/app/friend-survey/[token]/actions";
import { FRIEND_SURVEY_QUESTIONS } from "@/lib/content/friend-gate";

vi.mock("@/app/friend-survey/[token]/actions", () => ({ sendCode: vi.fn(), checkCode: vi.fn(), submitFriendSurvey: vi.fn() }));

let lastStep = 0;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (step: number) => {
  lastStep = step;
};
function Harness() {
  const survey = useFriendSurvey("tok", true);
  capture(survey.state.step);
  return <StepQuestions survey={survey} seekerName="Sam" friendName="Alex" />;
}
const submitButton = () => screen.getByRole("button", { name: /submit my response/i });

describe("StepQuestions", () => {
  beforeEach(() => {
    vi.mocked(submitFriendSurvey).mockResolvedValue({});
  });

  it("lists all six questions, numbered, about the seeker", () => {
    render(<Harness />);
    expect(screen.getByText("Sam")).toBeInTheDocument();
    FRIEND_SURVEY_QUESTIONS.forEach((q, i) => expect(screen.getByText(`${i + 1}. ${q.question}`)).toBeInTheDocument());
  });

  it("needs the verdict (question 5) before sending; the note is optional", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Absolutely" }));
    await userEvent.click(submitButton());
    expect(screen.getByRole("alert")).toHaveTextContent("Please answer question 5");
    expect(submitFriendSurvey).not.toHaveBeenCalled();
  });

  it("marks the picked option as pressed and sends scale numbers, the verdict and the note", async () => {
    render(<Harness />);
    await userEvent.click(screen.getAllByRole("button", { name: "Mostly yes" })[0]);
    expect(screen.getAllByRole("button", { name: "Mostly yes" })[0]).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Consistently" }));
    await userEvent.click(screen.getByRole("button", { name: /Not yet — I think they need more time/ }));
    await userEvent.type(screen.getByLabelText(FRIEND_SURVEY_QUESTIONS[5].question), "Take your time.");
    await userEvent.click(submitButton());
    expect(submitFriendSurvey).toHaveBeenCalledWith("tok", { q1: 3, q2: 5, q5: "wait", q6: "Take your time." });
    await vi.waitFor(() => expect(lastStep).toBe(4));
  });

  it("shows the server error if saving fails", async () => {
    vi.mocked(submitFriendSurvey).mockResolvedValue({ error: "Already answered." });
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: /I'm genuinely unsure/ }));
    await userEvent.click(submitButton());
    expect(await screen.findByRole("alert")).toHaveTextContent("Already answered.");
    expect(lastStep).toBe(3);
  });
});
