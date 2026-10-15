import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClinicRankings, type Clinic } from "@/components/marketing/clinic-rankings";

const clinic = (over: Partial<Clinic>): Clinic => ({
  name: "C",
  url: "https://c.example",
  questions: 10,
  score: 50,
  type: "Telehealth",
  contraindications: true,
  goals: true,
  personalized: true,
  evidence: false,
  medicalHistory: true,
  disclaimer: true,
  weaknesses: "Thin evidence.",
  strengths: "",
  ...over,
});

const CLINICS = [
  clinic({ name: "Bravo Clinic", score: 85, questions: 5 }),
  clinic({ name: "Alpha Health", score: 15, questions: 0, strengths: "Great screening." }),
  clinic({ name: "Charlie Rx", score: 40, questions: 30 }),
];
const order = () =>
  screen.getAllByRole("button").filter((b) => /Clinic|Health|Rx/.test(b.textContent ?? "")).map((b) => b.textContent!.match(/(Bravo Clinic|Alpha Health|Charlie Rx)/)![1]);

describe("ClinicRankings", () => {
  it("ranks by score (lowest risk first) with labels", () => {
    render(<ClinicRankings clinics={CLINICS} />);
    expect(order()).toEqual(["Alpha Health", "Charlie Rx", "Bravo Clinic"]);
    expect(screen.getByText("15/100 · Excellent")).toBeInTheDocument();
    expect(screen.getByText("85/100 · Failing")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText(/No assessment/)).toBeInTheDocument();
  });

  it("re-sorts by questions and by name", async () => {
    const user = userEvent.setup();
    render(<ClinicRankings clinics={CLINICS} />);
    await user.click(screen.getByRole("button", { name: "By Questions" }));
    expect(order()).toEqual(["Charlie Rx", "Bravo Clinic", "Alpha Health"]);
    expect(screen.queryByText("#1")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "By Name" }));
    expect(order()).toEqual(["Alpha Health", "Bravo Clinic", "Charlie Rx"]);
  });

  it("expands a clinic to show strengths, weaknesses, criteria and its site", async () => {
    const user = userEvent.setup();
    render(<ClinicRankings clinics={CLINICS} />);
    await user.click(screen.getByRole("button", { name: /Bravo Clinic/ }));
    expect(screen.getByText("Thin evidence.")).toBeInTheDocument();
    expect(screen.getByText("None identified.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Visit Site/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Fails:").parentElement).toHaveTextContent("Fails:Cites Evidence");
    await user.click(screen.getByRole("button", { name: /Bravo Clinic/ }));
    expect(screen.queryByText("Thin evidence.")).not.toBeInTheDocument();
  });

  it("the expand button tells screen readers whether it is open (aria-expanded)", () => {
    render(<ClinicRankings clinics={CLINICS} />);
    expect(screen.getByRole("button", { name: /Bravo Clinic/ })).toHaveAttribute("aria-expanded", "false");
  });
});
