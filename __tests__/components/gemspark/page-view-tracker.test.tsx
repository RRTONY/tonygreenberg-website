import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { PageViewTracker } from "@/components/gemspark/page-view-tracker";
import { trackGemSparkView } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({ trackGemSparkView: vi.fn(async () => {}) }));

describe("PageViewTracker", () => {
  it("records one read of the page and renders nothing", () => {
    const { container, rerender } = render(<PageViewTracker page="long-form" />);
    rerender(<PageViewTracker page="long-form" />);
    expect(container).toBeEmptyDOMElement();
    expect(trackGemSparkView).toHaveBeenCalledTimes(1);
    expect(trackGemSparkView).toHaveBeenCalledWith("long-form");
  });

  it("counts once even when React runs the effect twice (Strict Mode in development)", () => {
    render(
      <StrictMode>
        <PageViewTracker page="short-form" />
      </StrictMode>,
    );
    expect(trackGemSparkView).toHaveBeenCalledTimes(1);
    expect(trackGemSparkView).toHaveBeenCalledWith("short-form");
  });

  it("swallows a failed count instead of throwing an unhandled error", async () => {
    const failed = Promise.reject(new TypeError("Failed to fetch"));
    let handled = false;
    vi.mocked(trackGemSparkView).mockReturnValue({ catch: (fn: () => void) => { handled = true; return failed.catch(fn); } } as never);
    render(<PageViewTracker page="long-form" />);
    expect(handled).toBe(true);
    await failed.catch(() => {});
  });
});
