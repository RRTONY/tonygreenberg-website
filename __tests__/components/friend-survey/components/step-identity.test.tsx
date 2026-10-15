import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepIdentity } from "@/components/friend-survey/components/step-identity";
import { useFriendSurvey } from "@/components/friend-survey/hook/use-friend-survey";
import { sendCode } from "@/app/friend-survey/[token]/actions";

vi.mock("@/app/friend-survey/[token]/actions", () => ({ sendCode: vi.fn(), checkCode: vi.fn(), submitFriendSurvey: vi.fn() }));

let lastStep = 0;
// Called from render; keeps the assignment out of the component body (react-hooks/globals).
const capture = (step: number) => {
  lastStep = step;
};
function Harness() {
  const survey = useFriendSurvey("tok", false);
  capture(survey.state.step);
  return <StepIdentity survey={survey} seekerName="Sam" friendName="Alex" />;
}

const sendButton = () => screen.getByRole("button", { name: /send verification code/i });

describe("StepIdentity", () => {
  beforeEach(() => {
    vi.mocked(sendCode).mockResolvedValue({});
  });

  it("names the seeker and explains the survey", () => {
    render(<Harness />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your honest voice matters.");
    expect(screen.getByText("Sam")).toBeInTheDocument();
    expect(screen.getByText(/six questions, five minutes/)).toBeInTheDocument();
  });

  it("asks for an email when none is entered and sends nothing", async () => {
    render(<Harness />);
    await userEvent.click(sendButton());
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your email address.");
    expect(sendCode).not.toHaveBeenCalled();
  });

  it("sends the code to the typed email and moves to the code step", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Your email address"), "alex@x.com");
    await userEvent.click(sendButton());
    expect(sendCode).toHaveBeenCalledWith("tok", "alex@x.com");
    await vi.waitFor(() => expect(lastStep).toBe(2));
  });

  it("shows a spinner while sending and the server error after", async () => {
    let finish: (v: { error?: string }) => void = () => {};
    vi.mocked(sendCode).mockImplementation(() => new Promise((r) => (finish = r)));
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Your email address"), "alex@x.com");
    await userEvent.click(sendButton());
    expect(sendButton()).toBeDisabled();
    expect(sendButton().querySelector(".animate-spin")).not.toBeNull();
    finish({ error: "That email isn't on the invite." });
    expect(await screen.findByRole("alert")).toHaveTextContent("That email isn't on the invite.");
    expect(sendButton()).not.toBeDisabled();
    expect(lastStep).toBe(1);
  });
});
