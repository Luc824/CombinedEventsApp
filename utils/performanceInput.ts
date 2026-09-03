export function extractDigits(text: string, maxDigits: number): string {
  return text.replace(/[^0-9]/g, "").slice(0, maxDigits);
}

export function getMaxDigitsForEvent(
  eventName: string,
  longTrackEventNames: string[]
): number {
  return longTrackEventNames.includes(eventName) ? 6 : 4;
}
