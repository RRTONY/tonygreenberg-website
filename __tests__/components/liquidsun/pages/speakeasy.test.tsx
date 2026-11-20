import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Speakeasy, blackMarketBottles } from "@/components/liquidsun/pages/speakeasy";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
}));

function renderPage() {
  return render(
    <LiquidsunProviders>
      <Speakeasy />
    </LiquidsunProviders>,
  );
}

const box = () => screen.getByLabelText("Passphrase");

describe("Speakeasy", () => {
  it("asks for the passphrase when the box is empty", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Restricted Area" })).toBeInTheDocument();
    await user.click(box());
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter the passphrase.");
  });

  it("flashes Access Denied for a second on a wrong passphrase", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(box(), "tequila{Enter}");
    expect(await screen.findByRole("alert")).toHaveTextContent("Access Denied");
    expect(box()).toHaveAttribute("aria-invalid", "true");
    await waitFor(() => expect(screen.queryByText("Access Denied")).not.toBeInTheDocument(), { timeout: 2500 });
  });

  it("opens THE BLACK MARKET with the passphrase, after the lock screen fades out", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(box(), "AGAVE{Enter}");
    expect(screen.getByRole("heading", { name: "Restricted Area" }).parentElement).toHaveClass("animate-out");
    expect(await screen.findByRole("heading", { level: 1, name: "THE BLACK MARKET" })).toBeInTheDocument();
    for (const b of blackMarketBottles) expect(screen.getByRole("heading", { name: b.name })).toBeInTheDocument();
    expect(screen.getAllByText("CONFIDENTIAL")).toHaveLength(3);
  });

  it("also opens with the Konami code", async () => {
    renderPage();
    for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
      fireEvent.keyDown(window, { key });
    }
    await waitFor(() => expect(screen.getByRole("heading", { name: "THE BLACK MARKET" })).toBeInTheDocument());
  });

  beforeEach(() => {
    vi.stubGlobal("matchMedia", undefined);
  });
});
