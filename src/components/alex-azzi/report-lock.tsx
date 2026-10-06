"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { unlockReport, type ReportUnlockState } from "@/app/alex-azzi/unlock-action";

// Live's lock screen for /alex-azzi (October 2026): dark page, "Restricted
// Access", "This report is password-protected.", one password field and an
// "Unlock Report" button. The check runs on the server; the report isn't in
// the page until it passes.
export function ReportLock({ gateKey }: { gateKey: string }) {
  const [state, formAction, pending] = useActionState<ReportUnlockState, FormData>(unlockReport, { error: false });
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#0E0E18] px-6 py-16">
      <div className="w-full max-w-110 text-center">
        <h1 className="mb-4 font-heading text-3xl font-black tracking-[0.04em] text-[#E8B923] uppercase sm:text-[2.6rem]">Restricted Access</h1>
        <p className="mb-10 text-lg text-[#C9C9D1]">This report is password-protected.</p>
        <form action={formAction}>
          <input type="hidden" name="key" value={gateKey} />
          <label htmlFor="report-password" className="sr-only">
            Password
          </label>
          <input
            id="report-password"
            name="password"
            type="password"
            placeholder="Enter password"
            autoFocus
            required
            aria-invalid={state.error || undefined}
            aria-describedby={state.error ? "report-password-error" : undefined}
            className={`mb-4 w-full border-2 bg-[#1A1A26] px-4 py-4 text-center font-mono text-lg tracking-[0.15em] text-white outline-none placeholder:text-[#8A8A96] focus-visible:ring-2 focus-visible:ring-[#E8B923] ${state.error ? "border-[#E0848A]" : "border-[#4A4A58]"}`}
          />
          {state.error && (
            <p id="report-password-error" role="alert" className="mb-4 font-mono text-sm text-[#E0848A]">
              That&apos;s not it. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex min-h-14 w-full items-center justify-center gap-2 bg-[#E8B923] font-sans text-base font-bold tracking-[0.12em] text-[#0E0E18] uppercase hover:bg-[#f2c73a] disabled:cursor-wait"
          >
            {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            Unlock Report
          </button>
        </form>
      </div>
    </div>
  );
}
