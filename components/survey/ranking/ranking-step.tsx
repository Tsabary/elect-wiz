"use client";

/**
 * Step 1: ranking (PRD Step 1, plan "Survey (client-side)").
 *
 * All issues start in an unranked pool in this session's random order. The user
 * builds a ranked list (1 = most important) and can mark up to 5 issues
 * "doesn't matter to me". Three equivalent ways to rank:
 * - tap/click "Add", then the up/down arrows (works everywhere, no dragging);
 * - drag and drop with mouse or touch (drag handles; dnd-kit);
 * - keyboard drag and drop (Space to pick up, arrows to move, Space to drop).
 */
import {
  closestCorners,
  DndContext,
  pointerWithin,
  type CollisionDetection,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  addToRanking,
  markNotImportant,
  MAX_NOT_IMPORTANT,
  MIN_RANKED,
  moveRanked,
  rankingComplete,
  removeFromRanking,
  setRanking,
  unmarkNotImportant,
  unrankedPool,
  type SurveyState,
} from "@/lib/survey/state";
import type { ClientIssue } from "../types";
import { IssueCard, IssueCardOverlay, NotImportantCard } from "./issue-card";

type ContainerId = "ranked" | "pool";

/** Pointer position first (mouse/touch); closest corners for keyboard moves. */
const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : closestCorners(args);
};
interface DragItems {
  ranked: string[];
  pool: string[];
}

