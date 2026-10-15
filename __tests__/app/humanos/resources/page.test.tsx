import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/humanos/resources/page";
import { PLAYBOOKS, READING_LIST } from "@/lib/content/humanos-content";

describe("/humanos/resources", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("HumanOS Resources");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/humanos/resources");
  });

  it("has one H1 and every playbook", () => {
    render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Resources");
    PLAYBOOKS.forEach((pb) => expect(screen.getByText(pb.title)).toBeInTheDocument());
    expect(READING_LIST.length).toBeGreaterThan(0);
  });

  it("only playbooks with a link get an Explore link, pointing at it", () => {
    render(<Page />);
    const explore = screen.getAllByRole("link", { name: /Explore/ });
    expect(explore.map((a) => a.getAttribute("href"))).toEqual(PLAYBOOKS.filter((p) => p.link).map((p) => p.link));
  });

  it("links to the diagnostic and philosophy", () => {
    render(<Page />);
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toContain("/humanos/philosophy");
  });
});
