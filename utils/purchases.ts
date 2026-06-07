import Constants from "expo-constants";
import { Platform } from "react-native";
import Purchases, {
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

const TIER_PRODUCT_IDS = ["donation_tier1", "donation_tier2", "donation_tier3"] as const;

let configured = false;

function getApiKey(): string | undefined {
  return (
    Platform.select({
      ios: Constants.expoConfig?.extra?.revenueCatApiKeyIos as string | undefined,
      android: Constants.expoConfig?.extra?.revenueCatApiKeyAndroid as
        | string
        | undefined,
      default: undefined,
    }) || undefined
  );
}

export function configurePurchases(): boolean {
  if (configured || Platform.OS === "web") {
    return configured;
  }

  const apiKey = getApiKey();
  if (apiKey && !apiKey.startsWith("YOUR_")) {
    Purchases.configure({ apiKey });
    configured = true;
  }

  return configured;
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

export function getTipsOffering(data: PurchasesOfferings): PurchasesOffering | null {
  const all = data.all ?? {};

  if (all.tips) {
    return all.tips;
  }

  const tipsKey = Object.keys(all).find((key) => key.toLowerCase() === "tips");
  if (tipsKey) {
    return all[tipsKey];
  }

  if (data.current) {
    return data.current;
  }

  const firstOffering = Object.values(all)[0];
  return firstOffering ?? null;
}

function packageIdentifiers(pkg: PurchasesPackage): string[] {
  const sp = pkg.storeProduct ?? (pkg as { product?: { identifier?: string } }).product;
  return [
    pkg.identifier,
    pkg.storeProduct?.identifier,
    pkg.storeProduct?.productIdentifier,
    sp?.identifier,
    (sp as { productIdentifier?: string } | undefined)?.productIdentifier,
  ].filter(Boolean) as string[];
}

export function getDonationPackages(
  offering: PurchasesOffering | null
): PurchasesPackage[] {
  if (!offering) {
    return [];
  }

  const packages = offering.availablePackages ?? [];
  if (packages.length === 0) {
    return [];
  }

  const byId = new Map<string, PurchasesPackage>();
  packages.forEach((pkg) => {
    packageIdentifiers(pkg).forEach((id) => {
      if (!byId.has(id)) {
        byId.set(id, pkg);
      }
    });
  });

  const byTier = TIER_PRODUCT_IDS.map((id) => byId.get(id)).filter(
    Boolean
  ) as PurchasesPackage[];

  if (byTier.length === TIER_PRODUCT_IDS.length) {
    return byTier;
  }

  if (byTier.length > 0) {
    return byTier;
  }

  return [...packages]
    .sort((a, b) => {
      const priceA =
        a.storeProduct?.price ??
        (a as { product?: { price?: number } }).product?.price ??
        0;
      const priceB =
        b.storeProduct?.price ??
        (b as { product?: { price?: number } }).product?.price ??
        0;
      return priceA - priceB;
    })
    .slice(0, 3);
}

export async function loadDonationPackages(): Promise<PurchasesPackage[]> {
  if (Platform.OS === "web" || !configurePurchases()) {
    return [];
  }

  const data = await Purchases.getOfferings();
  const offering = getTipsOffering(data);
  return getDonationPackages(offering);
}

configurePurchases();
