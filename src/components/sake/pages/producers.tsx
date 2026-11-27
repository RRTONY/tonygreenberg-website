"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ArrowRight, BarChart3, BookOpen, Building2, Camera, Check, Globe, MessageCircle, Pen, Shield, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { useAesthetic, useLanguage } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { sakeImages } from "@/lib/content/sake/images";

// Ported from the Sake app's client/src/pages/Producers.tsx (2026-11-26): the Producer Portal hero
// (brewing photo, now from images.ts), the Why Join / Apply / Share Stories tabs, the benefits and
// story prompts, and the application form. The app's JS-picked colors per look are full class strings.
// Changed:
// - The app's form only showed "Application received! We'll review your submission and respond within
//   7 days." and sent nothing anywhere, so every application was lost. Until the site has a place to
//   save these (see docs/ai/project_sake_port.md), submitting opens the visitor's email app with the
//   application filled in, addressed to Tony, and the toast says so.
// - The form uses Formik + Yup (rule 6) with the app's required fields; Website accepts an empty value
//   or a web address. Tabs are a tablist with selected state; benefit/prompt cards stagger in with CSS.

const OWNER_EMAIL = "tony@tonygreenberg.com";

const LOOK = {
  kintsugi: {
    page: "min-h-screen bg-[oklch(0.08_0.02_270)] transition-colors duration-700",
    card: "bg-[oklch(0.12_0.025_270)] border border-[oklch(0.78_0.12_85/0.15)] transition-colors duration-500",
    overlay: "absolute inset-0 bg-linear-to-b from-[oklch(0.08_0.02_270/0.6)] to-[oklch(0.08_0.02_270)]",
    accent: "text-[oklch(0.78_0.12_85)]",
    fg: "text-[oklch(0.9_0.01_85)]",
    muted: "text-[oklch(0.6_0.02_270)]",
    h1: "font-sk-display text-4xl sm:text-5xl tracking-wider mb-4 font-bold text-[oklch(0.9_0.01_85)]",
    tabOn:
      "px-4 sm:px-6 py-3 text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.78_0.12_85)] bg-[oklch(0.14_0.025_270)]",
    tabOff:
      "px-4 sm:px-6 py-3 text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.6_0.02_270)] bg-transparent",
    outlineBtn:
      "inline-flex items-center gap-2 px-8 py-3 border text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 border-[oklch(0.78_0.12_85)] text-[oklch(0.78_0.12_85)]",
    typeOn:
      "px-4 py-2 border text-[10px] tracking-wider transition-all duration-300 border-[oklch(0.78_0.12_85)] text-[oklch(0.78_0.12_85)] bg-[oklch(0.78_0.12_85/0.06)]",
    typeOff:
      "px-4 py-2 border text-[10px] tracking-wider transition-all duration-300 border-[oklch(0.78_0.12_85/0.15)] text-[oklch(0.6_0.02_270)] bg-transparent",
    input:
      "w-full px-4 py-3 border text-sm transition-colors duration-300 outline-none border-[oklch(0.78_0.12_85/0.15)] bg-[oklch(0.1_0.02_270)] text-[oklch(0.9_0.01_85)] focus:border-[oklch(0.78_0.12_85/0.5)]",
    submit:
      "inline-flex items-center gap-2 px-8 py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:scale-105 bg-[oklch(0.78_0.12_85)] text-[oklch(0.1_0.02_270)]",
  },
  austere: {
    page: "min-h-screen bg-[oklch(0.96_0.005_80)] transition-colors duration-700",
    card: "bg-[oklch(0.93_0.006_80)] border border-[oklch(0.82_0.008_80)] transition-colors duration-500",
    overlay: "absolute inset-0 bg-linear-to-b from-[oklch(0.96_0.005_80/0.7)] to-[oklch(0.96_0.005_80)]",
    accent: "text-[oklch(0.52_0.19_30)]",
    fg: "text-[oklch(0.25_0.01_60)]",
    muted: "text-[oklch(0.5_0.008_60)]",
    h1: "font-sk-display text-4xl sm:text-5xl tracking-wider mb-4 font-light text-[oklch(0.25_0.01_60)]",
    tabOn:
      "px-4 sm:px-6 py-3 text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 border-[oklch(0.82_0.008_80)] text-[oklch(0.52_0.19_30)] bg-[oklch(0.93_0.006_80)]",
    tabOff:
      "px-4 sm:px-6 py-3 text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 border-[oklch(0.82_0.008_80)] text-[oklch(0.5_0.008_60)] bg-transparent",
    outlineBtn:
      "inline-flex items-center gap-2 px-8 py-3 border text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 border-[oklch(0.52_0.19_30)] text-[oklch(0.52_0.19_30)]",
    typeOn:
      "px-4 py-2 border text-[10px] tracking-wider transition-all duration-300 border-[oklch(0.52_0.19_30)] text-[oklch(0.52_0.19_30)] bg-[oklch(0.52_0.19_30/0.06)]",
    typeOff:
      "px-4 py-2 border text-[10px] tracking-wider transition-all duration-300 border-[oklch(0.82_0.008_80)] text-[oklch(0.5_0.008_60)] bg-transparent",
    input:
      "w-full px-4 py-3 border text-sm transition-colors duration-300 outline-none border-[oklch(0.82_0.008_80)] bg-[oklch(0.96_0.005_80)] text-[oklch(0.25_0.01_60)] focus:border-[oklch(0.52_0.19_30/0.5)]",
    submit:
      "inline-flex items-center gap-2 px-8 py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:scale-105 bg-[oklch(0.52_0.19_30)] text-[oklch(0.98_0.005_80)]",
  },
} as const;

