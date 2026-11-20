import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { Partner } from "@/components/liquidsun/pages/partner";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { getLiquidsunMember, submitPartnerInquiry, type LiquidsunMember } from "@/app/liquid-sun/actions";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn(), submitPartnerInquiry: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const member = (signedIn: boolean): LiquidsunMember => ({
  signedIn,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
});

const renderPage = () =>
  render(
    <LiquidsunProviders>
      <Partner />
    </LiquidsunProviders>,
  );

async function fill(values: Partial<Record<"brand" | "nom" | "contact" | "email" | "website" | "message", string>>) {
  const fields = {
    brand: "Brand Name *",
    nom: "NOM Number",
    contact: "Contact Name *",
    email: "Email *",
    website: "Brand Website",
    message: "Why should LiquidSun feature your brand?",
  } as const;
  for (const [key, label] of Object.entries(fields)) {
    const value = values[key as keyof typeof fields];
    if (value !== undefined) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

const submit = () => userEvent.click(screen.getByRole("button", { name: /Submit Partnership Inquiry/ }));

beforeEach(() => {
  vi.mocked(getLiquidsunMember).mockResolvedValue(member(true));
  vi.mocked(submitPartnerInquiry).mockResolvedValue({ ok: true, data: null });
});

describe("Partner", () => {
  it("shows the hero, stats and three tiers, Featured selected", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Become a Partner");
    expect(screen.getByText("50K+")).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Selected")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: /Altar Selection/ }));
    expect(screen.getByRole("radio", { name: /Altar Selection/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /^Featured/ })).toHaveAttribute("aria-checked", "false");
  });

  it("shows a sign-in box instead of the form to a signed-out visitor", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member(false));
    renderPage();
    expect(await screen.findByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login?next=/liquid-sun/partner");
    expect(screen.queryByLabelText("Brand Name *")).not.toBeInTheDocument();
  });

  it("shows each required field's error inline and sends nothing", async () => {
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await submit();
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.map((a) => a.textContent)).toEqual([
      "Please fill in all required fields.",
      "Please fill in all required fields.",
      "Enter a valid email address",
    ]);
    expect(screen.getByLabelText("Brand Name *")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Brand Name *")).toHaveAttribute("aria-describedby", "partner-brandName-error");
    expect(submitPartnerInquiry).not.toHaveBeenCalled();
  });

  it.each([
    ["email", { email: "nope" }, "Enter a valid email address"],
    ["website", { website: "yourbrand.com" }, "Start the website with http:// or https://"],
    ["NOM", { nom: "1".repeat(33) }, "Keep this under 32 characters."],
    ["message", { message: "x".repeat(5001) }, "Keep this under 5,000 characters."],
  ])("rejects a bad %s", async (_label, change, message) => {
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await fill({ brand: "Fortaleza", contact: "Guillermo", email: "g@fortaleza.mx", ...change });
    await submit();
    expect(await screen.findByText(message)).toHaveAttribute("role", "alert");
    expect(submitPartnerInquiry).not.toHaveBeenCalled();
  });

  it("shows Spanish messages when the site is in Spanish", async () => {
    window.localStorage.setItem("tequila-language", JSON.stringify("es"));
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await submit();
    expect((await screen.findAllByText("Completa todos los campos obligatorios.")).length).toBe(2);
    expect(screen.getByText("Ingresa un correo válido")).toBeInTheDocument();
  });

  it("sends a valid inquiry with the chosen tier and thanks the brand", async () => {
    let finish!: (v: { ok: true; data: null }) => void;
    vi.mocked(submitPartnerInquiry).mockReturnValueOnce(new Promise((r) => (finish = r)));
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await userEvent.click(screen.getByRole("radio", { name: /Spotlight Partner/ }));
    await fill({ brand: "Fortaleza", contact: "Guillermo", email: "g@fortaleza.mx", website: "", nom: "", message: "Tahona." });
    await submit();
    await waitFor(() => expect(screen.getByRole("button", { name: /Submit Partnership Inquiry/ })).toBeDisabled());
    expect(screen.getByRole("button", { name: /Submit Partnership Inquiry/ })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: /Submit Partnership Inquiry/ }).querySelector(".animate-spin")).not.toBeNull();
    finish({ ok: true, data: null });
    expect(await screen.findByRole("heading", { name: "Inquiry Received" })).toBeInTheDocument();
    expect(submitPartnerInquiry).toHaveBeenCalledWith({
      brandName: "Fortaleza",
      contactName: "Guillermo",
      contactEmail: "g@fortaleza.mx",
      nom: "",
      website: "",
      message: "Tahona.",
      tierInterest: "spotlight",
    });
    expect(toast.success).toHaveBeenCalledWith("Inquiry submitted! We'll be in touch within 48 hours.");
  });

  it("shows the server's error and keeps the form", async () => {
    vi.mocked(submitPartnerInquiry).mockResolvedValueOnce({ ok: false, error: "That's a lot at once." });
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await fill({ brand: "Fortaleza", contact: "Guillermo", email: "g@fortaleza.mx" });
    await submit();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("That's a lot at once."));
    expect(screen.getByLabelText("Brand Name *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Partnership Inquiry/ })).toBeEnabled();
  });

  it("handles an empty server error and a dropped connection", async () => {
    vi.mocked(submitPartnerInquiry).mockResolvedValueOnce({ ok: false, error: "" }).mockRejectedValueOnce(new Error("offline"));
    renderPage();
    await screen.findByLabelText("Brand Name *");
    await fill({ brand: "Fortaleza", contact: "Guillermo", email: "g@fortaleza.mx" });
    await submit();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again."));
    await submit();
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
  });
});
