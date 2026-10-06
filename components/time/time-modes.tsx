"use client";

/**
 * Client-side re-check of the time-based modes (plan Performance §1).
 *
 * Pages are statically generated and revalidated about every 5 minutes, so a
 * cached page (CDN, browser tab left open) could outlive a switch instant. These
 * guards compare the absolute UTC instants with the browser clock and hide poll
 * content / disable the survey as soon as an instant passes. Server-rendered HTML
 * already reflects the mode at render time, so pages work without JavaScript.
 *
 * Non-production only: the `clock-override` cookie (set via `?clock=<ISO>` on any
 * page, cleared with `?clock=off`) shifts the browser clock for testing.
 */
import { createContext, use, useEffect, useSyncExternalStore, type ReactNode } from "react";
import {
  CLOCK_OVERRIDE_COOKIE,
  CLOCK_OVERRIDE_PARAM,
  parseClockOverride,
  readCookie,
  timeModes,
  type ClientTimeConfig,
  type TimeModes,
} from "@/lib/time-modes";

const TimeConfigContext = createContext<ClientTimeConfig | null>(null);

/** Applies `?clock=` to the override cookie (non-production only). */
function syncOverrideParam(cfg: ClientTimeConfig) {
  if (!cfg.overrideAllowed || typeof window === "undefined") return;
  const value = new URLSearchParams(window.location.search).get(CLOCK_OVERRIDE_PARAM);
  if (value === null) return;
  if (value === "off" || value === "") {
    document.cookie = `${CLOCK_OVERRIDE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  } else if (parseClockOverride(value)) {
    document.cookie = `${CLOCK_OVERRIDE_COOKIE}=${encodeURIComponent(value)}; path=/; samesite=lax`;
  }
}

export function clientNow(cfg: ClientTimeConfig): Date {
  if (cfg.overrideAllowed && typeof document !== "undefined") {
    const fromCookie = parseClockOverride(readCookie(document.cookie, CLOCK_OVERRIDE_COOKIE));
    if (fromCookie) return fromCookie;
    if (cfg.serverOverride !== null) return new Date(cfg.serverOverride);
  }
  return new Date();
}

export function TimeModesProvider({
  config,
  children,
}: {
  config: ClientTimeConfig;
  children: ReactNode;
}) {
  // Runs before child effects read the cookie on first load.
  if (typeof window !== "undefined") syncOverrideParam(config);
  return <TimeConfigContext value={config}>{children}</TimeConfigContext>;
}

const key = (m: TimeModes) => `${m.blackout ? 1 : 0}${m.electionOver ? 1 : 0}`;
const fromKey = (k: string): TimeModes => ({ blackout: k[0] === "1", electionOver: k[1] === "1" });

function subscribe(onChange: () => void) {
  // Re-check periodically and when the tab becomes visible again.
  const id = window.setInterval(onChange, 15_000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/**
 * The current modes: the server-rendered value during hydration, then the
 * browser's own check of the instants.
 */
export function useTimeModes(server: TimeModes): TimeModes {
  const cfg = use(TimeConfigContext);
  const k = useSyncExternalStore(
    subscribe,
    () => (cfg ? key(timeModes(clientNow(cfg), cfg)) : key(server)),
    () => key(server),
  );
  return fromKey(k);
}

/** Renders `children` unless the poll blackout is in force, then `fallback`. */
export function PollContent({
  serverBlackout,
  fallback = null,
  children,
}: {
  serverBlackout: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { blackout } = useTimeModes({ blackout: serverBlackout, electionOver: false });
  return <>{blackout ? fallback : children}</>;
}

/** Renders `open` while the survey is open, `closed` once the election is over. */
export function ElectionGate({
  serverOver,
  open,
  closed,
}: {
  serverOver: boolean;
  open: ReactNode;
  closed: ReactNode;
}) {
  const { electionOver } = useTimeModes({ blackout: false, electionOver: serverOver });
  return <>{electionOver ? closed : open}</>;
}

/** Calls `onOver` once the election is over (e.g. to redirect away from the survey). */
export function useOnElectionOver(serverOver: boolean, onOver: () => void) {
  const { electionOver } = useTimeModes({ blackout: false, electionOver: serverOver });
  useEffect(() => {
    if (electionOver) onOver();
  }, [electionOver, onOver]);
  return electionOver;
}
