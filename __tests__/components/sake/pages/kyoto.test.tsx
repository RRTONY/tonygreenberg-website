import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeKyoto } from "@/components/sake/pages/kyoto";
import { kyotoSpots } from "@/lib/content/sake/culture-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

vi.mock("@/components/sake/ambient-sound", () => ({ AmbientSound: ({ label }: { label?: { en: string } }) => <button type="button">{label?.en}</button> }));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeKyoto />
    </SakeProviders>,
  );

describe("SakeKyoto", () => {
  it("renders every spot and reveals its secret", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Kyoto They/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rain on Kyoto tiles" })).toBeInTheDocument();
    const first = kyotoSpots[0];
    const panel = container.querySelector(`#sake-kyoto-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.secret);
    await user.click(screen.getByRole("button", { name: first.name }));
    expect(panel).not.toHaveAttribute("hidden");
    await user.click(screen.getByRole("button", { name: first.name }));
    expect(panel).toHaveAttribute("hidden");
  });
});
