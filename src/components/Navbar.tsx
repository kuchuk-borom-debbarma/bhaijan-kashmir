import Link from 'next/link';
import { Menu } from 'lucide-react';
import NavbarCart from './NavbarCart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
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
            <NavbarCart />
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-walnut">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}
