/**
 * Web stub — keeps react-native-purchases out of the web bundle.
 * Tips on web use PayPal links in the More screen.
 */

export const TIER_PRODUCT_IDS = [
  "donation_tier1",
  "donation_tier2",
  "donation_tier3",
] as const;

/** Minimal shape so More screen types stay shared across platforms. */
export type DonationPackage = {
  identifier: string;
  storeProduct?: {
    identifier?: string;
    productIdentifier?: string;
    title?: string;
    price?: number;
    priceString?: string;
    currencyCode?: string;
  };
};

export type DonationCatalog = {
  packages: DonationPackage[];
  priceByProductId: Record<string, string>;
};

export function configurePurchases(): boolean {
  return false;
}

export function isPurchasesConfigured(): boolean {
  return false;
}

export function getLocalizedPackagePrice(_pkg: DonationPackage): string {
  return "";
}

export function getPackageProductId(pkg: DonationPackage): string {
  return (
    pkg.storeProduct?.identifier ??
    pkg.storeProduct?.productIdentifier ??
    pkg.identifier
  );
}

export async function loadDonationCatalog(): Promise<DonationCatalog> {
  return { packages: [], priceByProductId: {} };
}

export async function loadDonationPackages(): Promise<DonationPackage[]> {
  return [];
}

export async function purchaseDonationPackage(
  _pkg: DonationPackage
): Promise<void> {
  throw Object.assign(new Error("In-app purchases are not available on web"), {
    userCancelled: false,
  });
}
