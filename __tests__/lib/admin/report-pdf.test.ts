// @vitest-environment node
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { REPORT_DEFAULTS, generateReportPdf, type ReportInput } from "@/lib/admin/report-pdf";

// react-pdf compresses each page's drawing commands (FlateDecode), so the
// text is only readable after inflating every stream. Helvetica text is
// written as hex glyph codes, so decode those back to characters too.
function pdfText(pdf: Buffer): string {
  const raw = pdf.toString("latin1");
  const parts: string[] = [raw];
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end === -1) break;
    try {
      parts.push(inflateSync(pdf.subarray(start, end)).toString("latin1"));
    } catch {
      // not a compressed stream (e.g. an image or font); skip it
    }
  }
  const all = parts.join("\n");
  const hex = [...all.matchAll(/<([0-9a-fA-F]+)>\s*-?\d*\s*/g)].map((h) => h[1]);
  const decoded = hex
    .map((h) => h.match(/../g)!.map((b) => String.fromCharCode(parseInt(b, 16))).join(""))
    .join("");
  return `${all}\n${decoded}`;
}

const base: ReportInput = {
  title: "Weekly Traffic Summary",
  subtitle: "tonygreenberg.com, first week live",
  date: "October 16, 2026",
  sections: [
    {
      heading: "Highlights",
      paragraphs: ["Traffic held steady after the move."],
      bullets: ["Essays up", "Quizzes steady"],
      steps: ["Check Search Console", "Fix the two 404s"],
      callout: "No errors on the live site.",
      table: { headers: ["Page", "Views"], rows: [["/blog", "120"]] },
    },
  ],
};

describe("generateReportPdf", () => {
  it("renders a real PDF carrying the title, the sections and the Tony Greenberg branding", async () => {
    const pdf = await generateReportPdf(base);
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(1000);
    const text = pdfText(pdf);
    // Document metadata keeps the title verbatim.
    expect(text).toContain("Weekly Traffic Summary");
    expect(text).toContain("Tony Greenberg");
    for (const s of ["Highlights", "Fix the two 404s", "No errors on the live site.", "TONY GREENBERG", REPORT_DEFAULTS.eyebrow.toUpperCase()]) {
      expect(text, s).toContain(s);
    }
    expect(text).not.toMatch(/RampRate/i);
  }, 60000);

  it("adds the document information and contents page when documentInfo is given", async () => {
    const plain = await generateReportPdf(base);
    const withInfo = await generateReportPdf({
      ...base,
      eyebrow: "Internal Guide",
      preparedBy: "Kimberly",
      documentInfo: { version: "1.2", owner: "Tony", classification: "Internal use only" },
    });
    const text = pdfText(withInfo);
    for (const s of ["Document information", "Contents", "Internal use only", "INTERNAL GUIDE", "Prepared by Kimberly"]) expect(text, s).toContain(s);
    expect(pdfText(plain)).not.toContain("Document information");
    // One extra page.
    const pages = (b: Buffer) => (b.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages(withInfo)).toBe(pages(plain) + 1);
  }, 60000);
});
