"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { submitSupplierIntake } from "@/app/supplier-intake/actions";
import { EMPTY_VALUES, STEP_FIELDS, TOTAL_FORM_STEPS, supplierIntakeData } from "../data/supplier-intake.data";
import { STEP_SCHEMAS } from "../data/supplier-intake.schema";

// The supplier intake's ONE shared state: which step is showing, the answers
// (a Formik form validated one step at a time with that step's Yup schema),
// the reference returned on success, and whether the site can submit at all.
// Steps read it and call these actions; nothing else holds form state.
export function useSupplierIntake(canSubmit: boolean) {
  const [step, setStep] = useState(1);
  const [supplierId, setSupplierId] = useState<string>();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const form = useFormik({
    initialValues: EMPTY_VALUES,
    validationSchema: () => STEP_SCHEMAS[step] ?? STEP_SCHEMAS[TOTAL_FORM_STEPS],
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const res = await submitSupplierIntake(values);
      if (!res.ok) {
        toast.error(`Submission failed: ${res.error}`);
        return;
      }
      setSupplierId(res.supplierId);
      setStep(TOTAL_FORM_STEPS + 1);
      scrollTop();
    },
  });

  // Validate the current step; mark its fields touched so errors show.
  const checkStep = async () => {
    const errors = await form.validateForm();
    const names = STEP_FIELDS[step]?.map((f) => f.name) ?? [];
    form.setTouched(Object.fromEntries(names.map((n) => [n, true])), false);
    return names.every((n) => !errors[n]);
  };

  const onNext = async () => {
    if (!(await checkStep())) {
      toast.error(supplierIntakeData.missingFields);
      return;
    }
    form.setErrors({});
    setStep((s) => s + 1);
    scrollTop();
  };

  const back = () => {
    form.setErrors({});
    setStep((s) => Math.max(1, s - 1));
    scrollTop();
  };

  const submit = async () => {
    if (!(await checkStep())) {
      toast.error(supplierIntakeData.missingFieldsFinal);
      return;
    }
    await form.submitForm();
  };

  const setField = (name: string, value: string) => {
    form.setFieldValue(name, value, false);
    if (form.errors[name as keyof typeof form.errors]) form.setFieldError(name, undefined);
  };

  const errorFor = (name: string) =>
    form.touched[name as keyof typeof form.touched] ? form.errors[name as keyof typeof form.errors] : undefined;

  return { step, supplierId, canSubmit, form, onNext, back, submit, setField, errorFor };
}

export type SupplierIntake = ReturnType<typeof useSupplierIntake>;
