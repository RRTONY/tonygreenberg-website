"use client";

import type { RefObject } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NavItemLink } from "@/components/nav-item-link";
import { primaryNavLinks, navCategories, findYourMeGroups } from "@/components/site-nav-data";

// The site header's phone menu. Loaded on first open (see site-header.tsx), so
// the Sheet and Accordion code isn't part of every page's first load. Focus
// goes back to the header's menu button on close, as a SheetTrigger would.
export function MobileMenu({
  open,
  onOpenChange,
  pathname,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}) {
  const isActive = (href: string) => pathname === href;
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-sm"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-heading">
            Tony<span className="text-brand-gold">G</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4 pb-8">
          {primaryNavLinks.map((link) => (
            <NavItemLink key={link.href} href={link.href} label={link.label} active={isActive(link.href)} onNavigate={close} />
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
                      <NavItemLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} onNavigate={close} />
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
                    <NavItemLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} onNavigate={close} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
