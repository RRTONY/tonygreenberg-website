import { describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalError from "@/app/global-error";

type Html = ReactElement<{ lang: string; children: ReactElement<{ children: ReactNode }> }>;

// It brings its own <html>/<body>; render what's inside <body> instead (from
// inside a component, since GlobalError uses a hook).
function renderInsideBody(error: Error & { digest?: string }, retry = vi.fn()) {
  const seen: { lang?: string; bodyType?: unknown } = {};
  function Inside() {
    const html = GlobalError({ error, retry }) as Html;
    seen.lang = html.props.lang;
    seen.bodyType = html.props.children.type;
    return <>{html.props.children.props.children}</>;
  }
  render(<Inside />);
  return { seen, retry };
}

describe("global error page", () => {
  it("is a full English document with its own <title>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { seen } = renderInsideBody(new Error("x"));
    expect(seen.lang).toBe("en");
    expect(seen.bodyType).toBe("body");
    expect(document.querySelector("title")?.textContent).toBe("Something went wrong | Tony Greenberg");
  });

  it("shows one H1, a plain link home and a working retry button", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { retry } = renderInsideBody(Object.assign(new Error("secret detail"), { digest: "d1" }));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /homepage/i })).toHaveAttribute("href", "/");
    expect(screen.getByText("Reference: d1")).toBeInTheDocument();
    expect(screen.queryByText(/secret detail/)).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalled();
  });
});
