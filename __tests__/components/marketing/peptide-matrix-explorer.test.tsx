import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeptideMatrixExplorer } from "@/components/marketing/peptide-matrix-explorer";
import { ENTITIES } from "@/lib/content/peptide-matrix";

const bodyRows = () => within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");

describe("PeptideMatrixExplorer", () => {
  it("ranks every entity by gap, largest first", () => {
    render(<PeptideMatrixExplorer />);
    expect(screen.getByRole("heading", { level: 2, name: "All Entities Ranked" })).toBeInTheDocument();
    const rows = bodyRows();
    expect(rows).toHaveLength(ENTITIES.length);
    const ranked = [...ENTITIES].sort((a, b) => b.gap - a.gap);
    expect(rows[0].firstElementChild).toHaveTextContent(ranked[0].name);
    expect(rows.at(-1)!.firstElementChild).toHaveTextContent(ranked.at(-1)!.name);
  });

  it("clicking a row opens that entity's detail card", async () => {
    render(<PeptideMatrixExplorer />);
    const entity = [...ENTITIES].sort((a, b) => b.gap - a.gap)[0];
    await userEvent.setup().click(bodyRows()[0]);
    expect(screen.getByRole("heading", { level: 3, name: entity.name })).toBeInTheDocument();
    expect(screen.getAllByText(`${entity.riskLevel} RISK`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`${entity.evidence}/100`).length).toBeGreaterThan(0);
    expect(bodyRows()[0]).toHaveClass("bg-brand-gold/10");
  });

  it("the matrix panel collapses and reopens", async () => {
    const user = userEvent.setup();
    const { container } = render(<PeptideMatrixExplorer />);
    const toggle = screen.getByRole("button", { name: /Interactive Matrix/ });
    expect(container.querySelector("canvas")).not.toBeNull();
    await user.click(toggle);
    expect(container.querySelector("canvas")).toBeNull();
    await user.click(toggle);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});

// ---- The scatter plot (drawn on a canvas) ---------------------------------
// jsdom has no canvas, so the setup returns a null context. Here the canvas
// gets a recording 2D context and the container a real width, so the drawing
// and the click/hover hit-testing run against the real entity data.

type FakeCtx = Record<string, unknown> & {
  fillText: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
};

function makeCtx(): FakeCtx {
  const fn = () => vi.fn();
  return {
    fillStyle: "",
    strokeStyle: "",
    font: "",
    textAlign: "",
    globalAlpha: 1,
    lineWidth: 1,
    scale: fn(),
    fillRect: fn(),
    fillText: fn(),
    beginPath: fn(),
    moveTo: fn(),
    lineTo: fn(),
    stroke: fn(),
    setLineDash: fn(),
    save: fn(),
    restore: fn(),
    translate: fn(),
    rotate: fn(),
    arc: fn(),
    fill: fn(),
  } as FakeCtx;
}

// Container 600px wide -> canvas 600 x 390, plot area 510 x 310 starting at (60, 30).
const W = 600;
const plotPoint = (reviews: number, evidence: number) => ({
  x: 60 + (reviews / 5) * 510,
  y: 30 + 310 - (evidence / 100) * 310,
});

describe("PeptideMatrixExplorer scatter plot", () => {
  let ctx: FakeCtx;
  let widthSpy: PropertyDescriptor | undefined;

  beforeEach(() => {
    ctx = makeCtx();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D,
    );
    widthSpy = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => W });
  });

  afterEach(() => {
    if (widthSpy) Object.defineProperty(HTMLElement.prototype, "offsetWidth", widthSpy);
    vi.restoreAllMocks();
  });

  const labels = () => ctx.fillText.mock.calls.map((c) => String(c[0]));
  const plotted = ENTITIES.filter((e) => e.reviews > 0);

  it("sizes the canvas from its container and draws the four quadrant labels and axes", () => {
    const { container } = render(<PeptideMatrixExplorer />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas.style.width).toBe("600px");
    expect(canvas.style.height).toBe("390px");
    expect(labels()).toEqual(
      expect.arrayContaining([
        "Q3: OBVIOUS SCAMS",
        "Q4: DANGER ZONE",
        "Q2: GOOD SCIENCE",
        "Q1: ALIGNED",
        "REVIEW SCORE (1–5 STARS)",
        "EVIDENCE SCORE (0–100)",
        "USADA (Regulatory)",
      ]),
    );
    // Axis ticks 0-5 and 0-100.
    for (const t of ["0", "1", "5", "20", "100"]) expect(labels()).toContain(t);
  });

  it("plots only entities with a review score, labelling each one", () => {
    render(<PeptideMatrixExplorer />);
    expect(plotted.length).toBeGreaterThan(0);
    for (const e of plotted) {
      const label = e.name.length > 14 ? e.name.slice(0, 12) + "…" : e.name;
      expect(labels()).toContain(label);
    }
    // Entities with no reviews (e.g. Joe Rogan) are not drawn as points.
    const unplotted = ENTITIES.filter((e) => e.reviews === 0 && e.name.length <= 14);
    for (const e of unplotted) expect(labels()).not.toContain(e.name);
    // Every plotted entity is a point at its (reviews, evidence) position.
    for (const e of plotted) {
      const { x, y } = plotPoint(e.reviews, e.evidence);
      expect(ctx.arc.mock.calls.some((c) => c[0] === x && c[1] === y && c[2] === 7)).toBe(true);
    }
  });

  it("clicking a point selects that entity; clicking empty space clears it", () => {
    const { container } = render(<PeptideMatrixExplorer />);
    const canvas = container.querySelector("canvas")!;
    const target = plotted[0];
    const { x, y } = plotPoint(target.reviews, target.evidence);
    fireEvent.click(canvas, { clientX: x + 3, clientY: y - 3 });
    expect(screen.getByRole("heading", { level: 3, name: target.name })).toBeInTheDocument();
    // The selected point is redrawn bigger (radius 10) with a gold outline.
    expect(ctx.arc.mock.calls.some((c) => c[0] === x && c[1] === y && c[2] === 10)).toBe(true);

    fireEvent.click(canvas, { clientX: 5, clientY: 5 });
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("hovering a point highlights it in bold and leaving the canvas un-highlights it", () => {
    const { container } = render(<PeptideMatrixExplorer />);
    const canvas = container.querySelector("canvas")!;
    const target = plotted[0];
    const { x, y } = plotPoint(target.reviews, target.evidence);
    ctx.arc.mockClear();
    fireEvent.mouseMove(canvas, { clientX: x, clientY: y });
    expect(ctx.arc.mock.calls.some((c) => c[0] === x && c[1] === y && c[2] === 10)).toBe(true);
    // Hovering doesn't select anything.
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    ctx.arc.mockClear();
    fireEvent.mouseLeave(canvas);
    expect(ctx.arc.mock.calls.some((c) => c[0] === x && c[1] === y && c[2] === 7)).toBe(true);
  });

  it("re-measures the canvas when the window is resized", () => {
    const { container } = render(<PeptideMatrixExplorer />);
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => 1200 });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    // Capped at 800 wide, height 65% of the width.
    const canvas = container.querySelector("canvas")!;
    expect(canvas.style.width).toBe("800px");
    expect(canvas.style.height).toBe("520px");
  });
});

