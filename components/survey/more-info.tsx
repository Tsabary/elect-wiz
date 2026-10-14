"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ClientIssue } from "./types";

/**
 * "More info" on an issue, in a dialog: its title, its one-line summary (which the
 * ranking rows leave out to stay short) and its short neutral explanation.
 */
export function MoreInfo({ issue, className }: { issue: ClientIssue; className?: string }) {
  const t = useTranslations("Survey");
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className={cn("text-muted-foreground h-9 gap-1 px-2 text-sm", className)}
            aria-label={t("moreInfoAbout", { title: issue.title })}
            data-testid="more-info"
          />
        }
      >
        <Info aria-hidden="true" />
        {t("moreInfo")}
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{issue.title}</DialogTitle>
          {/* Both paragraphs describe the dialog, so both are read when it opens. */}
          <DialogDescription
            render={<div />}
            className="text-foreground flex flex-col gap-3 text-base leading-relaxed"
          >
            <p className="font-medium" data-testid="more-info-summary">
              {issue.description}
            </p>
            <p data-testid="more-info-text">{issue.moreInfo}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="h-10" />}>
            {t("close")}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
