import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssessmentQuiz } from "@/components/assessments/assessment-quiz";
import { ARCHETYPES, ASSESSMENT_QUESTIONS, type ArchetypeKey } from "@/lib/content/archetypes";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));

async function answerAll(user: ReturnType<typeof userEvent.setup>, picks: ArchetypeKey[]) {
  for (let i = 0; i < ASSESSMENT_QUESTIONS.length; i++) {
    expect(screen.getByText(`Question ${i + 1} of ${ASSESSMENT_QUESTIONS.length}`)).toBeInTheDocument();
    const opt = ASSESSMENT_QUESTIONS[i].options.find((o) => o.archetype === picks[i])!;
    await user.click(screen.getByRole("button", { name: opt.text }));
  }
}

describe("AssessmentQuiz", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ success: true })));
  });
  it("every question offers one option per archetype", () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      expect(q.options.map((o) => o.archetype).sort()).toEqual(["builder", "crusader", "investor"]);
    }
  });

  it("the archetype with the most answers wins and is saved", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await answerAll(user, ["crusader", "investor", "crusader", "builder", "crusader"]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(ARCHETYPES.crusader.name);
    expect(screen.getByText(ARCHETYPES.crusader.tagline)).toBeInTheDocument();
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "assessment", summary: ARCHETYPES.crusader.name, score: undefined });
  });

  it("a tie goes to the earlier archetype (builder before crusader before investor)", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await answerAll(user, ["investor", "investor", "builder", "builder", "crusader"]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(ARCHETYPES.builder.name);
  });

  it("subscribes with the archetype as the source and shows Subscribed", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await answerAll(user, ["investor", "investor", "investor", "investor", "investor"]);
    const button = screen.getByRole("button", { name: /subscribe/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByPlaceholderText("your@email.com"), "me@example.com");
    await user.click(button);
    expect(await screen.findByRole("button", { name: /subscribed/i })).toBeDisabled();
    const init = vi.mocked(fetch).mock.calls[0][1]!;
    expect(JSON.parse(init.body as string)).toEqual({ email: "me@example.com", source: "assessment-investor" });
  });

  it("shows the server's message when subscribing fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ success: false, message: "Bad email" })));
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await answerAll(user, ["builder", "builder", "builder", "builder", "builder"]);
    await user.type(screen.getByPlaceholderText("your@email.com"), "x@y.z");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(await screen.findByText("Bad email")).toBeInTheDocument();
  });

  it("links to where to start next", async () => {
    const user = userEvent.setup();
    render(<AssessmentQuiz />);
    await answerAll(user, ["builder", "builder", "builder", "builder", "builder"]);
    expect(screen.getByRole("link", { name: /go to my dashboard/i })).toHaveAttribute("href", "/impact-dashboard");
    expect(screen.getByRole("link", { name: /explore human os/i })).toHaveAttribute("href", "/humanos");
  });
});
