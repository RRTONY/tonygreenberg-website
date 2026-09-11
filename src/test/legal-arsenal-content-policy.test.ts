import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Legal Arsenal content policy", () => {
  it("uses official regulator links and omits unsupported proposed-law claims", () => {
    const data = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content/attention-theft.ts"),
      "utf8",
    );
    const component = fs.readFileSync(
      path.join(process.cwd(), "src/components/manifesto/legal-arsenal.tsx"),
      "utf8",
    );

    expect(data).toContain(
      "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
    );
    expect(data).toContain("https://commission.europa.eu/law/law-topic/data-protection_en");
    expect(data).toContain("https://oag.ca.gov/privacy/ccpa");
    expect(data).toContain("https://crtc.gc.ca/eng/internet/anti/reg.htm");
    expect(data).not.toContain("Attention Theft Prevention Act");
    expect(data).not.toContain("AI Transparency in Communications Act");
    expect(data).not.toContain("nearly $1 trillion");
    expect(component).toContain("View official guidance");
    expect(component).not.toContain('value: "proposed"');
  });
});
