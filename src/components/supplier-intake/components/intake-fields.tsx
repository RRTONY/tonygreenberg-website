"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FieldDef } from "../data/supplier-intake.data";
import type { SupplierIntake } from "../hook/use-supplier-intake";

// The labelled inputs for one step, laid out two to a row like live.
const inputClass =
  "h-11 w-full rounded-lg border border-neutral-700 bg-[#111118] px-3 text-base text-neutral-200 placeholder:text-neutral-600 focus-visible:border-[#D4B96A] focus-visible:ring-1 focus-visible:ring-[#D4B96A]/30 aria-invalid:border-red-500 md:text-sm";
const textareaClass =
  "min-h-[90px] w-full rounded-lg border border-neutral-700 bg-[#111118] px-3 py-2 text-base text-neutral-200 outline-none placeholder:text-neutral-600 focus-visible:border-[#D4B96A] focus-visible:ring-1 focus-visible:ring-[#D4B96A]/30 aria-invalid:border-red-500 md:text-sm";

export function IntakeFields({ fields, intake }: { fields: FieldDef[]; intake: SupplierIntake }) {
  const { form, setField, errorFor } = intake;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((f) => {
        const id = `si-${f.name}`;
        const error = errorFor(f.name);
        const describedBy = [f.sub && `${id}-sub`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
        const value = form.values[f.name];
        const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": f.required || undefined };

        return (
          <div key={f.name} className={f.wide ? "md:col-span-2" : undefined}>
            <Label htmlFor={id} className="mb-1.5 font-mono text-sm tracking-wider text-[#D4B96A]">
              <span>
                {f.label}
                {f.required && <span className="ml-0.5 text-[#D4B96A]/60">*</span>}
              </span>
            </Label>
            {f.sub && (
              <p id={`${id}-sub`} className="mb-1.5 text-xs text-neutral-500">
                {f.sub}
              </p>
            )}
            {f.kind === "select" ? (
              <Select value={value} onValueChange={(v) => setField(f.name, v)}>
                <SelectTrigger {...common} className="h-11! w-full rounded-lg border border-neutral-700 bg-[#111118] text-neutral-200 aria-invalid:border-red-500 data-placeholder:text-neutral-500">
                  <SelectValue placeholder={f.placeholder} />
                </SelectTrigger>
                <SelectContent className="border border-neutral-700 bg-[#111118] text-neutral-200">
                  {f.options?.map((opt) => (
                    <SelectItem key={opt} value={opt} className="focus:bg-neutral-800 focus:text-neutral-100">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.kind === "textarea" ? (
              <textarea
                {...common}
                name={f.name.replaceAll("_", "-")}
                value={value}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={textareaClass}
              />
            ) : (
              <Input
                {...common}
                type={f.kind}
                name={f.name.replaceAll("_", "-")}
                autoComplete={f.kind === "email" ? "email" : f.kind === "tel" ? "tel" : f.name === "primary_contact_name" ? "name" : "off"}
                value={value}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={inputClass}
              />
            )}
            {error && (
              <p id={`${id}-err`} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
