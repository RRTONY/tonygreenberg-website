import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FindYourPeptideQuiz } from "@/components/assessments/find-your-peptide-quiz";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(),
}));

const TOTAL = 10;
type User = ReturnType<typeof userEvent.setup>;
const choices = () => screen.getAllByRole("button").filter((b) => !/previous|journey|hide details/i.test(b.textContent ?? ""));

async function answer(user: User, picks: number[]) {
  await user.click(screen.getByRole("button", { name: /begin assessment/i }));
  for (let i = 0; i < TOTAL; i++) {
    expect(screen.getByText(`QUESTION ${i + 1} OF ${TOTAL}`)).toBeInTheDocument();
    expect(screen.getByText(`${i * 10}%`)).toBeInTheDocument();
    await user.click(choices()[picks[i]]);
  }
}
async function unlock(user: User) {
  await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
  await user.click(screen.getByRole("button", { name: "Unlock" }));
}

describe("FindYourPeptideQuiz", () => {
  it("Previous goes back and keeps the earlier choice highlighted", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await user.click(screen.getByRole("button", { name: /begin assessment/i }));
    expect(choices()).toHaveLength(5);
    await user.click(choices()[1]);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText(`QUESTION 1 OF ${TOTAL}`)).toBeInTheDocument();
    expect(choices()[1].className).toContain("bg-brand-gold-light/12");
  });

  it("all first answers: The Rebuilder, readiness 22 with no flags; the gate unlocks without any network call", async () => {
    // Axis scores (raw / 15, capped at 100): recovery 40, vitality 60, cognitive 20, immune 13, others 7.
    // Readiness = average 22, no contraindication flags.
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(0));
    expect(screen.getByText("22/100")).toBeInTheDocument();
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Rebuilder");
    expect(screen.getByText("60/100")).toBeInTheDocument();
    expect(screen.getByText("Low readiness — physician consultation strongly recommended before starting")).toBeInTheDocument();
    expect(screen.queryByText(/contraindication flag/)).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(recordFinish).toHaveBeenCalledWith(expect.objectContaining({ assessment: "find-your-peptide", summary: "The Rebuilder", score: 22 }));
  });

  it("all last answers: seven contraindication flags take 56 points off readiness (to 5) and show the warning", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(4));
    expect(screen.getByText("5/100")).toBeInTheDocument();
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Vanguard");
    expect(screen.getByText(/7 contraindication flags detected/)).toBeInTheDocument();
  });

  it("Retake starts over from the intro", async () => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(1));
    await unlock(user);
    await user.click(await screen.findByRole("button", { name: /retake assessment/i }));
    expect(screen.getByRole("button", { name: /begin assessment/i })).toBeInTheDocument();
  });

  it("the share buttons use tonygreenberg.com for the link and the profile's share text, and count shares", async () => {
    const open = vi.fn();
    vi.stubGlobal("open", open);
    const user = userEvent.setup();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<FindYourPeptideQuiz />);
    await answer(user, Array(TOTAL).fill(0));
    await unlock(user);
    await screen.findByRole("heading", { level: 1 });
    const url = window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com");
    expect(url.startsWith("https://tonygreenberg.com")).toBe(true);
    const text = "I'm The Rebuilder";
    await user.click(screen.getByRole("button", { name: "twitter" }));
    const tweet = String(open.mock.calls[0][0]);
    expect(tweet.startsWith("https://twitter.com/intent/tweet?text=")).toBe(true);
    expect(decodeURIComponent(tweet)).toContain(text);
    expect(tweet).toContain(`&url=${encodeURIComponent(url)}`);
    expect(screen.getByText("Shared 1x")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "linkedin" }));
    expect(open).toHaveBeenLastCalledWith(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    await user.click(screen.getByRole("button", { name: "email" }));
    const mail = String(open.mock.lastCall![0]);
    expect(mail).toContain(`mailto:?subject=${encodeURIComponent("My Peptide Clarity Index™ Results")}`);
    expect(decodeURIComponent(mail)).toContain(`\n\n${url}`);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(writeText).toHaveBeenCalledWith(url);
    expect(screen.getByText("Shared 4x")).toBeInTheDocument();
  });

  // The Catalyst (metabolic+cognitive), The Healer (recovery+immune) and The Sovereign
  // (vitality+longevity) use the same axis pair as an earlier profile in the other order. The lookup
  // used to ignore order, so they could never be shown; it is order-sensitive since 2026-10-16.
  it("metabolic-first, cognitive-second shows The Catalyst, not The Strategist (fixed: the axis pair match is order-sensitive)", async () => {
    // These answers give metabolic 87, cognitive 67, then vitality/immune 53.
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, [3, 2, 2, 0, 2, 3, 3, 3, 0, 1]);
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("The Catalyst");
  });

  // One answer set (choice index per question, 0-based) for every profile, checked against all
  // 9,765,625 possible answer sets, so none is unreachable again.
  it.each([
    ["The Rebuilder", "0,0,0,0,0,0,0,0,0,0"],
    ["The Metabolic Reset", "0,0,0,0,0,0,4,3,1,1"],
    ["The Optimizer", "0,0,0,0,0,0,0,0,0,2"],
    ["The Guardian", "0,0,0,0,0,0,4,2,2,0"],
    ["The Architect", "0,0,0,0,0,0,0,3,1,1"],
    ["The Sentinel", "0,0,0,0,0,3,4,0,1,3"],
    ["The Restorer", "0,0,0,3,3,2,3,3,4,0"],
    ["The Strategist", "0,0,0,0,1,0,0,4,1,1"],
    ["The Vanguard", "0,0,0,0,0,0,4,2,2,4"],
    ["The Renaissance", "0,0,0,0,0,1,0,0,0,2"],
    ["The Catalyst", "0,0,0,0,1,0,4,3,4,1"],
    ["The Centurion", "0,0,0,0,0,0,0,2,2,4"],
    ["The Healer", "0,0,0,0,0,0,4,3,1,0"],
    ["The Alchemist", "0,0,0,0,0,4,4,2,2,3"],
    ["The Phoenix", "0,0,0,0,0,1,4,4,4,0"],
    ["The Sovereign", "0,0,0,0,0,0,0,0,0,4"],
  ])("%s is reachable", async (name, picks) => {
    const user = userEvent.setup();
    render(<FindYourPeptideQuiz />);
    await answer(user, picks.split(",").map(Number));
    await unlock(user);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(name);
  });
});
