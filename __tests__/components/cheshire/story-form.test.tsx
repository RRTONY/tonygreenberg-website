import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryForm } from "@/components/cheshire/story-form";
import { submitStory } from "@/app/forms/actions";

// The server action is replaced: these tests check the form, not the database.
vi.mock("@/app/forms/actions", () => ({ submitStory: vi.fn() }));
const submit = vi.mocked(submitStory);

const STORY = "They promised a finished product by March and delivered nothing, then stopped answering.";

function renderForm() {
  render(
    <StoryForm sourcePage="alex-azzi" fallbackEmail="tony@tonygreenberg.com" fallbackSubject="My story" />,
  );
  return userEvent.setup();
}

describe("StoryForm", () => {
  beforeEach(() => {
    submit.mockResolvedValue({ ok: true });
  });

  it("shows the required-field errors and sends nothing when submitted empty", async () => {
    const user = renderForm();
    await user.click(screen.getByRole("button", { name: /share your story/i }));
    expect(await screen.findByText("Add your relationship to the person.")).toBeInTheDocument();
    expect(screen.getByText(/at least 50 characters/i)).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("rejects a story under 50 characters and a malformed email", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText(/relationship to the person/i), "Client");
    await user.type(screen.getByLabelText(/what happened/i), "Too short");
    await user.type(screen.getByLabelText(/contact email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /share your story/i }));
    expect(await screen.findByText(/at least 50 characters/i)).toBeInTheDocument();
    expect(screen.getByText("That email address doesn't look right.")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("sends the filled-in answers and shows the thank-you message", async () => {
    const user = renderForm();
    await user.type(screen.getByLabelText(/relationship to the person/i), "Client");
    await user.type(screen.getByLabelText(/city/i), "Santa Monica, CA");
    await user.type(screen.getByLabelText(/what happened/i), STORY);
    await user.selectOptions(screen.getByLabelText(/paid what was owed/i), "partial");
    await user.type(screen.getByLabelText(/contact email/i), "me@example.com");
    await user.click(screen.getByLabelText(/willing to be contacted/i));
    await user.click(screen.getByRole("button", { name: /share your story/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Your story has been received.");
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        sourcePage: "alex-azzi",
        relationship: "Client",
        city: "Santa Monica, CA",
        promisedVsDelivered: STORY,
        receivedPayment: "partial",
        contactEmail: "me@example.com",
        willingToContact: true,
        website: "",
      }),
    );
  });

  it("offers a pre-filled email to Tony when saving fails, so the story isn't lost", async () => {
    submit.mockResolvedValue({ ok: false, error: "This couldn't be saved just now." });
    const user = renderForm();
    await user.type(screen.getByLabelText(/relationship to the person/i), "Client");
    await user.type(screen.getByLabelText(/what happened/i), STORY);
    await user.click(screen.getByRole("button", { name: /share your story/i }));

    expect(await screen.findByText(/couldn't be saved just now/i)).toBeInTheDocument();
    const fallback = screen.getAllByRole("link").find((a) => a.getAttribute("href")?.startsWith("mailto:"));
    expect(fallback?.getAttribute("href")).toContain("tony@tonygreenberg.com");
    expect(decodeURIComponent(fallback!.getAttribute("href")!)).toContain(STORY);
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });
});
