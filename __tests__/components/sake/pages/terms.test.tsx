import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeTerms } from "@/components/sake/pages/terms";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeTerms />
    </SakeProviders>,
  );

describe("SakeTerms", () => {
  it("renders the six sections word for word", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeInTheDocument();
    for (const h of ["Intellectual Property Rights", "Prohibited Activities", "Monitoring & Enforcement", "Permitted Sharing", "Trademarks", "DMCA Policy"]) {
      expect(screen.getByRole("heading", { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByText(/Last updated: 2026/)).toBeInTheDocument();
  });
});
