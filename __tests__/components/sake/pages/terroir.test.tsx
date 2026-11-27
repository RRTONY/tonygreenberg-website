import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeTerroir } from "@/components/sake/pages/terroir";
import { prefectureTerroirs } from "@/lib/content/sake/deep-data2";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeTerroir />
    </SakeProviders>,
  );

describe("SakeTerroir", () => {
  it("compares the two picked prefectures", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Terroir Comparison/ })).toBeInTheDocument();
    expect(screen.getByText(prefectureTerroirs[0].climate)).toBeInTheDocument();
    const third = prefectureTerroirs[2];
    const groupB = screen.getByRole("group", { name: "Prefecture B" });
    const btn = Array.from(groupB.querySelectorAll("button")).find((b) => b.textContent === third.name)!;
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(third.climate)).toBeInTheDocument();
  });
});
