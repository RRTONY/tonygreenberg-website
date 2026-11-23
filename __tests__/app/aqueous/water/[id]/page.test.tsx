import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { generateMetadata, generateStaticParams } from "@/app/aqueous/water/[id]/page";
import { bottledWaters } from "@/lib/content/aqueous/water-data";

vi.mock("@/components/aqueous/pages/water-detail", () => ({
  WaterDetail: ({ water }: { water: { name: string } }) => <div data-testid="detail">{water.name}</div>,
}));

const water = bottledWaters[0];
const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/aqueous/water/[id] page", () => {
  it("prebuilds every bottled water", () => {
    expect(generateStaticParams()).toEqual(bottledWaters.map((w) => ({ id: w.id })));
  });

  it("titles the page with the water's name and its source description", async () => {
    const meta = await generateMetadata(params(water.id));
    expect(String(meta.title)).toContain(water.name);
    expect(meta.description).toBe(water.sourceDescription);
    expect(meta.alternates?.canonical).toBe(`/aqueous/water/${water.id}`);
    expect(await generateMetadata(params("nope"))).toEqual({});
  });

  it("renders the water with JSON-LD, and 404s an unknown id", async () => {
    const { container, getByTestId } = render(await Page(params(water.id)));
    expect(getByTestId("detail")).toHaveTextContent(water.name);
    expect(container.querySelector('script[type="application/ld+json"]')?.textContent).toContain(water.name);
    await expect(Page(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
