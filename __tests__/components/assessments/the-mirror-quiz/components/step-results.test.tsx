import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepResults } from "@/components/assessments/the-mirror-quiz/components/step-results";
import { MIRROR_ARTICLES, MIRROR_DIMENSIONS, type MirrorDimensionId } from "@/lib/content/mirror-data";
import type { StepProps } from "@/components/assessments/the-mirror-quiz/the-mirror-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";
import { theMirrorData } from "@/components/assessments/the-mirror-quiz/data/the-mirror.data";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const SCORES: Record<MirrorDimensionId, number> = { relationships: 2, purpose: 3, body: 4, truth: 7, tribe: 8, consciousness: 9 };

function quiz() {
  const sortedDims = [...MIRROR_DIMENSIONS].sort((a, b) => SCORES[a.id] - SCORES[b.id]);
  return { dimensionScores: SCORES, overallScore: 6, sortedDims, reset: vi.fn() } as unknown as StepProps["quiz"];
}

describe("mirror StepResults", () => {
  it("shows the overall score and label and each dimension's flow or friction line", () => {
    render(<StepResults quiz={quiz()} articleTitles={{}} />);
    expect(screen.getByText("/ 9").previousElementSibling).toHaveTextContent("6");
    expect(screen.getAllByText("Approaching Flow").length).toBeGreaterThan(0);
    const rel = MIRROR_DIMENSIONS.find((d) => d.id === "relationships")!;
    const con = MIRROR_DIMENSIONS.find((d) => d.id === "consciousness")!;
    expect(screen.getByText(rel.frictionState)).toBeInTheDocument();
    expect(screen.getByText(con.flowState)).toBeInTheDocument();
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "the-mirror", summary: "Approaching Flow", score: 6 });
  });

  it("recommends only articles that have a real title and belong to the 3 weakest dimensions", () => {
    const entries = Object.entries(MIRROR_ARTICLES);
    const weak = entries.find(([, a]) => a.dimension === "relationships")![0];
    const strong = entries.find(([, a]) => a.dimension === "consciousness")![0];
    const untitled = entries.filter(([, a]) => a.dimension === "purpose")[0][0];
    render(<StepResults quiz={quiz()} articleTitles={{ [weak]: "Weak Essay", [strong]: "Strong Essay" }} />);
    expect(screen.getByRole("link", { name: /Weak Essay/ })).toHaveAttribute("href", expect.stringContaining(weak));
    expect(screen.queryByText("Strong Essay")).not.toBeInTheDocument();
    expect(document.querySelector(`a[href$="${untitled}"]`)).toBeNull();
  });

  it("hides the reading list when no titles resolve and shows matching satellite sites", () => {
    render(<StepResults quiz={quiz()} articleTitles={{}} />);
    expect(screen.queryByText("Articles That Mirror Your Growth Edge")).not.toBeInTheDocument();
    // Human OS is the "purpose" satellite; purpose is one of the 3 weakest.
    expect(screen.getAllByRole("link", { name: /Human OS/ })[0]).toHaveAttribute("href", "/humanos");
  });

  it("opens the share panel, copies the link, and Retake calls reset", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const q = quiz();
    const user = userEvent.setup();
    render(<StepResults quiz={q} articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /share with your people/i }));
    expect(screen.getByLabelText("Share this link:")).toHaveValue("https://tonygreenberg.com/the-mirror");
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("https://tonygreenberg.com/the-mirror");
    await user.click(screen.getByRole("button", { name: /twitter/i }));
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent("My score: 6/9"));
    await user.click(screen.getByRole("button", { name: /retake the mirror/i }));
    expect(q.reset).toHaveBeenCalled();
  });

  it("caps the reading list at 9 essays even when more weak-dimension essays have titles", () => {
    const titles = Object.fromEntries(Object.keys(MIRROR_ARTICLES).map((slug, i) => [slug, `Essay Number ${i}`]));
    const weakIds = ["relationships", "purpose", "body"];
    const eligible = Object.values(MIRROR_ARTICLES).filter((a) => weakIds.includes(a.dimension)).length;
    expect(eligible).toBeGreaterThan(9);
    render(<StepResults quiz={quiz()} articleTitles={titles} />);
    expect(screen.getAllByRole("link", { name: /Essay Number \d+/ })).toHaveLength(9);
  });

  it("LinkedIn and Email share the page link and the score text", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const user = userEvent.setup();
    render(<StepResults quiz={quiz()} articleTitles={{}} />);
    await user.click(screen.getByRole("button", { name: /share with your people/i }));
    const url = "https://tonygreenberg.com/the-mirror";
    await user.click(screen.getByRole("button", { name: "LinkedIn" }));
    expect(open).toHaveBeenLastCalledWith(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    await user.click(screen.getByRole("button", { name: "Email" }));
    const text = theMirrorData.results.shareText(6);
    expect(open).toHaveBeenLastCalledWith(
      `mailto:?subject=${encodeURIComponent(theMirrorData.results.shareEmailSubject)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
      "_blank",
    );
  });
});
