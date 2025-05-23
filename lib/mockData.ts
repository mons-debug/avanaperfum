// Mock data to use when MongoDB is not available

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  volume: string;
  gender: string;
  images: string[];
  inspiredBy?: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
}

export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Royal Oud',
    slug: 'royal-oud',
    description: 'A luxurious woody fragrance with notes of oud, sandalwood and cedar',
    price: 249.99,
    originalPrice: 299.99,
    volume: '100ml',
    gender: 'Homme',
    images: ['/images/product-placeholder.svg'],
    inspiredBy: 'Creed Royal Oud',
    category: 'Homme',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Azure Dream',
    slug: 'azure-dream',
    description: 'A refreshing aquatic fragrance with notes of bergamot, sea salt and ambergris',
    price: 199.99,
    originalPrice: 249.99,
    volume: '100ml',
    gender: 'Homme',
    images: ['/images/product-placeholder.svg'],
    inspiredBy: 'Bleu de Chanel',
    category: 'Homme',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Rose Elixir',
    slug: 'rose-elixir',
    description: 'A captivating floral fragrance with notes of Bulgarian rose, jasmine and patchouli',
    price: 229.99,
    originalPrice: 279.99,
    volume: '100ml',
    gender: 'Femme',
    images: ['/images/product-placeholder.svg'],
    inspiredBy: 'Miss Dior',
    category: 'Femme',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Amber Mystique',
    slug: 'amber-mystique',
    description: 'A seductive oriental fragrance with notes of amber, vanilla and musk',
    price: 219.99,
    originalPrice: 269.99,
    volume: '100ml',
    gender: 'Femme',
    images: ['/images/product-placeholder.svg'],
    inspiredBy: 'YSL Black Opium',
    category: 'Femme',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Citrus Paradisi',
    slug: 'citrus-paradisi',
    description: 'A refreshing unisex fragrance with notes of grapefruit, bergamot and vetiver',
    price: 189.99,
    originalPrice: 229.99,
    volume: '100ml',
    gender: 'Mixte',
    images: ['/images/product-placeholder.svg'],
    inspiredBy: 'Tom Ford Neroli Portofino',
    category: 'Mixte',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockCategories: Category[] = [
  {
    _id: '1',
    name: 'Homme',
    slug: 'homme',
    description: 'Fragrances for men',
    image: '/images/product-placeholder.svg',
    featured: true
  },
  {
    _id: '2',
    name: 'Femme',
    slug: 'femme',
    description: 'Fragrances for women',
    image: '/images/product-placeholder.svg',
    featured: true
  },
  {
    _id: '3',
    name: 'Mixte',
    slug: 'mixte',
    description: 'Unisex fragrances',
    image: '/images/product-placeholder.svg',
    featured: true
  }
]; 