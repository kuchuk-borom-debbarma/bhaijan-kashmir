import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
         {/* Using a placeholder for now if image is just a string URL. In real app, use next/image properly with width/height */}
        <div className="absolute inset-0 flex items-center justify-center text-stone-300 bg-stone-100">
           {/* Fallback visual if no image */}
           <span className="text-4xl">🏔️</span>
        </div>
      </div>
      
      <div className="p-4">
        <span className="text-xs font-medium text-kashmir-green uppercase tracking-wider">{category}</span>
        <h3 className="font-serif text-lg font-bold text-walnut mt-1 group-hover:text-kashmir-red transition-colors">
          <Link href={`/shop/${id}`}>
            {name}
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-walnut">₹{price}</span>
          <AddToCartButton product={{ id, name, price, category, image }} />
        </div>
      </div>
    </div>
  );
}
