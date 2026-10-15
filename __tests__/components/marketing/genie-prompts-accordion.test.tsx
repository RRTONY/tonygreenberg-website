import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GeniePromptsAccordion, type GeniePrompt } from "@/components/marketing/genie-prompts-accordion";

const base: Omit<GeniePrompt, "id" | "link" | "clientAsk"> = {
  door: "01",
  domain: "Cloud",
  target: "Jane Doe",
  title: "CTO",
  company: "Acme",
  whyCare: "Because it saves money.",
  outcome: "A warm intro.",
};
const PROMPTS: GeniePrompt[] = [
  { ...base, id: 1, clientAsk: "Get me to the CTO", link: "/engage" },
  { ...base, id: 2, clientAsk: "Find me a partner", link: "https://ramprate.com" },
];

describe("GeniePromptsAccordion", () => {
  it("shows each client ask as a trigger", () => {
    render(<GeniePromptsAccordion prompts={PROMPTS} />);
    expect(screen.getByRole("button", { name: /Get me to the CTO/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /Find me a partner/ })).toBeInTheDocument();
  });

  it("keeps the closed details and links in the HTML (forceMount)", () => {
    const { container } = render(<GeniePromptsAccordion prompts={PROMPTS} />);
    expect(container.querySelector('a[href="/engage"]')).not.toBeNull();
    const ext = container.querySelector('a[href="https://ramprate.com"]');
    expect(ext).toHaveAttribute("target", "_blank");
    expect(ext).toHaveAttribute("rel", "noopener noreferrer");
    expect(container).toHaveTextContent("Because it saves money.");
    expect(container).toHaveTextContent("CTO, Acme");
  });

  it("opens one prompt at a time", async () => {
    const user = userEvent.setup();
    render(<GeniePromptsAccordion prompts={PROMPTS} />);
    await user.click(screen.getByRole("button", { name: /Get me to the CTO/ }));
    expect(screen.getByRole("button", { name: /Get me to the CTO/ })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: /Find me a partner/ }));
    expect(screen.getByRole("button", { name: /Get me to the CTO/ })).toHaveAttribute("aria-expanded", "false");
  });
});
