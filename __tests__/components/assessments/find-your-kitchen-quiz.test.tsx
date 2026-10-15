import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourKitchenQuiz } from "@/components/assessments/find-your-kitchen-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

type User = ReturnType<typeof userEvent.setup>;
// The kitchen quiz shows all 15 questions on one page.
const questionBlocks = () => screen.getAllByRole("heading", { level: 2 }).map((h) => h.parentElement as HTMLElement);

async function answerAll(user: User, index: number) {
  for (const block of questionBlocks()) await user.click(within(block).getAllByRole("button")[index]);
}
async function unlock(user: User) {
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const dim = (name: string) => screen.getByText(`${name}:`).nextElementSibling?.textContent;

describe("FindYourKitchenQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  it("shows all 15 numbered questions with 4 options each after Begin", async () => {
    const user = userEvent.setup();
    render(<FindYourKitchenQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    const blocks = questionBlocks();
    expect(blocks).toHaveLength(15);
    expect(blocks[0]).toHaveTextContent("1. When sourcing ingredients, you prioritize:");
    for (const b of blocks) expect(within(b).getAllByRole("button")).toHaveLength(4);
  });

  it("changing an answer doesn't count twice: results only open once every question is answered", async () => {
    const user = userEvent.setup();
    render(<FindYourKitchenQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    const blocks = questionBlocks();
    for (let i = 0; i < 14; i++) {
      await user.click(within(blocks[i]).getAllByRole("button")[0]);
      await user.click(within(blocks[i]).getAllByRole("button")[1]);
    }
    expect(screen.queryByPlaceholderText("Your email address")).not.toBeInTheDocument();
    await user.click(within(blocks[14]).getAllByRole("button")[0]);
    expect(screen.getByPlaceholderText("Your email address")).toBeInTheDocument();
  });

  it("all first answers: The Fusion Explorer has the most archetype points", async () => {
    // From the data: dimension totals Technique 8, Improvisation 7, Sourcing 6, Hospitality 6,
    // Presentation 5, Cultural 3.
    const user = userEvent.setup();
    render(<FindYourKitchenQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    await answerAll(user, 0);
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Your Archetype: The Fusion Explorer");
    expect(dim("Technique Mastery")).toBe("8");
    expect(dim("Cultural Curiosity")).toBe("3");
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-kitchen", summary: "The Fusion Explorer" }));
  });

  it("all second answers: The Communal Cook, with Technique Mastery 18", async () => {
    const user = userEvent.setup();
    render(<FindYourKitchenQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    await answerAll(user, 1);
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Communal Cook");
    expect(dim("Technique Mastery")).toBe("18");
    expect(dim("Improvisation")).toBe("0");
  });

  it("all last answers: The Fire Master", async () => {
    const user = userEvent.setup();
    render(<FindYourKitchenQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    await answerAll(user, 3);
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Fire Master");
    expect(dim("Presentation")).toBe("8");
  });
});
