'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';
import { getProductImage, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    inspiredBy?: string;
    price: number;
    volume: string;
    images: string[];
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display text-primary mb-2">
          {product.name}
        </h3>
        {product.inspiredBy && (
          <p className="text-gray-600 text-sm mb-2">
            Inspired by {product.inspiredBy}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-primary">
            ${product.price}
          </span>
          <span className="text-sm text-gray-600">
            {product.volume}ml
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 