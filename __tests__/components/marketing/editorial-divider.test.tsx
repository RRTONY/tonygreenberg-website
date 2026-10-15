import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { EditorialDivider } from "@/components/marketing/editorial-divider";

describe("EditorialDivider", () => {
  it("is decorative with the default spacing", () => {
    const { container } = render(<EditorialDivider />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveClass("h-px", "my-12");
  });

  it("takes a custom spacing class", () => {
    const { container } = render(<EditorialDivider className="my-4" />);
    expect(container.firstElementChild).toHaveClass("my-4");
    expect(container.firstElementChild).not.toHaveClass("my-12");
  });
});
