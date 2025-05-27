// Test file for bulk pricing
function calculateBulkPricing(quantity) {
  const originalPrice = 99; // Standard price per item
  const originalTotal = quantity * originalPrice;
  
  let bulkTotal;
  let pricePerItem;
  
  if (quantity === 1) {
    bulkTotal = 99;
    pricePerItem = 99;
  } else if (quantity === 2) {
    bulkTotal = 149;
    pricePerItem = 74.5;
  } else if (quantity === 3) {
    bulkTotal = 199;
    pricePerItem = 66.33;
  } else {
    // 4+ items: 199 DH for first 3 + 66 DH for each additional
    const additionalItems = quantity - 3;
    bulkTotal = 199 + (additionalItems * 66);
    pricePerItem = bulkTotal / quantity;
  }
  
  const savings = originalTotal - bulkTotal;
  const isPromoActive = savings > 0;
  
  return {
    originalTotal,
    bulkTotal,
    savings,
    isPromoActive,
    pricePerItem
  };
}

console.log('Testing AVANA Parfum Bulk Pricing:');
console.log('================================');
console.log('1 item:', calculateBulkPricing(1));
console.log('2 items:', calculateBulkPricing(2));
console.log('3 items:', calculateBulkPricing(3));
console.log('4 items:', calculateBulkPricing(4));
console.log('5 items:', calculateBulkPricing(5));
console.log('6 items:', calculateBulkPricing(6)); 