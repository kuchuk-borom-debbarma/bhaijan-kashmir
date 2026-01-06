import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-walnut text-snow mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-kashmir-red">Bhaijan Kashmir</h3>
            <p className="text-stone-300 text-sm">
              Bringing the authentic flavors and crafts of Kashmir directly to your doorstep. Pure Saffron, Premium Dry Fruits, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-snow">Quick Links</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-snow">Contact Us</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>Srinagar, Kashmir</li>
              <li>support@bhaijankashmir.com</li>
              <li>+91 99999 99999</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-snow">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-kashmir-red transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-kashmir-red transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-kashmir-red transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

        </div>
        
        <div className="border-t border-stone-600 mt-12 pt-8 text-center text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} Bhaijan Kashmir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
