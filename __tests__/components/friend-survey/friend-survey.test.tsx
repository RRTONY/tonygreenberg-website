import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FriendSurvey } from "@/components/friend-survey/friend-survey";
import { checkCode, sendCode, submitFriendSurvey } from "@/app/friend-survey/[token]/actions";

vi.mock("@/app/friend-survey/[token]/actions", () => ({ sendCode: vi.fn(), checkCode: vi.fn(), submitFriendSurvey: vi.fn() }));

describe("FriendSurvey (whole flow)", () => {
  beforeEach(() => {
    vi.mocked(sendCode).mockResolvedValue({});
    vi.mocked(checkCode).mockResolvedValue({});
    vi.mocked(submitFriendSurvey).mockResolvedValue({});
  });

  it("walks identity -> code -> questions -> thank you", async () => {
    const user = userEvent.setup();
    render(<FriendSurvey token="tk" seekerName="Sam" friendName="Alex" verified={false} />);
    await user.type(screen.getByLabelText("Your email address"), "alex@x.com");
    await user.click(screen.getByRole("button", { name: /send verification code/i }));

    expect(await screen.findByRole("heading", { name: "Check your inbox." })).toBeInTheDocument();
    expect(screen.getByText("alex@x.com")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Verification code"), "111222");
    await user.click(screen.getByRole("button", { name: /verify & open survey/i }));

    expect(await screen.findByRole("heading", { name: "A few honest questions." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Yes — I support them/ }));
    await user.click(screen.getByRole("button", { name: /submit my response/i }));

    expect(await screen.findByRole("heading", { name: "Thank you, Alex." })).toBeInTheDocument();
    expect(sendCode).toHaveBeenCalledWith("tk", "alex@x.com");
    expect(checkCode).toHaveBeenCalledWith("tk", "111222");
    expect(submitFriendSurvey).toHaveBeenCalledWith("tk", { q5: "support" });
  });

  it("skips straight to the questions for a friend who already verified", () => {
    render(<FriendSurvey token="tk" seekerName="Sam" friendName="Alex" verified />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A few honest questions.");
  });
});
