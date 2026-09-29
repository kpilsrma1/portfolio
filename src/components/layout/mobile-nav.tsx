"use client";

import { FileTextIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/config/site";

interface MobileNavProps {
  items: readonly NavItem[];
  resumeHref: string;
  hasResume: boolean;
}

export function MobileNav({ items, resumeHref, hasResume }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
          data-testid="mobile-menu-trigger"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(20rem,85vw)] bg-background p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="text-left">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Site navigation links</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground-secondary transition-colors hover:bg-surface hover:text-foreground"
              activeClassName="bg-surface text-foreground"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-6 py-5">
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href={resumeHref} onClick={() => setOpen(false)}>
              <FileTextIcon aria-hidden="true" />
              {hasResume ? "Download résumé" : "Résumé"}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
