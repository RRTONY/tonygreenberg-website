import type { Metadata } from "next";
import { FriendGate } from "@/components/friend-gate/friend-gate";

export const metadata: Metadata = {
  title: "The Three Friends Gate",
  description:
    "Before any intervention that reshapes how you move through the world, three people who know you well weigh in, anonymously. Only time buys trust.",
  alternates: { canonical: "/friend-gate" },
};

export default function FriendGatePage() {
  return <FriendGate />;
}
