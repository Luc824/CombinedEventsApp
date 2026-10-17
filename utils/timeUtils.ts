export const convertTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  timeStr = timeStr.replace(",", ".");
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]);
    // Allow mid-entry "4:" (minutes only) from long-track digit formatting.
    const secondsAndMs =
      parts[1] === "" || parts[1] === "." ? 0 : parseFloat(parts[1]);
    if (isNaN(minutes) || isNaN(secondsAndMs)) return 0;
    return minutes * 60 + secondsAndMs;
  }
  if (parts.length === 1 && !isNaN(parseFloat(parts[0]))) {
    return parseFloat(parts[0]);
  }
  return 0;
};

/** Whole-seconds portion of M:SS[.cs] / MM:SS[.cs], or null if not that shape. */
export function parseLongTrackSecondsPart(value: string): number | null {
  const match = value.match(/^\d+:(\d{1,2})(\.\d{1,2})?$/);
  if (!match) {
    return null;
  }
  return parseInt(match[1], 10);
}
