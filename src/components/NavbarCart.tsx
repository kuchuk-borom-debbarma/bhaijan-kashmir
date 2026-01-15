'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NavbarCart() {
  const { toggleCart, items } = useCartStore();
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const itemCount = isMounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <button 
      onClick={toggleCart}
      className="p-2 text-walnut hover:text-kashmir-red transition-colors relative"
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-kashmir-green text-white text-[10px] flex items-center justify-center rounded-full animate-in zoom-in duration-300">
          {itemCount}
        </span>
      )}
    </button>
  );
}
