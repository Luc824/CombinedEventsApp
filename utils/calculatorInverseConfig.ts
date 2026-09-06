import {
  formatFieldDisplay,
  formatLongTrackTime,
  formatShortTrackTime,
  formatWomenJumpDisplay,
  InverseEventConfig,
} from "./performanceFromPoints";

const TRACK_BOUNDS: Record<string, { min: number; max: number }> = {
  "60m": { min: 6, max: 15 },
  "100m": { min: 9, max: 22 },
  "200m": { min: 18, max: 40 },
  "400m": { min: 40, max: 90 },
  "800m": { min: 110, max: 260 },
  "1000m": { min: 130, max: 360 },
  "1500m": { min: 180, max: 420 },
  "60m Hurdles": { min: 7, max: 18 },
  "110m Hurdles": { min: 12, max: 25 },
  "100m Hurdles": { min: 11, max: 22 },
};

const FIELD_BOUNDS: Record<string, { min: number; max: number }> = {
  "Long Jump": { min: 1, max: 10 },
  "High Jump": { min: 0.5, max: 2.6 },
  "Pole Vault": { min: 1, max: 7 },
  "Shot Put": { min: 1, max: 25 },
  Discus: { min: 1, max: 80 },
  Javelin: { min: 1, max: 100 },
  "Javelin Throw": { min: 1, max: 100 },
};

const WOMEN_JUMP_FORMULA_BOUNDS = { min: 120, max: 900 };

export function getDecathlonInverseConfig(
  eventName: string,
  formula: (value: number) => number
): InverseEventConfig {
  const trackBounds = TRACK_BOUNDS[eventName];
  if (trackBounds) {
    const isLong = eventName === "1500m";
    return {
      formula,
      bounds: trackBounds,
      decreasing: true,
      formatDisplay: isLong ? formatLongTrackTime : formatShortTrackTime,
    };
  }

  const fieldBounds = FIELD_BOUNDS[eventName] ?? { min: 1, max: 50 };
  return {
    formula,
    bounds: fieldBounds,
    decreasing: false,
    formatDisplay: formatFieldDisplay,
  };
}

export function getStandardInverseConfig(
  eventName: string,
  formula: (value: number) => number,
  trackEvents: string[],
  longTrackEvents: string[],
  womenStyleJumps = false
): InverseEventConfig {
  const trackBounds = TRACK_BOUNDS[eventName];
  if (trackEvents.includes(eventName) && trackBounds) {
    const isLong = longTrackEvents.includes(eventName);
    return {
      formula,
      bounds: trackBounds,
      decreasing: true,
      formatDisplay: isLong ? formatLongTrackTime : formatShortTrackTime,
    };
  }

  if (
    womenStyleJumps &&
    (eventName === "High Jump" || eventName === "Long Jump")
  ) {
    return {
      formula,
      bounds: WOMEN_JUMP_FORMULA_BOUNDS,
      decreasing: false,
      formatDisplay: formatWomenJumpDisplay,
      searchStep: 1,
    };
  }

  const fieldBounds = FIELD_BOUNDS[eventName] ?? { min: 1, max: 50 };
  return {
    formula,
    bounds: fieldBounds,
    decreasing: false,
    formatDisplay: formatFieldDisplay,
  };
}
