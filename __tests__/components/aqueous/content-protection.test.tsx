import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentProtection } from "@/components/aqueous/content-protection";

// Dispatches a cancelable event and says whether the page blocked it.
function blocked(target: EventTarget, event: Event) {
  target.dispatchEvent(event);
  return event.defaultPrevented;
}
const contextMenu = () => new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
const key = (init: KeyboardEventInit) => new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
const drag = () => new Event("dragstart", { bubbles: true, cancelable: true });

function page() {
  document.body.innerHTML = `
    <p id="text">Water</p>
    <input id="field" />
    <textarea id="area"></textarea>
    <select id="pick"></select>
    <div id="editable" contenteditable="true"></div>
    <div data-shareable><span id="shareable">Share</span></div>
    <div class="share-zone"><span id="zone">Zone</span></div>
    <div class="referral-zone"><span id="ref">Ref</span></div>
    <img id="photo" alt="" />`;
  return (id: string) => document.getElementById(id)!;
}

afterEach(() => {
  delete (window as unknown as Record<string, unknown>).ontouchstart;
  document.body.innerHTML = "";
});

describe("ContentProtection", () => {
  it("renders nothing", () => {
    const { container } = render(<ContentProtection />);
    expect(container).toBeEmptyDOMElement();
  });

  it("blocks right-click on content but not on inputs or sharing elements", () => {
    render(<ContentProtection />);
    const el = page();
    expect(blocked(el("text"), contextMenu())).toBe(true);
    for (const id of ["field", "area", "pick", "shareable", "zone", "ref"]) {
      expect(blocked(el(id), contextMenu()), id).toBe(false);
    }
    // jsdom doesn't compute isContentEditable; a stand-in shows the check.
    const editable = el("editable");
    Object.defineProperty(editable, "isContentEditable", { value: true });
    expect(blocked(editable, contextMenu())).toBe(false);
  });

  it("leaves right-click alone on touch devices (long-press share)", () => {
    (window as unknown as Record<string, unknown>).ontouchstart = null;
    render(<ContentProtection />);
    expect(blocked(page()("text"), contextMenu())).toBe(false);
  });

  it("blocks the source-view and save shortcuts, not copy", () => {
    render(<ContentProtection />);
    expect(blocked(document, key({ key: "F12" }))).toBe(true);
    expect(blocked(document, key({ key: "u", ctrlKey: true }))).toBe(true);
    expect(blocked(document, key({ key: "S", ctrlKey: true }))).toBe(true);
    expect(blocked(document, key({ key: "I", ctrlKey: true, shiftKey: true }))).toBe(true);
    expect(blocked(document, key({ key: "j", ctrlKey: true, shiftKey: true }))).toBe(true);
    expect(blocked(document, key({ key: "c", ctrlKey: true }))).toBe(false);
    expect(blocked(document, key({ key: "u", ctrlKey: true, shiftKey: true }))).toBe(false);
    expect(blocked(document, key({ key: "i", ctrlKey: true }))).toBe(false);
    expect(blocked(document, key({ key: "s" }))).toBe(false);
  });

  it("blocks dragging images only", () => {
    render(<ContentProtection />);
    const el = page();
    expect(blocked(el("photo"), drag())).toBe(true);
    expect(blocked(el("text"), drag())).toBe(false);
  });

  it("stops blocking once the page is left", () => {
    const { unmount } = render(<ContentProtection />);
    unmount();
    const el = page();
    expect(blocked(el("text"), contextMenu())).toBe(false);
    expect(blocked(document, key({ key: "F12" }))).toBe(false);
    expect(blocked(el("photo"), drag())).toBe(false);
  });
});
