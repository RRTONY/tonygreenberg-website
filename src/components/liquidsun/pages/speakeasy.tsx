"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AlertTriangle, Lock, Skull } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { usePresenceSwap } from "@/components/liquidsun/motion";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { liquidsunImages } from "@/lib/content/liquidsun/images";
import { passphraseSchema } from "@/lib/content/liquidsun/forms";

// Ported from the LiquidSun app's client/src/pages/Speakeasy.tsx (2026-11-21), the hidden page behind
// the passphrase "agave" or the Konami code. Same copy. Changes:
// - framer-motion's AnimatePresence became usePresenceSwap: the lock screen fades out, shrinking to
//   90% and blurring 10px (0.3s), then THE BLACK MARKET rises 50px and its cards follow 0.2s apart.
// - The passphrase box is Formik + Yup (owner, 2026-11-21); an empty box says so, a wrong word still
//   flashes "Access Denied" for a second.
// - The app's /audio/unlock.mp3 and /images/hero-tahona.jpg never existed on the live site (Manus
//   answered with its HTML page), so there is no unlock sound, and the faint grayscale background is
//   the rescued tahona photo the page was clearly meant to show.
// - The bottle photos listed in the data were never drawn by the page (it shows CONFIDENTIAL
//   placeholders), so they stay placeholders.
// - The app pinned the content to one screen height with overflow hidden, which cut off the stacked
//   cards on phones; it now grows with its content (rule 20).

export const blackMarketBottles = [
  {
    name: "Fortaleza Lote 42-A",
    price: "$1,500",
    status: "Sold Out",
    description: "The ghost bottle. A mistake in the blend that created perfection. Only 50 bottles exist in the wild.",
  },
  {
    name: "G4 6-Year Extra Añejo",
    price: "$800",
    status: "Available (2 left)",
    description: "Aged in a single cognac barrel in Felipe's personal cellar. Never released to the public.",
  },
  {
    name: "Caballito Cerrero 'Chato' 55%",
    price: "$450",
    status: "Available (5 left)",
    description: "High proof, wild agave, distilled in 2015. A flavor bomb that will ruin you for all other spirits.",
  },
];

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function Speakeasy() {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const { language } = useLanguage();
  const { shown, leaving } = usePresenceSwap(unlocked, 300);
  const errorId = useId();

  // Secret Knock Listener (Konami Code: Up, Up, Down, Down, Left, Right, Left, Right, B, A)
  useEffect(() => {
    let keys: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      keys = [...keys, e.key].slice(-10);
      if (keys.join(",") === KONAMI.join(",")) setUnlocked(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(false), 1000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans text-white">
      <AudioController />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.tahonaWheel.src} alt="" fill sizes="100vw" className="object-cover opacity-10 grayscale" />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24">
        {!shown ? (
          <div
            className={
              leaving
                ? "w-full max-w-md animate-out space-y-8 text-center duration-300 blur-out-10 fade-out fill-mode-forwards zoom-out-90"
                : "w-full max-w-md animate-in space-y-8 text-center duration-300 fade-in"
            }
          >
            <div className="mb-6 flex justify-center">
              <Lock aria-hidden="true" className="size-16 text-slate-700" strokeWidth={1} />
            </div>

            <h1 className="mb-2 font-serif text-4xl text-slate-500">Restricted Area</h1>
            <p className="mb-8 font-mono text-xs tracking-widest text-slate-600 uppercase">Authorized Personnel Only</p>

            <Formik
              initialValues={{ password: "" }}
              validationSchema={passphraseSchema(language)}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={(values) => {
                if (values.password.toLowerCase() === "agave") setUnlocked(true);
                else setError(true);
              }}
            >
              {({ errors }) => (
                <Form noValidate className="relative">
                  <label htmlFor="speakeasy-passphrase" className="sr-only">
                    Passphrase
                  </label>
                  <Field
                    id="speakeasy-passphrase"
                    name="password"
                    type="password"
                    placeholder="Enter Passphrase"
                    autoFocus
                    aria-invalid={error || Boolean(errors.password)}
                    aria-describedby={error || errors.password ? errorId : undefined}
                    className={
                      error
                        ? "w-full border-b-2 border-red-500 bg-transparent py-2 text-center font-mono text-xl text-red-500 transition-colors outline-none"
                        : "w-full border-b-2 border-slate-700 bg-transparent py-2 text-center font-mono text-xl text-white transition-colors outline-none focus:border-amber-500"
                    }
                  />
                  {error ? (
                    <div
                      id={errorId}
                      role="alert"
                      className="absolute top-full right-0 left-0 mt-2 animate-in font-mono text-xs tracking-widest text-red-500 uppercase fade-in slide-in-from-top-[10px]"
                    >
                      Access Denied
                    </div>
                  ) : (
                    <ErrorMessage name="password">
                      {(message) => (
                        <div
                          id={errorId}
                          role="alert"
                          className="absolute top-full right-0 left-0 mt-2 animate-in font-mono text-xs tracking-widest text-red-500 uppercase fade-in slide-in-from-top-[10px]"
                        >
                          {message}
                        </div>
                      )}
                    </ErrorMessage>
                  )}
                </Form>
              )}
            </Formik>

            <p className="mt-12 font-mono text-[10px] text-slate-800">Hint: The plant of life.</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl animate-in duration-300 fade-in fill-mode-both slide-in-from-bottom-[50px]">
            <div className="mb-16 text-center">
              <div className="mb-4 flex justify-center">
                <Skull aria-hidden="true" className="size-12 animate-pulse text-red-900" strokeWidth={1} />
              </div>
              <h1 className="mb-4 font-serif text-5xl tracking-tighter text-red-700 md:text-7xl">THE BLACK MARKET</h1>
              <p className="font-mono text-sm tracking-[0.3em] text-red-900/60 uppercase">Off the books. Cash only. No questions.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {blackMarketBottles.map((bottle, index) => (
                <div
                  key={bottle.name}
                  // The app's per-card stagger (index * 0.2s), a runtime value.
                  style={{ animationDelay: `${index * 0.2}s` }}
                  className="group animate-in rounded-sm border border-red-900/20 bg-red-950/10 p-6 transition-colors duration-300 fade-in fill-mode-both slide-in-from-bottom-5 hover:bg-red-950/20"
                >
                  <div className="relative mb-6 aspect-3/4 overflow-hidden bg-black/50">
                    <div className="absolute inset-0 flex rotate-45 items-center justify-center font-serif text-6xl font-bold text-red-900/20 opacity-20">
                      CONFIDENTIAL
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                  </div>

                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-serif text-xl text-red-100 transition-colors group-hover:text-red-500">{bottle.name}</h3>
                    <span className="font-mono text-red-500">{bottle.price}</span>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle aria-hidden="true" className="size-3 text-red-700" />
                    <span className="font-mono text-[10px] tracking-widest text-red-700 uppercase">{bottle.status}</span>
                  </div>

                  <p className="font-serif text-sm leading-relaxed text-red-200/60 italic">&quot;{bottle.description}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
