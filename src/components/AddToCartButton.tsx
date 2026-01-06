'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  variant?: 'icon' | 'full';
}

export default function AddToCartButton({ product, variant = 'icon' }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  if (variant === 'full') {
    return (
      <button 
        onClick={handleAddToCart}
        className="w-full md:w-auto px-8 py-4 bg-kashmir-red text-white font-bold rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/10"
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </button>
    );
  }

  return (
    <button 
      onClick={handleAddToCart}
      className="p-2 bg-stone-100 rounded-full text-walnut hover:bg-kashmir-red hover:text-white transition-colors"
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}
