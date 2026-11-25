import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Page, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/sake/bottle/[id]/page";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { NextNotFoundError } from "@tests/helpers/next";

vi.mock("@/components/sake/pages/sake-detail", () => ({
  SakeDetail: (p: { sake: { id: string }; checkoutOpen: boolean }) => <div data-testid="page">{`${p.sake.id}/${p.checkoutOpen}`}</div>,
}));

const sake = qprSakeDatabase[0];
const props = (id: string) => ({ params: Promise.resolve({ id }) });

afterEach(() => vi.unstubAllEnvs());

describe("/sake/bottle/[id]", () => {
  it("builds one page per sake, with unique ids, and no others", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(qprSakeDatabase.length);
    expect(new Set(params.map((p) => p.id)).size).toBe(params.length);
    expect(dynamicParams).toBe(false);
  });

  it("titles the page with the sake's name, describes it with its own text, and points the canonical at /sake/bottle", async () => {
    const meta = await generateMetadata(props(sake.id));
    expect(meta.title).toEqual({ absolute: `${sake.name} | Sake for Sake's Sake™` });
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
    expect(sake.description.startsWith(String(meta.description).replace(/…$/, "").slice(0, 40))).toBe(true);
    expect(meta.alternates?.canonical).toBe(`/sake/bottle/${sake.id}`);
    expect(await generateMetadata(props("no-such-sake"))).toEqual({});
  });

  it("renders the sake with JSON-LD and the ordering switch", async () => {
    vi.stubEnv("SAKE_CHECKOUT_ENABLED", "true");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    const { container, getByTestId } = render(await Page(props(sake.id)));
    expect(getByTestId("page").textContent).toMatch(new RegExp(`^${sake.id}/(true|false)$`));
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });

  it("is a 404 for an unknown id", async () => {
    await expect(Page(props("no-such-sake"))).rejects.toBeInstanceOf(NextNotFoundError);
  });
});
