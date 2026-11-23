import { describe, expect, it } from "vitest";
import { claimSchema, projectSchema } from "@/lib/content/aqueous/forms";

async function errorOf(schema: { validate: (v: unknown) => Promise<unknown> }, value: unknown) {
  try {
    await schema.validate(value);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

describe("claimSchema", () => {
  it("accepts an email, trimmed, with or without a name (empty is fine)", async () => {
    expect(await claimSchema.validate({ email: "  me@example.com ", name: "  Mia " })).toEqual({ email: "me@example.com", name: "Mia" });
    expect(await claimSchema.validate({ email: "me@example.com", name: "" })).toEqual({ email: "me@example.com", name: "" });
    expect(await claimSchema.validate({ email: "me@example.com" })).toEqual({ email: "me@example.com" });
  });

  it.each([
    [{ email: "" }, "Please enter your email."],
    [{}, "Please enter your email."],
    [{ email: "nope" }, "Please enter a valid email."],
    [{ email: "me@example.com", name: "x".repeat(256) }, "That name is too long."],
  ])("rejects %j", async (value, message) => {
    expect(await errorOf(claimSchema, value)).toBe(message);
  });
});

describe("projectSchema", () => {
  it("accepts a full http(s) address or a site path, with empty optional fields", async () => {
    expect(await projectSchema.validate({ name: " Aqueous ", url: " https://tonygreenberg.com/aqueous ", description: "", tag: "" })).toEqual({
      name: "Aqueous",
      url: "https://tonygreenberg.com/aqueous",
      description: "",
      tag: "",
    });
    expect(await errorOf(projectSchema, { name: "A", url: "http://example.com" })).toBeNull();
    expect(await errorOf(projectSchema, { name: "A", url: "/aqueous/explore" })).toBeNull();
  });

  const URL_ERROR = "Please enter a full address (https://...) or a path starting with /.";
  it.each([
    [{ name: "A", url: "" }, "Please enter a URL."],
    [{ name: "A", url: "//evil.com" }, URL_ERROR],
    [{ name: "A", url: "javascript:alert(1)" }, URL_ERROR],
    [{ name: "A", url: "example.com" }, URL_ERROR],
    [{ name: "A", url: `https://x.com/${"a".repeat(500)}` }, expect.stringContaining("500")],
    [{ name: "x".repeat(256), url: "/a" }, expect.stringContaining("255")],
    [{ name: "A", url: "/a", tag: "t".repeat(51) }, expect.stringContaining("50")],
    [{ name: "A", url: "/a", description: "d".repeat(2001) }, expect.stringContaining("2000")],
  ])("rejects %#", async (value, message) => {
    expect(await errorOf(projectSchema, value)).toEqual(message);
  });

  it("rejects a missing name", async () => {
    expect(await errorOf(projectSchema, { url: "/a" })).toBe("Please enter a project name.");
  });

  it("rejects an empty or blank name with the form's own message", async () => {
    expect(await errorOf(projectSchema, { name: "", url: "/a" })).toBe("Please enter a project name.");
    expect(await errorOf(projectSchema, { name: "   ", url: "/a" })).toBe("Please enter a project name.");
  });
});
