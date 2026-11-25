import { afterEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeQuiz } from "@/components/sake/pages/sake-quiz/sake-quiz";
import { profileFor, SAKE_QUIZ_TOTAL, sakeQuizQuestions } from "@/components/sake/pages/sake-quiz/data/sake-quiz.data";
import { sakeProfiles } from "@/lib/content/sake/experience-data";
import { renderSake } from "../../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

afterEach(() => vi.useRealTimers());

/** Picks option `i` of the question on screen, then lets the 400ms pause run. */
async function pick(user: ReturnType<typeof userEvent.setup>, i: number) {
  const q = sakeQuizQuestions.find((qq) => screen.queryByRole("heading", { level: 2, name: qq.question }))!;
  const option = screen.getAllByRole("button").find((b) => b.textContent?.includes(q.options[i].text))!;
  await user.click(option);
  await act(async () => {
    vi.advanceTimersByTime(450);
  });
}

describe("SakeQuiz", () => {
  it("answers every question, goes back, shows a profile, and starts again", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderSake(<SakeQuiz />);
    expect(screen.getByText(`Question 1 of ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Previous question/ })).toBeNull();

    await pick(user, 0);
    expect(screen.getByText(`Question 2 of ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Previous question/ }));
    expect(screen.getByText(`Question 1 of ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();

    for (let i = 0; i < SAKE_QUIZ_TOTAL; i++) await pick(user, 0);
    const expected = profileFor(Array(SAKE_QUIZ_TOTAL).fill(0));
    expect(screen.getByRole("heading", { level: 1, name: expected.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore the Collection/ })).toHaveAttribute("href", "/sake/collection");
    expect(screen.getByRole("link", { name: /Build Your EXV/ })).toHaveAttribute("href", "/sake/exv-builder");

    await user.click(screen.getByRole("button", { name: /Take Again/ }));
    expect(screen.getByText(`Question 1 of ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();
  });

  it("Start Over resets mid-quiz, and Austere/Japanese apply", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderSake(<SakeQuiz />);
    await pick(user, 1);
    await user.click(screen.getByRole("button", { name: /Start Over/ }));
    expect(screen.getByText(`Question 1 of ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(document.querySelector(".bg-\\[\\#f5f0e8\\]")).not.toBeNull();
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText(`質問 1 / ${SAKE_QUIZ_TOTAL}`)).toBeInTheDocument();
  });

  it("scores answers into one of the four profiles", () => {
    expect(sakeProfiles.map((p) => p.key)).toContain(profileFor([0, 0, 0]).key);
    expect(profileFor([])).toBe(sakeProfiles[0]);
  });
});
