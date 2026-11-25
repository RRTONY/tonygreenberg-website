import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { SakeProducers, producerMailto, producerSchema, type ProducerValues } from "@/components/sake/pages/producers";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const VALID: ProducerValues = {
  type: "distributor",
  breweryName: "Dassai",
  breweryNameJa: "獺祭",
  prefecture: "Yamaguchi",
  contactName: "Aiko",
  email: "aiko@example.com",
  website: "",
  message: "Hello",
};

describe("producer form helpers", () => {
  it("accepts an empty website and rejects a bad one", async () => {
    await expect(producerSchema.validate(VALID)).resolves.toBeTruthy();
    await expect(producerSchema.validate({ ...VALID, website: "dassai" })).rejects.toThrow(/web address/);
  });

  it("builds the email to Tony with the filled fields", () => {
    const href = producerMailto({ ...VALID, website: "https://dassai.com" });
    expect(href.startsWith("mailto:tony@tonygreenberg.com?subject=Producer%20application%3A%20Dassai")).toBe(true);
    const body = decodeURIComponent(href.split("&body=")[1]);
    expect(body).toContain("I am a: Distributor");
    expect(body).toContain("Website: https://dassai.com");
    expect(producerMailto({ ...VALID, breweryNameJa: "", message: "" })).not.toContain("%E7%8D%BA");
  });
});

describe("SakeProducers", () => {
  it("switches tabs and shows the benefits and story prompts", async () => {
    const user = userEvent.setup();
    renderSake(<SakeProducers />);
    expect(screen.getByRole("heading", { level: 1, name: "Producer Portal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EXV™ Scoring" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Share Stories" }));
    expect(screen.getByRole("tab", { name: "Share Stories" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "The Kura" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Start Here/ }));
    expect(screen.getByRole("heading", { name: "Producer Application" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Why Join" }));
    await user.click(screen.getByRole("button", { name: /Apply Now/ }));
    expect(screen.getByRole("heading", { name: "Producer Application" })).toBeInTheDocument();
  });

  it("validates the application, then opens the email and says so", async () => {
    const user = userEvent.setup();
    renderSake(<SakeProducers />);
    await user.click(screen.getByRole("tab", { name: "Apply" }));
    await user.click(screen.getByRole("button", { name: /Submit Application/ }));
    expect((await screen.findAllByText("Required")).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("radio", { name: "Retailer / Bar" }));
    expect(screen.getByRole("radio", { name: "Retailer / Bar" })).toHaveAttribute("aria-checked", "true");
    await user.type(screen.getByLabelText("Brewery Name (English)"), "Dassai");
    await user.type(screen.getByLabelText("Prefecture"), "Yamaguchi");
    await user.type(screen.getByLabelText("Contact Name"), "Aiko");
    await user.type(screen.getByLabelText("Email"), "aiko@example.com");
    await user.click(screen.getByRole("button", { name: /Submit Application/ }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(String(vi.mocked(toast.success).mock.calls[0][0])).toMatch(/email app is opening/);
  });

  it("uses the Austere look", async () => {
    const user = userEvent.setup();
    renderSake(<SakeProducers />);
    await user.click(screen.getByTestId("toggle-austere"));
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("font-light");
  });
});
