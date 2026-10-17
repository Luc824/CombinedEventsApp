/**
 * Event-aware digit entry: how many whole digits before the decimal,
 * based on plausible combined-events performances.
 */

type WholeDigitMode =
  | "always_one" // LJ, HJ, PV, 60m, 60H
  | "always_two" // 400m, 200m, 100H, discus, javelin
  | "sprint_flexible" // 100m / 110H: 1–2 → 10–29; else 8.xx / 9.xx
  | "shot_flexible"; // SP: 1–2 → 10–29; else 9.xx etc.

type EventEntryProfile = {
  mode: WholeDigitMode;
  maxDigits: number;
};

const PROFILES: Record<string, EventEntryProfile> = {
  // Sprints / hurdles
  "100m": { mode: "sprint_flexible", maxDigits: 4 },
  "110m Hurdles": { mode: "sprint_flexible", maxDigits: 4 },
  "100m Hurdles": { mode: "always_two", maxDigits: 4 },
  "200m": { mode: "always_two", maxDigits: 4 },
  "400m": { mode: "always_two", maxDigits: 4 },
  "60m": { mode: "always_one", maxDigits: 3 },
  "60m Hurdles": { mode: "always_one", maxDigits: 3 },

  // Jumps — never need DD.DD (no 10m HJ / 10m+ LJ in practice for entry UX)
  "Long Jump": { mode: "always_one", maxDigits: 3 },
  "High Jump": { mode: "always_one", maxDigits: 3 },
  "Pole Vault": { mode: "always_one", maxDigits: 3 },

  // Throws — discus/javelin stay two-whole (50–90m); short beginner marks are rare.
  "Shot Put": { mode: "shot_flexible", maxDigits: 4 },
  Discus: { mode: "always_two", maxDigits: 4 },
  Javelin: { mode: "always_two", maxDigits: 4 },
};

const DEFAULT_PROFILE: EventEntryProfile = {
  mode: "always_two",
  maxDigits: 4,
};

export function getEventEntryProfile(eventName: string): EventEntryProfile {
  return PROFILES[eventName] ?? DEFAULT_PROFILE;
}

/** Whole digits before decimal for the current digit string. */
export function resolveWholeDigits(
  digits: string,
  eventName: string
): number {
  if (!digits) {
    return 1;
  }

  const { mode } = getEventEntryProfile(eventName);
  const first = digits[0];

  switch (mode) {
    case "always_one":
      return 1;
    case "always_two":
      return 2;
    case "sprint_flexible":
    case "shot_flexible":
      // 1x / 2x → two whole digits (10.xx–29.xx); otherwise one (9.92, 8.5, …).
      return first === "1" || first === "2" ? 2 : 1;
    default:
      return 2;
  }
}

export function getDecimalMaxDigits(eventName: string): number {
  return getEventEntryProfile(eventName).maxDigits;
}

/**
 * Progressive decimal display: integer until the whole part is filled,
 * then append up to two fractional digits.
 *
 * 100m: 1 → 10 → 10.8 → 10.80 | 9 → 9.9 → 9.92
 * SP:   1 → 15 → 15.0 → 15.00 | 9 → 9.5 → 9.50
 * LJ:   7 → 7.5 → 7.50
 */
export function formatDecimalDigits(
  digits: string,
  eventName: string
): string {
  const maxDigits = getDecimalMaxDigits(eventName);
  const d = digits.slice(0, maxDigits);
  if (!d) {
    return "";
  }

  const whole = resolveWholeDigits(d, eventName);
  if (d.length <= whole) {
    return d;
  }

  return `${d.slice(0, whole)}.${d.slice(whole)}`;
}

/** True when the displayed value is complete enough to score. */
export function isDecimalPerformanceComplete(
  value: string,
  eventName: string
): boolean {
  if (!value) {
    return false;
  }

  if (/^\d+\.\d{1,2}$/.test(value)) {
    return true;
  }

  // Bare integer: score once the whole part is filled (7, 10, 15, …).
  if (/^\d+$/.test(value)) {
    return value.length >= resolveWholeDigits(value, eventName);
  }

  return false;
}
