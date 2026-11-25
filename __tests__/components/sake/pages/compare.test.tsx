import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeCompare, parseIds } from "@/components/sake/pages/compare";
import { unifiedSakeDatabase } from "@/lib/content/sake/unified-sake-data";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const detailIds = new Set(qprSakeDatabase.map((s) => s.id));
const [a, b, c] = unifiedSakeDatabase.filter((s) => detailIds.has(s.id));

describe("parseIds", () => {
  it("keeps known ids, at most three", () => {
    expect(parseIds(`${a.id},nope,${b.id},${c.id},${a.id}`)).toEqual([a.id, b.id, c.id]);
    expect(parseIds("")).toEqual([]);
  });
});

describe("SakeCompare", () => {
  afterEach(() => window.history.replaceState({}, "", "/"));

  it("starts empty and adds sakes through the picker", async () => {
    const user = userEvent.setup();
    renderSake(<SakeCompare />);
    expect(screen.getByRole("heading", { level: 1, name: /Compare\s*Sakes/ })).toBeInTheDocument();
    expect(screen.getByText(/Click the \+ buttons above/)).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /Add sake to compare/ })[0]);
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByRole("textbox"), a.name);
    await user.click(within(dialog).getAllByRole("button", { name: new RegExp(a.name) })[0]);
    expect(screen.getByText(/Add one more sake/)).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /Add sake to compare/ })[0]);
    const dialog2 = await screen.findByRole("dialog");
    expect(within(dialog2).getAllByText("(already selected)").length).toBeGreaterThanOrEqual(0);
    await user.type(within(dialog2).getByRole("textbox"), b.name);
    await user.click(within(dialog2).getAllByRole("button", { name: new RegExp(b.name) })[0]);
    expect(screen.getByText("Aroma Profile Comparison")).toBeInTheDocument();
  });

  it("preselects ?ids=, compares, changes, removes and cancels", async () => {
    window.history.replaceState({}, "", `/sake/compare?ids=${a.id},${b.id}`);
    const user = userEvent.setup();
    renderSake(<SakeCompare />);
    expect(screen.getByText("Score Comparison")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByText("BEST").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: `View ${a.name}` })).toHaveAttribute("href", `/sake/bottle/${a.id}`);

    await user.click(screen.getAllByRole("button", { name: "Change sake" })[0]);
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getAllByText(a.nameJa).length).toBeGreaterThan(0);
    await user.click(screen.getByTestId("toggle-austere"));

    await user.click(screen.getAllByRole("button", { name: "削除" })[0]);
    expect(screen.queryByRole("table")).toBeNull();
  });
});
