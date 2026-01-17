import Link from 'next/link';
import { User } from 'lucide-react';
import NavbarCart from './NavbarCart';
import CartDrawer from './CartDrawer';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { auth } from '@/auth';

export default async function Navbar() {
  const session = await auth();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold text-kashmir-red">
            Bhaijan Kashmir
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-walnut hover:text-kashmir-red transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-walnut hover:text-kashmir-red transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-walnut hover:text-kashmir-red transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {session?.user ? (
                <UserMenu user={session.user} />
            ) : (
                <Link href="/auth/sign-in" className="hidden md:block text-sm font-medium text-walnut hover:text-kashmir-red transition-colors">
                    Sign In
                </Link>
            )}

            <NavbarCart />
            
            {/* Mobile Menu Button */}
            <MobileMenu user={session?.user} />
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}
