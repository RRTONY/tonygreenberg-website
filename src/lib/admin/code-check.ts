import { ESLint } from "eslint";
import path from "path";

export interface CodeCheckMessage {
  line: number;
  severity: "error" | "warning";
  message: string;
  ruleId: string | null;
}

export interface CodeCheckResult {
  eslint: {
    errorCount: number;
    warningCount: number;
    messages: CodeCheckMessage[];
  };
  patternIssues: string[];
}

// This project's own house rules (CONTRIBUTING.md) that are cheap to check
// mechanically, on top of whatever generic ESLint already catches. Skips
// `src/components/ui/` (shadcn-generated files are exempt from the
// inline-style rule per CONTRIBUTING.md) and `globals.css` (the one
// documented raw-hex exception).
const PATTERN_CHECKS: Array<{
  test: (content: string, filePath: string) => boolean;
  message: string;
}> = [
  {
    test: (c, f) => !f.includes("components/ui/") && /style=\{\{/.test(c),
    message: "Inline style={{...}} found — use a Tailwind class instead (CONTRIBUTING.md's one documented exception is a build-time-unknowable dynamic value, e.g. a progress-bar width driven by state).",
  },
  {
    test: (c) => /<img[\s>]/.test(c),
    message: "Raw <img> tag found — use next/image's <Image> component instead.",
  },
  {
    test: (c) => /from ["']framer-motion["']/.test(c),
    message: "framer-motion import found — this project doesn't carry that dependency; use CSS transitions or tailwindcss-animate instead.",
  },
  {
    test: (c) => /bg-gradient-to-/.test(c),
    message: "Non-canonical Tailwind class `bg-gradient-to-*` found — this project's Tailwind v4 setup uses `bg-linear-to-*`.",
  },
  {
    test: (c) => /\bz-\[9999\]/.test(c),
    message: "Non-canonical Tailwind class `z-[9999]` found — use `z-9999`.",
  },
  {
    test: (c, f) => f.includes("write-client") === false && /from ["']@\/lib\/sanity\/write-client["']/.test(c) && /^"use client"/.test(c.trimStart()),
    message: "write-client.ts imported from a file that starts with \"use client\" — write-client.ts is server-only (enforced by its own server-only import) and must never reach a Client Component bundle.",
  },
];

export async function checkCode(filePath: string, content: string): Promise<CodeCheckResult> {
  const absolutePath = path.join(process.cwd(), filePath);

  const eslint = new ESLint({ cwd: process.cwd() });
  const isIgnored = await eslint.isPathIgnored(absolutePath).catch(() => false);
  let eslintResult: CodeCheckResult["eslint"] = { errorCount: 0, warningCount: 0, messages: [] };
  if (!isIgnored && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
    const [result] = await eslint.lintText(content, { filePath: absolutePath });
    eslintResult = {
      errorCount: result?.errorCount ?? 0,
      warningCount: result?.warningCount ?? 0,
      messages: (result?.messages ?? []).map((m) => ({
        line: m.line ?? 0,
        severity: m.severity === 2 ? "error" : "warning",
        message: m.message,
        ruleId: m.ruleId,
      })),
    };
  }

  const patternIssues = PATTERN_CHECKS.filter((p) => p.test(content, filePath)).map((p) => p.message);

  return { eslint: eslintResult, patternIssues };
}
