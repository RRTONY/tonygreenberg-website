import { describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({}) as Record<string, unknown>);
vi.mock("next/font/google", () => {
  const make = (name: string) => (opts: { variable: string }) => {
    calls[name] = opts;
    return { className: name, variable: opts.variable };
  };
  return {
    Libre_Baskerville: make("Libre_Baskerville"),
    Cormorant_Garamond: make("Cormorant_Garamond"),
    IM_Fell_English: make("IM_Fell_English"),
    Fraunces: make("Fraunces"),
  };
});

import { essayFontVariables } from "@/lib/fonts/essay-fonts";

describe("essayFontVariables", () => {
  it("lists the four essay font variables in order", () => {
    expect(essayFontVariables).toBe("--font-libre-baskerville --font-cormorant-face --font-im-fell --font-fraunces-face");
  });

  it("only the body and hero faces are preloaded", () => {
    expect(calls.Libre_Baskerville).not.toHaveProperty("preload");
    expect(calls.Fraunces).not.toHaveProperty("preload");
    expect(calls.Cormorant_Garamond).toMatchObject({ preload: false, style: ["italic"] });
    expect(calls.IM_Fell_English).toMatchObject({ preload: false, display: "swap" });
  });
});
