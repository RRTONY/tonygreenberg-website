import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { EmailCapture } from "@/components/liquidsun/home/email-capture";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { writeLocalStore } from "@/components/soulsmoke/hooks/use-local-store";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
}));

const fetchMock = vi.fn();

function renderForm() {
  return render(
    <LiquidsunProviders>
      <EmailCapture />
    </LiquidsunProviders>,
  );
}

describe("EmailCapture", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    writeLocalStore("tequila-language", "en", "en");
  });

  it("asks for an email when the box is empty, and for a valid one when it is not", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email address");
    await user.type(screen.getByLabelText("Email address"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(screen.getByLabelText("Email address")).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the Spanish message when the visitor chose ES", async () => {
    writeLocalStore("tequila-language", "es", "en");
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Ingresa un correo válido");
  });

  it("subscribes with the LiquidSun source and shows the welcome panel", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText("Email address"), " fan@example.com ");
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    expect(await screen.findByText("You're in.")).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/subscribe");
    expect(JSON.parse(init.body)).toEqual({ email: "fan@example.com", source: "liquidsun-homepage" });
    expect(toast.success).toHaveBeenCalledWith("Welcome to the resistance. Check your inbox.");
  });

  it("keeps the form and says so when the service refuses or the network drops", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) });
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText("Email address"), "fan@example.com");
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole("button", { name: /Subscribe/ })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /Subscribe/ }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    expect(toast.error).toHaveBeenCalledWith("Something went wrong. Try again.");
    expect(screen.queryByText("You're in.")).not.toBeInTheDocument();
  });
});
