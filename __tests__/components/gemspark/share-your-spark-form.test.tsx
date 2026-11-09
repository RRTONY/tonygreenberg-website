import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareYourSparkForm } from "@/components/gemspark/share-your-spark-form";
import { submitGemSparkStory } from "@/app/gem-spark/actions";

vi.mock("@/app/gem-spark/actions", () => ({ submitGemSparkStory: vi.fn() }));

const STORY = "A wrong turn put me next to my future co-founder.";

describe("ShareYourSparkForm", () => {
  it("keeps the button off until there's a story, and asks for at least 10 characters", async () => {
    const user = userEvent.setup();
    render(<ShareYourSparkForm />);
    const button = screen.getByRole("button", { name: "Submit My GemSpark" });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("Your GemSpark"), "Too short");
    await user.click(button);
    expect(screen.getByRole("alert")).toHaveTextContent("at least 10 characters");
    expect(submitGemSparkStory).not.toHaveBeenCalled();
  });

  it("sends the story and optional email, shows the thank-you, and resets for another", async () => {
    let resolve!: (v: { ok: true }) => void;
    vi.mocked(submitGemSparkStory).mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ShareYourSparkForm />);
    await user.type(screen.getByLabelText("Your GemSpark"), `  ${STORY}  `);
    await user.type(screen.getByLabelText("Email (Optional)"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Submit My GemSpark" }));
    expect(screen.getByRole("button", { name: "Submit My GemSpark" })).toBeDisabled();
    expect(screen.getByLabelText("Your GemSpark")).toBeDisabled();
    expect(submitGemSparkStory).toHaveBeenCalledWith({ story: STORY, email: "ana@example.com" });
    resolve({ ok: true });
    expect(await screen.findByRole("heading", { name: "Your GemSpark Has Been Received" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Share another story" }));
    expect(screen.getByLabelText("Your GemSpark")).toHaveValue("");
  });

  it("leaves the email out when blank and shows the server's error", async () => {
    vi.mocked(submitGemSparkStory).mockResolvedValue({ ok: false, error: "That email address doesn't look right." });
    const user = userEvent.setup();
    render(<ShareYourSparkForm />);
    await user.type(screen.getByLabelText("Your GemSpark"), STORY);
    await user.click(screen.getByRole("button", { name: "Submit My GemSpark" }));
    expect(submitGemSparkStory).toHaveBeenCalledWith({ story: STORY, email: undefined });
    expect(await screen.findByRole("alert")).toHaveTextContent("That email address doesn't look right.");
    expect(screen.getByLabelText("Your GemSpark")).toHaveValue(STORY);
  });

  it("shows a generic error when the request fails", async () => {
    vi.mocked(submitGemSparkStory).mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<ShareYourSparkForm />);
    await user.type(screen.getByLabelText("Your GemSpark"), STORY);
    await user.click(screen.getByRole("button", { name: "Submit My GemSpark" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });

  it("falls back to the generic message when the server gives none", async () => {
    vi.mocked(submitGemSparkStory).mockResolvedValue({ ok: false, error: "" });
    const user = userEvent.setup();
    render(<ShareYourSparkForm />);
    await user.type(screen.getByLabelText("Your GemSpark"), STORY);
    await user.click(screen.getByRole("button", { name: "Submit My GemSpark" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });
});
