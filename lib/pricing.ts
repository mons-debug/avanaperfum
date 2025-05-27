// lib/pricing.ts
export interface BulkPricingTier {
  quantity: number;
  totalPrice: number;
  savings: number;
  pricePerItem: number;
}

export interface PricingResult {
  originalTotal: number;
  bulkTotal: number;
  savings: number;
  tier: BulkPricingTier;
  isPromoActive: boolean;
}

// Bulk pricing configuration
export const BULK_PRICING_TIERS = {
  1: { totalPrice: 99, pricePerItem: 99 },
  2: { totalPrice: 149, pricePerItem: 74.5 },
  3: { totalPrice: 199, pricePerItem: 66.33 },
  // For 4+ items: 199 + 66 for each additional item
} as const;

/**
 * Calculate bulk pricing for a given quantity
 * @param quantity Number of items
 * @returns Pricing information including savings
 */
export function calculateBulkPricing(quantity: number): PricingResult {
  const originalPrice = 99; // Standard price per item
  const originalTotal = quantity * originalPrice;
  
  let bulkTotal: number;
  let pricePerItem: number;
  
  if (quantity === 1) {
    bulkTotal = BULK_PRICING_TIERS[1].totalPrice;
    pricePerItem = BULK_PRICING_TIERS[1].pricePerItem;
  } else if (quantity === 2) {
    bulkTotal = BULK_PRICING_TIERS[2].totalPrice;
    pricePerItem = BULK_PRICING_TIERS[2].pricePerItem;
  } else if (quantity === 3) {
    bulkTotal = BULK_PRICING_TIERS[3].totalPrice;
    pricePerItem = BULK_PRICING_TIERS[3].pricePerItem;
  } else {
    // 4+ items: 199 DH for first 3 + 66 DH for each additional
    const additionalItems = quantity - 3;
    bulkTotal = 199 + (additionalItems * 66);
    pricePerItem = bulkTotal / quantity;
  }
  
  const savings = originalTotal - bulkTotal;
  const isPromoActive = savings > 0;
  
  const tier: BulkPricingTier = {
    quantity,
    totalPrice: bulkTotal,
    savings,
    pricePerItem
  };
  
  return {
    originalTotal,
    bulkTotal,
    savings,
    tier,
    isPromoActive
  };
}

/**
 * Get pricing display text for a given quantity
 * @param quantity Number of items
 * @returns Display text for the pricing
 */
export function getPricingDisplayText(quantity: number): string {
  if (quantity === 1) {
    return "99 DH";
  } else if (quantity === 2) {
    return "149 DH (Économisez 49 DH!)";
  } else if (quantity === 3) {
    return "199 DH (Économisez 98 DH!)";
  } else {
    const pricing = calculateBulkPricing(quantity);
    return `${pricing.bulkTotal} DH (Économisez ${pricing.savings} DH!)`;
  }
}

/**
 * Get the promotional message for bulk pricing
 * @param quantity Current quantity in cart
 * @returns Promotional message or null if no promo
 */
export function getPromotionalMessage(quantity: number): string | null {
  if (quantity === 0) {
    return "🎉 Promo Spéciale: 2 parfums = 149 DH au lieu de 198 DH!";
  } else if (quantity === 1) {
    return "🔥 Ajoutez 1 parfum de plus et payez seulement 149 DH au lieu de 198 DH!";
  } else if (quantity === 2) {
    return "💎 Ajoutez 1 parfum de plus et payez seulement 199 DH au lieu de 297 DH!";
  } else if (quantity >= 3) {
    return "✨ Chaque parfum supplémentaire à seulement 66 DH!";
  }
  return null;
}

/**
 * Check if bulk pricing is better than individual pricing
 * @param quantity Number of items
 * @returns True if bulk pricing offers savings
 */
export function hasBulkDiscount(quantity: number): boolean {
  const pricing = calculateBulkPricing(quantity);
  return pricing.isPromoActive;
} 