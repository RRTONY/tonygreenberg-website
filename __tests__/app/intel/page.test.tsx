import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IntelPage, { metadata } from "@/app/intel/page";

describe("/intel", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Intel");
    expect(metadata.description).toMatch(/impact theses, Hawkins consciousness scores, competitive landscape/);
    expect(metadata.alternates?.canonical).toBe("/intel");
  });

  it("renders one H1 and the three scoring frameworks", () => {
    const { container } = render(<IntelPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Where the Thinking Meets the Doing");
    expect(container).toHaveTextContent("Impact Compass (7 Dimensions)");
    expect(container).toHaveTextContent("Impact Rate of Return (iRR)");
    expect(container).toHaveTextContent("200+ = integrity threshold.");
    expect(container).toHaveTextContent("Capital without consciousness is extraction.");
  });

  it("lists the portfolio with a Full Analysis toggle per company", () => {
    render(<IntelPage />);
    expect(screen.getByRole("heading", { level: 3, name: "RampRate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "ImpactSoul" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Full Analysis/ })).toHaveLength(9);
  });

  it("keeps the collapsed competitor analysis in the server HTML", () => {
    const { container } = render(<IntelPage />);
    expect(container).toHaveTextContent("Gartner");
    expect(container).toHaveTextContent("Tokenized carbon credits — similar mechanism, different asset class");
    expect(container).toHaveTextContent("Bill Gross's venture studio — pioneered the model");
  });

  it("opens a company's analysis on click", async () => {
    const user = userEvent.setup();
    render(<IntelPage />);
    const first = screen.getAllByRole("button", { name: /Full Analysis/ })[0];
    expect(first).toHaveAttribute("aria-expanded", "false");
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("links to the blog and related tools", () => {
    render(<IntelPage />);
    expect(screen.getByRole("link", { name: /Read the Blog/ })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /SoulScore/ })).toHaveAttribute("href", "/soulscore");
  });
});
