import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrescriptionWizard } from "@/components/brewsoul/prescription-wizard";

type Choices = {
  genetics?: RegExp;
  wake?: string;
  cups?: string;
  sleep?: RegExp;
  pregnant?: boolean;
  health?: RegExp[];
  flavor?: RegExp[];
  budget?: RegExp;
};

async function walk(user: ReturnType<typeof userEvent.setup>, c: Choices = {}) {
  if (c.genetics) await user.click(screen.getByRole("button", { name: c.genetics }));
  await user.click(screen.getByRole("button", { name: /^Next/ }));
  if (c.wake) await user.click(screen.getByRole("button", { name: `${c.wake} AM` }));
  if (c.cups) await user.click(screen.getByRole("button", { name: c.cups }));
  if (c.sleep) await user.click(screen.getByRole("button", { name: c.sleep }));
  if (c.pregnant) await user.click(screen.getByLabelText("Currently pregnant or breastfeeding"));
  await user.click(screen.getByRole("button", { name: /^Next/ }));
  for (const h of c.health ?? [/Longevity/]) await user.click(screen.getByRole("button", { name: h }));
  await user.click(screen.getByRole("button", { name: /^Next/ }));
  for (const f of c.flavor ?? [/Chocolate/]) await user.click(screen.getByRole("button", { name: f }));
  await user.click(screen.getByRole("button", { name: /^Next/ }));
  if (c.budget) await user.click(screen.getByRole("button", { name: c.budget }));
  await user.click(screen.getByRole("button", { name: /Get Prescription/ }));
}

const headline = () => screen.getByRole("heading", { level: 2 }).textContent;

describe("PrescriptionWizard", () => {
  it("starts on the genetics question with one H1 and no Back button", () => {
    render(<PrescriptionWizard />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("How does caffeine affect you?");
    expect(screen.queryByRole("button", { name: /Back/ })).not.toBeInTheDocument();
  });

  it("won't move past health or flavor until something is picked", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await user.click(screen.getByRole("button", { name: /^Next/ }));
    await user.click(screen.getByRole("button", { name: /^Next/ }));
    expect(screen.getByRole("button", { name: /^Next/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Liver protection/ }));
    expect(screen.getByRole("button", { name: /^Next/ })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: /Liver protection/ }));
    expect(screen.getByRole("button", { name: /^Next/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("When do you wake up?");
  });

  it("with the defaults (3 cups, protect sleep, mid budget) prescribes 2 caf + 1 decaf at ~$3.30/day", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user);
    expect(headline()).toBe("2 Caf + 1 Decaf · Medium Roast");
    expect(screen.getByText("~$3.30/day")).toBeInTheDocument();
    expect(screen.getByText("First cup: 8:30-9:30 AM")).toBeInTheDocument();
    const picks = screen.getAllByRole("link").map((a) => a.textContent ?? "");
    expect(picks.some((t) => t.startsWith("Holistic Roasters") && t.includes("BEST-IN-CLASS"))).toBe(true);
    expect(picks.some((t) => t.startsWith("Cafe Altura"))).toBe(true);
    expect(picks.some((t) => t.startsWith("Holistic Roasters Biodynamic Decaf"))).toBe(true);
    expect(screen.queryByText(/WHO recommends/)).not.toBeInTheDocument();
  });

  it("limits a pregnant visitor to one caffeinated cup and says why", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { cups: "4", pregnant: true });
    expect(headline()).toBe("1 Caf + 3 Decaf · Medium Roast");
    expect(screen.getByText(/WHO recommends <200mg caffeine\/day during pregnancy/)).toBeInTheDocument();
  });

  it("caps a slow metabolizer at 2 caffeinated cups with a warning", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { genetics: /One cup makes me jittery/, wake: "6:00", cups: "4", sleep: /Not a concern/ });
    expect(headline()).toBe("2 Caf + 2 Decaf · Medium Roast");
    expect(screen.getByText(/As a slow metabolizer/)).toBeInTheDocument();
    expect(screen.getByText("Decaf: After 11:00")).toBeInTheDocument();
  });

  it("anxiety relief drops to one caffeinated cup with a warning; antioxidants pick light-medium and Purity Coffee", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { health: [/Reduce anxiety/, /Maximum antioxidants/] });
    expect(headline()).toMatch(/^1 Caf \+ \d Decaf · Light-Medium Roast$/);
    expect(screen.getByText(/Caffeine amplifies anxiety/)).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((a) => a.textContent?.startsWith("Purity Coffee"))).toBe(true);
  });

  it.fails("BUG: anxiety relief keeps the visitor's total cups (3 a day becomes 1 caf + 2 decaf, but the wizard prescribes 1 + 1)", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { health: [/Reduce anxiety/] });
    expect(headline()).toBe("1 Caf + 2 Decaf · Medium Roast");
  });

  it("bold flavours get a medium-dark roast, and the value budget swaps in budget brands", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { flavor: [/Bold/], budget: /^Value/ });
    expect(headline()).toContain("Medium-Dark Roast");
    const picks = screen.getAllByRole("link").map((a) => a.textContent ?? "");
    expect(picks.some((t) => t.startsWith("Subtle Earth Organic"))).toBe(true);
    expect(picks.some((t) => t.startsWith("Allegro Coffee Decaf"))).toBe(true);
    expect(picks.some((t) => t.startsWith("Holistic Roasters"))).toBe(false);
  });

  it("Start Over returns to the first question with the defaults", async () => {
    const user = userEvent.setup();
    render(<PrescriptionWizard />);
    await walk(user, { cups: "5" });
    await user.click(screen.getByRole("button", { name: "Start Over" }));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("How does caffeine affect you?");
    await user.click(screen.getByRole("button", { name: /^Next/ }));
    expect(screen.getByRole("button", { name: "3" }).className).toContain("border-2");
  });
});
