import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BottleScanner } from "@/components/soulsmoke/pages/bottle-scanner";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <BottleScanner />
    </SoulsmokeProviders>,
  );

const photo = (size = 10) => {
  const file = new File(["x".repeat(size)], "label.png", { type: "image/png" });
  return file;
};

async function upload(file = photo()) {
  fireEvent.change(screen.getByLabelText("Upload a bottle photo"), { target: { files: [file] } });
  await screen.findByRole("img", { name: "Uploaded bottle" });
}

const match = allMezcals[0];

describe("BottleScanner", () => {
  it("starts with the upload box and tips", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Bottle Scanner" })).toBeInTheDocument();
    expect(screen.getByText("Upload a bottle photo to see analysis")).toBeInTheDocument();
    expect(screen.getByText("• NOM number visible is a plus")).toBeInTheDocument();
  });

  it("refuses photos over 10MB and ignores an empty pick", () => {
    renderPage();
    const big = photo();
    Object.defineProperty(big, "size", { value: 11 * 1024 * 1024 });
    fireEvent.change(screen.getByLabelText("Upload a bottle photo"), { target: { files: [big] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Image too large. Please use an image under 10MB.");
    fireEvent.change(screen.getByLabelText("Upload a bottle photo"), { target: { files: [] } });
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("analyzes the photo, shows every result card and the database match, then resets", async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolve = r)));
    vi.stubGlobal("fetch", fetchMock);
    renderPage();
    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    expect(await screen.findByText("AI reading the label")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI Analyzing Label" })).toBeDisabled();

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/soul-smoke/bottle-scanner");
    expect(JSON.parse(init.body as string).imageBase64).toMatch(/^data:image\/png;base64,/);

    resolve(
      Response.json({
        identified: true,
        brand: match.brand,
        expression: "Something",
        producer: "Maestro X",
        agaveType: "Espadín",
        region: "Oaxaca",
        abv: "48%",
        nomNumber: "O123",
        confidence: "high",
        authenticity: "verified",
        warnings: ["Watch out"],
        recommendations: ["Sip slowly"],
        analysis: "A fine bottle.",
      }),
    );
    expect(await screen.findByText("IDENTIFIED AS")).toBeInTheDocument();
    expect(screen.getByText("Authentic")).toHaveClass("text-emerald-400");
    expect(screen.getByText("High Confidence")).toBeInTheDocument();
    for (const t of ["Maestro X", "Espadín", "Oaxaca", "48%", "O123", "Watch out", "Sip slowly", "A fine bottle."]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /FOUND IN OUR DATABASE/ })).toHaveAttribute(
      "href",
      `/soul-smoke/quadrant?bottle=${encodeURIComponent(match.id)}`,
    );

    fireEvent.click(screen.getByRole("button", { name: "Scan Another Bottle" }));
    expect(screen.getByText("Upload a bottle photo to see analysis")).toBeInTheDocument();
  });

  it("shows unknown and suspicious results with their labels", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ identified: false, confidence: "low", authenticity: "unknown", warnings: [], recommendations: [], analysis: "?" }),
      )
      .mockResolvedValueOnce(
        Response.json({
          identified: true,
          brand: "Zzz Unknown Brand",
          confidence: "medium",
          authenticity: "suspicious",
          warnings: [],
          recommendations: [],
          analysis: "Hmm.",
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    renderPage();
    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    expect(await screen.findByRole("heading", { name: "Unknown Bottle" })).toBeInTheDocument();
    expect(screen.getByText("Low Confidence")).toHaveClass("text-red-400");
    expect(screen.queryByText("DETAILS")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));
    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    expect(await screen.findByText("Suspicious")).toHaveClass("text-red-400");
    expect(screen.getByText("Medium Confidence")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /FOUND IN OUR DATABASE/ })).toBeNull();
  });

  it("shows the server's message on a 400 and a generic one when the network fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ message: "Please upload a JPEG, PNG, GIF or WebP image." }, { status: 400 }))
      .mockResolvedValueOnce(new Response("oops", { status: 500 }))
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    renderPage();
    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please upload a JPEG, PNG, GIF or WebP image.");
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Analysis failed. Please try again."));
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(screen.getByRole("alert")).toHaveTextContent("Analysis failed. Please try again.");
  });

  it("shrinks the photo when the browser can, and sends the original when it can't", async () => {
    const close = vi.fn();
    vi.stubGlobal("createImageBitmap", vi.fn(async () => ({ width: 4000, height: 3000, close })));
    const drawImage = vi.fn();
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValueOnce({ drawImage } as unknown as CanvasRenderingContext2D)
      .mockReturnValueOnce(null);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,SMALL");
    const fetchMock = vi.fn(async () => new Response("x", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    renderPage();

    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1568, 1176);
    expect(close).toHaveBeenCalled();
    expect(JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string).imageBase64).toBe(
      "data:image/jpeg;base64,SMALL",
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));
    await upload();
    fireEvent.click(screen.getByRole("button", { name: "Analyze This Bottle" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(JSON.parse((fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1].body as string).imageBase64).toMatch(
      /^data:image\/png;base64,/,
    );

    vi.stubGlobal("createImageBitmap", vi.fn(async () => Promise.reject(new Error("HEIC"))));
    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));
    await upload();
    expect(getContext).toHaveBeenCalledTimes(2);
  });

  it("reports a photo the browser can't read", async () => {
    vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(function (this: FileReader) {
      this.onerror?.(new ProgressEvent("error") as ProgressEvent<FileReader>);
    });
    renderPage();
    fireEvent.change(screen.getByLabelText("Upload a bottle photo"), { target: { files: [photo()] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Analysis failed. Please try again.");
    vi.restoreAllMocks();
  });
});
