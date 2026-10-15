import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlossaryExplorer } from "@/components/brewsoul/glossary-explorer";
import { GLOSSARY } from "@/lib/content/brewsoul-encyclopedia";

const terms = () => Array.from(document.querySelectorAll("dt")).map((d) => d.textContent);

describe("GlossaryExplorer", () => {
  it("lists every term, grouped under alphabetical letter headings", () => {
    const { container } = render(<GlossaryExplorer terms={GLOSSARY} />);
    expect(terms()).toHaveLength(GLOSSARY.length);
    const letters = Array.from(container.querySelectorAll(".mb-6 > div:first-child")).map((d) => d.textContent);
    const expected = Array.from(new Set(GLOSSARY.map((g) => g.term[0].toUpperCase()))).sort((a, b) => a.localeCompare(b));
    expect(letters).toEqual(expected);
  });

  it("filters terms as you type, ignoring case", async () => {
    const user = userEvent.setup();
    render(<GlossaryExplorer terms={GLOSSARY} />);
    const q = GLOSSARY[0].term.slice(0, 3).toUpperCase();
    await user.type(screen.getByPlaceholderText("Search terms..."), q);
    expect(terms().sort()).toEqual(GLOSSARY.filter((g) => g.term.toLowerCase().includes(q.toLowerCase())).map((g) => g.term).sort());
  });

  it("shows each definition with its term", () => {
    render(<GlossaryExplorer terms={GLOSSARY} />);
    expect(screen.getByText(GLOSSARY[0].term).nextElementSibling).toHaveTextContent(GLOSSARY[0].definition);
  });

  it("shows nothing for a search with no match", async () => {
    const user = userEvent.setup();
    render(<GlossaryExplorer terms={GLOSSARY} />);
    await user.type(screen.getByPlaceholderText("Search terms..."), "zzzqqq");
    expect(terms()).toEqual([]);
  });
});
