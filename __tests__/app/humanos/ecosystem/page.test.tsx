import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/ecosystem/page";
import { ADVISORS, CLIENTS, MENTOR, PARTNERS } from "@/lib/content/humanos-content";

describe("/humanos/ecosystem", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("HumanOS Ecosystem");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/humanos/ecosystem");
  });

  it("has one H1", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Ecosystem");
  });

  it("shows the mentor, every advisor and partner, and the client list", () => {
    render(<Page />);
    for (const p of [MENTOR, ...ADVISORS, ...PARTNERS]) expect(screen.getAllByText(p.name).length).toBeGreaterThan(0);
    for (const c of CLIENTS) expect(screen.getAllByText(c).length).toBeGreaterThan(0);
  });

  it("uses each person's name as their photo's alt text", () => {
    render(<Page />);
    expect(screen.getByRole("img", { name: MENTOR.name })).toBeInTheDocument();
  });
});
