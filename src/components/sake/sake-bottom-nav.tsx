"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites, useLanguage } from "@/components/sake/sake-providers";
import { sakeBottomLinks, sk } from "@/lib/content/sake/nav";

// The Sake app's BottomNav (client/src/components/BottomNav.tsx): five destinations on phones and
// tablets (under 1024px), 56px targets, the saved count on the heart, a short bar over the active
// item. Colors follow the look (sake.css --sk-bottom-*).

export function SakeBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { count: favCount } = useFavorites();

  return (
    <nav
      aria-label={t("Quick links", "クイックリンク")}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden backdrop-blur-xl border-t bg-(--sk-bottom-bg) border-(--sk-bottom-border)"
    >
      <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
        {sakeBottomLinks.map((item) => {
          const active = pathname === sk(item.href);
          const Icon = item.icon;
          const showBadge = item.href === "/favorites" && favCount > 0;
          return (
            <Link
              key={item.href}
              href={sk(item.href)}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex flex-col items-center justify-center gap-0.5 py-2 px-3 relative min-h-14 min-w-14 transition-colors duration-200 text-(--sk-accent)"
                  : "flex flex-col items-center justify-center gap-0.5 py-2 px-3 relative min-h-14 min-w-14 transition-colors duration-200 text-(--sk-bottom-muted)"
              }
            >
              <span className="relative">
                <Icon aria-hidden="true" size={22} strokeWidth={active ? 2.5 : 1.8} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 size-4 text-[10px] font-bold leading-none rounded-full flex items-center justify-center bg-(--sk-accent) text-(--sk-on-accent)">
                    {favCount > 9 ? "9+" : favCount}
                  </span>
                )}
              </span>
              <span className="font-sans text-[10px] font-medium tracking-wide leading-none">
                {t(item.en, item.ja)}
              </span>
              {active && <span aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-(--sk-accent)" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
