import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeProcess } from "@/components/sake/pages/process";
import { brewingSteps } from "@/lib/content/sake/sake-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeProcess />
    </SakeProviders>,
  );

describe("SakeProcess", () => {
  it("renders every step and opens its detail", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Sacred Process/ })).toBeInTheDocument();
    for (const s of brewingSteps) expect(screen.getByText(s.name)).toBeInTheDocument();
    const panel = container.querySelector("#sake-step-1") as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent("Switch to Connoisseur mode for the deep dive.");
    await user.click(screen.getAllByRole("button", { expanded: false })[0]);
    expect(panel).not.toHaveAttribute("hidden");
    expect(container.innerHTML).not.toMatch(/⚙️|manuscdn/);
  });
});
