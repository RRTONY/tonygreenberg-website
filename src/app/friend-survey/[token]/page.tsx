import type { Metadata } from "next";
import { getSlot } from "@/lib/friend-gate";
import { FriendSurvey } from "@/components/friend-survey/friend-survey";
import { GateFrame, gateH1, gateSub } from "@/components/friend-gate/frame";

export const metadata: Metadata = {
  title: "Your honest voice matters",
  robots: { index: false, follow: false },
};

export default async function FriendSurveyPage({ params }: PageProps<"/friend-survey/[token]">) {
  const { token } = await params;
  const slot = await getSlot(token);

  if (!slot) {
    return (
      <GateFrame>
        <h1 className={gateH1}>This link isn&apos;t working.</h1>
        <p className={gateSub}>This survey link is invalid or has expired. Please check the email or message you received and try again.</p>
      </GateFrame>
    );
  }
  if (slot.responded_at) {
    return (
      <GateFrame>
        <h1 className={gateH1}>Already submitted</h1>
        <p className={gateSub}>
          You&apos;ve already completed this survey. Your response has been recorded. Thank you for showing up for {slot.seekerName}.
        </p>
      </GateFrame>
    );
  }
  return <FriendSurvey token={token} seekerName={slot.seekerName} friendName={slot.friend_name ?? "friend"} verified={slot.verified} />;
}
