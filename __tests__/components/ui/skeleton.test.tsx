import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("is a pulsing block that merges className and props", () => {
    render(<Skeleton className="h-4 w-20" data-testid="s" />);
    const s = screen.getByTestId("s");
    expect(s).toHaveClass("animate-pulse", "bg-muted", "h-4", "w-20");
    expect(s).toHaveAttribute("data-slot", "skeleton");
  });
});
