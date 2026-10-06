"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updatePassword } from "../actions";

const schema = Yup.object({
  password: Yup.string().min(8, "Use at least 8 characters.").required("Choose a password."),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "The passwords don't match.")
    .required("Type the password again."),
});

const inputClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm";

export function ResetPasswordForm() {
  const [error, setError] = useState<string>();
  return (
    <Formik
      initialValues={{ password: "", confirm: "" }}
      validationSchema={schema}
      onSubmit={async (values) => setError((await updatePassword({ password: values.password }))?.error)}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4" noValidate>
          {(
            [
              ["password", "New password"],
              ["confirm", "Confirm new password"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <Label htmlFor={name}>{label}</Label>
              <Field id={name} name={name} type="password" autoComplete="new-password" className={inputClass} />
              <ErrorMessage name={name} component="p" className="text-sm text-destructive" />
            </div>
          ))}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="mt-2 min-h-11">
            {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Save new password
          </Button>
        </Form>
      )}
    </Formik>
  );
}
