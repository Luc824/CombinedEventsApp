/** Clamp formula output to a valid non-negative integer points value. */
export function safeFloorPoints(raw: number): number {
  if (!Number.isFinite(raw) || raw < 0) {
    return 0;
  }
  return Math.floor(raw);
}

/** Skip point calculation while the user is still typing a partial value. */
export function shouldCalculatePoints(
  value: string,
  isTrackEvent: boolean,
  isLongTrack = false
): boolean {
  if (!value) {
    return false;
  }
  if (isTrackEvent) {
    if (isLongTrack) {
      return /^\d+:\d{2}\.\d{2}$/.test(value);
    }
    return /^\d+\.\d{2}$/.test(value);
  }
  return /^\d+\.\d{2}$/.test(value);
}

export function validateScoreForSave(
  results: string[],
  points: number[],
  totalPoints: number
): string | null {
  if (!Number.isFinite(totalPoints) || totalPoints <= 0) {
    return "Cannot save a score with 0 or invalid points.";
  }
  if (points.some((p) => !Number.isFinite(p) || p < 0)) {
    return "Some event points are invalid.";
  }
  if (!results.some((r) => r.trim() !== "")) {
    return "Enter at least one event result before saving.";
  }
  return null;
}
