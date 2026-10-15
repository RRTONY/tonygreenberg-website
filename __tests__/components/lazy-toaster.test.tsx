import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { LazyToaster } from "@/components/lazy-toaster";

describe("LazyToaster", () => {
  it("loads the real toaster and shows a toast", async () => {
    render(<LazyToaster />);
    expect(await screen.findByRole("region", { name: /notifications/i }, { timeout: 5000 })).toBeInTheDocument();
    act(() => {
      toast.success("Saved");
    });
    expect(await screen.findByText("Saved", {}, { timeout: 5000 })).toBeInTheDocument();
  });
});
