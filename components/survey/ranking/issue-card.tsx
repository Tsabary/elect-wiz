"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Plus, Undo2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreInfo } from "../more-info";
import type { ClientIssue } from "../types";

type Props =
  | {
      issue: ClientIssue;
      mode: "ranked";
      rank: number;
      isFirst: boolean;
      isLast: boolean;
      onMoveUp: () => void;
      onMoveDown: () => void;
      onRemove: () => void;
    }
  | {
      issue: ClientIssue;
      mode: "pool";
      onAdd: () => void;
      onNotImportant: () => void;
    };

/** One issue in the ranked list or the unranked pool. Sortable via its drag handle. */
export function IssueCard(props: Props) {
  const { issue } = props;
  const t = useTranslations("Ranking");
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id, attributes: { roleDescription: t("dnd.roleDescription") } });

  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-testid={props.mode === "ranked" ? "ranked-item" : "pool-item"}
      data-issue-id={issue.id}
      className={cn(
        // A control scrolled to (on focus) stays clear of the sticky header and, on
        // narrow screens, the sticky "continue" bar.
        "sheet flex gap-2 p-3 [&_button]:scroll-mt-28 [&_button]:scroll-mb-36 sm:[&_button]:scroll-mb-4",
        isDragging && "opacity-40",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={t("dragHandle", { title: issue.title })}
        data-testid="drag-handle"
        className="text-muted-foreground hover:bg-muted focus-visible:ring-ring/50 -my-1 -ms-1 flex w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md outline-none focus-visible:ring-3 active:cursor-grabbing"
      >
        <GripVertical className="size-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-2">
          {props.mode === "ranked" && (
            <span
              className="display text-primary min-w-6 shrink-0 text-center text-3xl leading-[0.8] tabular-nums"
              data-testid="rank-badge"
            >
              <span className="sr-only">{t("rankLabel")} </span>
              {props.rank}
            </span>
          )}
          <h3 className="flex-1 text-lg leading-snug font-bold">{issue.title}</h3>
          {/* Beside the title it explains: the issue's summary is only shown in here. */}
          <MoreInfo issue={issue} className="text-primary -my-1.5 -me-1 shrink-0 font-medium" />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {props.mode === "pool" ? (
            <>
              <Button
                variant="outline"
                className="h-10 gap-1 px-3"
                onClick={props.onAdd}
                aria-label={t("addAria", { title: issue.title })}
                data-testid="add-to-ranking"
                data-focus-key={`${issue.id}-add`}
              >
                <Plus aria-hidden="true" />
                {t("add")}
              </Button>
              <Button
                variant="ghost"
                className="h-10 px-3"
                onClick={props.onNotImportant}
                aria-label={t("notImportantAria", { title: issue.title })}
                data-testid="mark-not-important"
                data-focus-key={`${issue.id}-not-important`}
              >
                {t("notImportant")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                className="size-10"
                onClick={props.onMoveUp}
                disabled={props.isFirst}
                aria-label={t("moveUp", { title: issue.title })}
                data-testid="move-up"
                data-focus-key={`${issue.id}-up`}
              >
                <ChevronUp aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10"
                onClick={props.onMoveDown}
                disabled={props.isLast}
                aria-label={t("moveDown", { title: issue.title })}
                data-testid="move-down"
                data-focus-key={`${issue.id}-down`}
              >
                <ChevronDown aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="h-10 gap-1 px-3"
                onClick={props.onRemove}
                aria-label={t("removeAria", { title: issue.title })}
                data-testid="remove-from-ranking"
                data-focus-key={`${issue.id}-remove`}
              >
                <X aria-hidden="true" />
                {t("remove")}
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/** The floating copy of a card while it's dragged. */
export function IssueCardOverlay({ issue }: { issue: ClientIssue }) {
  return (
    <div className="sheet flex -rotate-1 cursor-grabbing gap-2 p-3 shadow-lg">
      <GripVertical className="text-muted-foreground size-5 shrink-0" aria-hidden="true" />
      <p className="text-lg font-bold">{issue.title}</p>
    </div>
  );
}

/** An issue marked "doesn't matter to me". */
export function NotImportantCard({
  issue,
  onRestore,
}: {
  issue: ClientIssue;
  onRestore: () => void;
}) {
  const t = useTranslations("Ranking");
  return (
    <li
      data-testid="not-important-item"
      data-issue-id={issue.id}
      className="border-foreground/30 flex items-center justify-between gap-2 rounded-sm border border-dashed py-1.5 ps-3 pe-1.5"
    >
      <span className="text-muted-foreground font-medium">{issue.title}</span>
      <Button
        variant="ghost"
        className="h-10 shrink-0 gap-1 px-3"
        onClick={onRestore}
        aria-label={t("restoreAria", { title: issue.title })}
        data-testid="restore-issue"
        data-focus-key={`${issue.id}-restore`}
      >
        <Undo2 aria-hidden="true" />
        {t("restore")}
      </Button>
    </li>
  );
}
