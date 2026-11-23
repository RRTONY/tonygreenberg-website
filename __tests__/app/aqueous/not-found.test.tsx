import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AqueousNotFoundPage from "@/app/aqueous/not-found";

describe("/aqueous not-found", () => {
  it("renders the Aqueous 404", () => {
    render(<AqueousNotFoundPage />);
    expect(screen.getByRole("heading", { name: "Lost in the Current" })).toBeInTheDocument();
  });
});
