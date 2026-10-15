import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ArchiveSearchBox } from "@/components/blog/archive-search-box";
import { navigation } from "@tests/helpers/next";

const hits = [
  { title: "Coffee and Consciousness", href: "/blog/coffee-consciousness", description: "", category: "Mind" },
  { title: "Cold Brew Notes", href: "/blog/cold-brew", description: "" },
];

let fetchMock: ReturnType<typeof vi.fn>;
const onActivate = vi.fn();
const onPickCategory = vi.fn();
const onPickTopic = vi.fn();

function Harness() {
  const [value, setValue] = useState("");
  return (
    <>
      <ArchiveSearchBox
        value={value}
        onChange={setValue}
        onActivate={onActivate}
        categories={["Coffee Culture", "Technology"]}
        topics={["coffee", "AI"]}
        onPickCategory={onPickCategory}
        onPickTopic={onPickTopic}
      />
      <p data-testid="value">{value}</p>
    </>
  );
}

describe("ArchiveSearchBox", () => {
  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ posts: hits })));
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows nothing and fetches nothing for a single character", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("combobox", { name: "Search essays" }), "c");
    expect(onActivate).toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 300));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("suggests matching categories and topics at once, then essays from /api/search", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole("combobox", { name: "Search essays" });
    await user.type(box, "coff");
    expect(box).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: /coffee culture/i })).toHaveTextContent("Show this category");
    expect(screen.getByRole("option", { name: /^coffee\s*show this topic/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Searching inside the essays");

    expect(await screen.findByRole("option", { name: /coffee and consciousness/i })).toHaveTextContent("Mind");
    expect(screen.getByRole("option", { name: /cold brew notes/i })).toHaveTextContent("Essay");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/search?q=coff");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("says nothing matched when the search finds nothing", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ posts: [] })));
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText("No essays mention “zzz”.")).toBeInTheDocument();
  });

  it("treats a failed search as no essays", async () => {
    fetchMock.mockImplementation(async () => {
      throw new TypeError("offline");
    });
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText(/No essays mention/)).toBeInTheDocument();
  });

  it("picking a category clears the box and reports it; picking an essay navigates", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole("combobox");
    await user.type(box, "coff");
    await user.pointer({ keys: "[MouseLeft>]", target: screen.getByRole("option", { name: /coffee culture/i }) });
    expect(onPickCategory).toHaveBeenCalledWith("Coffee Culture");
    expect(screen.getByTestId("value")).toHaveTextContent("");

    await user.type(box, "coff");
    const essay = await screen.findByRole("option", { name: /coffee and consciousness/i });
    await user.pointer({ keys: "[MouseLeft>]", target: essay });
    expect(navigation.router.push).toHaveBeenCalledWith("/blog/coffee-consciousness");
  });

  it("supports arrow keys, Enter and Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole("combobox");
    await user.type(box, "coff");
    await screen.findByRole("option", { name: /coffee and consciousness/i });
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const topic = screen.getByRole("option", { name: /^coffee\s*show this topic/i });
    expect(topic).toHaveAttribute("aria-selected", "true");
    expect(box).toHaveAttribute("aria-activedescendant", topic.id);
    await user.keyboard("{ArrowUp}{ArrowUp}");
    // wraps from the first item to the last
    expect(screen.getByRole("option", { name: /cold brew notes/i })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onPickTopic).toHaveBeenCalledWith("coffee");

    await user.type(box, "coff");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });
});
