"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
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
} from "@/components/site-nav-data";

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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Tony<span className="text-brand-gold">G</span>
          </span>
          <span className="hidden border-l border-border pl-2.5 font-mono text-[0.68rem] uppercase tracking-wide text-muted-foreground lg:inline">
            Only Time Buys Trust
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu viewport={false} className="hidden xl:flex">
          <NavigationMenuList className="gap-1">
            {primaryNavLinks.map((link) =>
              link.href === "/find-my" ? (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuTrigger className="h-8 bg-transparent px-2 font-mono text-xs font-normal text-muted-foreground uppercase tracking-wide transition-colors hover:bg-transparent hover:text-brand-gold data-open:font-bold data-open:text-brand-gold-light data-popup-open:bg-transparent data-popup-open:text-brand-gold-light">
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
                    className={`inline-flex h-8 items-center px-2 font-mono text-xs uppercase tracking-wide transition-colors hover:text-brand-gold ${
                      isActive(link.href) ? "text-brand-gold-light" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ),
            )}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 bg-transparent px-2 font-mono text-xs font-normal text-muted-foreground uppercase tracking-wide transition-colors hover:bg-transparent hover:text-brand-gold data-open:font-bold data-open:text-brand-gold-light data-popup-open:bg-transparent data-popup-open:text-brand-gold-light">
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

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="text-muted-foreground transition-colors hover:text-brand-gold-light"
          >
            <Search size={16} />
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-1 xl:hidden">
          <Link href="/search" aria-label="Search">
            <Button variant="ghost" size="icon">
              <Search className="size-5" />
            </Button>
          </Link>
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
  );
}
