"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

const ITEMS = [
  { href: "/", key: "home" },
  { href: "/parties", key: "parties" },
  { href: "/how-it-works", key: "howItWorks" },
] as const;

export function MainNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label={t("mainLabel")} className={className}>
      <ul className="-mx-2 flex items-center gap-1 overflow-x-auto">
        {ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring/50 flex min-h-11 items-center rounded-md px-2 text-sm whitespace-nowrap outline-none focus-visible:ring-3",
                  active
                    ? "text-primary font-semibold underline decoration-2 underline-offset-8"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
