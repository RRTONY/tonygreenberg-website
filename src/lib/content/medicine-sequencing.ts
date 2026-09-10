import { MEDICINES, type Medicine } from "@/lib/content/pri-data";

export const MEDICINE_COMPLEXITY_ORDER = [
  "Entry",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Clinical Only",
  "Hard Stop",
] as const;

export type MedicineComplexityLevel = (typeof MEDICINE_COMPLEXITY_ORDER)[number];

export const MEDICINE_COMPLEXITY_DESCRIPTIONS: Record<MedicineComplexityLevel, string> = {
  Entry:
    "Gentle altered states with no expected hallucinations. A lower-intensity starting point for people new to non-ordinary states.",
  Beginner:
    "Mild to moderate altered states with shorter duration. Prior experience may be helpful, but is not always required.",
  Intermediate:
    "Significant altered states that require preparation, support, and careful attention to individual health considerations.",
  Advanced:
    "Profound altered states where experienced facilitation, medical screening, and substantial preparation are essential.",
  "Clinical Only":
    "Pharmaceutical-grade compounds intended for FDA-approved, clinical-trial, or otherwise supervised medical settings only.",
  "Hard Stop":
    "Substances with serious safety concerns or no established therapeutic application. They are included for harm-reduction context, not endorsement.",
};

const COMPLEXITY_ALIASES: Record<string, MedicineComplexityLevel> = {
  "Gentle Entry": "Entry",
};

export function getMedicineComplexityLevel(medicine: Medicine): MedicineComplexityLevel {
  const configuredLevel = medicine.complexityLevel;

  if (configuredLevel && configuredLevel in COMPLEXITY_ALIASES) {
    return COMPLEXITY_ALIASES[configuredLevel];
  }

  if (
    configuredLevel &&
    MEDICINE_COMPLEXITY_ORDER.includes(configuredLevel as MedicineComplexityLevel)
  ) {
    return configuredLevel as MedicineComplexityLevel;
  }

  return "Intermediate";
}

export type MedicineSequenceGroup = {
  level: MedicineComplexityLevel;
  medicines: Medicine[];
};

export function getMedicineSequenceGroups(
  medicines: readonly Medicine[] = MEDICINES,
): MedicineSequenceGroup[] {
  return MEDICINE_COMPLEXITY_ORDER.map((level) => ({
    level,
    medicines: medicines
      .filter((medicine) => getMedicineComplexityLevel(medicine) === level)
      .toSorted(
        (left, right) => left.intensity - right.intensity || left.name.localeCompare(right.name),
      ),
  })).filter((group) => group.medicines.length > 0);
}
