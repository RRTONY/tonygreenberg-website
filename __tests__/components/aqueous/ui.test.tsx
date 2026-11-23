import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "@/components/aqueous/ui";

describe("Aqueous Button", () => {
  it("is a default primary button that passes props through", async () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" className="w-full" onClick={onClick}>
        Get my report
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Get my report" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-9", "px-4", "w-full");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has the app's variants and sizes", () => {
    render(
      <>
        <Button variant="outline" size="lg">
          Outline
        </Button>
        <Button variant="destructive" size="icon" aria-label="Delete" />
        <Button variant="link" size="sm" disabled>
          Link
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border", "bg-transparent", "h-10", "px-6");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("bg-destructive", "size-9");
    const link = screen.getByRole("button", { name: "Link" });
    expect(link).toHaveClass("text-primary", "underline-offset-4", "h-8");
    expect(link).toBeDisabled();
    expect(buttonVariants({ variant: "ghost", size: "icon-lg" })).toContain("hover:bg-accent");
    expect(buttonVariants({ variant: "secondary", size: "icon-sm" })).toMatch(/bg-secondary.*size-8/);
  });

  it("renders as its child (a link) with asChild", () => {
    render(
      <Button asChild variant="outline">
        <a href="/aqueous/pricing">Pricing</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/aqueous/pricing");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveClass("border", "bg-transparent");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
