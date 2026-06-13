import { Linking, Platform } from "react-native";

export const APP_STORE_ID = "6752707829";

export function openExternalUrl(url: string): void {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.assign(url);
    return;
  }
  Linking.openURL(url);
}

export function openAppStore(): void {
  if (Platform.OS === "web" && typeof navigator !== "undefined") {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const url = isIOS
      ? `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}`
      : `https://apps.apple.com/app/id${APP_STORE_ID}`;
    window.location.assign(url);
    return;
  }
  Linking.openURL(`https://apps.apple.com/app/id${APP_STORE_ID}`);
}

export function openAppReview(): void {
  if (Platform.OS === "ios") {
    Linking.openURL(
      `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`
    );
    return;
  }
  if (Platform.OS === "android") {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.luc.decathloncalculator"
    );
  }
}
