import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";

describe("ThemeProvider", () => {
  it("renders its children", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <p>inside</p>
      </ThemeProvider>,
    );
    expect(screen.getByText("inside")).toBeInTheDocument();
  });
});
