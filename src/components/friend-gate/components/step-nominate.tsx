"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { ArrowRight, Loader2 } from "lucide-react";
import { startGate } from "@/app/friend-gate/actions";
import { gateButton, gateH1, gateInput, gateLabel, gateSub } from "../frame";
import type { GateStepProps } from "../friend-gate";

const schema = Yup.object({
  seekerName: Yup.string().trim().required("Please enter your first name."),
  friends: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().required("Add a name."),
        email: Yup.string().trim().email("Enter a valid email address.").required("Add an email address."),
      }),
    )
    .test("unique", "Use three different email addresses.", (list) => new Set((list ?? []).map((f) => f.email?.trim().toLowerCase())).size === 3),
});

export function StepNominate({ gate }: GateStepProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();

  return (
    <>
      <h1 className={gateH1}>Who are your three?</h1>
      <p className={gateSub}>Choose people who know you well and will be honest. Not cheerleaders — witnesses.</p>
      <Formik
        initialValues={{ seekerName: "", friends: [0, 1, 2].map(() => ({ name: "", email: "" })) }}
        validationSchema={schema}
        onSubmit={async (values) => {
          setError(undefined);
          const res = await startGate(values);
          if (res.token) router.push(`/friend-gate/${res.token}`);
          else setError(res.error);
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="seekerName" className={gateLabel}>
                Your first name
              </label>
              <Field id="seekerName" name="seekerName" autoComplete="given-name" className={gateInput} />
              <ErrorMessage name="seekerName" component="p" className="mt-1 text-sm text-[#B91C1C]" />
            </div>
            <FieldArray name="friends">
              {() =>
                [0, 1, 2].map((i) => (
                  <fieldset key={i} className="rounded-xl border border-[#FDE68A] p-4">
                    <legend className="px-1 text-xs font-semibold tracking-[.12em] text-[#B45309] uppercase">Friend {i + 1}</legend>
                    <label htmlFor={`friends.${i}.name`} className={gateLabel}>
                      Name
                    </label>
                    <Field id={`friends.${i}.name`} name={`friends.${i}.name`} className={gateInput} />
                    <ErrorMessage name={`friends.${i}.name`} component="p" className="mt-1 text-sm text-[#B91C1C]" />
                    <label htmlFor={`friends.${i}.email`} className={`${gateLabel} mt-3`}>
                      Email address
                    </label>
                    <Field id={`friends.${i}.email`} name={`friends.${i}.email`} type="email" className={gateInput} />
                    <ErrorMessage name={`friends.${i}.email`} component="p" className="mt-1 text-sm text-[#B91C1C]" />
                  </fieldset>
                ))
              }
            </FieldArray>
            {typeof errors.friends === "string" && <p className="text-sm text-[#B91C1C]">{errors.friends}</p>}
            <p className="text-[13px]/[1.6] text-[#92400E]">
              Each friend receives a unique, one-time link. They verify their identity with a code before responding. Their answers are anonymous
              — you&apos;ll see a summary, not their names or specific responses.
            </p>
            {error && (
              <p role="alert" className="text-sm text-[#B91C1C]">
                {error}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className={gateButton}>
              {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              Send invitations to all three
              {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
            </button>
            <button type="button" onClick={() => gate.onNext(1)} className="text-sm text-[#92400E] underline underline-offset-4">
              Back
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
