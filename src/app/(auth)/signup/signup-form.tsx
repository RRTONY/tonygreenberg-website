"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions";

const schema = Yup.object({
  email: Yup.string().trim().email("Enter a valid email address.").required("Enter your email."),
  password: Yup.string().min(8, "Use at least 8 characters.").required("Choose a password."),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "The passwords don't match.")
    .required("Type the password again."),
});

const inputClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm";

export function SignUpForm({ next, referralCode }: { next: string; referralCode?: string }) {
  const [result, setResult] = useState<{ error?: string; message?: string }>();

  if (result?.message) {
    return (
      <p role="status" className="text-sm leading-relaxed text-foreground">
        {result.message}
      </p>
    );
  }

  return (
    <Formik
      initialValues={{ email: "", password: "", confirm: "" }}
      validationSchema={schema}
      onSubmit={async (values) => setResult(await signUp({ email: values.email, password: values.password, next, ref: referralCode }))}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4" noValidate>
          {(
            [
              ["email", "Email", "email", "email"],
              ["password", "Password", "password", "new-password"],
              ["confirm", "Confirm password", "password", "new-password"],
            ] as const
          ).map(([name, label, type, autoComplete]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <Label htmlFor={name}>{label}</Label>
              <Field id={name} name={name} type={type} autoComplete={autoComplete} className={inputClass} />
              <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
            </div>
          ))}
          {result?.error && (
            <p role="alert" className="text-sm text-destructive">
              {result.error}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="mt-2 min-h-11">
            {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Create account
          </Button>
        </Form>
      )}
    </Formik>
  );
}
