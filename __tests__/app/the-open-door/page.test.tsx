import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TheOpenDoorPage, { metadata } from "@/app/the-open-door/page";

describe("/the-open-door", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Open Door");
    expect(metadata.description).toMatch(/10 magic genie prompts, client testimonials with ROI data/);
    expect(metadata.alternates?.canonical).toBe("/the-open-door");
  });

  it("renders one H1 and the intro", () => {
    render(<TheOpenDoorPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("What Happens When You Walk In");
    expect(screen.getByText(/These are the real asks\. Real companies\. Real targets\./)).toBeInTheDocument();
  });

  it("lays out the ten genie prompts and the main sections", () => {
    const { container } = render(<TheOpenDoorPage />);
    for (const h of ["The Magic Genie Prompts", "Keynotes & Speaking", "Podcasts & Interviews", "Published Articles", "What They Said After"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(container.textContent).toContain("I need to cut $40M from my cloud and data center spend");
    expect(screen.getAllByRole("link", { name: /Learn more/ })).toHaveLength(10);
  });

  it("labels every made-up quote as parody", () => {
    render(<TheOpenDoorPage />);
    expect(screen.getByRole("heading", { level: 2, name: "What They Would Have Said" })).toBeInTheDocument();
    expect(screen.getByText(/These quotes are entirely fictional\. But if these people had spent an afternoon/)).toBeInTheDocument();
    expect(screen.getAllByText("Parody")).toHaveLength(8);
  });

  it("links the interviews and articles to their real sources", () => {
    render(<TheOpenDoorPage />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://www.jeffbullas.com/podcasts/ai-and-humanity-181/");
    expect(hrefs).toContain("https://www.youtube.com/watch?v=MfEt7jkBmOQ");
    expect(screen.getByRole("link", { name: /^Boiling the Human/ })).toHaveAttribute("href", "/blog/boiling-the-human-summit-harvard-kurzweil");
    expect(hrefs.some((h) => h?.startsWith("https://www.forbes.com/sites/ciocentral/2012/04/18/"))).toBe(true);
  });
});
