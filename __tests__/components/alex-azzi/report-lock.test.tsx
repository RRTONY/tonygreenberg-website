import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportLock } from "@/components/alex-azzi/report-lock";
import { unlockReport } from "@/app/alex-azzi/unlock-action";

vi.mock("@/app/alex-azzi/unlock-action", () => ({ unlockReport: vi.fn() }));
const unlock = vi.mocked(unlockReport);

describe("ReportLock (locked /alex-azzi)", () => {
  beforeEach(() => {
    unlock.mockResolvedValue({ error: true });
  });

  it("shows only the lock screen: one H1, the notice and a password field", () => {
    render(<ReportLock gateKey="alex-azzi" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Restricted Access");
    expect(screen.getByText("This report is password-protected.")).toBeInTheDocument();
    const pw = screen.getByLabelText("Password");
    expect(pw).toHaveAttribute("type", "password");
    expect(pw).toBeRequired();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("sends the page key and the typed password to the server check", async () => {
    render(<ReportLock gateKey="alex-azzi" />);
    await userEvent.type(screen.getByLabelText("Password"), "letmein");
    await userEvent.click(screen.getByRole("button", { name: /Unlock Report/ }));
    await vi.waitFor(() => expect(unlock).toHaveBeenCalled());
    const [prev, data] = unlock.mock.calls[0];
    expect(prev).toEqual({ error: false });
    expect((data as FormData).get("key")).toBe("alex-azzi");
    expect((data as FormData).get("password")).toBe("letmein");
  });

  it("a wrong password shows the error and marks the field invalid", async () => {
    render(<ReportLock gateKey="alex-azzi" />);
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /Unlock Report/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That's not it. Try again.");
    const pw = screen.getByLabelText("Password");
    expect(pw).toHaveAttribute("aria-invalid", "true");
    expect(pw).toHaveAttribute("aria-describedby", "report-password-error");
  });

  it("shows a spinner and disables Unlock while checking", async () => {
    let finish: (v: { error: boolean }) => void = () => {};
    unlock.mockImplementation(() => new Promise((r) => (finish = r)));
    render(<ReportLock gateKey="alex-azzi" />);
    await userEvent.type(screen.getByLabelText("Password"), "x");
    await userEvent.click(screen.getByRole("button", { name: /Unlock Report/ }));
    const btn = screen.getByRole("button", { name: /Unlock Report/ });
    await vi.waitFor(() => expect(btn).toBeDisabled());
    expect(btn.querySelector(".animate-spin")).not.toBeNull();
    finish({ error: true });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
