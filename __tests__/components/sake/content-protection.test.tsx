import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentProtection, CopyrightNotice, Watermark } from "@/components/sake/content-protection";
import { SakeImage } from "@/components/sake/sake-image";
import SakeNotFound from "@/app/sake/not-found";

function copyEvent(target: EventTarget) {
  const setData = vi.fn();
  const event = new Event("copy", { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, "clipboardData", { value: { setData } });
  target.dispatchEvent(event);
  return { event, setData };
}

function selectText(text: string) {
  vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => text } as Selection);
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ContentProtection", () => {
  it("blocks right-click and dragging on pictures and protected content only", () => {
    const { unmount } = render(
      <>
        <ContentProtection />
        <p>Plain text</p>
        <div data-protected="true">
          <span>EXV chart</span>
        </div>
        {/* A raw <img> on purpose: the listener checks the IMG tag name. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="bottle" src="/x.png" />
      </>,
    );
    expect(fireEvent.contextMenu(screen.getByText("Plain text"))).toBe(true);
    expect(fireEvent.contextMenu(screen.getByText("EXV chart"))).toBe(false);
    expect(fireEvent.contextMenu(screen.getByAltText("bottle"))).toBe(false);
    expect(fireEvent.dragStart(screen.getByAltText("bottle"))).toBe(false);
    expect(fireEvent.dragStart(screen.getByText("Plain text"))).toBe(true);
    unmount();
    // Listeners are gone once the section is left.
    document.body.innerHTML = '<img alt="later" src="/y.png" />';
    expect(fireEvent.contextMenu(screen.getByAltText("later"))).toBe(true);
  });

  it("blocks view-source, save and F12 shortcuts", () => {
    render(<ContentProtection />);
    expect(fireEvent.keyDown(document, { key: "u", ctrlKey: true })).toBe(false);
    expect(fireEvent.keyDown(document, { key: "S", ctrlKey: true })).toBe(false);
    expect(fireEvent.keyDown(document, { key: "F12" })).toBe(false);
    expect(fireEvent.keyDown(document, { key: "c", ctrlKey: true })).toBe(true);
  });

  it("adds the credit line to a short copy and cuts a long copy with the full notice", () => {
    render(
      <>
        <ContentProtection />
        <p>Copy me</p>
      </>,
    );
    selectText("Junmai");
    const short = copyEvent(screen.getByText("Copy me"));
    expect(short.event.defaultPrevented).toBe(true);
    expect(short.setData).toHaveBeenCalledWith("text/plain", "Junmai\n— Sake for Sake's Sake™");

    const long = "a".repeat(600);
    selectText(long);
    const cut = copyEvent(screen.getByText("Copy me"));
    const text = cut.setData.mock.calls[0][1] as string;
    expect(text.startsWith(`${"a".repeat(200)}...`)).toBe(true);
    expect(text).toContain("EXV™ is a proprietary scoring system.");
  });

  it("leaves copying alone in form fields and when nothing is selected", () => {
    render(
      <>
        <ContentProtection />
        <textarea aria-label="note" defaultValue="my note" />
        <p>Nothing</p>
      </>,
    );
    selectText("my note");
    const field = copyEvent(screen.getByLabelText("note"));
    expect(field.event.defaultPrevented).toBe(false);
    expect(field.setData).not.toHaveBeenCalled();

    selectText("");
    const empty = copyEvent(screen.getByText("Nothing"));
    expect(empty.event.defaultPrevented).toBe(false);
  });
});

describe("Watermark and CopyrightNotice", () => {
  it("wraps content as protected with the stripe overlay", () => {
    const { container } = render(
      <>
        <Watermark className="mt-4">
          <p>Scores</p>
        </Watermark>
        <Watermark>
          <p>Plain</p>
        </Watermark>
      </>,
    );
    const first = screen.getByText("Scores").parentElement!;
    expect(first).toHaveAttribute("data-protected", "true");
    expect(first).toHaveClass("relative", "mt-4");
    expect(screen.getByText("Plain").parentElement).toHaveClass("relative");
    expect(container.querySelectorAll(".sk-watermark")).toHaveLength(2);
  });

  it("shows the notice and the four links under /sake", () => {
    render(<CopyrightNotice />);
    expect(screen.getByText(/The EXV™ \(Experience Value\) scoring system/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/sake/privacy");
    expect(screen.getByRole("link", { name: "DMCA" })).toHaveAttribute("href", "/sake/dmca");
  });
});

describe("SakeImage", () => {
  it("draws the ink-wash stand-in while a picture has no Sanity copy", () => {
    const { container } = render(<SakeImage image={null} className="absolute inset-0" />);
    const wash = container.firstElementChild!;
    expect(wash).toHaveClass("sk-image-wash", "absolute", "inset-0");
    expect(wash).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the picture with its alt text once it has one", () => {
    render(
      <SakeImage
        image={{ src: "https://cdn.sanity.io/images/x/y/a.jpg", width: 10, height: 5, alt: "A sake bottle" }}
        className="object-cover"
        priority
      />,
    );
    expect(screen.getByAltText("A sake bottle")).toHaveClass("object-cover");
  });
});

describe("Sake 404", () => {
  it("says the page wasn't found and links home to /sake", () => {
    render(<SakeNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/sake");
  });
});
