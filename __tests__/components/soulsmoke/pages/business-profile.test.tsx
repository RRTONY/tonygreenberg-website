import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BUSINESS_PROFILE_KEY, BusinessProfile, toBusinessProfile } from "@/components/soulsmoke/pages/business-profile";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <BusinessProfile />
    </SoulsmokeProviders>,
  );
const saved = () => JSON.parse(window.localStorage.getItem(BUSINESS_PROFILE_KEY) ?? "null");

const base = {
  businessType: "bar" as const,
  businessName: "Bar X",
  contactName: "",
  contactEmail: "",
  phone: "",
  website: "",
  city: "",
  state: "",
  country: "US",
  licenseType: "",
  annualVolume: "",
  focusCategories: "",
  bio: "",
};

describe("toBusinessProfile", () => {
  it("mirrors the server checks", () => {
    expect(toBusinessProfile({ ...base, businessType: "" })).toBeNull();
    expect(toBusinessProfile({ ...base, businessType: "zoo" as never })).toBeNull();
    expect(toBusinessProfile({ ...base, businessName: "  " })).toBeNull();
    expect(toBusinessProfile({ ...base, contactEmail: "not-an-email" })).toBeNull();
    expect(toBusinessProfile({ ...base, contactEmail: "a@b.co" })).toMatchObject({
      businessType: "bar",
      contactEmail: "a@b.co",
      contactName: undefined,
      country: "US",
      isVerified: false,
    });
  });
});

describe("BusinessProfile", () => {
  it("registers a business without an account and shows the saved profile", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Register Your Business" })).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/)).toBeNull();
    expect(screen.getByRole("button", { name: "Register My Business" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Bar \/ Cocktail Lounge/ }));
    expect(screen.getByRole("button", { name: /Bar \/ Cocktail Lounge/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Business Name *"), { target: { value: "Mezcaleria Uno" } });
    fireEvent.change(screen.getByLabelText("Contact Name"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ana@uno.bar" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "555" } });
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "https://uno.bar" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Austin" } });
    fireEvent.change(screen.getByLabelText("State / Province"), { target: { value: "TX" } });
    fireEvent.change(screen.getByLabelText("Annual Volume (estimated cases)"), { target: { value: "10-50" } });
    fireEvent.change(screen.getByLabelText("Tell us about your business"), { target: { value: "Agave only." } });
    fireEvent.click(screen.getByRole("button", { name: "Register My Business" }));

    expect(saved()).toMatchObject({ businessType: "bar", businessName: "Mezcaleria Uno", annualVolume: "10-50", city: "Austin" });
    expect(screen.getByRole("heading", { level: 1, name: "Profile Created!" })).toBeInTheDocument();
    expect(screen.getByText("Email: ana@uno.bar")).toBeInTheDocument();
    expect(screen.getByText("Location: Austin, TX")).toBeInTheDocument();
    expect(screen.getByText("Agave only.")).toBeInTheDocument();
    expect(screen.getByText(/Pending verification/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Discovery Engine" })).toHaveAttribute("href", "/soul-smoke/discovery");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/soul-smoke");
  });

  it("shows a returning visitor their profile", () => {
    window.localStorage.setItem(
      BUSINESS_PROFILE_KEY,
      JSON.stringify({ businessType: "retailer", businessName: "Shop", city: "Reno", isVerified: true, createdAt: "" }),
    );
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Your Business Profile" })).toBeInTheDocument();
    expect(screen.getByText("Location: Reno")).toBeInTheDocument();
    expect(screen.queryByText(/Pending verification/)).toBeNull();
  });

  it("shows the error line when the email is invalid, and nothing when the form is incomplete", () => {
    renderPage();
    const form = screen.getByRole("button", { name: "Register My Business" }).closest("form")!;
    fireEvent.submit(form);
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Importer/ }));
    fireEvent.change(screen.getByLabelText("Business Name *"), { target: { value: "Imp" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } });
    fireEvent.submit(form);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
    expect(saved()).toBeNull();
  });
});
