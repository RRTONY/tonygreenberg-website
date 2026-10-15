import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepCode } from "@/components/friend-survey/components/step-code";
import { useFriendSurvey } from "@/components/friend-survey/hook/use-friend-survey";
import { checkCode, sendCode } from "@/app/friend-survey/[token]/actions";

vi.mock("@/app/friend-survey/[token]/actions", () => ({ sendCode: vi.fn(), checkCode: vi.fn(), submitFriendSurvey: vi.fn() }));

let lastStep = 0;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (step: number) => {
  lastStep = step;
};
function Harness() {
  const survey = useFriendSurvey("tok", false);
  capture(survey.state.step);
  return <StepCode survey={{ ...survey, state: { ...survey.state, email: survey.state.email || "alex@x.com" } }} seekerName="Sam" friendName="Alex" />;
}

const verifyButton = () => screen.getByRole("button", { name: /verify & open survey/i });

describe("StepCode", () => {
  beforeEach(() => {
    vi.mocked(checkCode).mockResolvedValue({});
    vi.mocked(sendCode).mockResolvedValue({});
  });

  it("says where the code went", () => {
    render(<Harness />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Check your inbox.");
    expect(screen.getByText("alex@x.com")).toBeInTheDocument();
  });

  it("keeps only digits, at most six", async () => {
    render(<Harness />);
    const input = screen.getByLabelText("Verification code");
    await userEvent.type(input, "12ab34-5678");
    expect(input).toHaveValue("123456");
  });

  it("rejects a short code without calling the server", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Verification code"), "123");
    await userEvent.click(verifyButton());
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter the 6-digit code.");
    expect(checkCode).not.toHaveBeenCalled();
  });

  it("checks a full code and opens the survey", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Verification code"), "654321");
    await userEvent.click(verifyButton());
    expect(checkCode).toHaveBeenCalledWith("tok", "654321");
    await vi.waitFor(() => expect(lastStep).toBe(3));
  });

  it("shows the server's error for a wrong code", async () => {
    vi.mocked(checkCode).mockResolvedValue({ error: "That code is wrong or expired." });
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Verification code"), "000000");
    await userEvent.click(verifyButton());
    expect(await screen.findByRole("alert")).toHaveTextContent("That code is wrong or expired.");
  });

  it("Resend asks for a new code", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Resend" }));
    expect(sendCode).toHaveBeenCalledWith("tok", "");
  });
});
