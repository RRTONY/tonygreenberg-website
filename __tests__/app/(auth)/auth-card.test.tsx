import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthCard } from "@/app/(auth)/auth-card";

describe("AuthCard", () => {
  it("shows the title as the page's only H1, the description and the children", () => {
    render(
      <AuthCard title="Sign in" description="Your saved highlights.">
        <p>form here</p>
      </AuthCard>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sign in");
    expect(screen.getByText("Your saved highlights.")).toBeInTheDocument();
    expect(screen.getByText("form here")).toBeInTheDocument();
  });

  it("renders the footer only when one is given", () => {
    const { rerender } = render(<AuthCard title="T" description="D">x</AuthCard>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    rerender(
      <AuthCard title="T" description="D" footer={<a href="/login">Back</a>}>
        x
      </AuthCard>,
    );
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute("href", "/login");
  });
});
