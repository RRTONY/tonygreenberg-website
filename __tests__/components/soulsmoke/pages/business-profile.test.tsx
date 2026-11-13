import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BusinessProfile, toBusinessProfile } from "@/components/soulsmoke/pages/business-profile";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { getMyBusinessProfile, saveBusinessProfile } from "@/app/soul-smoke/actions";

vi.mock("@/app/soul-smoke/actions", () => ({
  getMyBusinessProfile: vi.fn(),
  saveBusinessProfile: vi.fn(),
}));

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <BusinessProfile />
    </SoulsmokeProviders>,
  );

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

beforeEach(() => {
  vi.mocked(getMyBusinessProfile).mockResolvedValue({ ok: true, data: null });
});

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
  it("shows a spinner while it checks for a profile, then the form", async () => {
    renderPage();
    expect(screen.getByLabelText("Loading your business profile")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Register Your Business" })).toBeInTheDocument();
  });

  it("asks a signed-out visitor to sign in and come back here", async () => {
    vi.mocked(getMyBusinessProfile).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderPage();
    expect(await screen.findByRole("heading", { level: 1, name: "Business Registration" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In to Register" })).toHaveAttribute(
      "href",
      "/login?next=%2Fsoul-smoke%2Fbusiness",
    );
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/soul-smoke");
  });

  it("registers a business and shows the saved profile", async () => {
    let answer!: (v: Awaited<ReturnType<typeof saveBusinessProfile>>) => void;
    vi.mocked(saveBusinessProfile).mockReturnValue(new Promise((r) => (answer = r)));
    renderPage();
    await screen.findByRole("heading", { level: 1, name: "Register Your Business" });
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

    expect(await screen.findByRole("button", { name: "Creating Profile" })).toBeDisabled();
    answer({
      ok: true,
      data: { ...base, businessName: "Mezcaleria Uno", contactEmail: "ana@uno.bar", city: "Austin", state: "TX", bio: "Agave only.", isVerified: false, createdAt: "" },
    });
    expect(await screen.findByRole("heading", { level: 1, name: "Profile Created!" })).toBeInTheDocument();
    expect(saveBusinessProfile).toHaveBeenCalledWith(
      expect.objectContaining({ businessType: "bar", businessName: "Mezcaleria Uno", annualVolume: "10-50", city: "Austin" }),
    );
    expect(screen.getByText("Email: ana@uno.bar")).toBeInTheDocument();
    expect(screen.getByText("Location: Austin, TX")).toBeInTheDocument();
    expect(screen.getByText("Agave only.")).toBeInTheDocument();
    expect(screen.getByText(/Pending verification/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Discovery Engine" })).toHaveAttribute("href", "/soul-smoke/discovery");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/soul-smoke");
  });

  it("shows a member their saved profile", async () => {
    vi.mocked(getMyBusinessProfile).mockResolvedValue({
      ok: true,
      data: { businessType: "retailer", businessName: "Shop", city: "Reno", isVerified: true, createdAt: "" },
    });
    renderPage();
    expect(await screen.findByRole("heading", { level: 1, name: "Your Business Profile" })).toBeInTheDocument();
    expect(screen.getByText("Location: Reno")).toBeInTheDocument();
    expect(screen.queryByText(/Pending verification/)).toBeNull();
  });

  it("explains a dropped connection instead of spinning forever", async () => {
    vi.mocked(getMyBusinessProfile).mockRejectedValue(new TypeError("Failed to fetch"));
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't reach the server");
  });

  it("shows why it couldn't load or save, and checks the form first", async () => {
    vi.mocked(getMyBusinessProfile).mockResolvedValue({ ok: false, error: "Try again in a minute." });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("Try again in a minute.");
    const form = screen.getByRole("button", { name: "Register My Business" }).closest("form")!;

    // Nothing filled in: the load error clears and each required field says what it needs.
    fireEvent.submit(form);
    expect(await screen.findByText("Pick a business type.")).toHaveAttribute("role", "alert");
    expect(screen.getByText("Add your business name.")).toHaveAttribute("role", "alert");
    expect(screen.queryByText("Try again in a minute.")).toBeNull();
    const name = screen.getByLabelText("Business Name *");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Add your business name.");

    fireEvent.click(screen.getByRole("button", { name: /Importer/ }));
    fireEvent.change(name, { target: { value: "Imp" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } });
    fireEvent.submit(form);
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(screen.queryByText("Pick a business type.")).toBeNull();
    expect(screen.queryByText("Add your business name.")).toBeNull();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(saveBusinessProfile).not.toHaveBeenCalled();

    vi.mocked(saveBusinessProfile).mockResolvedValue({ ok: false, error: "Business name is required" });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "" } });
    fireEvent.submit(form);
    expect(await screen.findByText("Business name is required")).toBeInTheDocument();
  });

  it("names a missing business name as soon as the field is left empty", async () => {
    renderPage();
    const name = await screen.findByLabelText("Business Name *");
    fireEvent.change(name, { target: { value: "   " } });
    fireEvent.blur(name);
    expect(await screen.findByText("Add your business name.")).toBeInTheDocument();
  });

  it("checks a website only when one is given", async () => {
    vi.mocked(saveBusinessProfile).mockResolvedValue({ ok: false, error: "Saved nothing." });
    renderPage();
    await screen.findByRole("heading", { level: 1, name: "Register Your Business" });
    fireEvent.click(screen.getByRole("button", { name: /Distributor/ }));
    fireEvent.change(screen.getByLabelText("Business Name *"), { target: { value: "Dist" } });
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "dist.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Register My Business" }));
    expect(await screen.findByText("Use a web address starting with http.")).toBeInTheDocument();
    expect(saveBusinessProfile).not.toHaveBeenCalled();

    // Left empty (rule 17), the optional website and email don't block the save.
    fireEvent.change(screen.getByLabelText("Website"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Register My Business" }));
    await waitFor(() =>
      expect(saveBusinessProfile).toHaveBeenCalledWith(
        expect.objectContaining({ businessType: "distributor", businessName: "Dist", website: undefined, contactEmail: undefined }),
      ),
    );
    expect(screen.queryByText("Use a web address starting with http.")).toBeNull();
  });

  it("sends a member whose session ran out to the sign-in screen", async () => {
    vi.mocked(saveBusinessProfile).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderPage();
    await screen.findByRole("heading", { level: 1, name: "Register Your Business" });
    fireEvent.click(screen.getByRole("button", { name: /Retailer/ }));
    fireEvent.change(screen.getByLabelText("Business Name *"), { target: { value: "Shop" } });
    fireEvent.click(screen.getByRole("button", { name: "Register My Business" }));
    expect(await screen.findByRole("link", { name: "Sign In to Register" })).toBeInTheDocument();
  });

  it("ignores a late answer after the page is gone", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof getMyBusinessProfile>>) => void;
    vi.mocked(getMyBusinessProfile).mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = renderPage();
    unmount();
    resolve({ ok: true, data: null });
    await Promise.resolve();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
