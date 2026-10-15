import { afterEach, describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";
import { NavProgressBar } from "@/components/nav-progress-bar";

function bar(container: HTMLElement) {
  return container.firstElementChild!.firstElementChild as HTMLDivElement;
}

describe("NavProgressBar", () => {
  afterEach(() => {
    delete (window as unknown as { navigation?: unknown }).navigation;
  });

  it("is hidden and decorative when the Navigation API is missing", () => {
    const { container } = render(<NavProgressBar />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(bar(container).style.width).toBe("0%");
    expect(bar(container).style.opacity).toBe("0");
  });

  it("shows on navigate and fills to 100% on success", async () => {
    const nav = new EventTarget();
    (window as unknown as { navigation: EventTarget }).navigation = nav;
    const { container } = render(<NavProgressBar />);
    await act(async () => {
      nav.dispatchEvent(new Event("navigate"));
      await Promise.resolve();
    });
    expect(bar(container).style.width).toBe("15%");
    expect(bar(container).style.opacity).toBe("1");
    await act(async () => {
      nav.dispatchEvent(new Event("navigatesuccess"));
      await Promise.resolve();
    });
    expect(bar(container).style.width).toBe("100%");
  });
});
