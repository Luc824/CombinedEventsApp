import { safeFloorPoints } from "./pointsUtils";

export type InverseEventConfig = {
  formula: (value: number) => number;
  bounds: { min: number; max: number };
  /** True for track events (more points = faster / lower time). */
  decreasing: boolean;
  formatDisplay: (formulaValue: number) => string;
  /** Step size when searching for the closest achievable score. */
  searchStep?: number;
};

export type ClosestPointsResult = {
  performance: string;
  actualPoints: number;
};

function formatCentiseconds(seconds: number): string {
  const wholeSeconds = Math.floor(seconds);
  const centiseconds = Math.min(
    99,
    Math.max(0, Math.round((seconds - wholeSeconds) * 100))
  );
  return `${wholeSeconds}.${String(centiseconds).padStart(2, "0")}`;
}

export function formatShortTrackTime(seconds: number): string {
  return formatCentiseconds(seconds);
}

export function formatLongTrackTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  const wholeSeconds = Math.floor(remainder);
  const centiseconds = Math.min(
    99,
    Math.max(0, Math.round((remainder - wholeSeconds) * 100))
  );
  return `${minutes}:${String(wholeSeconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

export function formatFieldDisplay(meters: number): string {
  const digits = Math.max(0, Math.round(meters * 100));
  const padded = String(digits).padStart(3, "0");
  const beforeDecimal = padded.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const afterDecimal = padded.slice(-2);
  return `${beforeDecimal}.${afterDecimal}`;
}

export function formatWomenJumpDisplay(centimeters: number): string {
  return formatFieldDisplay(centimeters / 100);
}

function isBetterMatch(
  targetPoints: number,
  candidatePoints: number,
  candidateDiff: number,
  bestPoints: number,
  bestDiff: number
): boolean {
  if (candidateDiff < bestDiff) {
    return true;
  }
  if (candidateDiff > bestDiff) {
    return false;
  }

  const candidateDistanceAbove =
    candidatePoints >= targetPoints ? candidatePoints - targetPoints : Infinity;
  const currentBestDistanceAbove =
    bestPoints >= targetPoints ? bestPoints - targetPoints : Infinity;

  if (candidateDistanceAbove !== currentBestDistanceAbove) {
    return candidateDistanceAbove < currentBestDistanceAbove;
  }

  return candidatePoints > bestPoints;
}

export function closestPerformanceFromPoints(
  targetPoints: number,
  config: InverseEventConfig
): ClosestPointsResult | null {
  if (!Number.isFinite(targetPoints) || targetPoints <= 0) {
    return null;
  }

  const { formula, bounds } = config;
  const step = config.searchStep ?? 0.01;
  let bestValue = bounds.min;
  let bestPoints = safeFloorPoints(formula(bounds.min));
  let bestDiff = Math.abs(bestPoints - targetPoints);

  for (let value = bounds.min; value <= bounds.max; value += step) {
    const points = safeFloorPoints(formula(value));
    const diff = Math.abs(points - targetPoints);
    if (isBetterMatch(targetPoints, points, diff, bestPoints, bestDiff)) {
      bestDiff = diff;
      bestPoints = points;
      bestValue = value;
    }
  }

  if (bestPoints <= 0) {
    return null;
  }

  return {
    performance: config.formatDisplay(bestValue),
    actualPoints: bestPoints,
  };
}
