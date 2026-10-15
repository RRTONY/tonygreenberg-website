import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitForm } from "@/components/brewsoul/submit-form";
import { submitBrewSoul } from "@/app/forms/actions";

// The server action is replaced: these tests check the form, not the database.
vi.mock("@/app/forms/actions", () => ({ submitBrewSoul: vi.fn() }));
const submit = vi.mocked(submitBrewSoul);

function renderForm() {
  render(<SubmitForm />);
  return userEvent.setup();
}

describe("SubmitForm", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });
  it("needs a coffee name and sends nothing when empty", async () => {
    const user = renderForm();
    await user.click(screen.getByRole("button", { name: "Submit for Review" }));
    expect(await screen.findByText("Add the coffee's name.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("rejects a link that isn't a web address", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText("Coffee name"), "Gesha Lot 74");
    await user.type(screen.getByLabelText("Link (optional)"), "geshacoffee.com");
    await user.click(screen.getByRole("button", { name: "Submit for Review" }));
    expect(await screen.findByText("Use a web address starting with http.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("accepts a submission with only the name (empty optional fields are fine)", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText("Coffee name"), "Gesha Lot 74");
    await user.click(screen.getByRole("button", { name: "Submit for Review" }));
    expect(await screen.findByRole("status")).toHaveTextContent("We'll review your submission and update accordingly.");
    expect(submit).toHaveBeenCalledWith({ kind: "submit", coffeeName: "Gesha Lot 74", roaster: "", url: "", notes: "", website: "" });
  });

  it("files an appeal with every field filled in", async () => {
    const user = renderForm();
    await user.click(screen.getByRole("button", { name: "Appeal a Score" }));
    expect(screen.getByRole("button", { name: "Appeal a Score" })).toHaveAttribute("aria-pressed", "true");
    await user.type(screen.getByLabelText("Coffee name"), "Folgers Classic");
    await user.type(screen.getByLabelText("Roaster"), "Folgers");
    await user.type(screen.getByLabelText("Link (optional)"), "https://folgers.com");
    await user.type(screen.getByLabelText("What did we get wrong and why?"), "Too harsh.");
    await user.click(screen.getByRole("button", { name: "File Appeal" }));
    expect(await screen.findByRole("status")).toHaveTextContent("We'll review your appeal");
    expect(submit).toHaveBeenCalledWith({
      kind: "appeal",
      coffeeName: "Folgers Classic",
      roaster: "Folgers",
      url: "https://folgers.com",
      notes: "Too harsh.",
      website: "",
    });
  });

  it("offers a pre-filled email to Tony when saving fails", async () => {
    submit.mockResolvedValue({ ok: false, error: "This couldn't be saved just now." });
    const user = renderForm();
    await user.type(screen.getByLabelText("Coffee name"), "Gesha Lot 74");
    await user.type(screen.getByLabelText("Why should we add this coffee?"), "Best cup of my life.");
    await user.click(screen.getByRole("button", { name: "Submit for Review" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("This couldn't be saved just now.");
    const href = decodeURIComponent(screen.getByRole("link", { name: "Or email Tony directly." }).getAttribute("href")!);
    expect(href).toMatch(/^mailto:tony@tonygreenberg\.com\?subject=BrewSoul coffee submission: Gesha Lot 74/);
    expect(href).toContain("Best cup of my life.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
