import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonCard } from "@/components/humanos/person-card";

const base = { name: "Ada mary Lovelace", role: "Advisor", org: "Analytical Engines", quote: "Imagination is the discovering faculty." };

describe("PersonCard", () => {
  it("shows the name, role, org and the quote", () => {
    render(<PersonCard person={base} />);
    expect(screen.getByText("Ada mary Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Advisor")).toBeInTheDocument();
    expect(screen.getByText("Analytical Engines")).toBeInTheDocument();
    expect(screen.getByText(/Imagination is the discovering faculty\./).tagName).toBe("BLOCKQUOTE");
  });

  it("uses the headshot with the person's name as alt text", () => {
    render(<PersonCard person={{ ...base, img: "https://cdn.sanity.io/images/x/y/a.webp" }} />);
    expect(screen.getByRole("img", { name: "Ada mary Lovelace" })).toHaveAttribute("src", "https://cdn.sanity.io/images/x/y/a.webp");
  });

  it("falls back to two upper-case initials without a photo", () => {
    render(<PersonCard person={base} />);
    expect(screen.getByText("AM")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("switches colours for the emerald accent", () => {
    render(<PersonCard person={base} accent="emerald" />);
    expect(screen.getByText("Advisor").className).toContain("text-emerald-700");
  });
});
