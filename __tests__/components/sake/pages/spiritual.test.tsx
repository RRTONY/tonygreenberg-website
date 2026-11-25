import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeSpiritual } from "@/components/sake/pages/spiritual";
import { spiritualRealms } from "@/lib/content/sake/spiritual-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeSpiritual />
    </SakeProviders>,
  );

describe("SakeSpiritual", () => {
  it("shows the first realm, then the one picked, with no emoji icons", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Spiritual Realms/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: spiritualRealms[0].nameEn })).toBeInTheDocument();
    const third = spiritualRealms[2];
    await user.click(screen.getByRole("button", { name: third.nameEn }));
    expect(screen.getByRole("heading", { level: 2, name: third.nameEn })).toBeInTheDocument();
    expect(screen.queryByText("The Sake Connection")).toBeNull();
    expect(container.innerHTML).not.toMatch(/💧|⏳|🔗|⛩️|🌊|✨|🏠/u);
  });
});
