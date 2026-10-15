import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsNext } from "@/components/assessments/whats-next";

describe("WhatsNext", () => {
  it("links to another assessment, the essays and the ecosystem", () => {
    render(<WhatsNext />);
    expect(screen.getByRole("heading", { name: "What's Next?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /take another assessment/i })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: /read related essays/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /explore the ecosystem/i })).toHaveAttribute("href", "/ecosystem");
  });
});
