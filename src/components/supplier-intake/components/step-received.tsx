"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supplierIntakeData } from "../data/supplier-intake.data";
import type { StepProps } from "../supplier-intake";

// Step 4: shown after a successful submission, same copy as legacy.
export function StepReceived({ intake }: StepProps) {
  const copy = supplierIntakeData.received;
  return (
    <div role="status" className="mx-auto max-w-xl py-10 text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto mb-6 size-16 text-[#D4B96A]" />
      <h2 className="mb-4 font-heading text-3xl text-neutral-100">{copy.title}</h2>
      <p className="mb-6 leading-relaxed text-neutral-400">{copy.body}</p>
      {intake.supplierId && (
        <p className="mb-8 font-mono text-xs text-neutral-500">
          {copy.reference} {intake.supplierId}
        </p>
      )}
      <Button asChild variant="outline" className="min-h-11 border-[#D4B96A]/40 bg-transparent text-[#D4B96A] hover:bg-[#D4B96A]/10 hover:text-[#D4B96A]">
        <Link href="/">{copy.home}</Link>
      </Button>
    </div>
  );
}
