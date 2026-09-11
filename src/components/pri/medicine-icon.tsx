import type { ComponentPropsWithoutRef } from "react";
import {
  Atom,
  Brain,
  Droplets,
  Flower2,
  HeartPulse,
  Leaf,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

const MEDICINE_ICON_BY_ID: Record<string, LucideIcon> = {
  "5-meo-dmt": Sparkles,
  amanita: Sparkles,
  ayahuasca: Leaf,
  bufo: Droplets,
  cannabis: Leaf,
  changa: Leaf,
  dmt: Sparkles,
  iboga: Sprout,
  ibogaine: Atom,
  ketamine: HeartPulse,
  lsd: Brain,
  mdma: HeartPulse,
  mescaline: Flower2,
  peyote: Flower2,
  psilocybin: Sparkles,
  "san-pedro": Flower2,
};

type MedicineIconProps = {
  medicineId: string;
} & Omit<ComponentPropsWithoutRef<"svg">, "children">;

export function MedicineIcon({ medicineId, ...props }: MedicineIconProps) {
  const Icon = MEDICINE_ICON_BY_ID[medicineId] ?? Leaf;
  return <Icon aria-hidden="true" {...props} />;
}
