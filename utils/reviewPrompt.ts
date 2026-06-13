import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import { openAppReview } from "./openUrl";

const STORAGE_KEYS = {
  launchCount: "@review_launch_count",
  saveCount: "@review_save_count",
  lastPromptAt: "@review_last_prompt_at",
  dismissed: "@review_dismissed",
} as const;

const MIN_LAUNCHES = 4;
const MIN_SAVES = 1;
const COOLDOWN_DAYS = 120;

async function getNumber(key: string): Promise<number> {
  const raw = await AsyncStorage.getItem(key);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

async function canShowPrompt(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const dismissed = await AsyncStorage.getItem(STORAGE_KEYS.dismissed);
  if (dismissed === "true") {
    return false;
  }

  const lastPromptRaw = await AsyncStorage.getItem(STORAGE_KEYS.lastPromptAt);
  if (lastPromptRaw) {
    const lastPrompt = parseInt(lastPromptRaw, 10);
    const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    if (Number.isFinite(lastPrompt) && Date.now() - lastPrompt < cooldownMs) {
      return false;
    }
  }

  const launches = await getNumber(STORAGE_KEYS.launchCount);
  const saves = await getNumber(STORAGE_KEYS.saveCount);
  return launches >= MIN_LAUNCHES || saves >= MIN_SAVES;
}

async function markPromptShown(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.lastPromptAt, String(Date.now()));
}

async function requestStoreReview(): Promise<void> {
  try {
    const StoreReview = await import("expo-store-review");
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return;
    }
  } catch {
    // Native module missing or review unavailable — open App Store instead.
  }
  openAppReview();
}

export async function trackAppLaunch(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  const count = await getNumber(STORAGE_KEYS.launchCount);
  await AsyncStorage.setItem(STORAGE_KEYS.launchCount, String(count + 1));

  if (await canShowPrompt()) {
    showReviewPrompt();
  }
}

export async function trackScoreSaved(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  const count = await getNumber(STORAGE_KEYS.saveCount);
  await AsyncStorage.setItem(STORAGE_KEYS.saveCount, String(count + 1));

  if (await canShowPrompt()) {
    showReviewPrompt();
  }
}

export function showReviewPrompt(): void {
  if (Platform.OS === "web") {
    return;
  }

  void markPromptShown();

  Alert.alert(
    "Enjoying CE Points?",
    "If the app helps with your training, a quick App Store review would mean a lot.",
    [
      { text: "Not Now", style: "cancel" },
      {
        text: "Rate App",
        onPress: () => {
          void requestStoreReview();
        },
      },
    ]
  );
}

export async function resetReviewPromptState(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
