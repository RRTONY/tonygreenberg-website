import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("production deployment contract", () => {
  it("builds the Next.js standalone server output required by the managed runtime", () => {
    const nextConfig = readProjectFile("next.config.ts");

    expect(nextConfig).toMatch(/output:\s*["']standalone["']/u);
  });

  it("uses a server-owned Docker runtime instead of a Vite-style dist/public artifact", () => {
    const dockerfile = readProjectFile("Dockerfile");

    expect(dockerfile).toContain(".next/standalone");
    expect(dockerfile).toContain(".next/static");
    expect(dockerfile).toContain("COPY --from=builder /app/node_modules ./node_modules");
    expect(dockerfile).toContain('CMD ["node", "server.js"]');
    expect(dockerfile).not.toContain("dist/public");
  });
});
