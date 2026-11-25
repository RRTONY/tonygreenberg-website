import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakePrefectures } from "@/components/sake/pages/prefectures";
import { prefectures } from "@/lib/content/sake/sake-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakePrefectures", () => {
  it("renders every prefecture, the hero stand-in, and opens one from its card", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakePrefectures />);
    expect(screen.getByRole("heading", { level: 1, name: /Prefectures/ })).toBeInTheDocument();
    expect(container.querySelector(".sk-image-wash")).not.toBeNull();
    expect(container.innerHTML).not.toMatch(/manuscdn/);
    const first = prefectures[0];
    const panel = container.querySelector(`#pref-panel-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.description);
    const card = screen.getAllByRole("button").find((b) => b.getAttribute("aria-controls") === panel.id)!;
    await user.click(card);
    expect(panel).not.toHaveAttribute("hidden");
    await user.click(card);
    expect(panel).toHaveAttribute("hidden");
  });

  it("opens a prefecture from its map marker and shows its label on hover", async () => {
    const user = userEvent.setup();
    Element.prototype.scrollIntoView = vi.fn();
    const { container } = renderSake(<SakePrefectures />);
    const pref = prefectures.find((p) => ["niigata", "hyogo", "akita"].includes(p.id))!;
    const marker = screen.getByRole("button", { name: pref.name });
    await user.hover(marker);
    expect(screen.getAllByText(pref.name).length).toBeGreaterThan(1);
    await user.unhover(marker);
    await user.click(marker);
    expect(container.querySelector(`#pref-panel-${pref.id}`)).not.toHaveAttribute("hidden");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
