import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeWabiSabi } from "@/components/sake/pages/wabi-sabi";
import { wabiSabiPrinciples } from "@/lib/content/sake/culture-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeWabiSabi />
    </SakeProviders>,
  );

describe("SakeWabiSabi", () => {
  it("renders every principle and opens its meditation", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Taste the/ })).toBeInTheDocument();
    for (const p of wabiSabiPrinciples) expect(screen.getByRole("button", { name: p.name })).toBeInTheDocument();
    const first = wabiSabiPrinciples[0];
    const panel = container.querySelector(`#sake-wabi-${first.id}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    await user.click(screen.getByRole("button", { name: first.name }));
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.sakeExample);
  });
});
