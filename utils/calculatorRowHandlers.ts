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
    const digits = options.pointsInputs[index];

    if (!digits) {
      const newResults = [...options.results];
      newResults[index] = "";
      options.setResults(newResults);

      const newPoints = [...options.points];
      newPoints[index] = 0;
      options.setPoints(newPoints);
      return;
    }

    const targetPoints = parseInt(digits, 10);
    if (!targetPoints) {
      const newResults = [...options.results];
      newResults[index] = "";
      options.setResults(newResults);

      const newPoints = [...options.points];
      newPoints[index] = 0;
      options.setPoints(newPoints);
      syncPointsInput(options.setPointsInputs, index, 0);
      return;
    }

    const match = closestPerformanceFromPoints(
      targetPoints,
      options.getInverseConfig(index)
    );

    if (!match) {
      syncPointsInput(options.setPointsInputs, index, 0);
      return;
    }

    const newResults = [...options.results];
    newResults[index] = match.performance;
    options.setResults(newResults);

    const newPoints = [...options.points];
    newPoints[index] = match.actualPoints;
    options.setPoints(newPoints);
    syncPointsInput(options.setPointsInputs, index, match.actualPoints);
  };
}

export function createEmptyPointsInputs(count: number): string[] {
  return Array(count).fill("");
}
