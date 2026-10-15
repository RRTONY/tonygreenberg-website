import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepReceived } from "@/components/supplier-intake/components/step-received";
import type { StepProps } from "@/components/supplier-intake/supplier-intake";

const intake = (supplierId?: string) => ({ supplierId }) as unknown as StepProps["intake"];

describe("StepReceived", () => {
  it("announces the application was received and links home", () => {
    render(<StepReceived intake={intake("SUP-9")} />);
    expect(screen.getByRole("status")).toHaveTextContent("Application Received");
    expect(screen.getByText(/We review every submission/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute("href", "/");
  });

  it("shows the reference when there is one", () => {
    render(<StepReceived intake={intake("SUP-9")} />);
    expect(screen.getByText("Reference: SUP-9")).toBeInTheDocument();
  });

  it("hides the reference line when there isn't", () => {
    render(<StepReceived intake={intake()} />);
    expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
  });
});
