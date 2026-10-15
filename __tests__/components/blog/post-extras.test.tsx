import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BeforeYouRead, PostLessonBlocks, SeriesReadingList } from "@/components/blog/post-extras";
import { getFurtherReading } from "@/lib/content/further-reading";

vi.mock("@/lib/content/further-reading", () => ({ getFurtherReading: vi.fn() }));
const categoryReading = vi.mocked(getFurtherReading);

describe("BeforeYouRead", () => {
  it("renders nothing without a question", () => {
    const { container } = render(<BeforeYouRead riddle={{ answer: "x" }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps the answer and hint in the HTML behind Reveal / Hint", () => {
    render(<BeforeYouRead riddle={{ question: "What has keys?", answer: "A piano", hint: "Music" }} />);
    expect(screen.getByText("What has keys?")).toBeInTheDocument();
    expect(screen.getByText("Reveal").tagName).toBe("SUMMARY");
    expect(screen.getByText("A piano")).toBeInTheDocument();
    expect(screen.getByText("Hint").tagName).toBe("SUMMARY");
  });
});

describe("PostLessonBlocks", () => {
  beforeEach(() => {
    categoryReading.mockReturnValue([
      { title: "Fifth Discipline", url: "https://example.com/book", source: "Senge", why: "Systems" },
      { title: "Dup", url: "https://www.tonygreenberg.com/blog/five-cups", source: "", why: "" },
    ]);
  });

  it("shows lesson and next steps, and passes category and format to the reading list", () => {
    render(<PostLessonBlocks extras={{ lesson: "Slow down.", nextSteps: ["Walk", "Write"], formatTag: "Essay" }} category="Tech" />);
    expect(screen.getByText("Slow down.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Next Steps" })).toBeInTheDocument();
    expect(screen.getByText("Walk")).toBeInTheDocument();
    expect(categoryReading).toHaveBeenCalledWith("Tech", "Essay");
  });

  it("merges body and category reading without duplicates; site links stay on site", () => {
    render(
      <PostLessonBlocks
        extras={{}}
        bodyReading={{ items: [{ title: "Five Cups", url: "https://tonygreenberg.com/blog/five-cups" }], intro: "Read on.", keptInBody: false }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Further Reading" })).toBeInTheDocument();
    expect(screen.getByText("Read on.")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/blog/five-cups");
    expect(links[0]).not.toHaveAttribute("target");
    expect(links[1]).toHaveAttribute("href", "https://example.com/book");
    expect(links[1]).toHaveAttribute("target", "_blank");
    expect(screen.queryByText("Dup")).not.toBeInTheDocument();
  });

  it("leaves out the category list when the body kept its own reading section", () => {
    render(<PostLessonBlocks extras={{}} bodyReading={{ items: [], keptInBody: true }} />);
    expect(screen.queryByRole("heading", { name: "Further Reading" })).not.toBeInTheDocument();
    expect(categoryReading).not.toHaveBeenCalled();
  });

  it("shows voices (linked when they have a URL), 'also involves' and 'since this was written'", () => {
    categoryReading.mockReturnValue([]);
    render(
      <PostLessonBlocks
        extras={{
          voices: [
            { name: "Gabor Maté", title: "Physician", url: "https://drgabormate.com" },
            { name: "Unlinked Voice", title: "Writer" },
          ],
          alsoInvolves: ["MAPS"],
          sinceWritten: { headline: "FDA moves", source: "NYT", year: "2025", url: "https://nyt.com/x", connection: "Proves the point." },
        }}
      />,
    );
    expect(screen.getByRole("link", { name: /gabor maté/i })).toHaveAttribute("href", "https://drgabormate.com");
    expect(screen.queryByRole("link", { name: /unlinked voice/i })).not.toBeInTheDocument();
    expect(screen.getByText("MAPS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FDA moves" })).toHaveAttribute("href", "https://nyt.com/x");
    expect(screen.getByText("NYT · 2025")).toBeInTheDocument();
  });
});

describe("SeriesReadingList", () => {
  const titles = {
    "only-time-buys-trust": "Only Time Buys Trust",
    "why-good-service-is-all-about-trust": "Good Service",
    "the-arithmetic-of-relationships": "Arithmetic",
  };

  it("renders nothing for an essay outside any series", () => {
    const { container } = render(<SeriesReadingList slug="solo" titlesBySlug={titles} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current part and links the others plus the next one", () => {
    render(<SeriesReadingList slug="why-good-service-is-all-about-trust" titlesBySlug={titles} />);
    expect(screen.getByText("The Trust Trilogy — Part 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("You are here")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^2\.\s*good service/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /only time buys trust/i })).toHaveAttribute("href", "/blog/only-time-buys-trust");
    const next = screen.getByRole("link", { name: /^next/i });
    expect(next).toHaveAttribute("href", "/blog/the-arithmetic-of-relationships");
  });

  it("hides the next button on the last part and skips unpublished parts", () => {
    render(<SeriesReadingList slug="the-arithmetic-of-relationships" titlesBySlug={{ "the-arithmetic-of-relationships": "Arithmetic" }} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
