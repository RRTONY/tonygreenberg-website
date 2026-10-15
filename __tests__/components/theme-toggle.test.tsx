import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/theme-toggle";
import { theme } from "@tests/helpers/next";

describe("ThemeToggle", () => {
  it("in light mode offers dark mode and switches to it", async () => {
    theme.resolvedTheme = "light";
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Switch to dark mode" });
    await userEvent.setup().click(btn);
    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("in dark mode offers light mode and switches to it", async () => {
    theme.resolvedTheme = "dark";
    try {
      render(<ThemeToggle />);
      await userEvent.setup().click(screen.getByRole("button", { name: "Switch to light mode" }));
      expect(theme.setTheme).toHaveBeenCalledWith("light");
    } finally {
      theme.resolvedTheme = "light";
    }
  });

  it("is a 44px tap target and keyboard-reachable", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("size-11");
    await userEvent.setup().tab();
    expect(btn).toHaveFocus();
  });
});
