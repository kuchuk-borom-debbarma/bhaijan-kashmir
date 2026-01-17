'use client';

import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cart';

interface MobileMenuProps {
  user?: User;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resetLocalCart = useCartStore((state) => state.resetLocalCart);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-walnut hover:text-kashmir-red transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 z-40">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
          >
            Contact Us
          </Link>
          
          <hr className="border-stone-100" />

          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/profile/orders"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
              >
                My Orders
              </Link>
              
              <button
                onClick={() => {
                  resetLocalCart();
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex w-full items-center gap-2 text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
              >
                  Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-walnut hover:text-kashmir-red transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
