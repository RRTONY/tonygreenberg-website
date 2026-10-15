import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepGate } from "@/components/assessments/the-mirror-quiz/components/step-gate";
import type { StepProps } from "@/components/assessments/the-mirror-quiz/the-mirror-quiz";

describe("mirror StepGate", () => {
  it("subscribes with the mirror source and unlocks", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const quiz = { unlock: vi.fn() } as unknown as StepProps["quiz"];
    const user = userEvent.setup();
    render(<StepGate quiz={quiz} articleTitles={{}} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "a@b.co");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    await waitFor(() => expect(quiz.unlock).toHaveBeenCalled());
    expect(JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string).source).toBe("find-your-mirror");
  });
});
