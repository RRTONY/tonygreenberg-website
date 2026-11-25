import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalSearch } from "@/components/sake/global-search";
import { SakeProviders } from "@/components/sake/sake-providers";
import { getSakeMember } from "@/app/sake/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/sake/actions", () => ({ getSakeMember: vi.fn() }));

function renderSearch(isOpen = true, onClose = vi.fn()) {
  const utils = render(
    <SakeProviders>
      <GlobalSearch isOpen={isOpen} onClose={onClose} />
    </SakeProviders>,
  );
  return { ...utils, onClose };
}

const box = () => screen.getByRole("textbox", { name: "Search" });

beforeEach(() => {
  vi.mocked(getSakeMember).mockResolvedValue({ signedIn: false, id: null, email: null, name: null, isAdmin: false });
});

describe("GlobalSearch", () => {
  it("shows the prompt, then matching sakes and pages, with the result count", async () => {
    const user = userEvent.setup();
    renderSearch();
    expect(screen.getByText(/Start typing to search across 100\+ sakes/)).toBeInTheDocument();
    await user.type(box(), "rice");
    expect(screen.getByRole("button", { name: /Rice Encyclopedia/ })).toBeInTheDocument();
    expect(screen.getByText(/results$/)).toBeInTheDocument();
    await user.clear(box());
    await user.type(box(), "zzzz-nothing");
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("opens a sake's detail page under /sake/bottle and QPR Rankings at /sake/qpr", async () => {
    const user = userEvent.setup();
    const { onClose } = renderSearch();
    await user.type(box(), "Born");
    await user.click(screen.getAllByRole("button", { name: /Born/ })[0]);
    expect(navigation.router.push).toHaveBeenCalledWith(expect.stringMatching(/^\/sake\/bottle\//));
    expect(onClose).toHaveBeenCalled();

    await user.clear(box());
    await user.type(box(), "QPR Rankings");
    await user.keyboard("{Enter}");
    expect(navigation.router.push).toHaveBeenLastCalledWith("/sake/qpr");
  });

  it("moves the selection with the arrow keys", async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(box(), "sake");
    const options = () => screen.getAllByRole("button").filter((b) => b.className.includes("w-full flex"));
    expect(options()[0]).toHaveClass("bg-(--sk-accent-soft)");
    await user.keyboard("{ArrowDown}");
    expect(options()[1]).toHaveClass("bg-(--sk-accent-soft)");
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(options()[0]).toHaveClass("bg-(--sk-accent-soft)");
    await user.hover(options()[2]);
    expect(options()[2]).toHaveClass("bg-(--sk-accent-soft)");
  });

  it("closes from the X button and starts empty when reopened", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = renderSearch(true, onClose);
    await user.type(box(), "rice");
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
    rerender(
      <SakeProviders>
        <GlobalSearch isOpen={false} onClose={onClose} />
      </SakeProviders>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(
      <SakeProviders>
        <GlobalSearch isOpen onClose={onClose} />
      </SakeProviders>,
    );
    expect(box()).toHaveValue("");
  });
});
