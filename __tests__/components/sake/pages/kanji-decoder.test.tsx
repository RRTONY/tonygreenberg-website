import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeKanjiDecoder } from "@/components/sake/pages/kanji-decoder";
import { kanjiLabels } from "@/lib/content/sake/culture-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeKanjiDecoder", () => {
  it("filters by category and opens a kanji's explanation", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeKanjiDecoder />);
    expect(screen.getByRole("heading", { level: 1, name: /Read the/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(kanjiLabels.length);
    await user.click(screen.getByRole("button", { name: "Grade" }));
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(kanjiLabels.filter((k) => k.category === "grade").length);
    await user.click(screen.getByRole("button", { name: "All" }));

    const first = kanjiLabels[0];
    const panel = container.querySelector(`#kanji-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.detail);
    const btn = screen.getAllByRole("button").find((b) => b.getAttribute("aria-controls") === panel.id)!;
    await user.click(btn);
    expect(panel).not.toHaveAttribute("hidden");
    expect(screen.getByRole("heading", { level: 2, name: "How to Read a Sake Label" })).toBeInTheDocument();
  });
});
