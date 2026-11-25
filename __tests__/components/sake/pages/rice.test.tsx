import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeRice } from "@/components/sake/pages/rice";
import { riceVarieties } from "@/lib/content/sake/sake-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeRice />
    </SakeProviders>,
  );

describe("SakeRice", () => {
  it("renders the hero and every rice, and opens and closes a rice's detail", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Rice/ })).toBeInTheDocument();
    for (const r of riceVarieties) expect(screen.getByRole("heading", { level: 3, name: r.name })).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/manuscdn/);
    await user.click(screen.getByRole("heading", { level: 3, name: riceVarieties[0].name }).closest("button")!);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(riceVarieties[0].characteristics);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("heading", { level: 3, name: riceVarieties[1].name }).closest("button")!);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
