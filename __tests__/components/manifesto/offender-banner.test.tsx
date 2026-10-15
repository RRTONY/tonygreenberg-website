import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OffenderBanner } from "@/components/manifesto/offender-banner";

describe("OffenderBanner", () => {
  it("names the offender and points to the Report section", () => {
    render(<OffenderBanner offender="Spamco" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Spamco");
    expect(screen.getByText(/has been called/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Report A Spammer" })).toHaveAttribute("href", "#report");
  });

  it("goes away when dismissed", async () => {
    const { container } = render(<OffenderBanner offender="Spamco" />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the name as text, not HTML", () => {
    render(<OffenderBanner offender="<b>x</b>" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("<b>x</b>");
  });
});
