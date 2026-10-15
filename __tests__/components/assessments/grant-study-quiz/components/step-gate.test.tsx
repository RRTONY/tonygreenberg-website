import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepGate } from "@/components/assessments/grant-study-quiz/components/step-gate";
import type { StepProps } from "@/components/assessments/grant-study-quiz/grant-study-quiz";

describe("grant-study StepGate", () => {
  it("subscribes with the grant-study source and unlocks", async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const quiz = { unlock: vi.fn() } as unknown as StepProps["quiz"];
    const user = userEvent.setup();
    render(<StepGate quiz={quiz} />);
    await user.type(screen.getByPlaceholderText("Your email address"), "a@b.co");
    await user.click(screen.getByRole("button", { name: /get my results/i }));
    await waitFor(() => expect(quiz.unlock).toHaveBeenCalled());
    expect(JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string).source).toBe("find-your-grant-study");
  });
});
