"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import {
  Bell,
  BellOff,
  BellRing,
  Check,
  DollarSign,
  Filter,
  Heart,
  Loader2,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
  TrendingDown,
  Zap,
} from "lucide-react";
import { useLanguage, useMember } from "@/components/sake/sake-providers";
import { useToolPalette } from "@/components/sake/tool-palette";
import {
  createAlert,
  deleteAlert,
  getMyAlerts,
  getMyFavorites,
  getMyNotifications,
  markNotificationsRead,
  toggleFavorite,
  updateAlert,
  type DealAlert,
  type DealNotification,
  type TrackedSake,
} from "@/app/sake/actions";
import { alertSchema, type AlertValues } from "@/lib/content/sake/forms";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/DealAlerts.tsx (2026-11-26): price-drop alerts, the
// notifications they raised, and tracked sakes, for signed-in members (a preview for everyone else).
// Data comes from src/app/sake/actions.ts. The app's per-look style tokens are the shared
// useToolPalette (its active-tab underline was built with goldBorder.replace(...), which Tailwind never
// generated; it's a real class now).
// Changed (rule 6 and 20): the "New Alert" form uses Formik + Yup with the same rules the server checks
// (forms.ts) and shows their messages; signed-out visitors go to this site's sign-in and come back;
// "Creating..." and the "Loading..." lines are spinners; icon-only buttons have names; the tab badge no
// longer prints a stray "0" when there are no unread notices (the app's `badge && badge > 0` did).

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(sk("/deal-alerts"))}`;

type TabView = "alerts" | "notifications" | "favorites";

const EMPTY_FORM: AlertValues = { alertType: "all", sakeId: "", sakeCategory: "", priceThreshold: "", minDiscountPct: 10, zipCode: "" };

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16">
      <Loader2 aria-hidden="true" className="size-5 animate-spin" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function SakeDealAlerts() {
  const { t } = useLanguage();
  const { signedIn, loaded } = useMember();
  const k = useToolPalette();

  const [activeTab, setActiveTab] = useState<TabView>("alerts");
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alerts, setAlerts] = useState<DealAlert[] | null>(null);
  const [notices, setNotices] = useState<{ notifications: DealNotification[]; unreadCount: number } | null>(null);
  const [favorites, setFavorites] = useState<TrackedSake[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshAlerts = useCallback(() => getMyAlerts().then((r) => setAlerts(r.ok ? r.data : [])), []);
  const refreshNotices = useCallback(
    () => getMyNotifications({ limit: 50 }).then((r) => setNotices(r.ok ? r.data : { notifications: [], unreadCount: 0 })),
    [],
  );
  const refreshFavorites = useCallback(() => getMyFavorites().then((r) => setFavorites(r.ok ? r.data : [])), []);

  useEffect(() => {
    if (!loaded || !signedIn) return;
    void refreshAlerts();
    void refreshNotices();
    void refreshFavorites();
  }, [loaded, signedIn, refreshAlerts, refreshNotices, refreshFavorites]);

  const formik = useFormik<AlertValues>({
    initialValues: EMPTY_FORM,
    validationSchema: alertSchema,
    onSubmit: async (values, helpers) => {
      setError(null);
      const result = await createAlert(values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      helpers.resetForm();
      setShowCreateAlert(false);
      await refreshAlerts();
    },
  });

  const run = async (action: () => Promise<{ ok: boolean; error?: string }>, after: () => Promise<unknown>) => {
    setError(null);
    const result = await action();
    if (!result.ok) setError(result.error ?? null);
    await after();
  };

  const sakeTypes = useMemo(() => Array.from(new Set(qprSakeDatabase.map((s) => s.type))), []);
  const unreadCount = notices?.unreadCount ?? 0;
  const card = `border ${k.cardBorder} ${k.cardBg}`;
  const input = `w-full px-3 py-2.5 text-sm border focus:outline-none ${k.inputBg} ${k.textMain}`;
  const label = `text-xs block mb-2 ${k.textMuted}`;
  const fieldError = (name: keyof AlertValues) =>
    formik.touched[name] && formik.errors[name] ? (
      <p role="alert" className="mt-1 text-xs text-red-400">
        {String(formik.errors[name])}
      </p>
    ) : null;

  if (loaded && !signedIn) {
    const perks = [
      { icon: TrendingDown, en: "Price Drop Alerts", ja: "値下げアラート", descEn: "Get notified when sake drops below your target price", descJa: "目標価格を下回った時に通知" },
      { icon: Heart, en: "Favorite Tracking", ja: "お気に入り追跡", descEn: "Track prices across 8+ retailers for your favorites", descJa: "8以上の販売店でお気に入りの価格を追跡" },
      { icon: Zap, en: "Instant Notifications", ja: "即時通知", descEn: "In-app alerts the moment a deal appears", descJa: "セールが出現した瞬間にアプリ内アラート" },
    ];
    return (
      <div className={`min-h-screen ${k.pageBg} ${k.textMain}`}>
        <section className="relative pt-32 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <BellRing aria-hidden="true" size={48} className={`mx-auto mb-6 ${k.gold}`} />
            <h1 className="font-sk-display text-4xl sm:text-5xl font-bold [.sake-austere_&]:font-light mb-6">
              {t("Sake Deal", "酒セール")} <span className={k.isAustere ? k.gold : `${k.gold} gold-shimmer`}>{t("Alerts", "アラート")}</span>
            </h1>
            <p className={`text-lg mb-8 leading-relaxed ${k.textMuted}`}>
              {t(
                "Get notified when your favorite sake drops in price. Set thresholds, track favorites, and never miss a deal.",
                "お気に入りの日本酒が値下がりした時に通知を受け取りましょう。閾値を設定し、お気に入りを追跡し、セールを見逃さない。",
              )}
            </p>
            <Link
              href={SIGN_IN_HREF}
              className={`inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase border transition-all duration-300 ${k.goldBorder} ${k.goldBg} ${k.gold} ${k.hoverBg}`}
            >
              {t("Sign In to Set Alerts", "サインインしてアラートを設定")}
            </Link>
            <div className={`mt-16 p-6 text-left ${card}`}>
              <h2 className={`text-sm font-mono tracking-wider mb-4 ${k.gold}`}>{t("WHAT YOU GET", "得られるもの")}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {perks.map((item) => (
                  <div key={item.en} className={`p-4 border ${k.cardBorder}`}>
                    <item.icon aria-hidden="true" size={20} className={k.gold} />
                    <div className={`text-sm font-bold mt-2 ${k.textMain}`}>{t(item.en, item.ja)}</div>
                    <div className={`text-xs mt-1 ${k.textMuted}`}>{t(item.descEn, item.descJa)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const tabs: { id: TabView; icon: typeof Bell; label: string; badge?: number }[] = [
    { id: "alerts", icon: Bell, label: t("My Alerts", "マイアラート") },
    { id: "notifications", icon: BellRing, label: t("Notifications", "通知"), badge: unreadCount },
    { id: "favorites", icon: Heart, label: t("Favorites", "お気に入り") },
  ];

  return (
    <div className={`min-h-screen ${k.pageBg} ${k.textMain}`}>
      <section className="relative pt-32 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <p className={`text-xs tracking-[0.3em] uppercase mb-4 font-mono ${k.gold}`}>{t("Price Intelligence", "価格インテリジェンス")}</p>
            <h1 className="font-sk-display text-4xl sm:text-5xl lg:text-6xl font-bold [.sake-austere_&]:font-light">
              {t("Deal", "セール")} <span className={k.isAustere ? k.gold : `${k.gold} gold-shimmer`}>{t("Alerts", "アラート")}</span>
            </h1>
            <p className={`mt-4 max-w-xl mx-auto ${k.textMuted}`}>
              {t("Never overpay for sake again. Track prices, set thresholds, get notified.", "二度と日本酒に高い金を払わない。価格を追跡し、閾値を設定し、通知を受ける。")}
            </p>
          </div>

          <div role="tablist" className="flex flex-wrap justify-center gap-1 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs tracking-wider font-mono transition-all duration-300 border-b-2 ${
                  activeTab === tab.id ? k.tabActive : `${k.textMuted} border-transparent`
                }`}
              >
                <tab.icon aria-hidden="true" size={14} />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="kintsugi-line" />

      <section className="py-8 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          {error && (
            <p role="alert" className="mb-6 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
              {error}
            </p>
          )}

          {activeTab === "alerts" && (
            <div key="alerts" className="animate-in fade-in slide-in-from-bottom-2.5 duration-300">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className={`font-sk-display text-lg font-bold ${k.textMain}`}>
                  {t("Active Alerts", "アクティブアラート")}
                  <span className={`ml-2 text-sm ${k.textMuted}`}>({alerts?.length ?? 0})</span>
                </h2>
                <button
                  type="button"
                  aria-expanded={showCreateAlert}
                  onClick={() => setShowCreateAlert((s) => !s)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider border transition-all duration-300 ${k.goldBorder} ${k.gold} ${k.hoverBg}`}
                >
                  <Plus aria-hidden="true" size={14} />
                  {t("New Alert", "新しいアラート")}
                </button>
              </div>

              {showCreateAlert && (
                <form
                  noValidate
                  onSubmit={formik.handleSubmit}
                  className={`border p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-300 ${k.goldBorder} ${k.cardBg}`}
                >
                  <h3 className={`text-sm font-mono tracking-wider mb-4 ${k.gold}`}>{t("CREATE NEW ALERT", "新しいアラートを作成")}</h3>

                  <fieldset className="mb-4">
                    <legend className={label}>{t("Alert Type", "アラートタイプ")}</legend>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "all", label: t("All Deals", "全セール") },
                          { value: "specific", label: t("Specific Sake", "特定の酒") },
                          { value: "category", label: t("Category", "カテゴリー") },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={formik.values.alertType === opt.value}
                          onClick={() => void formik.setFieldValue("alertType", opt.value)}
                          className={`px-4 py-2 text-xs border transition-all ${
                            formik.values.alertType === opt.value ? `${k.goldBg} ${k.gold} ${k.goldBorder}` : `${k.cardBorder} ${k.textMuted}`
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {formik.values.alertType === "specific" && (
                    <div className="mb-4">
                      <label htmlFor="alert-sake" className={label}>
                        {t("Select Sake", "酒を選択")}
                      </label>
                      <select id="alert-sake" {...formik.getFieldProps("sakeId")} className={input}>
                        <option value="">{t("Choose a sake...", "酒を選んでください...")}</option>
                        {qprSakeDatabase.map((sake) => (
                          <option key={sake.id} value={sake.id}>
                            {sake.name} — ${sake.priceUS} ({sake.type})
                          </option>
                        ))}
                      </select>
                      {fieldError("sakeId")}
                    </div>
                  )}

                  {formik.values.alertType === "category" && (
                    <div className="mb-4">
                      <label htmlFor="alert-category" className={label}>
                        {t("Select Category", "カテゴリーを選択")}
                      </label>
                      <select id="alert-category" {...formik.getFieldProps("sakeCategory")} className={input}>
                        <option value="">{t("Choose a type...", "タイプを選んでください...")}</option>
                        {sakeTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {fieldError("sakeCategory")}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="alert-price" className={label}>
                        {t("Max Price ($)", "最大価格 ($)")}
                      </label>
                      <input id="alert-price" type="number" min={0} step="0.01" placeholder="e.g. 50" {...formik.getFieldProps("priceThreshold")} className={input} />
                      {fieldError("priceThreshold")}
                    </div>
                    <div>
                      <label htmlFor="alert-discount" className={label}>
                        {t("Min Discount (%)", "最低割引 (%)")}
                      </label>
                      <input id="alert-discount" type="number" min={1} max={90} {...formik.getFieldProps("minDiscountPct")} className={input} />
                      {fieldError("minDiscountPct")}
                    </div>
                    <div>
                      <label htmlFor="alert-zip" className={label}>
                        {t("ZIP Code", "ZIPコード")}
                      </label>
                      <input id="alert-zip" type="text" inputMode="numeric" placeholder="e.g. 10001" maxLength={5} {...formik.getFieldProps("zipCode")} className={input} />
                      {fieldError("zipCode")}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs tracking-wider border transition-all duration-300 disabled:opacity-50 ${k.goldBorder} ${k.goldBg} ${k.gold}`}
                    >
                      {formik.isSubmitting ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> : <Bell aria-hidden="true" size={14} />}
                      {t("Create Alert", "アラートを作成")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateAlert(false);
                        formik.resetForm();
                      }}
                      className={`px-4 py-2.5 text-xs border ${k.cardBorder} ${k.textMuted}`}
                    >
                      {t("Cancel", "キャンセル")}
                    </button>
                  </div>
                </form>
              )}

              {alerts === null ? (
                <Spinner label={t("Loading alerts", "アラートを読み込み中")} />
              ) : alerts.length === 0 ? (
                <div className={`text-center py-16 ${k.textMuted}`}>
                  <BellOff aria-hidden="true" size={32} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">{t("No alerts yet", "アラートはまだありません")}</p>
                  <p className="text-sm">{t("Create your first alert to start tracking deals", "最初のアラートを作成してセール追跡を開始")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const Icon = alert.alertType === "all" ? Bell : alert.alertType === "specific" ? Star : Filter;
                    return (
                      <div key={alert.id} className={`p-5 flex flex-wrap items-center gap-4 animate-in fade-in ${card}`}>
                        <div className={`size-10 rounded-full flex items-center justify-center ${alert.isActive ? k.goldBg : "bg-gray-500/10"}`}>
                          <Icon aria-hidden="true" size={18} className={alert.isActive ? k.gold : "text-gray-500"} />
                        </div>
                        <div className="flex-1 min-w-50">
                          <div className={`text-sm font-bold ${k.textMain}`}>
                            {alert.alertType === "all" ? t("All Deals", "全セール") : alert.alertType === "specific" ? alert.sakeName || alert.sakeId : alert.sakeCategory}
                          </div>
                          <div className={`text-xs mt-1 ${k.textMuted}`}>
                            {alert.priceThreshold && `${t("Max", "最大")} $${alert.priceThreshold}`}
                            {alert.priceThreshold && alert.minDiscountPct ? " · " : ""}
                            {alert.minDiscountPct ? `${t("Min", "最低")} ${alert.minDiscountPct}% ${t("off", "割引")}` : ""}
                            {alert.zipCode && ` · ZIP: ${alert.zipCode}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-pressed={alert.isActive}
                            onClick={() => void run(() => updateAlert(alert.id, { isActive: !alert.isActive }), refreshAlerts)}
                            className={`px-3 py-1.5 text-[10px] border ${alert.isActive ? `${k.goldBorder} ${k.gold}` : `${k.cardBorder} ${k.textMuted}`}`}
                          >
                            {alert.isActive ? t("Active", "アクティブ") : t("Paused", "一時停止")}
                          </button>
                          <button
                            type="button"
                            aria-label={t("Delete alert", "アラートを削除")}
                            onClick={() => void run(() => deleteAlert(alert.id), refreshAlerts)}
                            className={`flex items-center justify-center p-1.5 border hover:text-red-400 hover:border-red-400/30 transition-colors ${k.cardBorder} ${k.textMuted}`}
                          >
                            <Trash2 aria-hidden="true" size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div key="notifications" className="animate-in fade-in slide-in-from-bottom-2.5 duration-300">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className={`font-sk-display text-lg font-bold ${k.textMain}`}>
                  {t("Notifications", "通知")}
                  {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{unreadCount}</span>}
                </h2>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void run(() => markNotificationsRead({ markAll: true }), refreshNotices)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs border transition-all ${k.cardBorder} ${k.textMuted} ${k.hoverBg}`}
                  >
                    <Check aria-hidden="true" size={14} />
                    {t("Mark All Read", "全て既読にする")}
                  </button>
                )}
              </div>
              {notices === null ? (
                <Spinner label={t("Loading notifications", "通知を読み込み中")} />
              ) : notices.notifications.length === 0 ? (
                <div className={`text-center py-16 ${k.textMuted}`}>
                  <BellRing aria-hidden="true" size={32} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">{t("No notifications yet", "通知はまだありません")}</p>
                  <p className="text-sm">
                    {t("When prices drop on your watched sake, you'll see alerts here", "ウォッチ中の酒が値下がりすると、ここにアラートが表示されます")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-5 border animate-in fade-in ${notif.isRead ? k.cardBorder : `${k.goldBorder} ${k.ringUnread}`} ${k.cardBg}`}
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="size-10 rounded-full flex items-center justify-center bg-green-500/10">
                          <TrendingDown aria-hidden="true" size={18} className="text-green-500" />
                        </div>
                        <div className="flex-1 min-w-50">
                          <div className={`text-sm font-bold ${k.textMain}`}>{notif.sakeName}</div>
                          <div className={`text-xs mt-1 ${k.textMuted}`}>
                            {notif.retailerName} ·{" "}
                            <span className="text-green-500 font-mono">
                              {notif.discountPct}% {t("off", "割引")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm line-through ${k.textMuted}`}>${notif.oldPrice}</span>
                            <span className="text-lg font-bold text-green-500 font-mono">${notif.newPrice}</span>
                          </div>
                        </div>
                        {!notif.isRead && (
                          <button
                            type="button"
                            aria-label={t("Mark as read", "既読にする")}
                            onClick={() => void run(() => markNotificationsRead({ notificationIds: [notif.id] }), refreshNotices)}
                            className={`flex items-center justify-center p-1.5 border transition-colors ${k.cardBorder} ${k.textMuted} ${k.hoverBg}`}
                          >
                            <Check aria-hidden="true" size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div key="favorites" className="animate-in fade-in slide-in-from-bottom-2.5 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`font-sk-display text-lg font-bold ${k.textMain}`}>
                  {t("Favorite Sake", "お気に入りの酒")}
                  <span className={`ml-2 text-sm ${k.textMuted}`}>({favorites?.length ?? 0})</span>
                </h2>
              </div>
              {favorites === null ? (
                <Spinner label={t("Loading favorites", "お気に入りを読み込み中")} />
              ) : favorites.length === 0 ? (
                <div className={`text-center py-16 ${k.textMuted}`}>
                  <Heart aria-hidden="true" size={32} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">{t("No favorites yet", "お気に入りはまだありません")}</p>
                  <p className="text-sm mb-6">{t("Add sake from the QPR Rankings to track their prices", "QPRランキングから酒を追加して価格を追跡")}</p>
                  <Link
                    href={sk("/qpr")}
                    className={`inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wider border transition-all duration-300 ${k.goldBorder} ${k.gold}`}
                  >
                    <Star aria-hidden="true" size={14} />
                    {t("Browse QPR Rankings", "QPRランキングを閲覧")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => {
                    const sakeInfo = qprSakeDatabase.find((s) => s.id === fav.sakeId);
                    return (
                      <div key={fav.id} className={`p-5 flex flex-wrap items-center gap-4 animate-in fade-in ${card}`}>
                        <div className={`size-10 rounded-full flex items-center justify-center ${k.goldBg}`}>
                          <Heart aria-hidden="true" size={18} className={k.gold} />
                        </div>
                        <div className="flex-1 min-w-50">
                          <div className={`text-sm font-bold ${k.textMain}`}>{fav.sakeName}</div>
                          {sakeInfo && (
                            <div className={`text-xs mt-1 ${k.textMuted}`}>
                              {sakeInfo.brewery} · {sakeInfo.type} · ${sakeInfo.priceUS}
                            </div>
                          )}
                          {fav.targetPrice && (
                            <div className={`text-xs mt-1 font-mono ${k.gold}`}>
                              {t("Target:", "目標:")} ${fav.targetPrice}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={sakeDetailPath(fav.sakeId)}
                            className="px-3 py-2 text-xs font-bold bg-[oklch(0.78_0.12_85)] text-[oklch(0.12_0.03_270)] transition-all rounded min-h-10 inline-flex items-center gap-1"
                          >
                            <ShoppingCart aria-hidden="true" size={12} />
                            {t("View & Buy", "詳細・購入")}
                          </Link>
                          <button
                            type="button"
                            aria-label={t("Stop tracking", "追跡をやめる")}
                            onClick={() => void run(() => toggleFavorite(fav.sakeId), refreshFavorites)}
                            className={`flex items-center justify-center p-1.5 border hover:text-red-400 hover:border-red-400/30 transition-colors ${k.cardBorder} ${k.textMuted}`}
                          >
                            <Trash2 aria-hidden="true" size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/qpr", icon: Star, label: t("QPR Rankings", "QPRランキング") },
              { href: "/retailer-finder", icon: MapPin, label: t("Find Retailers", "販売店検索") },
              { href: "/supply-chain", icon: DollarSign, label: t("Dollar Maps", "ドルマップ") },
              { href: "/ordering-guide", icon: Package, label: t("Ordering Guide", "注文ガイド") },
            ].map((item) => (
              <Link
                key={item.href}
                href={sk(item.href)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider border transition-all duration-300 ${k.cardBorder} ${k.textMuted} ${k.hoverBg}`}
              >
                <item.icon aria-hidden="true" size={14} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
