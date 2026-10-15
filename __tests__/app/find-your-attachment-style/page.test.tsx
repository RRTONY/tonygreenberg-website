import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import FindYourAttachmentStylePage, { metadata } from "@/app/find-your-attachment-style/page";

describe("/find-your-attachment-style", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Find Your Attachment Style");
    expect(metadata.description).toMatch(/attachment style/);
    expect(metadata.alternates?.canonical).toBe("/find-your-attachment-style");
  });

  it("renders exactly one H1 with the assessment's name", () => {
    render(<FindYourAttachmentStylePage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Find Your Attachment Style/);
  });

  it("shows the real intro copy in the first render", () => {
    const { container } = render(<FindYourAttachmentStylePage />);
    expect(container).toHaveTextContent("How you love is how you were loved.");
    expect(container).toHaveTextContent("Secure, anxious, avoidant, or disorganized");
  });

  it("offers a way to start or move through the questions", () => {
    render(<FindYourAttachmentStylePage />);
    expect(screen.getAllByRole("button", { name: "Begin Assessment" }).length).toBeGreaterThan(0);
  });

  it("links on to the next places to go", () => {
    render(<FindYourAttachmentStylePage />);
    expect(screen.getAllByRole("link", { name: new RegExp("Take Another Assessment") })[0]).toHaveAttribute("href", "/find-my");
    expect(screen.getAllByRole("link", { name: new RegExp("Read Related Essays") })[0]).toHaveAttribute("href", "/blog");
    expect(screen.getAllByRole("link", { name: new RegExp("Explore the Ecosystem") })[0]).toHaveAttribute("href", "/ecosystem");
  });
});
