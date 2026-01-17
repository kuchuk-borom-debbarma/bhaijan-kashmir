'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { User } from 'next-auth';

interface MobileMenuProps {
  user?: User;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              {/* Sign out is handled by UserMenu usually, but for mobile we might need a dedicated button or just rely on the desktop user menu if visible? 
                  Actually, UserMenu is visible in the navbar actions. 
                  So we just need the navigation links here. 
              */}
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
