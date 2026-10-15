import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { recordFinish } from "@/lib/assessments/record-finish";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));

describe("AssessmentResultActions", () => {
  it("saves the finish with its summary and score and logs the slug in the results cookie", () => {
    render(<AssessmentResultActions resultSlug="find-your-coffee" resultSummary="Bright & Fruity" resultScore={7} />);
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "find-your-coffee", summary: "Bright & Fruity", score: 7 });
    const raw = decodeURIComponent(document.cookie.match(/tg_assessment_results=([^;]*)/)![1]);
    expect(JSON.parse(raw)).toEqual([expect.objectContaining({ slug: "find-your-coffee" })]);
  });

  it("does not save to the database when saveToDatabase is false, and saves nothing without a slug", () => {
    const { unmount } = render(<AssessmentResultActions resultSlug="soulscore" saveToDatabase={false} />);
    expect(recordFinish).not.toHaveBeenCalled();
    expect(document.cookie).toContain("tg_assessment_results");
    unmount();
    render(<AssessmentResultActions />);
    expect(recordFinish).not.toHaveBeenCalled();
  });

  it("Download PDF falls back to window.print without a target", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<AssessmentResultActions />);
    await user.click(screen.getByRole("button", { name: /download pdf/i }));
    expect(print).toHaveBeenCalled();
  });

  it("Download PDF writes the target's HTML into a new window", async () => {
    const write = vi.fn();
    const fakeWin = { document: { write, close: vi.fn() }, print: vi.fn() };
    vi.spyOn(window, "open").mockReturnValue(fakeWin as unknown as Window);
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <>
        <div ref={ref}>
          <h2>My Result</h2>
        </div>
        <AssessmentResultActions printTargetRef={ref} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: /download pdf/i }));
    expect(write.mock.calls[0][0]).toContain("<h2>My Result</h2>");
    expect(fakeWin.document.close).toHaveBeenCalled();
  });
});
