import { useEffect, useRef, useState } from "react";
import type { EventType } from "../utils/scoreStorage";
import {
  clearCalculatorDraft,
  loadCalculatorDraft,
  saveCalculatorDraft,
  type CalculatorDraft,
} from "../utils/calculatorDraftStorage";
import { createEmptyPointsInputs } from "../utils/calculatorRowHandlers";

type UseCalculatorDraftArgs = {
  eventType: EventType;
  eventCount: number;
  results: string[];
  points: number[];
  pointsInputs: string[];
  setResults: (results: string[]) => void;
  setPoints: (points: number[]) => void;
  setPointsInputs: (inputs: string[]) => void;
};

/**
 * Persist calculator inputs across leaving/returning until Clear.
 * Mirrors the rankings hydrate + skip-next-persist pattern.
 */
export function useCalculatorDraft({
  eventType,
  eventCount,
  results,
  points,
  pointsInputs,
  setResults,
  setPoints,
  setPointsInputs,
}: UseCalculatorDraftArgs) {
  const [hydrated, setHydrated] = useState(false);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadCalculatorDraft(eventType, eventCount)
      .then((draft) => {
        if (cancelled || !draft) {
          return;
        }
        skipNextPersist.current = true;
        setResults(draft.results);
        setPoints(draft.points);
        setPointsInputs(draft.pointsInputs);
      })
      .finally(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [eventType, eventCount, setResults, setPoints, setPointsInputs]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    const draft: CalculatorDraft = { results, points, pointsInputs };
    void saveCalculatorDraft(eventType, draft);
  }, [hydrated, eventType, results, points, pointsInputs]);

  const clearDraftState = () => {
    skipNextPersist.current = true;
    setResults(Array(eventCount).fill(""));
    setPoints(Array(eventCount).fill(0));
    setPointsInputs(createEmptyPointsInputs(eventCount));
    void clearCalculatorDraft(eventType);
  };

  return { hydrated, clearDraftState };
}