export function RankingStep({
  issues,
  state,
  onChange,
  onContinue,
  headingRef,
}: {
  issues: ClientIssue[];
  state: SurveyState;
  onChange: (fn: (s: SurveyState) => SurveyState) => void;
  onContinue: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const t = useTranslations("Ranking");
  const issueIds = issues.map((i) => i.id);
  const byId = new Map(issues.map((i) => [i.id, i]));
  const title = (id: UniqueIdentifier) => byId.get(String(id))?.title ?? String(id);

  const [dragItems, setDragItems] = useState<DragItems | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [limitHit, setLimitHit] = useState(false);
  const pendingFocus = useRef<string | null>(null);

  const base: DragItems = { ranked: state.ranked, pool: unrankedPool(state, issueIds) };
  const items = dragItems ?? base;
  const complete = rankingComplete(state, issueIds);
  const remaining = base.pool.length;

  // Restore focus to a control after a reorder/move (keyed nodes can lose focus when moved).
  useEffect(() => {
    const key = pendingFocus.current;
    if (!key) return;
    pendingFocus.current = null;
    const el = document.querySelector<HTMLElement>(`[data-focus-key="${key}"]`);
    (el && !el.hasAttribute("disabled") ? el : null)?.focus();
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // ------------------------------------------------------------------ button actions

  function announce(message: string) {
    // Re-set so identical consecutive messages are still read.
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(message));
  }

  function add(id: string) {
    const pool = base.pool;
    const i = pool.indexOf(id);
    const nextInPool = pool[i + 1] ?? pool[i - 1];
    onChange((s) => addToRanking(s, id));
    setLimitHit(false);
    pendingFocus.current = nextInPool ? `${nextInPool}-add` : "continue";
    const position = state.ranked.length + 1;
    announce(
      remaining === 1
        ? t("announce.addedLast", { title: title(id), position })
        : t("announce.added", { title: title(id), position }),
    );
  }

  function move(id: string, delta: -1 | 1) {
    const from = state.ranked.indexOf(id);
    const to = from + delta;
    if (to < 0 || to >= state.ranked.length) return;
    onChange((s) => moveRanked(s, from, to));
    const atEdge = to === 0 || to === state.ranked.length - 1;
    pendingFocus.current = atEdge
      ? `${id}-${delta < 0 ? "down" : "up"}`
      : `${id}-${delta < 0 ? "up" : "down"}`;
    announce(
      t("announce.moved", { title: title(id), position: to + 1, total: state.ranked.length }),
    );
  }

  function remove(id: string) {
    const i = state.ranked.indexOf(id);
    const neighbour = state.ranked[i + 1] ?? state.ranked[i - 1];
    onChange((s) => removeFromRanking(s, id));
    pendingFocus.current = neighbour ? `${neighbour}-remove` : `${id}-add`;
    announce(t("announce.removed", { title: title(id) }));
  }

  function notImportant(id: string) {
    const r = markNotImportant(state, id);
    if (!r.ok) {
      setLimitHit(true);
      announce(t("limitReached", { max: MAX_NOT_IMPORTANT }));
      return;
    }
    const pool = base.pool;
    const i = pool.indexOf(id);
    const nextInPool = pool[i + 1] ?? pool[i - 1];
    onChange((s) => {
      const res = markNotImportant(s, id);
      return res.ok ? res.state : s;
    });
    pendingFocus.current = nextInPool ? `${nextInPool}-add` : `${id}-restore`;
    announce(t("announce.notImportant", { title: title(id) }));
  }

  function restore(id: string) {
    onChange((s) => unmarkNotImportant(s, id));
    setLimitHit(false);
    pendingFocus.current = `${id}-add`;
    announce(t("announce.restored", { title: title(id) }));
  }

  // ------------------------------------------------------------------ drag and drop

  const containerOf = (id: UniqueIdentifier, from: DragItems = items): ContainerId | null => {
    if (id === "ranked" || id === "pool") return id;
    if (from.ranked.includes(String(id))) return "ranked";
    if (from.pool.includes(String(id))) return "pool";
    return null;
  };

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
    setDragItems(base);
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    setDragItems((prev) => {
      const cur = prev ?? base;
      const from = containerOf(active.id, cur);
      const to = containerOf(over.id, cur);
      if (!from || !to || from === to) return cur;
      const id = String(active.id);
      const target = [...cur[to]];
      const overIndex = target.indexOf(String(over.id));
      target.splice(overIndex >= 0 ? overIndex : target.length, 0, id);
      return { ...cur, [from]: cur[from].filter((x) => x !== id), [to]: target } as DragItems;
    });
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const cur = dragItems ?? base;
    setActiveId(null);
    setDragItems(null);
    if (!over) return;
    let ranked = cur.ranked;
    if (containerOf(active.id, cur) === "ranked" && containerOf(over.id, cur) === "ranked") {
      const oldIndex = ranked.indexOf(String(active.id));
      const newIndex = ranked.indexOf(String(over.id));
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        ranked = arrayMove(ranked, oldIndex, newIndex);
      }
    }
    onChange((s) => setRanking(s, ranked, issueIds));
    setLimitHit(false);
  }

  function onDragCancel() {
    setActiveId(null);
    setDragItems(null);
  }

  const positionText = (id: UniqueIdentifier, overId: UniqueIdentifier | undefined) => {
    if (overId === undefined) return t("dnd.outside", { title: title(id) });
    const container = containerOf(overId);
    if (container === "pool") return t("dnd.overPool", { title: title(id) });
    const idx = items.ranked.indexOf(String(overId));
    const position = idx >= 0 ? idx + 1 : items.ranked.length;
    return t("dnd.overRanked", { title: title(id), position });
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => t("dnd.pickedUp", { title: title(active.id) }),
    onDragOver: ({ active, over }) => positionText(active.id, over?.id),
    onDragEnd: ({ active, over }) =>
      over
        ? t("dnd.dropped", { text: positionText(active.id, over.id) })
        : t("dnd.cancelled", { title: title(active.id) }),
    onDragCancel: ({ active }) => t("dnd.cancelled", { title: title(active.id) }),
  };
  const screenReaderInstructions: ScreenReaderInstructions = { draggable: t("dnd.instructions") };

  return (
    <section aria-labelledby="ranking-heading" className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm font-medium">{t("stepLabel")}</p>
        <h1
          id="ranking-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold outline-none sm:text-3xl"
        >
          {t("heading")}
        </h1>
        <p className="text-muted-foreground max-w-prose">
          {t("instructions", { max: MAX_NOT_IMPORTANT })}
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{ announcements, screenReaderInstructions }}
      >
        <RankedList
          ids={items.ranked}
          label={t("rankedHeading")}
          emptyText={t("rankedEmpty")}
          count={items.ranked.length}
        >
          {items.ranked.map((id, i) => (
            <IssueCard
              key={id}
              issue={byId.get(id)!}
              mode="ranked"
              rank={i + 1}
              isFirst={i === 0}
              isLast={i === items.ranked.length - 1}
              onMoveUp={() => move(id, -1)}
              onMoveDown={() => move(id, 1)}
              onRemove={() => remove(id)}
            />
          ))}
        </RankedList>

        <PoolList
          ids={items.pool}
          label={t("poolHeading")}
          emptyText={t("poolEmpty")}
          count={items.pool.length}
        >
          {items.pool.map((id) => (
            <IssueCard
              key={id}
              issue={byId.get(id)!}
              mode="pool"
              onAdd={() => add(id)}
              onNotImportant={() => notImportant(id)}
            />
          ))}
        </PoolList>

        <DragOverlay>
          {activeId ? <IssueCardOverlay issue={byId.get(activeId)!} /> : null}
        </DragOverlay>
      </DndContext>

      <section aria-labelledby="not-important-heading" className="flex flex-col gap-3">
        <h2 id="not-important-heading" className="text-lg font-semibold">
          {t("notImportantHeading", { count: state.notImportant.length, max: MAX_NOT_IMPORTANT })}
        </h2>
        {limitHit && (
          <p
            role="alert"
            data-testid="limit-message"
            className="rounded-lg border border-dashed px-3 py-2 text-sm font-medium"
          >
            {t("limitReached", { max: MAX_NOT_IMPORTANT })}
          </p>
        )}
        {state.notImportant.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("notImportantEmpty")}</p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="not-important-list">
            {state.notImportant.map((id) => (
              <NotImportantCard key={id} issue={byId.get(id)!} onRestore={() => restore(id)} />
            ))}
          </ul>
        )}
      </section>

      <div className="bg-background/95 sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0">
        <p className="text-muted-foreground text-sm" id="ranking-status">
          {complete
            ? t("statusComplete", { count: state.ranked.length })
            : state.ranked.length + remaining < MIN_RANKED
              ? t("statusMin", { min: MIN_RANKED })
              : t("statusRemaining", { count: remaining })}
        </p>
        <Button
          size="lg"
          className="h-12 text-base"
          disabled={!complete}
          aria-describedby="ranking-status"
          onClick={onContinue}
          data-testid="ranking-continue"
          data-focus-key="continue"
        >
          {t("continue")}
        </Button>
      </div>

      <p aria-live="polite" role="status" className="sr-only" data-testid="ranking-live">
        {announcement}
      </p>
    </section>
  );
}

