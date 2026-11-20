import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SUBMITTED_MS, TheAssholes, receipts, roasts } from "@/components/liquidsun/pages/the-assholes";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

const renderPage = () =>
  render(
    <LiquidsunProviders>
      <TheAssholes />
    </LiquidsunProviders>,
  );

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.removeItem("tequila-language");
});

describe("TheAssholes", () => {
  it("shows the receipts, the roasts and Patron's purgatory", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "THE ASSHOLES" })).toBeInTheDocument();
    for (const r of receipts) expect(screen.getByRole("heading", { name: r.name })).toBeInTheDocument();
    for (const r of roasts) expect(screen.getByText(r.author)).toBeInTheDocument();
    expect(screen.getByText("Respectable, but Poor Value (Low EVI)")).toBeInTheDocument();
  });

  it("asks for a brand name before reporting (English and Spanish)", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Report Brand/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Name the brand.");
  });

  it("checks the evidence length and speaks Spanish when the visitor chose it", async () => {
    window.localStorage.setItem("tequila-language", JSON.stringify("es"));
    renderPage();
    fireEvent.change(screen.getByLabelText("Evidence (Optional)"), { target: { value: "x".repeat(2001) } });
    fireEvent.click(screen.getByRole("button", { name: /Report Brand/ }));
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.map((a) => a.textContent)).toEqual(
      expect.arrayContaining(["Nombra la marca.", "Debe tener menos de 2,000 caracteres."]),
    );
  });

  it("thanks the reporter, then brings the empty form back after 3 seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderPage();
    fireEvent.change(screen.getByLabelText("Brand Name"), { target: { value: "Fake Juice Reposado" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Additives" }));
    fireEvent.click(screen.getByRole("button", { name: /Report Brand/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Submission Received");

    await act(async () => {
      vi.advanceTimersByTime(SUBMITTED_MS);
    });
    // The thank-you fades out (300ms) before the form comes back.
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByText("Submission Received")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Brand Name")).toHaveValue("");
  });
});
