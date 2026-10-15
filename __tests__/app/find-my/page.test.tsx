import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CATEGORIES, FEATURED, FIND_MY_COMING, FIND_MY_LIVE, FIND_MY_TOTAL } from "@/lib/content/find-my-directory";
import FindMyPage, { metadata } from "@/app/find-my/page";

describe("/find-my", () => {
  it("has its own title, a description with the live total, and a canonical", () => {
    expect(metadata.title).toBe("Find What's Yours — All Assessments");
    expect(metadata.description).toBe(`${FIND_MY_TOTAL} decision frameworks that reduce friction and create clarity. No sales pitch. Just tools.`);
    expect(metadata.alternates?.canonical).toBe("/find-my");
  });

  it("renders one H1 and the real explainer copy", () => {
    const { container } = render(<FindMyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find What's Yours");
    expect(container).toHaveTextContent("These tools give you your own data about yourself.");
    expect(container).toHaveTextContent("5–10 min each · Free · Instant results");
    expect(container).toHaveTextContent(`${FIND_MY_LIVE} live now, ${FIND_MY_COMING} coming soon`);
  });

  it("links every live assessment and leaves coming-soon ones unlinked", () => {
    const { container } = render(<FindMyPage />);
    const all = [...FEATURED, ...CATEGORIES.flatMap((c) => c.items)];
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    for (const item of all) {
      if (item.status === "live") expect(hrefs).toContain(item.href);
    }
    const car = FEATURED.find((f) => f.title === "Find My Car")!;
    expect(car.status).toBe("coming");
    expect(hrefs).not.toContain(car.href);
    expect(screen.getAllByText("Coming Soon").length).toBeGreaterThan(0);
  });

  it("shows every category heading", () => {
    const { container } = render(<FindMyPage />);
    for (const c of CATEGORIES) expect(container).toHaveTextContent(c.label);
  });

  it("links to the self-portrait and to Tony", () => {
    render(<FindMyPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Self-Portrait" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Self-Portrait/ })).toHaveAttribute("href", "/self-portrait");
    expect(screen.getByRole("link", { name: /Pick Up the Phone/ })).toHaveAttribute("href", "/pick-up-the-phone");
  });
});
