// Test script for WhatsApp functionality
const { 
  generateSingleProductWhatsAppURL, 
  generateBulkOrderWhatsAppURL,
  generateDetailedProductWhatsAppURL 
} = require('./lib/whatsapp.ts');

// Test product data
const testProduct = {
  _id: '1',
  name: 'Bright Crystal Versace',
  price: 299,
  volume: '100ml',
  inspiredBy: 'Bright Crystal de Versace'
};

const testProducts = [
  {
    _id: '1',
    name: 'Bright Crystal Versace',
    price: 299
  },
  {
    _id: '2',
    name: 'Black Opium YSL',
    price: 350
  }
];

console.log('=== WhatsApp URL Tests ===\n');

console.log('1. Single Product URL:');
console.log(generateSingleProductWhatsAppURL(testProduct));
console.log();

console.log('2. Detailed Product URL:');
console.log(generateDetailedProductWhatsAppURL(testProduct));
console.log();

console.log('3. Bulk Order URL:');
console.log(generateBulkOrderWhatsAppURL(testProducts));
console.log();

console.log('4. Empty Bulk Order URL:');
console.log(generateBulkOrderWhatsAppURL([]));

console.log('\n=== Test completed ==='); 