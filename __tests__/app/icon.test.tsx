// @vitest-environment node
import { describe, expect, it } from "vitest";
import Icon, { size, contentType } from "@/app/icon";

describe("favicon", () => {
  it("is a 32x32 PNG", () => {
    expect(size).toEqual({ width: 32, height: 32 });
    expect(contentType).toBe("image/png");
  });

  it("draws a real PNG image", async () => {
    const res = Icon();
    expect(res).toBeInstanceOf(Response);
    expect(res.headers.get("content-type")).toBe("image/png");
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });
});
