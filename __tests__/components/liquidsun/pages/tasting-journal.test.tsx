import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { TastingJournal } from "@/components/liquidsun/pages/tasting-journal";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import {
  addLogEntry,
  deleteLogEntry,
  getLiquidsunMember,
  listLogEntries,
  type LiquidsunMember,
  type LogEntry,
} from "@/app/liquid-sun/actions";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(),
  listLogEntries: vi.fn(),
  addLogEntry: vi.fn(),
  deleteLogEntry: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const member = (signedIn: boolean): LiquidsunMember => ({
  signedIn,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
});

const saved: LogEntry = { id: "11", producerId: "fortaleza-blanco", rating: 4, notes: "Olive brine", date: "2026-11-20T10:00:00Z" };

const renderPage = () =>
  render(
    <LiquidsunProviders>
      <TastingJournal />
    </LiquidsunProviders>,
  );

// "Log It" waits for the account check (and a member's list) before it can be pressed.
const logIt = async () => {
  await waitFor(() => expect(screen.getByRole("button", { name: /Log It/ })).toBeEnabled());
  await userEvent.click(screen.getByRole("button", { name: /Log It/ }));
};

beforeEach(() => {
  vi.mocked(getLiquidsunMember).mockResolvedValue(member(true));
  vi.mocked(listLogEntries).mockResolvedValue({ ok: true, data: [saved] });
  vi.mocked(deleteLogEntry).mockResolvedValue({ ok: true, data: null });
});

describe("TastingJournal (The Log)", () => {
  it("loads a signed-in member's saved entries", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Log");
    expect(await screen.findByRole("heading", { name: "Fortaleza" })).toBeInTheDocument();
    expect(screen.getByText("Olive brine")).toBeInTheDocument();
    expect(screen.getByLabelText("4 of 5 stars")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("shows the blank page when there is nothing yet, and list errors", async () => {
    vi.mocked(listLogEntries).mockResolvedValueOnce({ ok: false, error: "This couldn't be saved just now." });
    renderPage();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("This couldn't be saved just now."));
    expect(screen.getByText("The page is blank. Start drinking.")).toBeInTheDocument();
  });

  it("says so when the server can't be reached", async () => {
    vi.mocked(listLogEntries).mockRejectedValueOnce(new Error("offline"));
    renderPage();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Couldn't reach the server")));
  });

  it("needs a rating or a note before logging", async () => {
    renderPage();
    await screen.findByText("Olive brine");
    await logIt();
    expect(await screen.findByRole("alert")).toHaveTextContent("Add a rating or a note first.");
    expect(screen.getByLabelText("Notes")).toHaveAttribute("aria-invalid", "true");
    expect(addLogEntry).not.toHaveBeenCalled();
  });

  it("rejects a note over 5,000 characters", async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "x".repeat(5001) } });
    await logIt();
    expect(await screen.findByRole("alert")).toHaveTextContent("Keep this under 5,000 characters.");
  });

  it("rejects a spirit that isn't on the list", async () => {
    renderPage();
    const select = screen.getByLabelText("Spirit") as HTMLSelectElement;
    const bogus = document.createElement("option");
    bogus.value = "vodka";
    select.appendChild(bogus);
    fireEvent.change(select, { target: { value: "vodka" } });
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "x" } });
    await logIt();
    expect(await screen.findByText("Choose a spirit from the list.")).toHaveAttribute("role", "alert");
  });

  it("saves a member's entry and puts it on top", async () => {
    vi.mocked(addLogEntry).mockResolvedValueOnce({
      ok: true,
      data: { id: "12", producerId: "g4-blanco", rating: 5, notes: "Rain", date: "not a date" },
    });
    renderPage();
    await screen.findByText("Olive brine");
    fireEvent.change(screen.getByLabelText("Spirit"), { target: { value: "g4-blanco" } });
    await userEvent.click(screen.getByRole("button", { name: "5 of 5" }));
    expect(screen.getByRole("button", { name: "5 of 5" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Rain" } });
    await logIt();
    await waitFor(() => expect(addLogEntry).toHaveBeenCalledWith({ producerId: "g4-blanco", rating: 5, notes: "Rain" }));
    expect(await screen.findByText("Rain")).toBeInTheDocument();
    expect(screen.getByText("not a date")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toHaveValue("");
  });

  it("shows a save error and a dropped connection", async () => {
    vi.mocked(addLogEntry)
      .mockResolvedValueOnce({ ok: false, error: "That's a lot at once." })
      .mockRejectedValueOnce(new Error("offline"));
    renderPage();
    await screen.findByText("Olive brine");
    await userEvent.click(screen.getByRole("button", { name: "3 of 5" }));
    await logIt();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("That's a lot at once."));
    await logIt();
    await waitFor(() => expect(toast.error).toHaveBeenLastCalledWith(expect.stringContaining("Couldn't reach the server")));
  });

  it("deletes a saved entry on the server", async () => {
    renderPage();
    await screen.findByText("Olive brine");
    await userEvent.click(screen.getByRole("button", { name: "Delete Fortaleza entry" }));
    await waitFor(() => expect(screen.queryByText("Olive brine")).not.toBeInTheDocument());
    expect(deleteLogEntry).toHaveBeenCalledWith("11");
  });

  it("keeps the entry when deleting fails", async () => {
    vi.mocked(deleteLogEntry).mockResolvedValueOnce({ ok: false, error: "Nope" }).mockRejectedValueOnce(new Error("offline"));
    renderPage();
    await screen.findByText("Olive brine");
    await userEvent.click(screen.getByRole("button", { name: "Delete Fortaleza entry" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Nope"));
    await userEvent.click(screen.getByRole("button", { name: "Delete Fortaleza entry" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Olive brine")).toBeInTheDocument();
  });

  it("lets a signed-out visitor log for this visit and invites them to sign in", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(member(false));
    renderPage();
    expect(await screen.findByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login?next=/liquid-sun/tasting-journal");
    expect(listLogEntries).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "  Tasted at the bar " } });
    await logIt();
    const entry = (await screen.findByText("Tasted at the bar")).closest("div")!;
    expect(within(entry).getByRole("heading", { name: "Fortaleza" })).toBeInTheDocument();
    expect(addLogEntry).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Delete Fortaleza entry" }));
    expect(screen.queryByText("Tasted at the bar")).not.toBeInTheDocument();
    expect(deleteLogEntry).not.toHaveBeenCalled();
  });

  it("names an unknown spirit Unknown", async () => {
    vi.mocked(listLogEntries).mockResolvedValueOnce({ ok: true, data: [{ ...saved, producerId: "gone" }] });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Unknown" })).toBeInTheDocument();
  });
});
