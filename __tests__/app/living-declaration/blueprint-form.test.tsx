import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlueprintForm } from "@/app/living-declaration/blueprint-form";
import { submitBlueprint } from "@/app/forms/actions";

// The server action is replaced: these tests check the form, not the database.
vi.mock("@/app/forms/actions", () => ({ submitBlueprint: vi.fn() }));
const submit = vi.mocked(submitBlueprint);

const OBSTACLE = "What's the biggest obstacle between you and your best self right now?";
const ABUNDANT = "Describe your most abundant life in one paragraph. No constraints. No budget. Just truth.";

function renderForm() {
  render(<BlueprintForm />);
  return userEvent.setup();
}

describe("BlueprintForm", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("shows all six questions with their labels", () => {
    renderForm();
    expect(screen.getByLabelText(OBSTACLE)).toHaveAttribute("placeholder", "Be honest. This isn't a job interview. It's a mirror.");
    expect(screen.getByLabelText(ABUNDANT)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").filter((el) => el.tagName === "TEXTAREA")).toHaveLength(6);
  });

  it("asks for at least one answer and sends nothing when empty", async () => {
    const user = renderForm();
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Answer at least one question first.");
    expect(submit).not.toHaveBeenCalled();
  });

  it("treats whitespace-only answers as empty", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText(ABUNDANT), "    ");
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    expect(await screen.findByText("Answer at least one question first.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("rejects a malformed email but accepts it left empty", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText(ABUNDANT), "A garden, a lab and a long table.");
    await user.type(screen.getByLabelText("Your email"), "nope");
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    expect(await screen.findByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText("Your email"));
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    await waitFor(() => expect(submit).toHaveBeenCalled());
  });

  it("sends the answers with their labels and shows the thank-you", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText(OBSTACLE), "Time.");
    await user.type(screen.getByLabelText("Your name"), "Ada");
    await user.type(screen.getByLabelText("Your email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    expect(await screen.findByText("Received. Thank you.")).toBeInTheDocument();
    expect(submit).toHaveBeenCalledWith({
      answers: expect.objectContaining({ biggestChallenge: "Time.", abundantLife: "" }),
      labels: expect.objectContaining({ biggestChallenge: OBSTACLE, abundantLife: ABUNDANT }),
      name: "Ada",
      email: "ada@example.com",
      website: "",
    });
  });

  it("offers a pre-filled email to Tony when saving fails", async () => {
    submit.mockResolvedValue({ ok: false, error: "This couldn't be saved just now." });
    const user = renderForm();
    await user.type(screen.getByLabelText(ABUNDANT), "A garden, a lab and a long table.");
    await user.click(screen.getByRole("button", { name: /Submit My Blueprint/ }));
    expect(await screen.findByText(/couldn't be saved just now/)).toBeInTheDocument();
    const mail = screen.getAllByRole("link").find((a) => a.getAttribute("href")?.startsWith("mailto:"));
    expect(mail?.getAttribute("href")).toContain("tony@impactsoul.is");
    expect(decodeURIComponent(mail!.getAttribute("href")!)).toContain("A garden, a lab and a long table.");
    expect(screen.queryByText("Received. Thank you.")).not.toBeInTheDocument();
  });
});
