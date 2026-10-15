import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigation } from "../../../helpers/next";
import { StepNominate } from "@/components/friend-gate/components/step-nominate";
import { startGate } from "@/app/friend-gate/actions";

vi.mock("@/app/friend-gate/actions", () => ({ startGate: vi.fn() }));
const start = vi.mocked(startGate);

function setup() {
  const gate = { step: 2, onNext: vi.fn() };
  render(<StepNominate gate={gate} />);
  return { gate, user: userEvent.setup() };
}

async function fill(user: ReturnType<typeof userEvent.setup>, emails = ["a@x.com", "b@x.com", "c@x.com"]) {
  await user.type(screen.getByLabelText("Your first name"), "Tony");
  const names = screen.getAllByLabelText("Name");
  const mails = screen.getAllByLabelText("Email address");
  for (let i = 0; i < 3; i++) {
    await user.type(names[i], `Friend ${i + 1}`);
    await user.type(mails[i], emails[i]);
  }
}

const submitButton = () => screen.getByRole("button", { name: /send invitations/i });

describe("StepNominate", () => {
  beforeEach(() => {
    start.mockResolvedValue({ token: "tok123" });
  });

  it("shows every required-field message and sends nothing when empty", async () => {
    const { user } = setup();
    await user.click(submitButton());
    expect(await screen.findByText("Please enter your first name.")).toBeInTheDocument();
    expect(screen.getAllByText("Add a name.")).toHaveLength(3);
    expect(screen.getAllByText("Add an email address.")).toHaveLength(3);
    expect(start).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const { user } = setup();
    await fill(user, ["a@x.com", "nope", "c@x.com"]);
    await user.click(submitButton());
    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(start).not.toHaveBeenCalled();
  });

  it("asks for three different emails", async () => {
    const { user } = setup();
    await fill(user, ["a@x.com", "A@x.com", "c@x.com"]);
    await user.click(submitButton());
    expect(await screen.findByText("Use three different email addresses.")).toBeInTheDocument();
    expect(start).not.toHaveBeenCalled();
  });

  it("sends the seeker and three friends, then opens the waiting page", async () => {
    const { user } = setup();
    await fill(user);
    await user.click(submitButton());
    await vi.waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith("/friend-gate/tok123"));
    expect(start).toHaveBeenCalledWith({
      seekerName: "Tony",
      friends: [
        { name: "Friend 1", email: "a@x.com" },
        { name: "Friend 2", email: "b@x.com" },
        { name: "Friend 3", email: "c@x.com" },
      ],
    });
  });

  it("shows a spinner and disables the button while sending", async () => {
    let finish: (v: { token?: string; error?: string }) => void = () => {};
    start.mockImplementation(() => new Promise((r) => (finish = r)));
    const { user } = setup();
    await fill(user);
    await user.click(submitButton());
    await vi.waitFor(() => expect(submitButton()).toBeDisabled());
    expect(submitButton().querySelector(".animate-spin")).not.toBeNull();
    finish({ token: "t" });
    await vi.waitFor(() => expect(submitButton()).not.toBeDisabled());
  });

  it("shows the server's error instead of moving on", async () => {
    start.mockResolvedValue({ error: "Friend 1: that email bounced." });
    const { user } = setup();
    await fill(user);
    await user.click(submitButton());
    expect(await screen.findByRole("alert")).toHaveTextContent("Friend 1: that email bounced.");
    expect(navigation.router.push).not.toHaveBeenCalled();
  });

  it("Back returns to the intro step", async () => {
    const { gate, user } = setup();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(gate.onNext).toHaveBeenCalledWith(1);
  });
});
