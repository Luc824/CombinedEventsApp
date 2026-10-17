import {
  formatDecimalDigits,
  getDecimalMaxDigits,
} from "./performanceEntry";
import { extractDigits } from "./performanceInput";

const LONG_TRACK_MAX_DIGITS = 5;

/**
 * Clamp the SS pair in a long-track digit string to 00–59.
 * Mutates the digit buffer so the next keystroke stays consistent.
 */
function clampLongTrackSecondsDigits(digits: string): string {
  const d = digits.slice(0, LONG_TRACK_MAX_DIGITS);
  if (d.length < 3) {
    return d;
  }

  // M + SS + optional centiseconds
  const minutes = d[0];
  let ss = d.slice(1, 3);
  if (parseInt(ss, 10) > 59) {
    ss = "59";
  }
  return minutes + ss + d.slice(3);
}

/**
 * Long-track digit entry (1500m / 800m / 1000m).
 * Minutes-first, max 5 digits → M:SS.CC (e.g. 4:36.11).
 * Single digit stays bare ("4") so backspace can clear past a colon.
 *
 * 4 → 4
 * 43 → 4:3
 * 430 → 4:30
 * 4305 → 4:30.5
 * 43050 → 4:30.50
 */
function formatLongTrackDigits(digits: string): string {
  const d = clampLongTrackSecondsDigits(digits);
  if (!d) {
    return "";
  }

  if (d.length === 1) {
    return d;
  }

  if (d.length === 2) {
    return `${d[0]}:${d[1]}`;
  }

  if (d.length === 3) {
    return `${d[0]}:${d.slice(1)}`;
  }

  if (d.length === 4) {
    return `${d[0]}:${d.slice(1, 3)}.${d[3]}`;
  }

  // 5 digits: M:SS.CC
  return `${d[0]}:${d.slice(1, 3)}.${d.slice(3)}`;
}

export function formatPerformanceText(
  text: string,
  eventName: string,
  _trackEvents: string[],
  longTrackEvents: string[]
): string {
  let formattedText = text.replace(",", ".");
  const isLong = longTrackEvents.includes(eventName);
  const maxDigits = isLong ? LONG_TRACK_MAX_DIGITS : getDecimalMaxDigits(eventName);
  const maxLength = getPerformanceMaxLength(eventName, longTrackEvents);

  formattedText = extractDigits(formattedText, maxDigits);
  if (formattedText.length > 0) {
    if (isLong) {
      formattedText = formatLongTrackDigits(formattedText);
    } else {
      formattedText = formatDecimalDigits(formattedText, eventName);
    }
  }

  if (formattedText.length > maxLength) {
    formattedText = formattedText.slice(0, maxLength);
  }

  return formattedText;
}

export function getPerformanceMaxLength(
  eventName: string,
  longTrackEvents: string[]
): number {
  if (longTrackEvents.includes(eventName)) {
    // "4:36.11" with five digits.
    return 7;
  }
  // D.DD (4) or DD.DD (5)
  return getDecimalMaxDigits(eventName) === 3 ? 4 : 5;
}
