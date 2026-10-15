import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EssayVersionPanel, EssayVersionToc, EssayVersionToggle } from "@/components/blog/essay-version";

const h = (p: string) => [1, 2, 3].map((i) => ({ id: `${p}-${i}`, text: `${p} ${i}`, level: 2 as const }));

function Page({ slug }: { slug: string }) {
  return (
    <>
      <EssayVersionToggle slug={slug} />
      <EssayVersionPanel slug={slug} version="original">
        <p>Original text</p>
      </EssayVersionPanel>
      <EssayVersionPanel slug={slug} version="updated">
        <p>Updated text</p>
      </EssayVersionPanel>
      <EssayVersionToc slug={slug} original={h("Orig")} updated={h("New")} />
    </>
  );
}

describe("EssayVersion", () => {
  it("starts on the original with the updated body hidden", () => {
    render(<Page slug="essay-a" />);
    expect(screen.getByRole("button", { name: /original post/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Original text")).toBeVisible();
    expect(screen.getByText("Updated text")).not.toBeVisible();
    expect(screen.getByRole("link", { name: "Orig 1" })).toBeInTheDocument();
  });

  it("switching shows the updated body and its contents", async () => {
    const user = userEvent.setup();
    render(<Page slug="essay-b" />);
    await user.click(screen.getByRole("button", { name: /updated for today/i }));
    expect(screen.getByRole("button", { name: /updated for today/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Updated text")).toBeVisible();
    expect(screen.getByText("Original text")).not.toBeVisible();
    expect(screen.getByRole("link", { name: "New 1" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /original post/i }));
    expect(screen.getByText("Original text")).toBeVisible();
  });

  it("a different essay starts on its original again", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Page slug="essay-c" />);
    await user.click(screen.getByRole("button", { name: /updated for today/i }));
    unmount();
    render(<Page slug="essay-d" />);
    expect(screen.getByRole("button", { name: /original post/i })).toHaveAttribute("aria-pressed", "true");
  });
});
