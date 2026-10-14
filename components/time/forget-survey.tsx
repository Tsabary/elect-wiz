"use client";

/**
 * Deletes the survey saved on this device once polls close, and a result past
 * its retention period (owner decision, 2026-10-14; the Privacy page says so).
 * Mounted on every page, so the first page load after either removes it, and a
 * tab left open across the close does as soon as its own check of the instant flips.
 */
import { useEffect } from "react";
import { browserLocalStorage, createSurveyStorage } from "@/lib/survey/storage";
import { useTimeModes } from "./time-modes";

export function ForgetSurveyAfterClose() {
  // The layout is rendered ahead of time, so it is the browser's check that counts here.
  const { electionOver } = useTimeModes({ blackout: false, electionOver: false });
  useEffect(() => {
    const storage = createSurveyStorage(browserLocalStorage());
    if (electionOver) storage.clear();
    else storage.forgetExpired();
  }, [electionOver]);
  return null;
}
