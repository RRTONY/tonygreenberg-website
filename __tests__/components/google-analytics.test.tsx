import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoogleAnalytics } from "@/components/google-analytics";

// Runs the inline script against a stand-in window so we can see what it does per host.
function runOn(hostname: string) {
  render(<GoogleAnalytics />);
  const code = screen.getByTestId("google-analytics").textContent ?? "";
  const appended: { src?: string; async?: boolean }[] = [];
  const fakeWindow: Record<string, unknown> & { location: { hostname: string } } = { location: { hostname } };
  const fakeDocument = {
    createElement: () => ({}) as { src?: string; async?: boolean },
    head: { appendChild: (el: { src?: string }) => appended.push(el) },
  };
  new Function("window", "document", code)(fakeWindow, fakeDocument);
  return { fakeWindow, appended, code };
}

describe("GoogleAnalytics", () => {
  it("loads gtag with the real measurement id on tonygreenberg.com", () => {
    const { fakeWindow, appended } = runOn("tonygreenberg.com");
    expect(typeof fakeWindow.gtag).toBe("function");
    expect(appended[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-4GVW40S47N");
    const calls = (fakeWindow.dataLayer as IArguments[]).map((a) => Array.from(a));
    expect(calls[1]).toEqual(["config", "G-4GVW40S47N", { cookie_flags: "SameSite=None;Secure" }]);
  });

  it("also loads on www.tonygreenberg.com", () => {
    expect(runOn("www.tonygreenberg.com").appended).toHaveLength(1);
  });

  it.each(["localhost", "deploy-preview-12--tonygreenberg-website.netlify.app"])("loads nothing on %s", (host) => {
    const { fakeWindow, appended } = runOn(host);
    expect(fakeWindow.gtag).toBeUndefined();
    expect(appended).toHaveLength(0);
  });
});