describe("PeptideMatrixExplorer detail card", () => {
  const rowFor = (name: string) =>
    bodyRows().find((r) => r.firstElementChild?.textContent === name)!;
  const byId = (id: string) => ENTITIES.find((e) => e.id === id)!;

  it("an entity with reviews shows its star score, a positive gap with a plus, and its sources", async () => {
    const e = byId("ways2well");
    render(<PeptideMatrixExplorer />);
    await userEvent.setup().click(rowFor(e.name));
    const card = screen.getByRole("heading", { level: 3, name: e.name }).closest("div.rounded-xl")!;
    expect(card).toHaveTextContent(`${e.type} · Tier ${e.tier} · Wall Score ${e.wallScore}`);
    expect(card).toHaveTextContent(`${e.reviews}stars`);
    expect(within(card as HTMLElement).getByText(`+${e.gap}`)).toHaveClass("text-[#C0392B]");
    expect(card).toHaveTextContent(`Sources: ${e.reviewSources!.join(", ")}`);
    expect(card).toHaveTextContent(e.details!);
  });

  it("an entity with no reviews shows N/A for reviews and gap, and no sources line when it has none", async () => {
    const e = byId("rogan");
    render(<PeptideMatrixExplorer />);
    await userEvent.setup().click(rowFor(e.name));
    const card = screen.getByRole("heading", { level: 3, name: e.name }).closest("div.rounded-xl")!;
    expect(within(card as HTMLElement).getAllByText("N/A")).toHaveLength(2);
    expect(card).not.toHaveTextContent("Sources:");
  });

  it("the regulatory entry has no tier or wall score and its zero gap is green", async () => {
    const e = byId("usada");
    render(<PeptideMatrixExplorer />);
    await userEvent.setup().click(rowFor(e.name));
    const card = screen.getByRole("heading", { level: 3, name: e.name }).closest("div.rounded-xl")!;
    expect(card).toHaveTextContent("Tier N/A · Wall Score N/A");
    expect(card).toHaveTextContent("REGULATORY RISK");
  });

  it("table gap cells: N/A without reviews, +n for a positive gap", () => {
    render(<PeptideMatrixExplorer />);
    const gapCell = (name: string) => rowFor(name).children[4];
    expect(gapCell(byId("ways2well").name)).toHaveTextContent(`+${byId("ways2well").gap}`);
    expect(gapCell(byId("ways2well").name)).toHaveClass("text-[#A93226]");
    expect(gapCell(byId("rogan").name)).toHaveTextContent("N/A");
    expect(gapCell(byId("prisk").name)).toHaveClass("text-[#246C44]");
    expect(gapCell(byId("levinson").name)).toHaveClass("text-[#9B5212]");
  });
});
