import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourTherapyQuiz } from "@/components/assessments/find-your-therapy-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 25;
type User = ReturnType<typeof userEvent.setup>;

async function walk(user: User, index: number | number[]) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`${i + 1} / ${TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[typeof index === "number" ? index : index[i]]);
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}

describe("FindYourTherapyQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });

  it("starts on the intro with the question count", async () => {
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    expect(screen.getByText(String(TOTAL)).nextElementSibling).toHaveTextContent("Questions");
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  // Raw totals per answer column: A cognitive 58, B somatic 56, C relational 53.
  it.each([
    [0, "The Architect"],
    [1, "The Embodied"],
    [2, "The Mirror Seeker"],
  ])("always option %i gives %s and saves it", async (index, name) => {
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    await walk(user, index);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-therapy", summary: name }));
  });

  it("share buttons open the share link and count shares", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    await walk(user, 0);
    await user.click(await screen.findByRole("button", { name: "Share on X" }));
    expect(open.mock.calls[0][0]).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?text=/);
    await user.click(screen.getByRole("button", { name: "Share by email" }));
    expect(open.mock.calls[1][0]).toMatch(/^mailto:\?subject=Find%20Your%20Therapy/);
    expect(screen.getByText("Shared 2 times")).toBeInTheDocument();
  });

  it("Retake goes back to the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    await walk(user, 1);
    await user.click(await screen.findByRole("button", { name: /retake assessment/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it("altered states 47 vs depth 33 shows The Boundary Crosser (fixed: no cap at 10 that tied them)", async () => {
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    await walk(user, 3);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Boundary Crosser");
  });

  // One answer set (choice index per question, 0-based) for every modality, found with a
  // random-answer search over the scoring, so none is unreachable again.
  it.each([
    ["The Architect", "2,0,0,0,2,0,3,0,1,3,1,0,0,0,0,0,1,1,0,0,3,3,0,0,0"],
    ["The Embodied", "1,0,2,1,1,1,3,1,1,0,1,1,1,0,1,1,1,1,1,1,1,3,1,2,1"],
    ["The Mirror Seeker", "2,2,1,2,3,2,2,2,3,2,2,2,2,0,1,2,2,3,0,2,2,2,2,2,2"],
    ["The Archaeologist", "3,3,3,2,1,3,3,2,1,2,3,1,3,3,3,2,3,3,0,3,0,3,0,3,1"],
    ["The Boundary Crosser", "3,0,3,3,3,3,3,0,2,3,3,3,1,3,3,3,3,3,1,1,3,0,3,2,1"],
    ["The Synthesizer", "2,2,1,3,2,0,0,0,2,3,3,3,1,3,0,3,2,0,2,1,2,1,2,3,0"],
  ])("%s is reachable", async (name, answers) => {
    const user = userEvent.setup();
    render(<FindYourTherapyQuiz />);
    await walk(user, answers.split(",").map(Number));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
  });
});
