import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleFooter } from "@/components/blog/article-footer";

describe("ArticleFooter", () => {
  it("always shows the assessment CTA, and nothing else when there is no data", () => {
    render(<ArticleFooter data={{}} />);
    expect(screen.getByRole("link", { name: /explore assessments/i })).toHaveAttribute("href", "/find-my");
    expect(screen.queryByText("Try This")).not.toBeInTheDocument();
    expect(screen.queryByText("Where This Leads")).not.toBeInTheDocument();
  });

  it("renders Try this with its steps and the riddle", () => {
    render(
      <ArticleFooter
        data={{ tryThis: { title: "Sit still", description: "Five minutes.", steps: ["Breathe", "Notice"] }, closingRiddle: "What has keys?" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Sit still" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Breathe", "Notice"]);
    expect(screen.getByText("What has keys?")).toBeInTheDocument();
  });

  it("labels each 'Where this leads' link from its reason and skips redirect hops", () => {
    render(
      <ArticleFooter
        data={{
          whereThisLeads: [
            { title: "Akbar", href: "/blog/akbar-cuisine-restoration-economics", reason: "Related idea: food economics" },
            { title: "Go", href: "/go", reason: "Go deeper: more" },
            { title: "Act", href: "/act", reason: "Do something: now" },
            { title: "Next", href: "/next" },
          ],
        }}
      />,
    );
    const akbar = screen.getByRole("link", { name: /akbar/i });
    expect(akbar).toHaveAttribute("href", "/akbar");
    expect(akbar).toHaveTextContent("Related Idea");
    expect(akbar).toHaveTextContent("food economics");
    expect(akbar).not.toHaveTextContent("Related idea:");
    expect(screen.getByRole("link", { name: /^go deeper/i })).toHaveAttribute("href", "/go");
    expect(screen.getByRole("link", { name: /do something/i })).toHaveAttribute("href", "/act");
    expect(screen.getByRole("link", { name: /continue/i })).toHaveAttribute("href", "/next");
  });

  it("links Go deeper items with a URL in a new tab and shows plain text otherwise", () => {
    render(<ArticleFooter data={{ goDeeper: [{ title: "Book", url: "https://example.com" }, { title: "Plain", description: "No link" }] }} />);
    const book = screen.getByRole("link", { name: "Book" });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "Plain" })).not.toBeInTheDocument();
    expect(screen.getByText("No link")).toBeInTheDocument();
  });
});
