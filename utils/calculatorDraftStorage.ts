import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EventType } from "./scoreStorage";

export type CalculatorDraft = {
  results: string[];
  points: number[];
  pointsInputs: string[];
};

function draftKey(eventType: EventType): string {
  return `@calculator_draft/${eventType}`;
}

function isValidDraft(
  draft: unknown,
  eventCount: number
): draft is CalculatorDraft {
  if (!draft || typeof draft !== "object") {
    return false;
  }
  const value = draft as Partial<CalculatorDraft>;
  return (
    Array.isArray(value.results) &&
    Array.isArray(value.points) &&
    Array.isArray(value.pointsInputs) &&
    value.results.length === eventCount &&
    value.points.length === eventCount &&
    value.pointsInputs.length === eventCount &&
    value.results.every((item) => typeof item === "string") &&
    value.points.every((item) => typeof item === "number" && Number.isFinite(item)) &&
    value.pointsInputs.every((item) => typeof item === "string")
  );
}

export async function loadCalculatorDraft(
  eventType: EventType,
  eventCount: number
): Promise<CalculatorDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(draftKey(eventType));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return isValidDraft(parsed, eventCount) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveCalculatorDraft(
  eventType: EventType,
  draft: CalculatorDraft
): Promise<void> {
  try {
    await AsyncStorage.setItem(draftKey(eventType), JSON.stringify(draft));
  } catch {
    // Ignore storage failures — calculator still works in memory.
  }
}

export async function clearCalculatorDraft(eventType: EventType): Promise<void> {
  try {
    await AsyncStorage.removeItem(draftKey(eventType));
  } catch {
    // Ignore.
  }
}