type Tab = "about" | "apply" | "stories";

export type ProducerValues = {
  type: "brewery" | "distributor" | "retailer";
  breweryName: string;
  breweryNameJa: string;
  prefecture: string;
  contactName: string;
  email: string;
  website: string;
  message: string;
};

const EMPTY: ProducerValues = {
  type: "brewery",
  breweryName: "",
  breweryNameJa: "",
  prefecture: "",
  contactName: "",
  email: "",
  website: "",
  message: "",
};

export const producerSchema = Yup.object({
  type: Yup.string().oneOf(["brewery", "distributor", "retailer"]).required(),
  breweryName: Yup.string().trim().max(200).required("Required"),
  breweryNameJa: Yup.string().trim().max(200),
  prefecture: Yup.string().trim().max(100).required("Required"),
  contactName: Yup.string().trim().max(200).required("Required"),
  email: Yup.string().trim().email("Please enter a valid email").max(320).required("Required"),
  website: Yup.string()
    .trim()
    .max(500)
    .test("url-or-empty", "Please enter a web address (https://...)", (v) => !v || /^https?:\/\/\S+$/i.test(v)),
  message: Yup.string().trim().max(5000),
});

const TYPE_LABELS: Record<ProducerValues["type"], string> = {
  brewery: "Brewery / Kura",
  distributor: "Distributor",
  retailer: "Retailer / Bar",
};

