"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";

// Ported from the SoulSmoke app's client/src/components/WantBottleModal.tsx. The Manus app
// saved this through trpc.leadGen.wantBottle (signed-in visitors only, with an owner alert).
// There is no account or shared database here, so the interest is saved in the visitor's
// browser under "soulsmoke-bottle-interests", with the same fields and checks the server had
// (bottleId and bottleName required, interestType consumer/retailer/distributor). The
// "Sign in to express interest" screen is gone: the form works without an account.

export type BottleInterestType = "consumer" | "retailer" | "distributor";

export type BottleInterest = {
  id: string;
  bottleId: string;
  bottleName: string;
  interestType: BottleInterestType;
  quantity: string;
  notes: string;
  createdAt: string;
};

export const BOTTLE_INTERESTS_KEY = "soulsmoke-bottle-interests";
const NO_INTERESTS: BottleInterest[] = [];
const INTEREST_TYPES: BottleInterestType[] = ["consumer", "retailer", "distributor"];

interface WantBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottleId: string;
  bottleName: string;
}

export function WantBottleModal({ isOpen, onClose, bottleId, bottleName }: WantBottleModalProps) {
  const [, setInterests] = useLocalStore<BottleInterest[]>(BOTTLE_INTERESTS_KEY, NO_INTERESTS);
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

  const recordInterest = () => {
    if (!bottleId.trim() || !bottleName.trim()) return;
    setInterests((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        bottleId,
        bottleName,
        interestType,
        quantity,
        notes,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

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
              className="w-full bg-amber-500 py-3 font-bold text-black hover:bg-amber-400"
            >
              Record My Interest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
