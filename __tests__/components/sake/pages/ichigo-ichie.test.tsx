import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeIchigoIchie } from "@/components/sake/pages/ichigo-ichie";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeIchigoIchie />
    </SakeProviders>,
  );

describe("SakeIchigoIchie", () => {
  it("summons a pairing after the pause", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Pairing Engine/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Summon a Moment/ }));
    expect(screen.getByRole("button", { name: /Summoning/ })).toBeDisabled();
    expect(await screen.findByText("The Dish", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Summon Another Moment/ })).toBeEnabled();
  });
});
