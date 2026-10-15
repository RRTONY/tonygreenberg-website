import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigation } from "../../helpers/next";
import { FriendGate } from "@/components/friend-gate/friend-gate";
import { startGate } from "@/app/friend-gate/actions";

vi.mock("@/app/friend-gate/actions", () => ({ startGate: vi.fn() }));

describe("FriendGate (whole flow)", () => {
  beforeEach(() => {
    vi.mocked(startGate).mockResolvedValue({ token: "abc" });
  });

  it("goes intro -> nominate -> back -> nominate -> sends and opens the waiting page", async () => {
    const user = userEvent.setup();
    render(<FriendGate />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Before you see your results.");

    await user.click(screen.getByRole("button", { name: /nominate my three friends/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Who are your three?");

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Before you see your results.");

    await user.click(screen.getByRole("button", { name: /nominate my three friends/i }));
    await user.type(screen.getByLabelText("Your first name"), "Sam");
    const names = screen.getAllByLabelText("Name");
    const mails = screen.getAllByLabelText("Email address");
    for (let i = 0; i < 3; i++) {
      await user.type(names[i], `F${i}`);
      await user.type(mails[i], `f${i}@x.com`);
    }
    await user.click(screen.getByRole("button", { name: /send invitations/i }));
    await vi.waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith("/friend-gate/abc"));
  });

  it("is wrapped in the gate frame", () => {
    render(<FriendGate />);
    expect(screen.getByText(/© 2026 Tony Greenberg/)).toBeInTheDocument();
  });
});
