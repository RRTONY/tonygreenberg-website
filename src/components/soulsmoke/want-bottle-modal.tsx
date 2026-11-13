"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Loader2, Wine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSoulsmokeMember, wantBottle } from "@/app/soul-smoke/actions";
import { CONNECTION_ERROR } from "@/lib/content/soulsmoke/reach";

// Ported from the SoulSmoke app's client/src/components/WantBottleModal.tsx. As on SoulSmoke it's
// for signed-in members: the interest is saved in Supabase through wantBottle
// (src/app/soul-smoke/actions.ts), which emails Tony (2026-11-10). When the modal opens it asks
// the server whether someone is signed in; if not it shows SoulSmoke's "Sign In to Express
// Interest" box, which goes to this site's /login and comes back to this page.

export type BottleInterestType = "consumer" | "retailer" | "distributor";

const INTEREST_TYPES: BottleInterestType[] = ["consumer", "retailer", "distributor"];

interface WantBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottleId: string;
  bottleName: string;
}

export function WantBottleModal({ isOpen, onClose, bottleId, bottleName }: WantBottleModalProps) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interestType, setInterestType] = useState<BottleInterestType>("consumer");
  const [quantity, setQuantity] = useState("1 bottle");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const titleId = useId();
  const quantityId = useId();
  const notesId = useId();
  // The parent passes a new onClose each render; a ref keeps the timers below from restarting.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Ask the server who's signed in each time the modal opens (they may have signed in since).
  useEffect(() => {
    if (!isOpen) return;
    let live = true;
    // On a failed check the modal used to spin forever (browser test, 2026-11-14).
    getSoulsmokeMember().then(
      ({ signedIn: yes }) => {
        if (live) setSignedIn(yes);
      },
      () => {
        if (live) setCheckFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, [isOpen]);

  // Escape closes the modal, like the dialogs elsewhere on the site.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // After "Interest Recorded!" the modal closes itself, as it did on the Manus app.
  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      setSuccess(false);
      onCloseRef.current();
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [success]);

  if (!isOpen) return null;

  const recordInterest = async () => {
    if (!bottleId.trim() || !bottleName.trim()) return;
    setError(null);
    setPending(true);
    try {
      const result = await wantBottle({ bottleId, bottleName, interestType, quantity, notes });
      if (result.ok) setSuccess(true);
      else if (result.signedOut) setSignedIn(false);
      else setError(result.error);
    } catch {
      setError(CONNECTION_ERROR);
    } finally {
      setPending(false);
    }
  };

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute top-4 right-4 text-zinc-400 hover:text-white"
    >
      <X aria-hidden="true" className="size-5" />
    </button>
  );

  if (signedIn === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="I Want This Bottle"
          className="relative w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-8"
        >
          {closeButton}
          {checkFailed ? (
            <p role="alert" className="text-center text-sm text-red-400">
              {CONNECTION_ERROR}
            </p>
          ) : (
            <Loader2 aria-label="Checking your account" className="mx-auto size-8 animate-spin text-amber-500" />
          )}
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-8"
        >
          {closeButton}
          <div className="space-y-4 text-center">
            <Wine aria-hidden="true" className="mx-auto size-12 text-amber-500" />
            <h3 id={titleId} className="font-display text-xl font-bold text-white">
              Sign In to Express Interest
            </h3>
            <p className="text-sm text-zinc-400">
              Create a free account to let us know you want{" "}
              <span className="font-semibold text-amber-500">{bottleName}</span>. We track demand and connect
              interested buyers with producers and retailers.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="inline-block rounded-lg bg-amber-500 px-6 py-3 font-bold text-black transition-colors hover:bg-amber-400"
            >
              Sign In / Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-8"
      >
        {closeButton}

        {success ? (
          <div className="space-y-4 py-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/20">
              <Check aria-hidden="true" className="size-8 text-green-500" />
            </div>
            <h3 id={titleId} className="font-display text-xl font-bold text-white">
              Interest Recorded!
            </h3>
            <p className="text-sm text-zinc-400">
              We&apos;ve noted your interest in {bottleName}. We&apos;ll track demand and work to connect you with
              sources.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 id={titleId} className="font-display text-xl font-bold text-white">
                I Want This Bottle
              </h3>
              <p className="mt-1 font-semibold text-amber-500">{bottleName}</p>
              <p className="mt-2 text-sm text-zinc-400">
                Express your interest and we&apos;ll track demand. When enough people want a bottle, we connect buyers
                with producers and retailers.
              </p>
            </div>

            {/* Interest Type */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-zinc-300">I am a...</span>
              {/* flex-wrap: the three buttons ran past the modal edge at 375px on live (rule 20). */}
              <div className="flex flex-wrap gap-2">
                {INTEREST_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={interestType === type}
                    onClick={() => setInterestType(type)}
                    className={
                      interestType === type
                        ? "rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-all"
                        : "rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-700"
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor={quantityId} className="mb-2 block text-sm font-semibold text-zinc-300">
                Quantity
              </label>
              <select
                id={quantityId}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="1 bottle">1 bottle</option>
                <option value="2-3 bottles">2-3 bottles</option>
                <option value="6 bottles (half case)">6 bottles (half case)</option>
                <option value="1 case (12)">1 case (12 bottles)</option>
                <option value="5+ cases">5+ cases</option>
                <option value="allocation">Ongoing allocation</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor={notesId} className="mb-2 block text-sm font-semibold text-zinc-300">
                Notes (optional)
              </label>
              <textarea
                id={notesId}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific batch, vintage, or other details..."
                className="h-20 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <Button
              type="button"
              onClick={recordInterest}
              disabled={pending}
              className="w-full bg-amber-500 py-3 font-bold text-black hover:bg-amber-400"
            >
              {pending ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  Recording
                </>
              ) : (
                "Record My Interest"
              )}
            </Button>

            {error && (
              <p role="alert" className="text-center text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
