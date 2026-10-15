import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideWatchFraudPatterns } from "@/components/marketing/peptide-watch-fraud-patterns";
import { FRAUD_PATTERNS } from "@/lib/content/peptide-watch";

const [first, second] = FRAUD_PATTERNS;

describe("PeptideWatchFraudPatterns", () => {
  it("lists every pattern with its number and title, bodies in the HTML but hidden", () => {
    render(<PeptideWatchFraudPatterns />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(FRAUD_PATTERNS.length);
    expect(screen.getByText(first.num)).toBeInTheDocument();
    expect(screen.getByText(first.body)).toHaveClass("hidden");
  });

  it("clicking a pattern opens it and closes the previously open one", async () => {
    const user = userEvent.setup();
    render(<PeptideWatchFraudPatterns />);
    await user.click(screen.getByText(first.title));
    expect(screen.getByText(first.body)).not.toHaveClass("hidden");
    await user.click(screen.getByText(second.title));
    expect(screen.getByText(first.body)).toHaveClass("hidden");
    expect(screen.getByText(second.body)).not.toHaveClass("hidden");
    await user.click(screen.getByText(second.title));
    expect(screen.getByText(second.body)).toHaveClass("hidden");
  });

  it("each pattern can be opened from the keyboard (a real button)", async () => {
    render(<PeptideWatchFraudPatterns />);
    expect(screen.getAllByRole("button")).toHaveLength(FRAUD_PATTERNS.length);
  });
});
