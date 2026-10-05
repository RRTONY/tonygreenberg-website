import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordReferral } from "@/lib/referrals";
import { safeNext } from "@/lib/auth";

// Where Supabase's emails land (confirm sign-up, reset password): swaps the
// one-time code for a session, records an invite if the member signed up
// through one, then continues to `next`.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const ref = data.user?.user_metadata?.referral_code;
      if (data.user && typeof ref === "string") await recordReferral(data.user.id, ref);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=link`);
}
