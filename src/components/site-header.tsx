"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SearchModal } from "@/components/search-modal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  primaryNavLinks,
  navCategories,
  findYourMeGroups,
  socialLinks,
} from "@/components/site-nav-data";

const SOCIAL_ICONS: Record<string, typeof FaXTwitter> = { X: FaXTwitter, LinkedIn: FaLinkedinIn };

// Legacy TonyDiscovery.tsx's "Ask Tony ⌘K" pill. In legacy it opened a
// search + FauxTony chat panel; the chat (Phase 10) was cancelled, so here
// it opens the site search, which is that panel's top half.
function AskTonyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask Tony — search the site"
      className="flex min-w-42.5 items-center gap-2.5 rounded-xl border-[1.5px] border-[#4A1D6B]/15 bg-[#4A1D6B]/6 px-4.5 py-2 text-brand-gold transition-all duration-250 hover:scale-[1.02] hover:border-[#4A1D6B]/25 hover:bg-[#4A1D6B]/10 dark:border-[#7B3FA0]/25 dark:bg-[#7B3FA0]/12 dark:text-brand-gold-light dark:hover:border-[#7B3FA0]/40 dark:hover:bg-[#7B3FA0]/18"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-135 from-brand-gold to-brand-gold-light font-heading text-[0.85rem] font-bold text-[#0A0A10]">
        T
      </span>
      <span className="font-mono text-[0.8rem] tracking-[0.06em]">Ask Tony</span>
      <kbd className="ml-0.5 rounded-[5px] border border-[#bbb] px-1.5 py-px font-mono text-[0.65rem] text-[#6b6b6b] dark:border-[#555] dark:text-[#9a9a9a]">
        ⌘K
      </kbd>
    </button>
  );
}

function NavItemLink({
  href,
  label,
  active,
  onNavigate,
  compact,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block font-mono uppercase tracking-wide transition-colors hover:text-brand-gold ${
        compact ? "text-[0.68rem] py-1" : "text-xs py-1.5"
      } ${active ? "text-brand-gold-light" : "text-muted-foreground"}`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the mobile menu on route change. Adjusted during render (React's
  // documented pattern for "reset state when a prop changes") rather than in
  // an effect, which would cost an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const isActive = (href: string) => pathname === href;

  return (
    <>
    {/* Matches legacy Layout.tsx's nav: full-width, translucent cream (dark:
        near-black) with blur + saturate, and a faint purple hairline. */}
    <header className="sticky top-0 z-50 border-b border-[#4A1D6B]/15 bg-[#FAFAF7]/88 backdrop-blur-xl backdrop-saturate-180 dark:bg-[#0A0A10]/88">
      <div className="flex min-h-14 items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <span className="font-heading text-[1.15rem] font-bold whitespace-nowrap text-[#111] dark:text-[#F5F0E0]">
            Tony<span className="text-brand-gold">G</span>
          </span>
          <span className="ml-1 hidden border-l border-[#4A1D6B]/30 pl-2.5 font-mono text-[0.7rem] tracking-[0.06em] whitespace-nowrap text-[#999] uppercase lg:inline xl:hidden 2xl:inline">
            Only Time Buys Trust
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu viewport={false} className="ml-auto hidden max-w-none flex-none xl:flex">
          <NavigationMenuList className="gap-2">
            {primaryNavLinks.map((link) =>
              link.href === "/find-my" ? (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuTrigger className="h-8 bg-transparent px-2 font-mono text-[0.78rem] font-semibold tracking-[0.05em] whitespace-nowrap text-[#555] uppercase transition-colors hover:bg-transparent hover:text-brand-gold data-open:text-brand-gold data-popup-open:bg-transparent data-popup-open:text-brand-gold dark:text-[#bbb]">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[720px] max-w-[calc(100vw-2rem)] grid-cols-5 gap-4 p-5">
                      {findYourMeGroups.map((group) => (
                        <div key={group.category}>
                          <p className="mb-2 border-b border-border pb-1 font-heading text-[0.62rem] font-bold uppercase tracking-widest text-brand-gold">
                            {group.category}
                          </p>
                          {group.items.map((item) => (
                            <NavItemLink
                              key={item.href}
                              href={item.href}
                              label={item.label}
                              active={isActive(item.href)}
                              compact
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex h-8 items-center px-2 font-mono text-[0.78rem] font-semibold tracking-[0.05em] whitespace-nowrap uppercase transition-colors hover:text-brand-gold ${
                      isActive(link.href) ? "text-brand-gold-light" : "text-[#555] dark:text-[#bbb]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ),
            )}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 bg-transparent px-2 font-mono text-[0.78rem] font-semibold tracking-[0.05em] whitespace-nowrap text-[#555] uppercase transition-colors hover:bg-transparent hover:text-brand-gold data-open:text-brand-gold data-popup-open:bg-transparent data-popup-open:text-brand-gold dark:text-[#bbb]">
                Explore
              </NavigationMenuTrigger>
              {/* Rightmost trigger — left-aligned (Radix's default with
                  viewport={false}) would expand this 640px panel off the
                  right edge of the viewport on laptop-width screens.
                  right-0/left-auto anchors it to the trigger's right edge
                  instead, so it expands leftward and stays on-screen. */}
              <NavigationMenuContent className="right-0 left-auto">
                <div className="grid w-[640px] max-w-[calc(100vw-2rem)] grid-cols-3 gap-4 p-5">
                  {navCategories.map((cat) => (
                    <div key={cat.title}>
                      <p className="mb-2 border-b border-border pb-1 font-heading text-[0.62rem] font-bold uppercase tracking-widest text-brand-gold">
                        {cat.title}
                      </p>
                      {cat.items.map((item) => (
                        <NavItemLink
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          active={isActive(item.href)}
                          compact
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-2 hidden items-center gap-3 border-l border-[#4A1D6B]/20 pl-3 xl:flex">
          <AskTonyButton onClick={() => setSearchOpen(true)} />
          {socialLinks.map((s) => {
            const Icon = SOCIAL_ICONS[s.label];
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-[#6b6b6b] transition-colors hover:text-brand-gold dark:text-[#aaa] dark:hover:text-brand-gold-light"
              >
                {Icon && <Icon className="size-3.5" />}
              </a>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-1 xl:hidden">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-5" />
          </Button>
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-heading">
                  Tony<span className="text-brand-gold">G</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-8">
                {primaryNavLinks.map((link) => (
                  <NavItemLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={isActive(link.href)}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}

                <Accordion type="multiple" className="mt-2">
                  <AccordionItem value="find-my">
                    <AccordionTrigger className="font-heading text-xs uppercase tracking-widest text-brand-gold">
                      Fix Myself
                    </AccordionTrigger>
                    <AccordionContent>
                      {findYourMeGroups.map((group) => (
                        <div key={group.category} className="mb-3">
                          <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                            {group.category}
                          </p>
                          {group.items.map((item) => (
                            <NavItemLink
                              key={item.href}
                              href={item.href}
                              label={item.label}
                              active={isActive(item.href)}
                              onNavigate={() => setMobileOpen(false)}
                            />
                          ))}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  {navCategories.map((cat) => (
                    <AccordionItem key={cat.title} value={cat.title}>
                      <AccordionTrigger className="font-heading text-xs uppercase tracking-widest text-brand-gold">
                        {cat.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {cat.items.map((item) => (
                          <NavItemLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            active={isActive(item.href)}
                            onNavigate={() => setMobileOpen(false)}
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
