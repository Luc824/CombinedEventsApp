import { extractDigits, getMaxDigitsForEvent } from "./performanceInput";

export function formatPerformanceText(
  text: string,
  eventName: string,
  trackEvents: string[],
  longTrackEvents: string[]
): string {
  let formattedText = text.replace(",", ".");
  const maxDigits = getMaxDigitsForEvent(eventName, longTrackEvents);
  const maxLength = longTrackEvents.includes(eventName) ? 7 : 5;

  if (trackEvents.includes(eventName)) {
    formattedText = extractDigits(formattedText, maxDigits);
    if (formattedText.length > 0) {
      if (longTrackEvents.includes(eventName)) {
        const minutes = formattedText.slice(0, -4);
        const seconds = formattedText.slice(-4, -2);
        const milliseconds = formattedText.slice(-2);
        formattedText = `${minutes}:${seconds}.${milliseconds}`;
      } else {
        const seconds = formattedText.slice(0, -2);
        const milliseconds = formattedText.slice(-2);
        formattedText = `${seconds}.${milliseconds}`;
      }
    }
  } else {
    formattedText = extractDigits(formattedText, maxDigits);
    if (formattedText.length > 0) {
      const beforeDecimal = formattedText.slice(0, -2);
      const afterDecimal = formattedText.slice(-2);
      formattedText = `${beforeDecimal}.${afterDecimal}`;
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
  return longTrackEvents.includes(eventName) ? 7 : 5;
}
