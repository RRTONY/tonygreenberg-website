import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const SOURCE_ROOTS = ["src/app", "src/components"];
const INTERACTIVE_TAGS = new Set(["a", "button", "Link"]);
const FORBIDDEN_UI_SYMBOLS = /[\u{1F300}-\u{1FAFF}←→]/u;

function findTsxFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findTsxFiles(entryPath);
    return entry.name.endsWith(".tsx") ? [entryPath] : [];
  });
}

function isInsideInteractiveElement(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  let current: ts.Node | undefined = node.parent;

  while (current) {
    if (ts.isJsxElement(current)) {
      const tagName = current.openingElement.tagName.getText(sourceFile);
      if (INTERACTIVE_TAGS.has(tagName)) return true;
    }
    current = current.parent;
  }

  return false;
}

function isInsideJsx(node: ts.Node): boolean {
  let current: ts.Node | undefined = node.parent;

  while (current) {
    if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) return true;
    current = current.parent;
  }

  return false;
}

function isRenderedStringLiteral(node: ts.StringLiteral): boolean {
  let current: ts.Node | undefined = node.parent;

  while (current && !ts.isJsxExpression(current)) {
    if (ts.isCallExpression(current) || ts.isPropertyAccessExpression(current)) return false;
    current = current.parent;
  }

  return Boolean(current);
}

function isShortUiIndicator(text: string): boolean {
  if (!/[←→]/u.test(text)) return false;
  const label = text.replace(/[←→]/gu, "").replace(/\s+/g, " ").trim();
  return label.length <= 64 && !/[.!?]$/u.test(label);
}

function findForbiddenControlText(filePath: string): string[] {
  const code = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const violations: string[] = [];

  const visit = (node: ts.Node) => {
    const isUiText =
      ts.isJsxText(node) || (ts.isStringLiteral(node) && isRenderedStringLiteral(node));
    if (isUiText && isInsideInteractiveElement(node, sourceFile)) {
      const text = node
        .getText(sourceFile)
        .replace(/^["']|["']$/g, "")
        .trim();
      if (FORBIDDEN_UI_SYMBOLS.test(text)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        violations.push(
          `${path.relative(process.cwd(), filePath)}:${line + 1}:${character + 1} ${text}`,
        );
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return violations;
}

function findForbiddenStatusText(filePath: string): string[] {
  const code = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const violations: string[] = [];

  const visit = (node: ts.Node) => {
    const isUiText =
      ts.isJsxText(node) || (ts.isStringLiteral(node) && isRenderedStringLiteral(node));
    if (isUiText && !isInsideInteractiveElement(node, sourceFile) && isInsideJsx(node)) {
      const text = node
        .getText(sourceFile)
        .replace(/^["']|["']$/g, "")
        .trim();
      if (isShortUiIndicator(text)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        violations.push(
          `${path.relative(process.cwd(), filePath)}:${line + 1}:${character + 1} ${text}`,
        );
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return violations;
}

describe("interface symbol policy", () => {
  it("uses semantic icon components rather than emoji or raw arrows in interactive controls", () => {
    const files = SOURCE_ROOTS.flatMap((directory) =>
      findTsxFiles(path.join(process.cwd(), directory)),
    );
    const violations = files.flatMap(findForbiddenControlText);

    expect(violations).toEqual([]);
  });

  it("does not use raw arrows in short rendered status or indicator labels", () => {
    const files = SOURCE_ROOTS.flatMap((directory) =>
      findTsxFiles(path.join(process.cwd(), directory)),
    );
    const violations = files.flatMap(findForbiddenStatusText);

    expect(violations).toEqual([]);
  });
});
