"use client";

import { useState } from "react";
import { checkCode, sendCode, submitFriendSurvey } from "@/app/friend-survey/[token]/actions";

// The friend survey's ONE shared state (CONTRIBUTING rule 19): step
// 1 identity, 2 code, 3 survey, 4 done; plus the email, answers and status.
export function useFriendSurvey(token: string, alreadyVerified: boolean) {
  const [state, setState] = useState({
    step: alreadyVerified ? 3 : 1,
    email: "",
    answers: {} as Record<string, number | string>,
    pending: false,
    error: null as string | null,
  });
  const update = (data: Partial<typeof state>) => setState((prev) => ({ ...prev, ...data }));

  const run = async (fn: () => Promise<{ error?: string }>, nextStep: number) => {
    update({ pending: true, error: null });
    const res = await fn();
    update(res.error ? { pending: false, error: res.error } : { pending: false, step: nextStep });
  };

  return {
    state,
    update,
    requestCode: () => run(() => sendCode(token, state.email), 2),
    resendCode: () => run(() => sendCode(token, state.email), 2),
    verify: (code: string) => run(() => checkCode(token, code), 3),
    submit: () => run(() => submitFriendSurvey(token, state.answers), 4),
  };
}
