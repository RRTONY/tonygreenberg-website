import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const dataPath = "src/lib/content/soulscore.ts";
const componentPath = "src/components/assessments/soulscore-tool.tsx";

describe("SoulScore icon policy", () => {
  it("uses typed Lucide component references rather than raw Unicode icon data", () => {
    const data = fs.readFileSync(path.join(process.cwd(), dataPath), "utf8");
    const component = fs.readFileSync(path.join(process.cwd(), componentPath), "utf8");

    expect(data).toContain('import type { LucideIcon } from "lucide-react"');
    expect(data).toContain("icon: LucideIcon");
    expect(data).not.toMatch(/[◉◈🌍⚖🔗🏛🏘💎🏗♻✊🧬👤⚡👥🏢👑📊🪙💰]/u);
    expect(component).toContain("const Icon = d.icon");
    expect(component).toContain("const Icon = e.icon");
    expect(component).toContain("<AlertTriangle");
    expect(component).toContain("<Sparkles");
    expect(component).not.toMatch(/[⚠✦]/u);
  });
});
