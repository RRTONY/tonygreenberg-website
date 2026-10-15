import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

describe("error page", () => {
  it("shows one H1, a way home and the site index, and logs the error", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("boom");
    render(<ErrorPage error={err} retry={vi.fn()} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Something went wrong");
    expect(screen.getByRole("link", { name: /homepage/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /site index/i })).toHaveAttribute("href", "/the-index");
    expect(log).toHaveBeenCalledWith(err);
  });

  it("retries when 'Try again' is pressed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const retry = vi.fn();
    render(<ErrorPage error={new Error("x")} retry={retry} />);
    await userEvent.setup().click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("shows the log reference but never the real error message", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const err = Object.assign(new Error("secret database detail"), { digest: "abc123" });
    render(<ErrorPage error={err} retry={vi.fn()} />);
    expect(screen.getByText("Reference: abc123")).toBeInTheDocument();
    expect(screen.queryByText(/secret database detail/)).not.toBeInTheDocument();
  });
});
