import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { navigation } from "../../helpers/next";
import { AutoRefresh } from "@/components/friend-gate/auto-refresh";

describe("AutoRefresh", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("re-reads the page every 8 seconds by default and renders nothing", () => {
    const { container } = render(<AutoRefresh />);
    expect(container).toBeEmptyDOMElement();
    vi.advanceTimersByTime(7999);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(navigation.router.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(16000);
    expect(navigation.router.refresh).toHaveBeenCalledTimes(3);
  });

  it("uses a custom interval", () => {
    render(<AutoRefresh seconds={2} />);
    vi.advanceTimersByTime(6000);
    expect(navigation.router.refresh).toHaveBeenCalledTimes(3);
  });

  it("stops refreshing once it's gone from the page", () => {
    const { unmount } = render(<AutoRefresh seconds={1} />);
    unmount();
    vi.advanceTimersByTime(5000);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
