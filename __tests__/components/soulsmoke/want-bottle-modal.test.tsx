import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { WantBottleModal } from "@/components/soulsmoke/want-bottle-modal";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { getSoulsmokeMember, wantBottle } from "@/app/soul-smoke/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/soul-smoke/actions", () => ({
  getSoulsmokeMember: vi.fn(),
  wantBottle: vi.fn(),
}));

const renderModal = (props: Partial<Parameters<typeof WantBottleModal>[0]> = {}) => {
  const onClose = vi.fn();
  const view = render(
    <SoulsmokeProviders>
      <WantBottleModal isOpen onClose={onClose} bottleId="us-1" bottleName="Del Maguey Chichicapa" {...props} />
    </SoulsmokeProviders>,
  );
  return { onClose, view };
};

beforeEach(() => {
  vi.mocked(getSoulsmokeMember).mockResolvedValue({ signedIn: true });
  vi.mocked(wantBottle).mockResolvedValue({ ok: true, data: null });
});

describe("WantBottleModal", () => {
  it("renders nothing when closed and doesn't ask the server", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(getSoulsmokeMember).not.toHaveBeenCalled();
  });

  it("asks a signed-out visitor to sign in and come back to this page", async () => {
    vi.mocked(getSoulsmokeMember).mockResolvedValue({ signedIn: false });
    navigation.pathname = "/soul-smoke/discovery";
    renderModal();
    expect(screen.getByLabelText("Checking your account")).toBeInTheDocument();
    expect(await screen.findByRole("dialog", { name: "Sign In to Express Interest" })).toBeInTheDocument();
    expect(screen.getByText("Del Maguey Chichicapa")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In / Create Account" })).toHaveAttribute(
      "href",
      "/login?next=%2Fsoul-smoke%2Fdiscovery",
    );
  });

  it("records the interest, shows the confirmation, then closes itself", async () => {
    const { onClose } = renderModal();
    expect(await screen.findByRole("dialog", { name: "I Want This Bottle" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retailer" }));
    expect(screen.getByRole("button", { name: "Retailer" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "5+ cases" } });
    fireEvent.change(screen.getByLabelText("Notes (optional)"), { target: { value: "2019 batch" } });
    vi.useFakeTimers();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Record My Interest" }));
    });

    expect(wantBottle).toHaveBeenCalledWith({
      bottleId: "us-1",
      bottleName: "Del Maguey Chichicapa",
      interestType: "retailer",
      quantity: "5+ cases",
      notes: "2019 batch",
    });
    expect(screen.getByRole("heading", { name: "Interest Recorded!" })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("shows a spinner while saving and the server's error if it fails", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof wantBottle>>) => void;
    vi.mocked(wantBottle).mockReturnValue(new Promise((r) => (resolve = r)));
    renderModal();
    fireEvent.click(await screen.findByRole("button", { name: "Record My Interest" }));
    expect(screen.getByRole("button", { name: "Recording" })).toBeDisabled();
    await act(async () => resolve({ ok: false, error: "That's a lot at once." }));
    expect(screen.getByRole("alert")).toHaveTextContent("That's a lot at once.");
  });

  // Browser test 2026-11-14: a failed request left the modal or its button spinning forever.
  it("explains a dropped connection instead of spinning forever on the account check", async () => {
    vi.mocked(getSoulsmokeMember).mockRejectedValue(new TypeError("Failed to fetch"));
    renderModal();
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't reach the server");
    expect(screen.queryByLabelText("Checking your account")).toBeNull();
  });

  it("explains a dropped connection while saving and re-enables the button", async () => {
    vi.mocked(wantBottle).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    renderModal();
    fireEvent.click(await screen.findByRole("button", { name: "Record My Interest" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't reach the server");
    expect(screen.getByRole("button", { name: "Record My Interest" })).toBeEnabled();
  });

  it("switches to the sign-in box when the session ran out", async () => {
    vi.mocked(wantBottle).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderModal();
    fireEvent.click(await screen.findByRole("button", { name: "Record My Interest" }));
    expect(await screen.findByRole("link", { name: "Sign In / Create Account" })).toBeInTheDocument();
  });

  it("doesn't save without a bottle", async () => {
    renderModal({ bottleId: " ", bottleName: "" });
    fireEvent.click(await screen.findByRole("button", { name: "Record My Interest" }));
    expect(wantBottle).not.toHaveBeenCalled();
  });

  it("closes from the X and the Escape key, and ignores a late answer after closing", async () => {
    const { onClose, view } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "a" });
    expect(onClose).toHaveBeenCalledTimes(2);
    view.unmount();
    await Promise.resolve();
  });
});
