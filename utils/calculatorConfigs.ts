import { worldAthleticsScores } from "../data/worldAthleticsScores";
import {
  getDecathlonInverseConfig,
  getStandardInverseConfig,
} from "./calculatorInverseConfig";
import { InverseEventConfig } from "./performanceFromPoints";
import { safeFloorPoints, shouldCalculatePoints } from "./pointsUtils";
import { EventType } from "./scoreStorage";
import { convertTimeToSeconds } from "./timeUtils";

export type CalculatorEventDef = {
  name: string;
  formula: (value: number) => number;
};

export type CalculatorConfig = {
  events: CalculatorEventDef[];
  trackEvents: string[];
  longTrackEvents: string[];
  placeholders: string[];
  womenStyleJumps: boolean;
  useDecathlonInverse: boolean;
};

const DECATHLON_CONFIG: CalculatorConfig = {
  events: [
    { name: "100m", formula: (time) => 25.4347 * Math.pow(18 - time, 1.81) },
    {
      name: "Long Jump",
      formula: (distance) => 0.14354 * Math.pow(distance * 100 - 220, 1.4),
    },
    {
      name: "Shot Put",
      formula: (distance) => 51.39 * Math.pow(distance - 1.5, 1.05),
    },
    {
      name: "High Jump",
      formula: (height) => 0.8465 * Math.pow(height * 100 - 75, 1.42),
    },
    { name: "400m", formula: (time) => 1.53775 * Math.pow(82 - time, 1.81) },
    {
      name: "110m Hurdles",
      formula: (time) => 5.74352 * Math.pow(28.5 - time, 1.92),
    },
    {
      name: "Discus",
      formula: (distance) => 12.91 * Math.pow(distance - 4, 1.1),
    },
    {
      name: "Pole Vault",
      formula: (height) => 0.2797 * Math.pow(height * 100 - 100, 1.35),
    },
    {
      name: "Javelin",
      formula: (distance) => 10.14 * Math.pow(distance - 7, 1.08),
    },
    { name: "1500m", formula: (time) => 0.03768 * Math.pow(480 - time, 1.85) },
  ],
  trackEvents: ["100m", "400m", "110m Hurdles", "1500m"],
  longTrackEvents: ["1500m"],
  placeholders: [
    "10.55",
    "7.80",
    "16.00",
    "2.05",
    "48.42",
    "13.75",
    "50.54",
    "5.45",
    "71.90",
    "4:36.11",
  ],
  womenStyleJumps: false,
  useDecathlonInverse: true,
};

const MEN_HEPTATHLON_CONFIG: CalculatorConfig = {
  events: [
    { name: "60m", formula: (time) => 58.015 * Math.pow(11.5 - time, 1.81) },
    {
      name: "Long Jump",
      formula: (distance) => 0.14354 * Math.pow(distance * 100 - 220, 1.4),
    },
    {
      name: "Shot Put",
      formula: (distance) => 51.39 * Math.pow(distance - 1.5, 1.05),
    },
    {
      name: "High Jump",
      formula: (height) => 0.8465 * Math.pow(height * 100 - 75, 1.42),
    },
    {
      name: "60m Hurdles",
      formula: (time) => 20.5173 * Math.pow(15.5 - time, 1.92),
    },
    {
      name: "Pole Vault",
      formula: (height) => 0.2797 * Math.pow(height * 100 - 100, 1.35),
    },
    { name: "1000m", formula: (time) => 0.08713 * Math.pow(305.5 - time, 1.85) },
  ],
  trackEvents: ["60m", "60m Hurdles", "1000m"],
  longTrackEvents: ["1000m"],
  placeholders: ["6.69", "8.15", "14.87", "2.02", "7.52", "5.30", "2:41.04"],
  womenStyleJumps: false,
  useDecathlonInverse: false,
};

