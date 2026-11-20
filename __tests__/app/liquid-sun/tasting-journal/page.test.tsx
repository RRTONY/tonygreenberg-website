import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/liquid-sun/tasting-journal/page";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
  listLogEntries: vi.fn(),
  addLogEntry: vi.fn(),
  deleteLogEntry: vi.fn(),
}));

describe("/liquid-sun/tasting-journal page", () => {
  it("uses the page's heading and intro as its title and description", () => {
    expect(metadata.title).toBe("The Log | LiquidSun");
    expect(metadata.alternates?.canonical).toBe("/liquid-sun/tasting-journal");
  });

  it("renders the ported page", () => {
    render(
      <LiquidsunProviders>
        <Page />
      </LiquidsunProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Log");
  });
});
