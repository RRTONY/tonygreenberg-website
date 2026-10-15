import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourCoffeeQuiz } from "@/components/assessments/find-your-coffee-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

type User = ReturnType<typeof userEvent.setup>;

async function walk(user: User, index: number) {
  await user.click(screen.getByRole("button", { name: /begin the ritual/i }));
  for (let i = 0; i < 15; i++) {
    expect(screen.getByText(`${i + 1} / 15`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button")[index]);
    await act(async () => vi.advanceTimersByTime(300));
  }
  await user.type(screen.getByPlaceholderText("Your email address"), "me@example.com");
  await user.click(screen.getByRole("button", { name: /get my results/i }));
}
const dim = (name: string) => screen.getByText(name, { selector: "span" }).nextElementSibling?.textContent;

describe("FindYourCoffeeQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}")));
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("opens on its own landing with the question and dimension counts", () => {
    render(<FindYourCoffeeQuiz />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find YourCoffee");
    expect(screen.getByText("15").nextElementSibling).toHaveTextContent("Questions");
    expect(screen.getByText("6").nextElementSibling).toHaveTextContent("Dimensions");
  });

  it("highlights the chosen option and only moves on after 300ms", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourCoffeeQuiz />);
    await user.click(screen.getByRole("button", { name: /begin the ritual/i }));
    const first = screen.getAllByRole("button")[1];
    await user.click(first);
    expect(first.className).toContain("bg-brand-gold-light/20");
    expect(screen.getByText("1 / 15")).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(300));
    expect(screen.getByText("2 / 15")).toBeInTheDocument();
  });

  // Archetype = the pair of dimensions with the highest sum. From the data:
  // A answers: Origin 7 + Flavor 2 = 9 (Single Origin Purist)
  // B answers: Brewing 5 + Origin 8 = 13 (Pour-Over Monk)
  // C answers: Social 1 + Brewing 2 = 3 (Turkish Traditionalist)
  it.each([
    [0, "The Single Origin Purist", "Origin Curiosity", "+7"],
    [1, "The Pour-Over Monk", "Brewing Ritual", "+5"],
    [2, "The Turkish Traditionalist", "Flavor Complexity", "-4"],
  ])("always option %i gives %s", async (index, name, dimension, value) => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourCoffeeQuiz />);
    await walk(user, index);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
    expect(dim(dimension)).toBe(value);
    expect(screen.getAllByText(/Roast$/).length).toBe(5);
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-coffee", summary: name }));
  });

  it("Retake goes back to the landing with fresh scores", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FindYourCoffeeQuiz />);
    await walk(user, 1);
    await user.click(await screen.findByRole("button", { name: /retake the assessment/i }));
    expect(screen.getByRole("button", { name: /begin the ritual/i })).toBeInTheDocument();
    await walk(user, 0);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Single Origin Purist");
    expect(dim("Origin Curiosity")).toBe("+7");
  });
});
