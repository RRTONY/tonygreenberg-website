import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readAppSource(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) return readAppSource(absolutePath);
    if (!entry.isFile() || !/\.(?:ts|tsx)$/u.test(entry.name)) return [];

    return [fs.readFileSync(absolutePath, "utf8")];
  });
}

describe("App Router prop type contract", () => {
  it("does not depend on generated Next.js global page or layout prop types", () => {
    const source = readAppSource(path.join(process.cwd(), "src/app")).join("\n");
    const declaration = fs.readFileSync(
      path.join(process.cwd(), "src/types/app-router-props.d.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/\b(?:PageProps|LayoutProps)</u);
    expect(source).toContain("AppPageProps<");
    expect(source).toContain("AppLayoutProps<");
    expect(declaration).toContain("type AppPageProps");
    expect(declaration).toContain("type AppLayoutProps");
  });
});
