import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostPasswordGate } from "@/components/blog/post-password-gate";
import { unlockPost } from "@/app/blog/[slug]/unlock-action";

vi.mock("@/app/blog/[slug]/unlock-action", () => ({ unlockPost: vi.fn() }));
const unlock = vi.mocked(unlockPost);

describe("PostPasswordGate", () => {
  beforeEach(() => {
    unlock.mockResolvedValue({ error: false });
  });

  it("shows the lock screen with a required password field and a way back", () => {
    render(<PostPasswordGate slug="secret-essay" />);
    expect(screen.getByRole("heading", { level: 1, name: "This One's Behind a Door" })).toBeInTheDocument();
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("type", "password");
    expect(field).toBeRequired();
    expect(screen.getByRole("link", { name: /back to the blog/i })).toHaveAttribute("href", "/blog");
  });

  it("does not submit an empty password", async () => {
    const user = userEvent.setup();
    render(<PostPasswordGate slug="secret-essay" />);
    await user.click(screen.getByRole("button", { name: /unlock/i }));
    expect(unlock).not.toHaveBeenCalled();
  });

  it("sends the slug and password to the server check", async () => {
    const user = userEvent.setup();
    render(<PostPasswordGate slug="secret-essay" />);
    await user.type(screen.getByLabelText("Password"), "open sesame");
    await user.click(screen.getByRole("button", { name: /unlock/i }));
    await waitFor(() => expect(unlock).toHaveBeenCalledTimes(1));
    const [prev, form] = unlock.mock.calls[0];
    expect(prev).toEqual({ error: false });
    expect(form.get("slug")).toBe("secret-essay");
    expect(form.get("password")).toBe("open sesame");
  });

  it("shows a spinner while checking", async () => {
    let resolve!: (v: { error: boolean }) => void;
    unlock.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<PostPasswordGate slug="secret-essay" />);
    await user.type(screen.getByLabelText("Password"), "x");
    await user.click(screen.getByRole("button", { name: /unlock/i }));
    const button = screen.getByRole("button", { name: /unlock/i });
    await waitFor(() => expect(button).toBeDisabled());
    expect(button.querySelector(".animate-spin")).not.toBeNull();
    resolve({ error: false });
    await waitFor(() => expect(button).toBeEnabled());
  });

  it("flags a wrong password on the field", async () => {
    unlock.mockResolvedValue({ error: true });
    const user = userEvent.setup();
    render(<PostPasswordGate slug="secret-essay" />);
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /unlock/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That's not it. Try again.");
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAttribute("aria-describedby", "post-password-error");
  });
});
