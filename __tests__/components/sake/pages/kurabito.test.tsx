import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeKurabito } from "@/components/sake/pages/kurabito";
import { kurabitoDiary } from "@/lib/content/sake/deep-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

vi.mock("@/components/sake/ambient-sound", () => ({ AmbientSound: ({ label }: { label?: { en: string } }) => <button type="button">{label?.en}</button> }));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeKurabito />
    </SakeProviders>,
  );

describe("SakeKurabito", () => {
  it("steps through the diary", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Kurabito Diaries/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: kurabitoDiary[0].title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { level: 2, name: kurabitoDiary[1].title })).toBeInTheDocument();
    const last = kurabitoDiary[kurabitoDiary.length - 1];
    await user.click(screen.getByRole("button", { name: last.title }));
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: last.title })).toHaveAttribute("aria-current", "step");
  });
});
