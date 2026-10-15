import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostNotes } from "@/components/blog/post-notes";

describe("PostNotes", () => {
  it("renders nothing without a note", () => {
    const { container } = render(<PostNotes editorsNote={{ label: "x" }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the editor's note with a default label and its provenance", () => {
    render(<PostNotes editorsNote={{ text: "Updated in 2026.", provenance: "Court filings" }} />);
    expect(screen.getByText("Editor's note")).toBeInTheDocument();
    expect(screen.getByText("Updated in 2026.")).toBeInTheDocument();
    expect(screen.getByText("Provenance: Court filings")).toBeInTheDocument();
  });

  it("uses a custom label and adds the standard corrections note", () => {
    render(<PostNotes editorsNote={{ label: "Update", text: "New facts." }} provenanceNote />);
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Provenance and corrections")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tony@impactsoul.is" })).toHaveAttribute("href", "mailto:tony@impactsoul.is");
  });
});
