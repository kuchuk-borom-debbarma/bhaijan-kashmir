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
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page if button is inside a Link
    e.stopPropagation();
    addItem(product);
  };

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