function RankedList({
  ids,
  label,
  emptyText,
  count,
  children,
}: {
  ids: string[];
  label: string;
  emptyText: string;
  count: number;
  children: React.ReactNode;
}) {
  // The list itself is a drop target only while empty; otherwise its items are.
  const { setNodeRef, isOver } = useDroppable({ id: "ranked", disabled: ids.length > 0 });
  return (
    <section aria-labelledby="ranked-heading" className="flex flex-col gap-3">
      <h2 id="ranked-heading" className="text-lg font-semibold">
        {label} <span className="text-muted-foreground font-normal">({count})</span>
      </h2>
      <SortableContext id="ranked" items={ids} strategy={verticalListSortingStrategy}>
        <ol
          ref={setNodeRef}
          data-testid="ranked-list"
          className={`flex min-h-20 flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition-colors ${isOver ? "border-primary/50 bg-accent/60" : "border-border"}`}
        >
          {ids.length === 0 && (
            <li className="text-muted-foreground flex min-h-16 items-center justify-center px-4 text-center text-sm">
              {emptyText}
            </li>
          )}
          {children}
        </ol>
      </SortableContext>
    </section>
  );
}

function PoolList({
  ids,
  label,
  emptyText,
  count,
  children,
}: {
  ids: string[];
  label: string;
  emptyText: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: "pool", disabled: ids.length > 0 });
  return (
    <section aria-labelledby="pool-heading" className="flex flex-col gap-3">
      <h2 id="pool-heading" className="text-lg font-semibold">
        {label} <span className="text-muted-foreground font-normal">({count})</span>
      </h2>
      <SortableContext id="pool" items={ids} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} data-testid="pool-list" className="flex min-h-12 flex-col gap-2">
          {ids.length === 0 && <li className="text-muted-foreground px-1 text-sm">{emptyText}</li>}
          {children}
        </ul>
      </SortableContext>
    </section>
  );
}
