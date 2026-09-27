import { formatPerformanceText } from "./formatPerformanceText";
import { extractDigits } from "./performanceInput";
import {
  closestPerformanceFromPoints,
  InverseEventConfig,
} from "./performanceFromPoints";

type SetPointsInputs = (
  updater: (previous: string[]) => string[] | string[]
) => void;

function syncPointsInput(
  setPointsInputs: SetPointsInputs | undefined,
  index: number,
  points: number
) {
  if (!setPointsInputs) {
    return;
  }

  setPointsInputs((previous) => {
    const next = [...previous];
    next[index] = points > 0 ? String(points) : "";
    return next;
  });
}

export function createHandleInputChange(options: {
  results: string[];
  points: number[];
  setResults: (results: string[]) => void;
  setPoints: (points: number[]) => void;
  setPointsInputs?: SetPointsInputs;
  getEventName: (index: number) => string;
  trackEvents: string[];
  longTrackEvents: string[];
  calculatePoints: (value: string, index: number) => number;
}) {
  return (text: string, index: number) => {
    const eventName = options.getEventName(index);
    const formattedText = formatPerformanceText(
      text,
      eventName,
      options.trackEvents,
      options.longTrackEvents
    );

    const newResults = [...options.results];
    newResults[index] = formattedText;
    options.setResults(newResults);

    const computedPoints = options.calculatePoints(formattedText, index);
    const newPoints = [...options.points];
    newPoints[index] = computedPoints;
    options.setPoints(newPoints);
    syncPointsInput(options.setPointsInputs, index, computedPoints);
  };
}

export function createHandlePointsTextChange(options: {
  setPointsInputs: SetPointsInputs;
}) {
  return (text: string, index: number) => {
    const digits = extractDigits(text.replace(/\D/g, ""), 4);
    options.setPointsInputs((previous) => {
      const next = [...previous];
      next[index] = digits;
      return next;
    });
  };
}

export function createCommitPointsChange(options: {
  results: string[];
  points: number[];
  pointsInputs: string[];
  setResults: (results: string[]) => void;
  setPoints: (points: number[]) => void;
  setPointsInputs: SetPointsInputs;
  getInverseConfig: (index: number) => InverseEventConfig;
}) {
  return (index: number) => {
    const flushed = flushAllPointsInputs({
      results: options.results,
      points: options.points,
      pointsInputs: options.pointsInputs,
      getInverseConfig: options.getInverseConfig,
      onlyIndex: index,
    });
    options.setResults(flushed.results);
    options.setPoints(flushed.points);
    options.setPointsInputs(() => flushed.pointsInputs);
  };
}

/** Apply pending points→performance for one or all rows before chart/save/clear. */
export function flushAllPointsInputs(options: {
  results: string[];
  points: number[];
  pointsInputs: string[];
  getInverseConfig: (index: number) => InverseEventConfig;
  onlyIndex?: number;
}): { results: string[]; points: number[]; pointsInputs: string[] } {
  const results = [...options.results];
  const points = [...options.points];
  const pointsInputs = [...options.pointsInputs];
  const start =
    typeof options.onlyIndex === "number" ? options.onlyIndex : 0;
  const end =
    typeof options.onlyIndex === "number"
      ? options.onlyIndex + 1
      : pointsInputs.length;

  for (let index = start; index < end; index++) {
    const digits = pointsInputs[index];

    if (!digits) {
      if (typeof options.onlyIndex === "number") {
        results[index] = "";
        points[index] = 0;
      }
      continue;
    }

    const targetPoints = parseInt(digits, 10);
    if (!targetPoints) {
      results[index] = "";
      points[index] = 0;
      pointsInputs[index] = "";
      continue;
    }

    const match = closestPerformanceFromPoints(
      targetPoints,
      options.getInverseConfig(index)
    );

    if (!match) {
      pointsInputs[index] = "";
      continue;
    }

    results[index] = match.performance;
    points[index] = match.actualPoints;
    pointsInputs[index] = String(match.actualPoints);
  }

  return { results, points, pointsInputs };
}

export function createEmptyPointsInputs(count: number): string[] {
  return Array(count).fill("");
}
