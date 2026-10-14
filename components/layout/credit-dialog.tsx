"use client";

import { Mail, XIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "cn";
import portrait from "@/assets/images/yanay-tsabary.png";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Brand marks as single paths (lucide has none), drawn in the text colour.
const LINKS = [
  {
    label: "X",
    href: "https://x.com/yantsab",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yanay-zabary/",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

const EMAIL = "yanaycodes@gmail.com";
const LINK_CLASS =
  "border-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring/50 flex min-h-11 items-center justify-center gap-2 rounded-sm border font-medium transition-colors outline-none focus-visible:ring-3";

type CreditLabels = Record<"open" | "builtBy" | "name" | "linksLabel" | "close", string>;

/**
 * The footer's "Credits" control: opens a dialog naming who built the site,
 * with a portrait, profile links and an email address. The labels come from the (server) footer,
 * so the footer's messages need not be sent to the browser.
 */
export function CreditDialog({ labels, className }: { labels: CreditLabels; className?: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn("cursor-pointer self-start", className)}
        data-testid="credit-open"
      >
        {labels.open}
      </DialogTrigger>
      <DialogContent
        className="gap-0 overflow-hidden rounded-sm p-0 text-base"
        data-testid="credit-dialog"
      >
        {/* An ink band with the two stripes, like the footer; the portrait hangs over its edge. */}
        <div className="bg-ink h-24">
          <div aria-hidden="true" className="flex flex-col gap-[3px] pt-[3px]">
            <div className="bg-background h-[3px]" />
            <div className="bg-background h-[3px]" />
          </div>
        </div>
        <DialogClose
          className="text-ink-foreground focus-visible:ring-ink-foreground/60 absolute end-2 top-4 flex size-11 cursor-pointer items-center justify-center rounded-sm outline-none focus-visible:ring-3"
          aria-label={labels.close}
        >
          <XIcon aria-hidden="true" className="size-5" />
        </DialogClose>
        <div className="flex flex-col gap-5 px-6 pb-6">
          <Image
            src={portrait}
            alt=""
            sizes="112px"
            className="border-card -mt-14 size-28 -rotate-3 rounded-sm border-4 shadow-[0_10px_24px_-10px_rgb(20_30_60/0.55)] rtl:rotate-3"
          />
          <div className="flex flex-col gap-1.5">
            <p className="eyebrow">{labels.builtBy}</p>
            <DialogTitle className="text-4xl">{labels.name}</DialogTitle>
          </div>
          <ul aria-label={labels.linksLabel} className="grid grid-cols-2 gap-3">
            {LINKS.map(({ label, href, icon }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d={icon} />
                  </svg>
                  <span lang="en" dir="ltr">
                    {label}
                  </span>
                </a>
              </li>
            ))}
            <li className="col-span-2">
              <a href={`mailto:${EMAIL}`} className={LINK_CLASS}>
                <Mail aria-hidden="true" className="size-4" />
                <span lang="en" dir="ltr">
                  {EMAIL}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
