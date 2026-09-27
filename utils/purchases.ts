import Constants from "expo-constants";
import { Platform } from "react-native";
import Purchases, {
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreProduct,
} from "react-native-purchases";

export const TIER_PRODUCT_IDS = [
  "donation_tier1",
  "donation_tier2",
  "donation_tier3",
] as const;

let configured = false;

function getApiKey(): string | undefined {
  return (
    Platform.select({
      ios: Constants.expoConfig?.extra?.revenueCatApiKeyIos as string | undefined,
      android: Constants.expoConfig?.extra?.revenueCatApiKeyAndroid as
        | string
        | undefined,
    }) || undefined
  );
}

export function configurePurchases(): boolean {
  if (configured || Platform.OS === "web") {
    return configured;
  }

  const apiKey = getApiKey();
  if (apiKey) {
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

function formatStorePrice(product: {
  priceString?: string | null;
  price?: number | null;
  currencyCode?: string | null;
}): string {
  const currencyCode =
    typeof product.currencyCode === "string" && product.currencyCode.trim()
      ? product.currencyCode.trim()
      : "";
  const price =
    typeof product.price === "number" && Number.isFinite(product.price)
      ? product.price
      : null;

  // Prefer numeric price + ISO currency so the label matches the storefront
  // currency used by the system purchase sheet (priceString can lag / be wrong).
  if (price != null && currencyCode) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
      }).format(price);
    } catch {
      // Invalid currency code — fall through to priceString.
    }
  }

  if (typeof product.priceString === "string" && product.priceString.trim()) {
    return product.priceString.trim();
  }

  return "";
}

/** Localized price for UI — never uses hardcoded USD fallbacks. */
export function getLocalizedPackagePrice(pkg: PurchasesPackage): string {
  const sp =
    pkg.storeProduct ??
    (pkg as { product?: PurchasesStoreProduct }).product ??
    null;
  if (!sp) {
    return "";
  }
  return formatStorePrice(sp);
}

export type DonationCatalog = {
  packages: PurchasesPackage[];
  /** Product id → localized price from a fresh StoreKit / Play Billing fetch */
  priceByProductId: Record<string, string>;
};

export function getPackageProductId(pkg: PurchasesPackage): string {
  return (
    pkg.storeProduct?.identifier ??
    pkg.storeProduct?.productIdentifier ??
    (pkg as { product?: { identifier?: string } }).product?.identifier ??
    pkg.identifier
  );
}

export async function loadDonationCatalog(): Promise<DonationCatalog> {
  if (Platform.OS === "web" || !configurePurchases()) {
    return { packages: [], priceByProductId: {} };
  }

  const data = await Purchases.getOfferings();
  const packages = getDonationPackages(getTipsOffering(data));
  const priceByProductId: Record<string, string> = {};

  // Offerings can expose server-side / default prices. Fetch store products
  // directly so button labels match the system purchase sheet currency.
  try {
    const productIds = [
      ...new Set([
        ...TIER_PRODUCT_IDS,
        ...packages.map(getPackageProductId).filter(Boolean),
      ]),
    ];
    const products = await Purchases.getProducts(productIds);
    for (const product of products) {
      const label = formatStorePrice(product);
      if (label) {
        priceByProductId[product.identifier] = label;
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("Failed to refresh store product prices", error);
    }
  }

  // Fall back to whatever the package already carries (still no hardcoded USD).
  for (const pkg of packages) {
    const id = getPackageProductId(pkg);
    if (!priceByProductId[id]) {
      const label = getLocalizedPackagePrice(pkg);
      if (label) {
        priceByProductId[id] = label;
      }
    }
  }

  return { packages, priceByProductId };
}

/** @deprecated Prefer loadDonationCatalog for correct localized prices */
export async function loadDonationPackages(): Promise<PurchasesPackage[]> {
  const catalog = await loadDonationCatalog();
  return catalog.packages;
}

configurePurchases();
