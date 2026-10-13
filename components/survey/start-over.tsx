"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type RefObject } from "react";
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

/**
 * "Start over" on the survey screens. Here the ranking and answers would be
 * lost, so it asks first. After a confirmed restart, focus goes to the new
 * survey's heading instead of back to this control.
 */
export function SurveyStartOver({
  onConfirm,
  headingRef,
}: {
  onConfirm: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const confirmed = useRef(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) confirmed.current = false;
        setOpen(next);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="text-muted-foreground h-9 gap-1.5 px-2 text-sm"
            data-testid="survey-start-over"
          />
        }
      >
        <RotateCcw aria-hidden="true" />
        {t("Common.startOver")}
      </DialogTrigger>
      <DialogContent
        role="alertdialog"
        data-testid="start-over-dialog"
        finalFocus={() => (confirmed.current ? headingRef.current : true)}
      >
        <DialogHeader>
          <DialogTitle>{t("Survey.startOverConfirm.title")}</DialogTitle>
          <DialogDescription className="text-foreground text-base leading-relaxed">
            {t("Survey.startOverConfirm.body")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" className="h-10" data-testid="start-over-cancel" />}
          >
            {t("Survey.startOverConfirm.cancel")}
          </DialogClose>
          <Button
            className="h-10"
            data-testid="start-over-confirm"
            onClick={() => {
              confirmed.current = true;
              setOpen(false);
              onConfirm();
            }}
          >
            {t("Survey.startOverConfirm.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
