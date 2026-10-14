"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ReactElement, type RefObject } from "react";
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
 * "Start over" behind a confirmation: the saved ranking and answers (or result)
 * would be lost, so it asks first. `trigger` is the button that opens it; after
 * a confirmed restart focus goes to `focusAfter` (the new survey's heading), or
 * stays where the page puts it when that is null (the intro, which navigates away).
 */
export function StartOverDialog({
  trigger,
  onConfirm,
  focusAfter,
  finished = false,
}: {
  trigger: ReactElement;
  onConfirm: () => void;
  focusAfter: RefObject<HTMLElement | null> | null;
  /** The survey to discard has a result: say so, and offer to keep it. */
  finished?: boolean;
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
      <DialogTrigger render={trigger}>
        <RotateCcw aria-hidden="true" />
        {t("Common.startOver")}
      </DialogTrigger>
      <DialogContent
        role="alertdialog"
        data-testid="start-over-dialog"
        finalFocus={() => (confirmed.current ? (focusAfter?.current ?? false) : true)}
      >
        <DialogHeader>
          <DialogTitle>{t("Survey.startOverConfirm.title")}</DialogTitle>
          <DialogDescription className="text-foreground text-base leading-relaxed">
            {finished ? t("Result.startOverHint") : t("Survey.startOverConfirm.body")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" className="h-10" data-testid="start-over-cancel" />}
          >
            {finished
              ? t("Survey.startOverConfirm.keepResult")
              : t("Survey.startOverConfirm.cancel")}
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

/** "Start over" on the survey screens. */
export function SurveyStartOver({
  onConfirm,
  headingRef,
}: {
  onConfirm: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <StartOverDialog
      onConfirm={onConfirm}
      focusAfter={headingRef}
      trigger={
        <Button
          variant="ghost"
          className="text-muted-foreground h-9 gap-1.5 px-2 text-sm"
          data-testid="survey-start-over"
        />
      }
    />
  );
}
