import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { EngageAudit } from "@/components/marketing/engage-audit";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const sentence = "We built and launched a pilot in 2025 with a $200,000 budget and a team of six people measuring outcomes every month.";
const STRONG = Array.from({ length: 5 }, () => sentence).join(" "); // 100+ words, specifics, action, 5 sentences
const MEDIUM = "We have a plan with a 12 month timeline for the region. It will help people there soon enough i think so."; // ~10 points
const WEAK = "Not sure yet.";

async function start(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Name/), "Jane Doe");
  await user.type(screen.getByLabelText(/Email/), "jane@example.com");
  await user.click(screen.getByRole("button", { name: /Begin the Audit/ }));
}

// Pastes rather than types each answer (long text, same result).
async function answerAll(user: ReturnType<typeof userEvent.setup>, text: string) {
  for (let i = 0; i < 5; i++) {
    fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
    if (i < 4) await user.click(screen.getByRole("button", { name: /Next/ }));
  }
  await user.click(screen.getByRole("button", { name: "Submit Audit" }));
}

describe("EngageAudit", () => {
  it("requires name and a valid email before the audit starts", async () => {
    const user = userEvent.setup();
    render(<EngageAudit />);
    expect(screen.getByRole("heading", { name: "The Engagement Audit" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Begin the Audit/ }));
    expect(toast.error).toHaveBeenCalledWith("Name and email are required.");
    await user.type(screen.getByLabelText(/Name/), "Jane");
    await user.type(screen.getByLabelText(/Email/), "not-an-email");
    await user.click(screen.getByRole("button", { name: /Begin the Audit/ }));
    expect(toast.error).toHaveBeenCalledWith("Please enter a valid email address.");
    expect(screen.getByRole("button", { name: /Begin the Audit/ })).toBeInTheDocument();
    expect(screen.queryByText("01 — THE INITIATIVE")).not.toBeInTheDocument();
  });

  it("walks through five questions, blocks empty answers and goes back", async () => {
    const user = userEvent.setup();
    render(<EngageAudit />);
    await start(user);
    expect(screen.getByText("01 — THE INITIATIVE")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Previous/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Next/ }));
    expect(toast.error).toHaveBeenCalledWith("Please answer this question before continuing.");
    await user.type(screen.getByRole("textbox"), "Three words here");
    expect(screen.getByText("3 words")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next/ }));
    expect(screen.getByText("02 — THE OUTCOMES")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Previous/ }));
    expect(screen.getByRole("textbox")).toHaveValue("Three words here");
  });

  it("specific, evidenced answers pass the gate and unlock booking", async () => {
    const user = userEvent.setup();
    render(<EngageAudit />);
    await start(user);
    await answerAll(user, STRONG);
    expect(screen.getByRole("heading", { name: "You've passed The Gate." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book Your Session/ })).toHaveAttribute("href", "https://calendly.com/tonyg/10-minute-1-1");
    expect(screen.queryByText(/Think we got it wrong/)).not.toBeInTheDocument();
  });

  it("middling answers get Not yet, and vague ones get the wrong-door result", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<EngageAudit />);
    await start(user);
    await answerAll(user, MEDIUM);
    expect(screen.getByRole("heading", { name: "Not yet. But close." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entice Me/ }).getAttribute("href")).toMatch(/^mailto:tony@impactsoul\.is/);
    unmount();
    render(<EngageAudit />);
    await start(user);
    await answerAll(user, WEAK);
    expect(screen.getByRole("heading", { name: "This isn't the right door." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find Your Fit" })).toHaveAttribute("href", "/assessments");
  });
});
