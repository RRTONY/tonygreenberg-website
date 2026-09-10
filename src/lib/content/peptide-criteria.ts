// Shared clinical-scoring criteria for /peptide-hall-of-shame, used by both
// the page (Server Component) and clinic-rankings.tsx (Client Component).
// Kept in a plain module rather than exported from the client file — a
// data constant re-exported from a "use client" module doesn't cross back
// into a Server Component correctly (only component references do), which
// broke this exact way (`CRITERIA.map is not a function`) when the page
// imported it from clinic-rankings.tsx.
export const CRITERIA = [
  {
    key: "contraindications",
    label: "Screens Contraindications",
    weight: 25,
    description: "Does the tool ask about conditions that would make peptide use dangerous?",
  },
  {
    key: "medicalHistory",
    label: "Asks Medical History",
    weight: 20,
    description: "Does it collect relevant health background before recommending?",
  },
  {
    key: "personalized",
    label: "Personalized Results",
    weight: 20,
    description: "Does it generate individualized recommendations based on answers?",
  },
  {
    key: "evidence",
    label: "Cites Evidence",
    weight: 15,
    description: "Are recommendations backed by peer-reviewed research?",
  },
  {
    key: "goals",
    label: "Asks Health Goals",
    weight: 10,
    description: "Does it understand what the user is trying to achieve?",
  },
  {
    key: "disclaimer",
    label: "Medical Disclaimer",
    weight: 10,
    description: "Does it include appropriate medical disclaimers?",
  },
] as const;
