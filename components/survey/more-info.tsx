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
import type { ClientIssue } from "./types";

/** "More info" on an issue: its short neutral explanation, in a dialog. */
export function MoreInfo({ issue }: { issue: ClientIssue }) {
  const t = useTranslations("Survey");
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="text-muted-foreground h-9 gap-1 px-2 text-sm"
            aria-label={t("moreInfoAbout", { title: issue.title })}
          />
        }
      >
        <Info aria-hidden="true" />
        {t("moreInfo")}
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{issue.title}</DialogTitle>
          <DialogDescription className="text-foreground text-base leading-relaxed">
            {issue.moreInfo}
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