/** The pre-filled email to Tony with the application. */
export function producerMailto(v: ProducerValues) {
  const body = [
    `I am a: ${TYPE_LABELS[v.type]}`,
    `Brewery name: ${v.breweryName}`,
    v.breweryNameJa ? `Brewery name (日本語): ${v.breweryNameJa}` : "",
    `Prefecture: ${v.prefecture}`,
    `Contact name: ${v.contactName}`,
    `Email: ${v.email}`,
    v.website ? `Website: ${v.website}` : "",
    v.message ? `\n${v.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(`Producer application: ${v.breweryName}`)}&body=${encodeURIComponent(body)}`;
}

export function SakeProducers() {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const look = isAustere ? LOOK.austere : LOOK.kintsugi;
  const [activeTab, setActiveTab] = useState<Tab>("about");

  const benefits = [
    { icon: Star, title: t("EXV™ Scoring", "EXV™スコアリング"), desc: t("Your bottles evaluated with our proprietary 7-dimension soul print system.", "独自の7次元ソウルプリントシステムで貴社のボトルを評価。") },
    { icon: BookOpen, title: t("Your Story", "あなたの物語"), desc: t("Share your brewery's history, philosophy, and the humans behind the sake.", "蔵の歴史、哲学、そして酒の背後にいる人々を共有。") },
    { icon: Camera, title: t("Visual Feature", "ビジュアル特集"), desc: t("Professional photography and editorial coverage in our Kintsugi Noir aesthetic.", "Kintsugi Noirの美学によるプロの写真撮影と編集記事。") },
    { icon: Globe, title: t("Global Reach", "グローバルリーチ"), desc: t("Bilingual EN/JP exposure to sake enthusiasts worldwide.", "世界中の日本酒愛好家への日英バイリンガル露出。") },
    { icon: BarChart3, title: t("Analytics", "アナリティクス"), desc: t("See how your bottles perform — views, saves, quiz recommendations.", "ボトルのパフォーマンスを確認 — 閲覧数、保存数、クイズ推薦。") },
    { icon: MessageCircle, title: t("Direct Connection", "直接つながり"), desc: t("Connect with enthusiasts who discover your sake through our platform.", "当プラットフォームを通じて貴社の酒を発見した愛好家とつながる。") },
  ];

  const storyPrompts = [
    { icon: Users, title: t("The Humans", "人々"), desc: t("Who wakes at 4am? Who tends the koji? The faces behind the label.", "午前4時に起きるのは誰？麹の世話をするのは誰？ラベルの裏の顔。") },
    { icon: Building2, title: t("The Kura", "蔵"), desc: t("Your building has a soul. The walls remember every winter. Tell us.", "あなたの建物には魂がある。壁はすべての冬を覚えている。教えてください。") },
    { icon: Pen, title: t("The Philosophy", "哲学"), desc: t("Why do you brew? Not the business answer. The real answer.", "なぜ醸すのか？ビジネスの答えではなく。本当の答えを。") },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "about", label: t("Why Join", "参加する理由") },
    { key: "apply", label: t("Apply", "申請") },
    { key: "stories", label: t("Share Stories", "ストーリーを共有") },
  ];

  const typeOptions: { value: ProducerValues["type"]; label: string }[] = [
    { value: "brewery", label: t("Brewery / Kura", "蔵元") },
    { value: "distributor", label: t("Distributor", "流通業者") },
    { value: "retailer", label: t("Retailer / Bar", "小売店/バー") },
  ];

  const fields: { key: keyof Omit<ProducerValues, "type" | "message">; label: string; placeholder: string }[] = [
    { key: "breweryName", label: t("Brewery Name (English)", "蔵名（英語）"), placeholder: "e.g., Dassai" },
    { key: "breweryNameJa", label: t("Brewery Name (日本語)", "蔵名（日本語）"), placeholder: "例：獺祭" },
    { key: "prefecture", label: t("Prefecture", "都道府県"), placeholder: "e.g., Yamaguchi" },
    { key: "contactName", label: t("Contact Name", "担当者名"), placeholder: "" },
    { key: "email", label: t("Email", "メール"), placeholder: "" },
    { key: "website", label: t("Website", "ウェブサイト"), placeholder: "https://" },
  ];

  return (
    <div className={look.page}>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-100 overflow-hidden">
        <div className="absolute inset-0">
          <SakeImage image={sakeImages.brewing} className="size-full object-cover" priority />
          <div className={look.overlay} />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <Building2 aria-hidden="true" size={32} className={`mx-auto mb-4 ${look.accent}`} />
            <h1 className={look.h1}>{t("Producer Portal", "蔵元ポータル")}</h1>
            <p className={`text-sm max-w-lg mx-auto ${look.muted}`}>
              {t(
                "Your sake has a soul. We want to tell its story. Join the most discerning sake platform in the world.",
                "あなたの酒には魂がある。その物語を伝えたい。世界で最も目の肥えた日本酒プラットフォームに参加。",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-16">
        <div className="flex flex-wrap justify-center gap-1 mb-12" role="tablist" aria-label={t("Producer Portal", "蔵元ポータル")}>
          {tabs.map((tab) => (
            <button
              type="button"
              role="tab"
              key={tab.key}
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? look.tabOn : look.tabOff}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <div className="animate-in fade-in duration-500" role="tabpanel">
            <div className="text-center mb-12">
              <h2 className={`font-sk-display text-2xl font-semibold tracking-wider mb-4 ${look.fg}`}>{t("What Producers Get", "蔵元が得られるもの")}</h2>
              <p className={`text-sm ${look.muted}`}>
                {t("We don't sell advertising. We don't take commissions. We tell the truth about sake.", "広告は売りません。手数料も取りません。酒の真実を伝えます。")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className={`${look.card} p-6 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <b.icon aria-hidden="true" size={20} className={`mb-3 ${look.accent}`} />
                  <h3 className={`text-sm font-semibold tracking-wider mb-2 ${look.fg}`}>{b.title}</h3>
                  <p className={`text-xs leading-relaxed ${look.muted}`}>{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button type="button" onClick={() => setActiveTab("apply")} className={look.outlineBtn}>
                {t("Apply Now", "今すぐ申請")}
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "apply" && (
          <div className="animate-in fade-in duration-500" role="tabpanel">
            <div className={`${look.card} p-6 sm:p-10`}>
              <div className="flex items-center gap-3 mb-8">
                <Shield aria-hidden="true" size={20} className={look.accent} />
                <h2 className={`font-sk-display text-xl font-semibold tracking-wider ${look.fg}`}>{t("Producer Application", "蔵元申請")}</h2>
              </div>

              <Formik<ProducerValues>
                initialValues={EMPTY}
                validationSchema={producerSchema}
                onSubmit={(values, { resetForm }) => {
                  window.location.href = producerMailto(values);
                  toast.success(
                    t(
                      "Your email app is opening with your application. Send it and we'll respond within 7 days.",
                      "申請内容を入れたメールアプリを開いています。送信いただければ、7日以内にご連絡します。",
                    ),
                  );
                  resetForm();
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="space-y-6" noValidate>
                    <div>
                      <span id="producer-type" className={`block text-[10px] tracking-[0.15em] uppercase mb-2 ${look.muted}`}>
                        {t("I am a...", "私は...")}
                      </span>
                      <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="producer-type">
                        {typeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={values.type === opt.value}
                            onClick={() => void setFieldValue("type", opt.value)}
                            className={values.type === opt.value ? look.typeOn : look.typeOff}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div key={field.key}>
                          <label htmlFor={`producer-${field.key}`} className={`block text-[10px] tracking-[0.15em] uppercase mb-2 ${look.muted}`}>
                            {field.label}
                          </label>
                          <Field
                            id={`producer-${field.key}`}
                            name={field.key}
                            type={field.key === "email" ? "email" : field.key === "website" ? "url" : "text"}
                            placeholder={field.placeholder}
                            className={look.input}
                          />
                          <ErrorMessage name={field.key} component="p" className="mt-1 text-xs text-destructive" />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="producer-message" className={`block text-[10px] tracking-[0.15em] uppercase mb-2 ${look.muted}`}>
                        {t("Tell us about your sake", "あなたの酒について教えてください")}
                      </label>
                      <Field
                        as="textarea"
                        id="producer-message"
                        name="message"
                        rows={5}
                        className={`${look.input} resize-none`}
                        placeholder={t("What makes your sake unique? What story do you want to tell?", "あなたの酒のユニークな点は？どんな物語を伝えたいですか？")}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button type="submit" className={look.submit}>
                        <Check aria-hidden="true" size={16} />
                        {t("Submit Application", "申請を送信")}
                      </button>
                      <span className={`text-[9px] tracking-wider ${look.muted}`}>{t("We respond within 7 days.", "7日以内にご連絡します。")}</span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {activeTab === "stories" && (
          <div className="animate-in fade-in duration-500" role="tabpanel">
            <div className="text-center mb-12">
              <h2 className={`font-sk-display text-2xl font-semibold tracking-wider mb-4 ${look.fg}`}>{t("Share Your Story", "あなたの物語を共有")}</h2>
              <p className={`text-sm max-w-lg mx-auto ${look.muted}`}>
                {t(
                  "We believe every bottle has a story that deserves to be told with the same care that went into brewing it. Here's what we're looking for.",
                  "すべてのボトルには、醸造に注がれたのと同じ心遣いで語られるべき物語があると信じています。私たちが求めているもの。",
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {storyPrompts.map((prompt, i) => (
                <div
                  key={prompt.title}
                  className={`${look.card} p-8 text-center animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <prompt.icon aria-hidden="true" size={28} className={`mx-auto mb-4 ${look.accent}`} />
                  <h3 className={`font-sk-display text-lg font-semibold tracking-wider mb-3 ${look.fg}`}>{prompt.title}</h3>
                  <p className={`text-xs leading-relaxed ${look.muted}`}>{prompt.desc}</p>
                </div>
              ))}
            </div>
            <div className={`${look.card} p-8 text-center`}>
              <p className={`text-sm mb-6 ${look.muted}`}>
                {t(
                  "Ready to share your story? Apply as a producer first, then we'll work with you to craft something beautiful.",
                  "ストーリーを共有する準備はできましたか？まず蔵元として申請し、その後一緒に美しいものを作り上げましょう。",
                )}
              </p>
              <button type="button" onClick={() => setActiveTab("apply")} className={look.outlineBtn}>
                {t("Start Here", "ここから始める")}
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
