import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BOTTLE_INTERESTS_KEY, WantBottleModal } from "@/components/soulsmoke/want-bottle-modal";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderModal = (props: Partial<Parameters<typeof WantBottleModal>[0]> = {}) => {
  const onClose = vi.fn();
  render(
    <SoulsmokeProviders>
      <WantBottleModal isOpen onClose={onClose} bottleId="us-1" bottleName="Del Maguey Chichicapa" {...props} />
    </SoulsmokeProviders>,
  );
  return onClose;
};

const saved = () => JSON.parse(window.localStorage.getItem(BOTTLE_INTERESTS_KEY) ?? "[]");

describe("WantBottleModal", () => {
  it("renders nothing when closed", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("saves the interest in the browser, shows the confirmation, then closes itself", () => {
    vi.useFakeTimers();
    const onClose = renderModal();
    expect(screen.getByRole("dialog", { name: "I Want This Bottle" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retailer" }));
    expect(screen.getByRole("button", { name: "Retailer" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "5+ cases" } });
    fireEvent.change(screen.getByLabelText("Notes (optional)"), { target: { value: "2019 batch" } });
    fireEvent.click(screen.getByRole("button", { name: "Record My Interest" }));

    expect(saved()).toEqual([
      expect.objectContaining({
        bottleId: "us-1",
        bottleName: "Del Maguey Chichicapa",
        interestType: "retailer",
        quantity: "5+ cases",
        notes: "2019 batch",
      }),
    ]);
    expect(screen.getByRole("heading", { name: "Interest Recorded!" })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("doesn't save without a bottle", () => {
    renderModal({ bottleId: " ", bottleName: "" });
    fireEvent.click(screen.getByRole("button", { name: "Record My Interest" }));
    expect(saved()).toEqual([]);
  });

  it("closes from the X and the Escape key", () => {
    const onClose = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "a" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
