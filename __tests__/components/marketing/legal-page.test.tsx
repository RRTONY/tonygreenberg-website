import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalPage, LegalSection } from "@/components/marketing/legal-page";

describe("LegalPage", () => {
  it("renders the eyebrow, one H1, the updated date, intro and sections", () => {
    render(
      <LegalPage eyebrow="Legal" title="Privacy Policy" updated="October 14, 2026" intro={<p>We keep it simple.</p>}>
        <LegalSection title="What we collect">
          <p>Your email, if you give it.</p>
        </LegalSection>
      </LegalPage>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy Policy");
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Last updated October 14, 2026")).toBeInTheDocument();
    expect(screen.getByText("We keep it simple.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What we collect" })).toBeInTheDocument();
    expect(screen.getByText("Your email, if you give it.")).toBeInTheDocument();
  });
});
