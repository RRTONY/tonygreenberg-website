import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeAging } from "@/components/sake/pages/aging";
import { agingStages } from "@/lib/content/sake/deep-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeAging />
    </SakeProviders>,
  );

describe("SakeAging", () => {
  it("shows the first stage, then the one picked", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Aging & Time/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: agingStages[0].name })).toBeInTheDocument();
    const last = agingStages[agingStages.length - 1];
    await user.click(screen.getByRole("button", { name: last.years }));
    expect(screen.getByRole("heading", { level: 2, name: last.name })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: last.years })).toHaveAttribute("aria-pressed", "true");
  });
});
