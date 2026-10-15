import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DecafShame } from "@/components/brewsoul/decaf-shame";

describe("DecafShame", () => {
  it("hides the wall until asked", () => {
    render(<DecafShame />);
    expect(screen.getByRole("button", { name: "Reveal Wall of Shame ▼" })).toBeInTheDocument();
    expect(screen.queryByText("Folgers Decaf")).not.toBeInTheDocument();
  });

  it("reveals all 10 methylene chloride brands and the lawsuit context, then hides again", async () => {
    const user = userEvent.setup();
    render(<DecafShame />);
    await user.click(screen.getByRole("button", { name: /Reveal Wall of Shame/ }));
    expect(screen.getAllByText(/^Process: Methylene Chloride/)).toHaveLength(10);
    expect(screen.getByText("Dunkin' Donuts Decaf")).toBeInTheDocument();
    expect(screen.getByText("Clean Label Project Lawsuits (2020-present)")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hide Wall of Shame ▲" }));
    expect(screen.queryByText("Dunkin' Donuts Decaf")).not.toBeInTheDocument();
  });
});
