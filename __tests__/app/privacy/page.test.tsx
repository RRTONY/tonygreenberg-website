import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage, { metadata } from "@/app/privacy/page";

describe("/privacy", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Privacy Policy");
    expect(metadata.description).toMatch(/collects/);
    expect(metadata.alternates?.canonical).toBe("/privacy");
  });

  it("renders one H1 and the contact email as a mailto link", () => {
    render(<PrivacyPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Privacy Policy");
    const mail = screen.getAllByRole("link", { name: "t@ramprate.com" })[0];
    expect(mail).toHaveAttribute("href", "mailto:t@ramprate.com");
  });
});
