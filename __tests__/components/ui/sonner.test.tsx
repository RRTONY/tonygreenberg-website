import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

describe("Toaster", () => {
  it("shows success and error toasts", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Saved it");
      toast.error("Broke it");
    });
    expect(await screen.findByText("Saved it")).toBeInTheDocument();
    expect(await screen.findByText("Broke it")).toBeInTheDocument();
  });
});
