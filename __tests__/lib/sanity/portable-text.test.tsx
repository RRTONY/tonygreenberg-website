import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PortableText, portableTextComponents } from "@/lib/sanity/portable-text";

vi.mock("@/components/blog/gem-spark-card", () => ({
  GemSparkCard: ({ anchorId, subtitle, children }: { anchorId?: string; subtitle?: string; children: ReactNode }) => (
    <section data-testid="gemspark" id={anchorId} data-subtitle={subtitle}>
      {children}
    </section>
  ),
}));

let n = 0;
const k = () => `k${n++}`;
const LONG = "This paragraph is easily long enough to carry the essay drop cap, at well over eighty characters in total.";

function para(text: string, opts: { marks?: string[]; markDefs?: object[]; style?: string; listItem?: string } = {}) {
  return {
    _key: k(),
    _type: "block",
    style: opts.style ?? "normal",
    ...(opts.listItem ? { listItem: opts.listItem, level: 1 } : {}),
    markDefs: opts.markDefs ?? [],
    children: [{ _key: k(), _type: "span", text, marks: opts.marks ?? [] }],
  };
}
const link = (text: string, href: string) => para(text, { marks: ["l"], markDefs: [{ _key: "l", _type: "link", href }] });
const show = (value: object[]) => render(<PortableText value={value as never} components={portableTextComponents} />);

describe("portableTextComponents: links", () => {
  it("opens external links in a new tab, safely", () => {
    show([link("RampRate", "https://ramprate.com")]);
    const a = screen.getByRole("link", { name: "RampRate" });
    expect(a).toHaveAttribute("href", "https://ramprate.com");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps internal links in the same tab", () => {
    show([link("Five Cups", "/blog/five-cups")]);
    const a = screen.getByRole("link", { name: "Five Cups" });
    expect(a).toHaveAttribute("href", "/blog/five-cups");
    expect(a).not.toHaveAttribute("target");
  });

  it("renders empty-href and dead internal links as plain text", () => {
    show([link("Empty", ""), link("Case file", "https://tonygreenberg.com/blog/the-case-file-dr-samuel-lee/")]);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByText("Case file")).toBeInTheDocument();
  });

  it("rewrites Manus links: this site to its own path, Clarisse to her domain, others to text", () => {
    show([
      link("Here", "https://tonygreenberg.manus.space/about"),
      link("Art", "https://clarisseart.manus.space/gallery"),
      link("Other", "https://someapp.manus.space/"),
    ]);
    expect(screen.getByRole("link", { name: "Here" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Art" })).toHaveAttribute("href", "https://clarisseartist.com/gallery");
    expect(screen.queryByRole("link", { name: "Other" })).toBeNull();
    expect(document.body.innerHTML).not.toContain("manus.space");
  });
});

describe("portableTextComponents: blocks", () => {
  it("anchors headings and hides the decorative glyph from screen readers", () => {
    show([{ ...para("◆ What the Fine Print Says", { style: "h2" }), anchorId: "fine-print" }]);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveAttribute("id", "fine-print");
    expect(h.querySelector('[aria-hidden="true"]')).toHaveTextContent("◆");
    expect(h).toHaveTextContent("What the Fine Print Says");
  });

  it("flags short or link-led paragraphs so the drop cap skips them", () => {
    const { container } = show([para("By Tony Greenberg"), para(LONG), link(LONG, "/blog/x")]);
    const ps = container.querySelectorAll("p");
    expect(ps[0]).toHaveAttribute("data-no-drop-cap", "true");
    expect(ps[1]).not.toHaveAttribute("data-no-drop-cap");
    expect(ps[2]).toHaveAttribute("data-no-drop-cap", "true");
  });

  it("renders pull quotes, section breaks and the GemSpark card", () => {
    const { container } = show([
      { _key: k(), _type: "essayPullQuote", text: "Trust is earned in drops." },
      { _key: k(), _type: "sectionBreak" },
      { _key: k(), _type: "gemSpark", anchorId: "gem", subtitle: "Today", paragraphs: [para("Inside the card.")] },
    ]);
    expect(screen.getByText("Trust is earned in drops.").closest("blockquote")).not.toBeNull();
    expect(container.querySelector("hr")).not.toBeNull();
    const gem = screen.getByTestId("gemspark");
    expect(gem).toHaveAttribute("id", "gem");
    expect(gem).toHaveTextContent("Inside the card.");
  });

  it("renders images with dimensions from the asset ref and alt as caption", () => {
    show([{ _key: k(), _type: "image", alt: "A cup of coffee", asset: { _ref: "image-abc-640x480-jpg" } }]);
    const img = screen.getByRole("img", { name: "A cup of coffee" });
    expect(img).toHaveAttribute("width", "640");
    expect(img).toHaveAttribute("height", "480");
    expect(img.getAttribute("src")).toContain("cdn.sanity.io");
    expect(screen.getByText("A cup of coffee", { selector: "figcaption" })).toBeInTheDocument();
  });

  it("skips an image with no asset", () => {
    const { container } = show([{ _key: k(), _type: "image" }]);
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders a data table with a header row, and nothing for fewer than two rows", () => {
    show([{ _key: k(), _type: "dataTable", rows: [{ cells: ["Name", "Score"] }, { cells: ["Kava", "9"] }, { cells: [] }] }]);
    expect(screen.getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Name", "Score"]);
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("region", { name: /scrolls sideways/ })).toBeInTheDocument();

    const { container } = show([{ _key: k(), _type: "dataTable", rows: [{ cells: ["Only"] }] }]);
    expect(container.querySelector("table")).toBeNull();
  });

  it("renders bullet lists", () => {
    show([para("One", { listItem: "bullet" }), para("Two", { listItem: "bullet" })]);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["One", "Two"]);
  });
});
