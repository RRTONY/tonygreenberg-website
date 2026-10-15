import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideQuiz } from "@/components/marketing/peptide-quiz";
import { saveAssessmentResult } from "@/lib/assessments/result-log";

vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

const TOTAL = 25;
const options = () => screen.getAllByRole("button").filter((b) => b.className.includes("border-2"));

async function answerAll(user: ReturnType<typeof userEvent.setup>, pick: (q: number) => number) {
  await user.click(screen.getByRole("button", { name: /Begin the Quiz/ }));
  for (let i = 0; i < TOTAL; i++) {
    await user.click(options()[pick(i)]);
    await user.click(screen.getByRole("button", { name: i < TOTAL - 1 ? "Next Question" : "See My Results" }));
  }
}

describe("PeptideQuiz", () => {
  it("starts on the intro with one H1 and a hero image", () => {
    render(<PeptideQuiz />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("img", { name: /glowing brain/ }).getAttribute("src")).toMatch(/^https:\/\/cdn\.sanity\.io\//);
  });

  it("picking an answer locks the question and shows the feedback and points", async () => {
    const user = userEvent.setup();
    render(<PeptideQuiz />);
    await user.click(screen.getByRole("button", { name: /Begin the Quiz/ }));
    expect(screen.getByText(`QUESTION 1 OF ${TOTAL}`)).toBeInTheDocument();
    await user.click(options()[1]);
    for (const o of options()) expect(o).toBeDisabled();
    expect(screen.getByText(/Partially correct. Sample size matters/)).toBeInTheDocument();
    expect(screen.getByText(/\+2 \/ 4 points \(Science Literacy\)/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next Question" }));
    expect(screen.getByText(`QUESTION 2 OF ${TOTAL}`)).toBeInTheDocument();
  });

  it("all best answers score 100% Peptide Savant and save the result", async () => {
    const user = userEvent.setup();
    render(<PeptideQuiz />);
    await answerAll(user, () => 0);
    expect(screen.getByRole("heading", { name: "Your Results Are Ready" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Skip/ }));
    expect(screen.getByText("Your Peptide Literacy Score").nextElementSibling).toHaveTextContent("100%");
    expect(screen.getByRole("link", { name: /Evidence Matrix/ })).toHaveAttribute("href", "/peptide-matrix");
    expect(screen.getByText("Peptide Savant")).toBeInTheDocument();
    expect(screen.getByText("RISK LEVEL: MINIMAL")).toBeInTheDocument();
    expect(saveAssessmentResult).toHaveBeenCalledWith("quiz_25q", { summary: "Peptide Savant", score: 100 });
  });

  it("weak answers land in a high-risk profile; the email step needs a real address", async () => {
    const user = userEvent.setup();
    render(<PeptideQuiz />);
    await answerAll(user, () => 2);
    const box = screen.getByPlaceholderText("your@email.com");
    await user.type(box, "nope");
    await user.click(screen.getByRole("button", { name: "Get My Report" }));
    expect(screen.getByRole("heading", { name: "Your Results Are Ready" })).toBeInTheDocument();
    await user.clear(box);
    await user.type(box, "me@example.com");
    await user.click(screen.getByRole("button", { name: "Get My Report" }));
    expect(screen.getByText(/RISK LEVEL: (HIGH|CRITICAL)/)).toBeInTheDocument();
  });

  it("Retake goes back to the intro", async () => {
    const user = userEvent.setup();
    render(<PeptideQuiz />);
    await answerAll(user, () => 0);
    await user.click(screen.getByRole("button", { name: /Skip/ }));
    await user.click(screen.getByRole("button", { name: "Retake the Quiz" }));
    expect(screen.getByRole("button", { name: /Begin the Quiz/ })).toBeInTheDocument();
  });
});
