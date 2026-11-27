import { describe, expect, it } from "vitest";
import { parseOracleReply } from "@/lib/content/liquidsun/oracle";

describe("parseOracleReply", () => {
  it("pulls the JSON out of the reply and tidies each field", () => {
    expect(
      parseOracleReply(
        'x {"identified":true,"name":"  G4 Blanco ","nom":"1579","rarity":"","soulScore":140,"evi":-3,"notes":[" Pine ","",7,"a","b","c","d","e"],"verdict":"Drink it."} y',
      ),
    ).toEqual({
      identified: true,
      name: "G4 Blanco",
      nom: "1579",
      rarity: null,
      soulScore: 100,
      evi: 0,
      notes: ["Pine", "a", "b", "c", "d", "e"],
      verdict: "Drink it.",
    });
  });

  it("is not identified without a name, and tolerates missing fields", () => {
    expect(parseOracleReply('{"identified":true}')).toEqual({
      identified: false,
      name: null,
      nom: null,
      rarity: null,
      soulScore: null,
      evi: null,
      notes: [],
      verdict: null,
    });
  });

  it("throws when there is no JSON object", () => {
    expect(() => parseOracleReply("no json")).toThrow(/No JSON/);
    expect(() => parseOracleReply("} {")).toThrow(/No JSON/);
  });
});
