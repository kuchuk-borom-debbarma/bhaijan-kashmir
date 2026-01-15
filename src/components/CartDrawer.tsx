'use client';

import { useCartStore } from '@/store/cart';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  
  // Hydration fix: persist middleware needs to rehydrate on client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <h2 className="font-serif text-xl font-bold text-walnut flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart ({items.length})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Your cart is empty.</p>
              <button 
                onClick={closeCart}
                className="text-kashmir-red font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Image Placeholder */}
                <div className="w-20 h-20 bg-stone-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                   {/* In a real app with next/image, you'd use the src. For now, we mock */}
                   <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-400">IMG</div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-walnut line-clamp-2 text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-stone-500">{item.category}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-walnut">₹{item.price * item.quantity}</span>
                    
                    <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, 'decrement')}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 'increment')}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold text-walnut">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="text-xs text-stone-500 text-center">Shipping and taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="w-full py-4 bg-kashmir-green text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-900/10 flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
