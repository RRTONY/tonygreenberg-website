import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClockKeeperForm } from "@/components/clock-keeper/clock-keeper-form";
import { submitClockKeeper } from "@/app/clock-keeper-part-2/actions";
import { CLOCK_KEEPER_QUESTIONS } from "@/lib/content/clock-keeper";

vi.mock("@/app/clock-keeper-part-2/actions", () => ({ submitClockKeeper: vi.fn() }));
const submit = vi.mocked(submitClockKeeper);
const traceButton = () => screen.getByRole("button", { name: /Leave Your Trace/ });
const ANSWER = "The model is a long patient loop.";

describe("ClockKeeperForm", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("shows the five questions by default, and none is the reframe box", () => {
    render(<ClockKeeperForm />);
    CLOCK_KEEPER_QUESTIONS.forEach((q) => expect(screen.getByRole("heading", { name: q.title })).toBeInTheDocument());
    expect(screen.queryByLabelText(/Reframe/)).not.toBeInTheDocument();
  });

  it("'The Pattern Itself' swaps the questions for one free-text box; 'Reframe' keeps both", async () => {
    render(<ClockKeeperForm />);
    await userEvent.click(screen.getByRole("button", { name: /The Pattern Itself/ }));
    expect(screen.getByRole("button", { name: /The Pattern Itself/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText(/The pattern itself — describe the model directly/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: CLOCK_KEEPER_QUESTIONS[0].title })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Reframe Entirely/ }));
    expect(screen.getByLabelText(/Reframe — provide the right questions/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: CLOCK_KEEPER_QUESTIONS[0].title })).toBeInTheDocument();
  });

  it("counts answers longer than 10 characters", async () => {
    render(<ClockKeeperForm />);
    await userEvent.type(screen.getByLabelText(CLOCK_KEEPER_QUESTIONS[0].prompt), "short");
    expect(screen.queryByText(/questions answered/)).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(CLOCK_KEEPER_QUESTIONS[1].prompt), ANSWER);
    expect(screen.getByText("1 of 5 questions answered")).toBeInTheDocument();
  });

  it("asks for a little more when nothing substantial is written", async () => {
    render(<ClockKeeperForm />);
    await userEvent.click(traceButton());
    expect(await screen.findByRole("alert")).toHaveTextContent("Write a little more in at least one answer before leaving your trace.");
    expect(submit).not.toHaveBeenCalled();
  });

  it("rejects a malformed optional email but sends with it empty", async () => {
    render(<ClockKeeperForm />);
    await userEvent.type(screen.getByLabelText(CLOCK_KEEPER_QUESTIONS[0].prompt), ANSWER);
    await userEvent.type(screen.getByLabelText("Email (optional)"), "nope");
    await userEvent.click(traceButton());
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    await userEvent.clear(screen.getByLabelText("Email (optional)"));
    await userEvent.click(traceButton());
    await vi.waitFor(() => expect(submit).toHaveBeenCalledWith({ respondentName: "", respondentEmail: "", q1: ANSWER, q2: "", q3: "", q4: "", q5: "", reframe: "" }));
    expect(await screen.findByRole("status")).toHaveTextContent("The trace is recorded.");
  });

  it("shows a spinner while sending and the server's error after", async () => {
    let finish: (v: { ok: false; error: string }) => void = () => {};
    submit.mockImplementation(() => new Promise((r) => (finish = r)) as ReturnType<typeof submitClockKeeper>);
    render(<ClockKeeperForm />);
    await userEvent.type(screen.getByLabelText("Name (optional)"), "Ana");
    await userEvent.type(screen.getByLabelText(CLOCK_KEEPER_QUESTIONS[4].prompt), ANSWER);
    await userEvent.click(traceButton());
    await vi.waitFor(() => expect(traceButton()).toBeDisabled());
    expect(traceButton().querySelector(".animate-spin")).not.toBeNull();
    finish({ ok: false, error: "Couldn't save right now." });
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't save right now.");
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ respondentName: "Ana", q5: ANSWER }));
  });
});
