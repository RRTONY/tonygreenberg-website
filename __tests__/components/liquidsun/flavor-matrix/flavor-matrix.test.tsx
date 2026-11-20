import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { FlavorMatrix } from "@/components/liquidsun/flavor-matrix/flavor-matrix";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const renderMatrix = () =>
  render(
    <LiquidsunProviders>
      <FlavorMatrix />
    </LiquidsunProviders>,
  );

const dot = (name: RegExp) => screen.getByRole("button", { name });

beforeEach(() => {
  window.localStorage.clear();
});

describe("FlavorMatrix: matrix view", () => {
  it("plots the Blanco bottles with the Blanco quadrant names", () => {
    renderMatrix();
    expect(screen.getByText("The Mineralist")).toBeInTheDocument();
    expect(screen.getByText("The Floralist")).toBeInTheDocument();
    expect(dot(/^Caballito Cerrero Azul 46/)).toHaveStyle({ left: "7.5%", bottom: "80%" });
    expect(screen.queryByText("La Gritona")).not.toBeInTheDocument();
  });

  it("opens the bottle card on hover, focus and tap, and closes it again", async () => {
    renderMatrix();
    const caballito = dot(/^Caballito Cerrero Azul 46/);
    fireEvent.mouseEnter(caballito);
    const card = screen.getByTestId("ls-hover-card");
    expect(within(card).getByText("Brine")).toBeInTheDocument();
    expect(within(card).getByText(/Buy at Old Town Tequila/)).toBeInTheDocument();
    expect(within(card).getByRole("img")).toHaveAttribute("alt", "Caballito Cerrero tequila bottle");
    expect(caballito).toHaveAttribute("aria-pressed", "true");
    fireEvent.mouseLeave(caballito);
    await waitFor(() => expect(screen.queryByTestId("ls-hover-card")).not.toBeInTheDocument());

    // Near the right edge the card opens to the left; near the top it opens below.
    const ocho = dot(/^Tequila Ocho Plata/);
    fireEvent.focus(ocho);
    expect(screen.getByTestId("ls-hover-card")).toHaveStyle({ right: "10%" });
    fireEvent.blur(ocho);
    const g4 = dot(/^G4 Madera/);
    fireEvent.click(g4);
    expect(screen.getByTestId("ls-hover-card")).toHaveStyle({ top: "5%" });
    fireEvent.click(g4);
    await waitFor(() => expect(screen.queryByTestId("ls-hover-card")).not.toBeInTheDocument());
  });

  it("shows a placeholder for bottles that never had a photo, and 'Click to Buy' without a retailer", async () => {
    renderMatrix();
    fireEvent.mouseEnter(dot(/^Cascahuín Tahona/));
    expect(within(screen.getByTestId("ls-hover-card")).queryByRole("img")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("ls-hover-card")).getByText("Cascahuín Tahona")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Extra Añejo" }));
    await screen.findByText("The Deep Cellar");
    fireEvent.mouseEnter(dot(/^El Tequileño Rare/));
    expect(within(screen.getByTestId("ls-hover-card")).getByText(/Click to Buy/)).toBeInTheDocument();
  });

  it("switches tabs after the old dots shrink out", async () => {
    renderMatrix();
    fireEvent.click(screen.getByRole("button", { name: "Reposado" }));
    expect(screen.getByRole("button", { name: "Reposado" })).toHaveAttribute("aria-pressed", "true");
    expect(dot(/^Caballito Cerrero/)).toHaveClass("animate-out");
    expect(await screen.findByText("The Earthy Oak")).toBeInTheDocument();
    expect(dot(/^La Gritona Reposado/)).toHaveClass("animate-in");
  });

  it("maps the palate through the quiz, then shares it", async () => {
    renderMatrix();
    expect(screen.queryByRole("button", { name: /Share/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Find My Palate/ }));
    const quiz = screen.getByRole("dialog");
    expect(within(quiz).getByText("Question 1 of 3")).toBeInTheDocument();
    fireEvent.click(within(quiz).getByRole("button", { name: "Rich & Complex" }));
    fireEvent.click(within(quiz).getByRole("button", { name: /Highland Fields/ }));
    expect(within(quiz).getByText("Question 3 of 3")).toBeInTheDocument();
    fireEvent.click(within(quiz).getByRole("button", { name: "Surprise me" }));
    expect(toast.success).toHaveBeenCalledWith("Palate mapped! Look for the 'You Are Here' pin.");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("ls-user-pin")).toHaveStyle({ left: "75%", bottom: "85%" });

    fireEvent.click(screen.getByRole("button", { name: /Share/ }));
    const share = screen.getByRole("dialog", { name: "My Soul Palate" });
    expect(within(share).getByText(/Highland/)).toHaveTextContent("Highland/Complex");
    fireEvent.click(within(share).getByRole("button", { name: "Download for Instagram" }));
    expect(toast.success).toHaveBeenCalledWith("Image saved to gallery!");
    fireEvent.click(within(share).getByRole("button", { name: "Close share card" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes the quiz with Escape and the close button, and a valley/crisp palate reads as such", async () => {
    renderMatrix();
    fireEvent.click(screen.getByRole("button", { name: /Find My Palate/ }));
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Find My Palate/ }));
    fireEvent.click(screen.getByRole("button", { name: "Close the palate quiz" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Share/ }));
    expect(screen.getByRole("dialog", { name: "My Soul Palate" })).toHaveTextContent("Valley/Crisp");
  });
});

