import { describe, expect, it } from "vitest";
import { MEDICINES } from "@/lib/content/pri-data";
import {
  getMedicineComplexityLevel,
  getMedicineSequenceGroups,
  MEDICINE_COMPLEXITY_ORDER,
} from "@/lib/content/medicine-sequencing";

describe("medicine sequencing", () => {
  it("groups every active PRI medicine once in the approved complexity order", () => {
    const groups = getMedicineSequenceGroups();
    const groupedIds = groups.flatMap((group) => group.medicines.map((medicine) => medicine.id));

    expect(groups.map((group) => group.level)).toEqual(
      MEDICINE_COMPLEXITY_ORDER.filter((level) =>
        MEDICINES.some((medicine) => getMedicineComplexityLevel(medicine) === level),
      ),
    );
    expect(groupedIds).toHaveLength(MEDICINES.length);
    expect(new Set(groupedIds).size).toBe(MEDICINES.length);
  });

  it("normalizes the legacy Gentle Entry label and sorts each rung by intensity", () => {
    const gentleEntryMedicine = MEDICINES.find(
      (medicine) => medicine.complexityLevel === "Gentle Entry",
    );
    const groups = getMedicineSequenceGroups();

    expect(gentleEntryMedicine).toBeDefined();
    expect(getMedicineComplexityLevel(gentleEntryMedicine!)).toBe("Entry");

    for (const group of groups) {
      const intensities = group.medicines.map((medicine) => medicine.intensity);
      expect(intensities).toEqual([...intensities].toSorted((left, right) => left - right));
    }
  });
});
