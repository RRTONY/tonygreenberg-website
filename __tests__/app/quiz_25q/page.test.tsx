import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quiz25QPage, { metadata } from "@/app/quiz_25q/page";
import { saveAssessmentResult } from "@/lib/assessments/result-log";

// The finish is logged to Supabase + /self-portrait; replaced so nothing is saved.
vi.mock("@/lib/assessments/result-log", () => ({ saveAssessmentResult: vi.fn() }));

const PROFILE_FOR = (score: number) =>
  score >= 95 ? "Peptide Savant" : score >= 75 ? "Informed Consumer" : score >= 50 ? "Developing Awareness" : score >= 25 ? "High-Risk Consumer" : "Danger Zone";

describe("/quiz_25q", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Peptide Consumer Literacy Quiz — 25 Questions");
    expect(metadata.description).toMatch(/Science Literacy, Red Flag Detection, Provider Evaluation/);
    expect(metadata.alternates?.canonical).toBe("/quiz_25q");
  });

  it("renders one H1, the five dimensions and the fair warning", () => {
    render(<Quiz25QPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How Well Do You ActuallyUnderstand Peptides?");
    for (const d of ["Science Literacy", "Red Flag Detection", "Provider Evaluation", "Regulatory Awareness", "Personal Risk Assessment"]) {
      expect(screen.getByText(d)).toBeInTheDocument();
    }
    expect(screen.getByText(/This quiz is designed to be difficult/)).toBeInTheDocument();
  });

  it("links to the methodology and BioChain", () => {
    render(<Quiz25QPage />);
    expect(screen.getByRole("link", { name: "View our methodology" })).toHaveAttribute("href", "/peptide-matrix");
    expect(screen.getByRole("link", { name: /BioChain Overview/ })).toHaveAttribute("href", "https://ramprate.com/biochain");
  });

  it("scores all 25 answers, gates the report on a real email and shows the matching profile", async () => {
    const user = userEvent.setup();
    render(<Quiz25QPage />);
    await user.click(screen.getByRole("button", { name: /Begin the Quiz/ }));

    let earned = 0;
    for (let i = 1; i <= 25; i++) {
      expect(screen.getByText(`QUESTION ${i} OF 25`)).toBeInTheDocument();
      const choices = screen.getAllByRole("button").filter((b) => /^[A-D]/.test(b.textContent ?? ""));
      await user.click(choices[i % choices.length]);
      const pts = screen.getByText(/^\+\d \/ 4 points/).textContent!;
      earned += Number(pts.match(/^\+(\d)/)![1]);
      for (const c of choices) expect(c).toBeDisabled();
      await user.click(screen.getByRole("button", { name: i < 25 ? /Next Question/ : /See My Results/ }));
    }

    const emailBox = screen.getByPlaceholderText("your@email.com");
    await user.type(emailBox, "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Get My Report" }));

    const score = Math.round((earned / 100) * 100);
    expect(await screen.findByText(`${score}%`)).toBeInTheDocument();
    expect(screen.getByText(PROFILE_FOR(score))).toBeInTheDocument();
    expect(saveAssessmentResult).toHaveBeenCalledWith("quiz_25q", { summary: PROFILE_FOR(score), score });
  });

  it("lets a reader skip the email and still see results, then retake from the start", async () => {
    const user = userEvent.setup();
    render(<Quiz25QPage />);
    await user.click(screen.getByRole("button", { name: /Begin the Quiz/ }));
    for (let i = 1; i <= 25; i++) {
      await user.click(screen.getAllByRole("button").filter((b) => /^A/.test(b.textContent ?? ""))[0]);
      await user.click(screen.getByRole("button", { name: i < 25 ? /Next Question/ : /See My Results/ }));
    }
    await user.click(screen.getByRole("button", { name: /Skip — show me my results without email/ }));
    expect(screen.getByText("Your Peptide Literacy Score")).toBeInTheDocument();
    expect(screen.getByText(/^RISK LEVEL:/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Retake/ }));
    expect(screen.getByRole("button", { name: /Begin the Quiz/ })).toBeInTheDocument();
  });
});
