import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyLink } from "@/app/my-impact/copy-link";

describe("CopyLink", () => {
  it("shows the link and copies it, then says Copied", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyLink url="https://tonygreenberg.com/signup?ref=abc" />);
    expect(screen.getByText("https://tonygreenberg.com/signup?ref=abc")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("https://tonygreenberg.com/signup?ref=abc");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("goes back to Copy after two seconds", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyLink url="u" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(await screen.findByRole("button", { name: "Copy" }, { timeout: 3000 })).toBeInTheDocument();
  });
});
