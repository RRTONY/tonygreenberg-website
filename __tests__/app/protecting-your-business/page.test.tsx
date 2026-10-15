import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProtectingYourBusinessPage, { metadata } from "@/app/protecting-your-business/page";
import { submitStory } from "@/app/forms/actions";

vi.mock("@/app/forms/actions", () => ({ submitStory: vi.fn() }));
const submit = vi.mocked(submitStory);

describe("/protecting-your-business", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Convicted Embezzler Kristi Klawiter — $46,795 Stolen, Prior NJ Guilty Pleas");
    expect(metadata.description).toMatch(/Monmouth County 17-005347, Morris County 16-002436/);
    expect(metadata.alternates?.canonical).toBe("/protecting-your-business");
  });

  it("renders one H1 and the documented-case summary", () => {
    render(<ProtectingYourBusinessPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "She Had Two Theft Convictions. I Hired Her Anyway. She Stole $46,795.",
    );
    expect(screen.getByText(/This is not an allegation\. This is a paper trail\./)).toBeInTheDocument();
    expect(screen.getAllByText("$46,795").length).toBeGreaterThan(0);
  });

  it("has every numbered section and a table of contents that points at real anchors", () => {
    const { container } = render(<ProtectingYourBusinessPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Chronological Timeline: Every Date, Every Document" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Where to Report Fraud" })).toBeInTheDocument();
    const anchors = [...container.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")!.slice(1));
    expect(anchors.length).toBeGreaterThanOrEqual(13);
    for (const id of anchors) expect(container.querySelector(`#${id}`), id).not.toBeNull();
  });

  it("shows the timeline entries with their sources", () => {
    const { container } = render(<ProtectingYourBusinessPage />);
    expect(container.textContent).toContain("Hired through Braintrust. Presented Kris Management, LLC.");
    expect(container.textContent).toContain("Returned $20,000. Signed promissory note for remaining $26,795.");
  });

  it("offers share links for the case", () => {
    render(<ProtectingYourBusinessPage />);
    const tweets = screen.getAllByRole("link", { name: "X / Twitter" });
    expect(tweets.length).toBeGreaterThan(0);
    for (const a of tweets) expect(a.getAttribute("href")).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?/);
    for (const a of screen.getAllByRole("link", { name: "LinkedIn" })) {
      expect(a.getAttribute("href")).toContain("protecting-your-business");
    }
  });

  it("sends a reader's story from the inline form, tagged with this page", async () => {
    const user = userEvent.setup();
    render(<ProtectingYourBusinessPage />);
    await user.type(screen.getByLabelText(/relationship to the person/i), "Employer");
    await user.type(
      screen.getByLabelText(/what happened/i),
      "Hired a bookkeeper who submitted fake invoices for months before anyone noticed.",
    );
    await user.click(screen.getByRole("button", { name: /Submit Your Story/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Your story has been received.");
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ sourcePage: "protecting-your-business", relationship: "Employer" }),
    );
  });
});
