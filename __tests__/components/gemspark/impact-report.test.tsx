import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ImpactReport } from "@/components/gemspark/impact-report";
import { getGemSparkCounts } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({ getGemSparkCounts: vi.fn() }));

describe("ImpactReport", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the pulsing dash while loading, then the formatted counts, refreshing every 30 seconds", async () => {
    vi.mocked(getGemSparkCounts).mockResolvedValueOnce({ longForm: 1250, shortForm: 2000 }).mockResolvedValue({ longForm: 42, shortForm: 7 });
    const { unmount } = render(<ImpactReport />);
    expect(screen.getAllByText("—")).toHaveLength(2);
    expect(await screen.findByText("1.3k")).toBeInTheDocument();
    expect(screen.getByText("2k")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(getGemSparkCounts).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("shows zeros when the counts can't be read", async () => {
    vi.mocked(getGemSparkCounts).mockResolvedValue(null);
    render(<ImpactReport />);
    expect(await screen.findAllByText("0")).toHaveLength(2);
  });

  it("stops the dash when the request fails", async () => {
    vi.mocked(getGemSparkCounts).mockRejectedValue(new Error("down"));
    render(<ImpactReport />);
    expect(await screen.findAllByText("0")).toHaveLength(2);
  });
});
