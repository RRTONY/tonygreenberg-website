import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { NotFoundRedirect } from "@/components/not-found-redirect";
import { navigation } from "@tests/helpers/next";

describe("NotFoundRedirect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the 404 heading and a link home", () => {
    render(<NotFoundRedirect />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("link", { name: /go to tonygreenberg.com now/i })).toHaveAttribute("href", "/");
  });

  it("counts down and sends the visitor home after 3 seconds", () => {
    render(<NotFoundRedirect />);
    expect(screen.getByText("Redirecting in 3s")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("Redirecting in 2s")).toBeInTheDocument();
    expect(navigation.router.push).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    expect(navigation.router.push).toHaveBeenCalledWith("/");
  });
});
