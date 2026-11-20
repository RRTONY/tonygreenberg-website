import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottleScanner } from "@/components/liquidsun/pages/bottle-scanner";

const photo = () => new File([new Uint8Array([137, 80, 78, 71])], "label.png", { type: "image/png" });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

async function scan(respond: () => Promise<Response> | Response) {
  const user = userEvent.setup();
  fetchMock.mockImplementation(async () => respond());
  render(<BottleScanner />);
  expect(screen.getByRole("heading", { level: 1, name: "The Oracle" })).toBeInTheDocument();
  await user.upload(screen.getByLabelText("Upload a photo of a tequila label"), photo());
  return user;
}

describe("BottleScanner", () => {
  it("opens the file picker from the Scan Label button", () => {
    render(<BottleScanner />);
    const input = screen.getByLabelText("Upload a photo of a tequila label") as HTMLInputElement;
    const click = vi.spyOn(input, "click").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: /Scan Label/ }));
    expect(click).toHaveBeenCalled();
  });

  it("shows the scanning beam and flickering grid while the label is read", async () => {
    await scan(() => new Promise<Response>(() => {}));
    expect(await screen.findByText("Analyzing Spirit DNA...")).toBeInTheDocument();
    expect(screen.getByTestId("ls-scan-beam")).toHaveClass("ls-scan-beam");
    const cells = screen.getAllByTestId("ls-scan-cell");
    expect(cells).toHaveLength(16);
    expect(cells[0].style.animationDelay).toMatch(/s$/);
  });

  it("sends the photo and shows the reading, then scans another", async () => {
    const user = await scan(() =>
      Response.json({
        identified: true,
        name: "Fortaleza Blanco",
        nom: "1493",
        rarity: "Cult Favorite",
        soulScore: 98,
        evi: 92,
        notes: ["Olive Brine", "Butter"],
        verdict: "Certified Unicorn. Drink immediately.",
      }),
    );
    expect(await screen.findByRole("heading", { name: "Fortaleza Blanco" })).toBeInTheDocument();
    expect(screen.getByText("NOM 1493 • Cult Favorite")).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
    expect(screen.getByText("92/100")).toBeInTheDocument();
    expect(screen.getByText("Olive Brine")).toBeInTheDocument();
    expect(screen.getByText(/Certified Unicorn/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/liquid-sun/bottle-scanner");
    expect(JSON.parse(init.body).imageBase64).toMatch(/^data:image\/png;base64,/);

    await user.click(screen.getByRole("button", { name: "Scan Another" }));
    expect(await screen.findByRole("button", { name: /Scan Label/ })).toBeInTheDocument();
  });

  it("fills missing numbers with a dash and hides empty sections", async () => {
    await scan(() => Response.json({ identified: true, name: "Mystery", nom: null, rarity: null, soulScore: null, evi: null, notes: [], verdict: null }));
    expect(await screen.findByText("NOM —")).toBeInTheDocument();
    expect(screen.getByText("—/100")).toBeInTheDocument();
    expect(screen.queryByText("Detected Notes")).not.toBeInTheDocument();
    expect(screen.queryByText("The Verdict")).not.toBeInTheDocument();
  });

  it("says when the label couldn't be read", async () => {
    await scan(() => Response.json({ identified: false, name: null }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't read that label/);
  });

  it("shows the server's message on an error status", async () => {
    await scan(() => Response.json({ message: "Image too large. Please use an image under 5MB." }, { status: 400 }));
    expect(await screen.findByRole("alert")).toHaveTextContent("under 5MB");
  });

  it("falls back to a general message when an error has no body", async () => {
    await scan(() => new Response("oops", { status: 500 }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't read that label/);
  });

  it("doesn't spin forever when the connection drops", async () => {
    await scan(() => Promise.reject(new TypeError("Failed to fetch")));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Couldn't reach the Oracle/);
  });

  it("ignores an empty file choice", async () => {
    render(<BottleScanner />);
    fireEvent.change(screen.getByLabelText("Upload a photo of a tequila label"), { target: { files: [] } });
    await waitFor(() => expect(screen.getByRole("button", { name: /Scan Label/ })).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shrinks big photos through a canvas when the browser can", async () => {
    const close = vi.fn();
    vi.stubGlobal("createImageBitmap", vi.fn(async () => ({ width: 4000, height: 3000, close })));
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,AAAA");
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage: vi.fn() } as never);
    await scan(() => Response.json({ identified: false }));
    await screen.findByRole("alert");
    expect(toDataURL).toHaveBeenCalledWith("image/jpeg", 0.85);
    expect(close).toHaveBeenCalled();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).imageBase64).toBe("data:image/jpeg;base64,AAAA");
  });

  it("sends the original photo when the canvas can't be used", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn(async () => ({ width: 10, height: 10 })));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    await scan(() => Response.json({ identified: false }));
    await screen.findByRole("alert");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).imageBase64).toMatch(/^data:image\/png/);
  });

  it("sends the original photo when the image can't be decoded", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn(async () => Promise.reject(new Error("bad"))));
    await scan(() => Response.json({ identified: false }));
    await screen.findByRole("alert");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).imageBase64).toMatch(/^data:image\/png/);
  });
});
