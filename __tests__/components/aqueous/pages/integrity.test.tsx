import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import {
  Integrity,
  coCreators,
  getBarClass,
  getGradeClass,
  getRevenueLabel,
  getScienceLabel,
  universalQuestions,
} from "@/components/aqueous/pages/integrity";

vi.mock("sonner", () => ({ toast: vi.fn() }));
vi.mock("@/components/aqueous/share-button", () => ({
  ShareButton: () => <button type="button">share</button>,
  FloatingShare: () => <div data-testid="floating-share" />,
}));

describe("Integrity helpers", () => {
  it("map every revenue model, science backing, grade and score to the app's colors", () => {
    expect(getRevenueLabel("ad-driven")).toEqual({ label: "Ad-Driven", badge: "bg-[#C75B3915] text-[#C75B39]" });
    expect(getRevenueLabel("subscription").label).toBe("Subscription");
    expect(getRevenueLabel("affiliate").label).toBe("Affiliate Revenue");
    expect(getRevenueLabel("nonprofit").badge).toContain("#0A8754");
    expect(getRevenueLabel("freemium").label).toBe("Freemium");
    expect(getRevenueLabel("mixed").badge).toContain("#9B2335");
    expect(getScienceLabel("peer-reviewed").label).toBe("Peer-Reviewed");
    expect(getScienceLabel("partial").label).toBe("Partially Backed");
    expect(getScienceLabel("opinion-based").badge).toContain("#C75B39");
    expect(getScienceLabel("unknown").label).toBe("Unknown");
    expect(["A", "B", "C", "D", "F", "Unrated"].map(getGradeClass)).toEqual([
      "text-[#0A8754]",
      "text-[#4ECDC4]",
      "text-[#B87333]",
      "text-[#C75B39]",
      "text-[#9B2335]",
      "text-[#888]",
    ]);
    expect(getBarClass(78)).toContain("bg-[#0A8754]");
    expect(getBarClass(55)).toContain("bg-[#B87333]");
    expect(getBarClass(35)).toContain("bg-[#C75B39]");
  });
});

describe("Integrity", () => {
  it("renders the self-assessment, all 15 questions with their answers in the DOM, and every co-creator", () => {
    const { container } = render(<Integrity />);
    expect(screen.getByRole("heading", { level: 1, name: /The Open\s*Integrity Protocol/ })).toBeInTheDocument();
    expect(screen.getByText("We Go First: Aqueous Self-Assessment")).toBeInTheDocument();
    expect(universalQuestions).toHaveLength(15);
    for (const q of universalQuestions) expect(screen.getByText(q.why)).toBeInTheDocument();
    for (const c of coCreators) {
      expect(screen.getByRole("button", { name: c.name })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: c.name, hidden: true })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('[style*="width"]')).toHaveLength(coCreators.length);
    expect(screen.getByRole("link", { name: "Read Our Manifesto" })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByRole("link", { name: "Collective Consciousness Map" })).toHaveAttribute("href", "/aqueous/landscape");
    expect(screen.getByRole("link", { name: /Audit Our Methodology/ })).toHaveAttribute("href", "/aqueous/methodology");
  });

  it("filters questions by category and opens a question's answer", () => {
    render(<Integrity />);
    fireEvent.click(screen.getByRole("button", { name: "Revenue" }));
    expect(screen.getByRole("button", { name: "Revenue" })).toHaveAttribute("aria-pressed", "true");
    const questionButtons = screen.getAllByRole("button", { expanded: false }).filter((b) => /Q\d+/.test(b.textContent ?? ""));
    expect(questionButtons).toHaveLength(2);

    const q2 = screen.getByRole("button", { name: /Q2/ });
    const answer = screen.getByText(universalQuestions[1].why).closest("div");
    expect(answer).toHaveClass("hidden");
    fireEvent.click(q2);
    expect(q2).toHaveAttribute("aria-expanded", "true");
    expect(answer).not.toHaveClass("hidden");
    fireEvent.click(q2);
    expect(q2).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "All Questions" }));
    expect(screen.getByText(universalQuestions[14].question)).toBeInTheDocument();
  });

  it("opens one co-creator's details from its row and closes it again", () => {
    render(<Integrity />);
    const ewg = screen.getByRole("button", { name: "EWG Tap Water Database" });
    const card = document.getElementById("integrity-ewg");
    expect(card).toHaveClass("hidden");
    fireEvent.click(ewg);
    expect(ewg).toHaveAttribute("aria-expanded", "true");
    expect(card).not.toHaveClass("hidden");
    expect(document.getElementById("integrity-oasis")).toHaveClass("hidden");
    fireEvent.click(ewg.closest("tr")!);
    expect(card).toHaveClass("hidden");
  });

  it("shows the coming-soon toast for Submit Your Response", () => {
    render(<Integrity />);
    fireEvent.click(screen.getByRole("button", { name: /Submit Your Response/ }));
    expect(toast).toHaveBeenCalledWith("Response portal coming soon — thank you for your willingness!");
  });
});
