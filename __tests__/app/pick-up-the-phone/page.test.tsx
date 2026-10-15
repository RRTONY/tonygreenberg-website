import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PickUpThePhonePage, { metadata } from "@/app/pick-up-the-phone/page";

describe("/pick-up-the-phone", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Pick Up the Phone");
    expect(metadata.description).toBe(
      "Ready to work with Tony Greenberg? Seven out of ten don't qualify. Enter The Gate to find out if you do.",
    );
    expect(metadata.alternates?.canonical).toBe("/pick-up-the-phone");
  });

  it("renders one H1 and the no-cold-calls copy", () => {
    render(<PickUpThePhonePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Connect");
    expect(screen.getByText(/I don't take cold calls, and I don't take meetings without preparation/)).toBeInTheDocument();
    expect(screen.getByText(/Seven out of ten inquiries aren't the right fit/)).toBeInTheDocument();
  });

  it("sends people to The Gate and shows the guarantee", () => {
    render(<PickUpThePhonePage />);
    expect(screen.getByRole("link", { name: /Enter The Gate/ })).toHaveAttribute("href", "/engage");
    expect(screen.getByText(/2× MONEY-BACK GUARANTEE/)).toBeInTheDocument();
  });

  it("lists the topics to talk about", () => {
    render(<PickUpThePhonePage />);
    expect(screen.getByRole("heading", { level: 2, name: "What to Talk About" })).toBeInTheDocument();
    expect(screen.getByText(/Psychedelic medicine & consciousness research/)).toBeInTheDocument();
    expect(screen.getByText(/Speaking engagements & advisory roles/)).toBeInTheDocument();
  });

  it("links the email, the online profiles and the related pages", () => {
    render(<PickUpThePhonePage />);
    expect(screen.getByRole("link", { name: "tony@impactsoul.is" })).toHaveAttribute("href", "mailto:tony@impactsoul.is");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://linkedin.com/in/tonygreenberg");
    expect(screen.getByRole("link", { name: "RampRate" })).toHaveAttribute("href", "https://ramprate.com");
    expect(screen.getByRole("link", { name: /^Speaking and Conversations/ })).toHaveAttribute("href", "/speaking");
    expect(screen.getByRole("link", { name: /^How I'd Approach Your Problem/ })).toHaveAttribute("href", "/framework");
  });
});