describe("FlavorMatrix: list view", () => {
  it("lists bottles with buy links, and a plain Buy Now where there is no retailer", async () => {
    renderMatrix();
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    expect(screen.getAllByRole("link", { name: /Buy \$75/ }).map((a) => a.getAttribute("href"))).toContain(
      "https://www.oldtowntequila.com/caballito-cerrero-azul-blanco-46/",
    );
    fireEvent.click(screen.getByRole("button", { name: "Extra Añejo" }));
    expect((await screen.findAllByRole("button", { name: /Buy Now/ })).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Matrix view" }));
    expect(screen.getByText("The Deep Cellar")).toBeInTheDocument();
  });

  it("checks the phone number before confirming a drop alert", async () => {
    const user = userEvent.setup();
    renderMatrix();
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    await user.click(screen.getAllByRole("button", { name: /Notify Me/ })[0]);
    const modal = screen.getByRole("dialog", { name: "Get Notified" });
    expect(modal).toHaveTextContent("G4");
    const phone = within(modal).getByLabelText("Phone number");
    await user.click(within(modal).getByRole("button", { name: "Set Alert" }));
    expect(await within(modal).findByRole("alert")).toHaveTextContent("Enter your phone number.");
    await user.type(phone, "call me");
    await user.click(within(modal).getByRole("button", { name: "Set Alert" }));
    expect(await within(modal).findByText("Use digits only, like (555) 555-5555.")).toBeInTheDocument();
    await user.clear(phone);
    await user.type(phone, "555");
    await user.click(within(modal).getByRole("button", { name: "Set Alert" }));
    expect(await within(modal).findByText("Enter a full phone number.")).toBeInTheDocument();
    await user.clear(phone);
    await user.type(phone, "(555) 555-5555");
    await user.click(within(modal).getByRole("button", { name: "Set Alert" }));
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("You're on the list! We'll text (555) 555-5555 when G4 drops."),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("saves tasting notes in the browser when the box loses focus, and rejects an overlong note", async () => {
    const user = userEvent.setup();
    renderMatrix();
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    const edit = screen.getByRole("button", { name: "Edit my notes on Caballito Cerrero Azul 46" });
    await user.click(edit);
    const box = screen.getByRole("textbox", { name: "My notes" });
    expect(screen.getByText("Click outside to save")).toBeInTheDocument();
    await user.type(box, "Briny and wild");
    act(() => box.blur());
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Tasting note saved."));
    expect(screen.getByText("Briny and wild")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("tastingNotes") ?? "{}")).toEqual({ "caballito-46": "Briny and wild" });

    await user.click(edit);
    const again = screen.getByRole("textbox", { name: "My notes" });
    fireEvent.change(again, { target: { value: "x".repeat(2001) } });
    fireEvent.blur(again);
    expect(await screen.findByRole("alert")).toHaveTextContent("Keep this under 2,000 characters.");
    expect(JSON.parse(window.localStorage.getItem("tastingNotes") ?? "{}")["caballito-46"]).toBe("Briny and wild");
    await user.click(edit);
    expect(screen.queryByRole("textbox", { name: "My notes" })).not.toBeInTheDocument();
  });
});
