import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeCeremony } from "@/components/sake/pages/ceremony";
import { sacredCeremonies, traditionalCeremonySteps, viewingRituals } from "@/lib/content/sake/spiritual-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeCeremony", () => {
  it("walks through the eight steps with the step buttons and Previous/Next", async () => {
    const user = userEvent.setup();
    renderSake(<SakeCeremony />);
    expect(screen.getByRole("heading", { level: 1, name: /The Traditional/ })).toBeInTheDocument();
    const [first, second] = traditionalCeremonySteps;
    expect(screen.getByRole("heading", { level: 2, name: first.nameEn })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { level: 2, name: second.nameEn })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByRole("heading", { level: 2, name: first.nameEn })).toBeInTheDocument();

    const last = traditionalCeremonySteps[traditionalCeremonySteps.length - 1];
    await user.click(screen.getByRole("button", { name: last.nameEn }));
    expect(screen.getByRole("heading", { level: 2, name: last.nameEn })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("keeps the ceremonies in the HTML while closed and toggles them", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeCeremony />);
    const list = container.querySelector("#sake-sacred-ceremonies") as HTMLElement;
    expect(list).toHaveAttribute("hidden");
    expect(list).toHaveTextContent(sacredCeremonies[0].nameEn);
    const toggle = screen.getByRole("button", { name: /Sacred Ceremonies of Japan/ });
    await user.click(toggle);
    expect(list).not.toHaveAttribute("hidden");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    for (const r of viewingRituals) expect(screen.getByText(r.nameEn)).toBeInTheDocument();
  });

  it("shows deep notes in Connoisseur mode, Japanese text, and the Austere colors", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeCeremony />);
    expect(screen.queryByText("Deep Note")).toBeNull();
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getByText("Deep Note")).toBeInTheDocument();
    expect(screen.getByText(traditionalCeremonySteps[0].deepNoteEn)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".bg-stone-50")).not.toBeNull();
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText("聖なる作法")).toBeInTheDocument();
  });
});
