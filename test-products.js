// Test products with and without slug property
const testProducts = [
  {
    _id: '1234567890abcdef12345678',
    name: 'Product with slug',
    slug: 'product-with-slug',
    price: 1999,
    originalPrice: 2999,
    images: ['/images/products/product-with-slug.jpg'],
    description: 'This is a product with a valid slug',
    inspiredBy: 'Original Product',
  },
  {
    _id: '2234567890abcdef12345678',
    name: 'Product without slug',
    price: 1499,
    originalPrice: 2499,
    images: [],
    description: 'This is a product without a slug property',
    inspiredBy: 'Another Original',
  },
  {
    _id: '3234567890abcdef12345678',
    name: 'Product with undefined slug',
    slug: undefined,
    price: 1299,
    images: ['/images/products/undefined.jpg'],
    description: 'This is a product with an undefined slug value',
  }
];

// Usage examples:
// import { testProducts } from './test-products';
// 
// function renderProducts() {
//   return testProducts.map(product => (
//     <ProductCard key={product._id} product={product} />
//   ));
// }

export { testProducts }; 