const WOMEN_HEPTATHLON_CONFIG: CalculatorConfig = {
  events: [
    {
      name: "100m Hurdles",
      formula: (time) => 9.23076 * Math.pow(26.7 - time, 1.835),
    },
    {
      name: "High Jump",
      formula: (height) => 1.84523 * Math.pow(height - 75, 1.348),
    },
    {
      name: "Shot Put",
      formula: (distance) => 56.0211 * Math.pow(distance - 1.5, 1.05),
    },
    { name: "200m", formula: (time) => 4.99087 * Math.pow(42.5 - time, 1.81) },
    {
      name: "Long Jump",
      formula: (distance) => 0.188807 * Math.pow(distance - 210, 1.41),
    },
    {
      name: "Javelin Throw",
      formula: (distance) => 15.9803 * Math.pow(distance - 3.8, 1.04),
    },
    { name: "800m", formula: (time) => 0.11193 * Math.pow(254 - time, 1.88) },
  ],
  trackEvents: ["100m Hurdles", "200m", "800m"],
  longTrackEvents: ["800m"],
  placeholders: [
    "12.69",
    "1.86",
    "15.80",
    "22.56",
    "7.27",
    "45.66",
    "2:08.51",
  ],
  womenStyleJumps: true,
  useDecathlonInverse: false,
};

const WOMEN_PENTATHLON_CONFIG: CalculatorConfig = {
  events: [
    {
      name: "60m Hurdles",
      formula: (time) => 20.0479 * Math.pow(17.0 - time, 1.835),
    },
    {
      name: "High Jump",
      formula: (height) => 1.84523 * Math.pow(height - 75, 1.348),
    },
    {
      name: "Shot Put",
      formula: (distance) => 56.0211 * Math.pow(distance - 1.5, 1.05),
    },
    {
      name: "Long Jump",
      formula: (distance) => 0.188807 * Math.pow(distance - 210, 1.41),
    },
    { name: "800m", formula: (time) => 0.11193 * Math.pow(254 - time, 1.88) },
  ],
  trackEvents: ["60m Hurdles", "800m"],
  longTrackEvents: ["800m"],
  placeholders: ["8.23", "1.92", "15.54", "6.59", "2:13.60"],
  womenStyleJumps: true,
  useDecathlonInverse: false,
};

export const CALCULATOR_CONFIGS: Record<EventType, CalculatorConfig> = {
  decathlon: DECATHLON_CONFIG,
  menHeptathlon: MEN_HEPTATHLON_CONFIG,
  womenHeptathlon: WOMEN_HEPTATHLON_CONFIG,
  womenPentathlon: WOMEN_PENTATHLON_CONFIG,
};

export function calculateEventPoints(
  value: string,
  index: number,
  config: CalculatorConfig
): number {
  if (!value) {
    return 0;
  }

  const event = config.events[index];
  const isTrack = config.trackEvents.includes(event.name);
  const isLongTrack = config.longTrackEvents.includes(event.name);
  if (!shouldCalculatePoints(value, isTrack, isLongTrack)) {
    return 0;
  }

  try {
    let inputValue = parseFloat(value);
    if (isLongTrack) {
      inputValue = convertTimeToSeconds(value);
    } else if (
      config.womenStyleJumps &&
      (event.name === "High Jump" || event.name === "Long Jump")
    ) {
      inputValue = parseFloat(value) * 100;
    }
    return safeFloorPoints(event.formula(inputValue));
  } catch {
    return 0;
  }
}

export function getEventInverseConfig(
  index: number,
  config: CalculatorConfig
): InverseEventConfig {
  const event = config.events[index];
  if (config.useDecathlonInverse) {
    return getDecathlonInverseConfig(event.name, event.formula);
  }
  return getStandardInverseConfig(
    event.name,
    event.formula,
    config.trackEvents,
    config.longTrackEvents,
    config.womenStyleJumps
  );
}

export function getResultScoreForTotal(
  eventType: EventType,
  totalPoints: number
): string {
  const table = worldAthleticsScores[eventType];
  const scores = Object.keys(table).map(Number);
  const closestLowerScore = scores
    .filter((score) => score <= totalPoints)
    .sort((a, b) => b - a)[0];

  return closestLowerScore
    ? table[closestLowerScore as keyof typeof table]
    : "0";
}

export function pointsInputsFromSaved(points: number[]): string[] {
  return points.map((point) => (point > 0 ? String(point) : ""));
}
