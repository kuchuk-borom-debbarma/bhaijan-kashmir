import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    include: { category: true }
  });

  // Map database products to UI component props
  const productsForUI = featuredProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.category.name,
    image: p.image
  }));

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-walnut text-center text-snow">
        {/* Abstract Background - mimicking mountains/nature with CSS gradients if no image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1598556804364-c270d47d4c82?q=80&w=2000')] bg-cover bg-center opacity-60"></div>
        
        <div className="relative z-20 px-4 max-w-4xl mx-auto space-y-6">
          <span className="text-kashmir-gold uppercase tracking-[0.2em] text-sm font-semibold">Welcome to Paradise</span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight">
            The Purest Essence of <br/><span className="text-kashmir-red">Kashmir</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto">
            From the valley to your doorstep. Authentic Saffron, Premium Dry Fruits, and Exquisite Handicrafts.
          </p>
          <div className="pt-8">
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-kashmir-red text-white font-medium rounded-full hover:bg-red-700 transition-colors"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-walnut">Bestsellers</h2>
            <p className="text-stone-500">Loved by our customers across the globe</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center text-kashmir-red hover:text-walnut transition-colors font-medium">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsForUI.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/shop" className="inline-flex items-center text-kashmir-red font-medium">
            View All Products <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Trust/About Section */}
      <section className="bg-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-stone-300">
               {/* Placeholder for About Image */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000')] bg-cover bg-center"></div>
            </div>
            
            <div className="space-y-6">
              <span className="text-kashmir-green font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-walnut">Authenticity in Every Grain</h2>
              <p className="text-stone-600 leading-relaxed">
                Bhaijan Kashmir is not just a brand; it&apos;s a promise of purity. We source our Saffron directly from the fields of Pampore and our dry fruits from the orchards of Sopore.
              </p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full text-kashmir-green shadow-sm"><Star className="w-5 h-5 fill-current" /></div>
                  <span className="font-medium text-walnut">100% Organic & Preservative Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full text-kashmir-green shadow-sm"><Star className="w-5 h-5 fill-current" /></div>
                  <span className="font-medium text-walnut">Direct from Farmers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full text-kashmir-green shadow-sm"><Star className="w-5 h-5 fill-current" /></div>
                  <span className="font-medium text-walnut">GI Tagged Saffron</span>
                </li>
              </ul>
              
              <div className="pt-6">
                 <Link href="/about" className="text-kashmir-red font-bold border-b-2 border-kashmir-red pb-1 hover:text-walnut hover:border-walnut transition-colors">
                   Read Our Story
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-kashmir-green rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
             <h2 className="font-serif text-3xl md:text-4xl font-bold">Join the Family</h2>
             <p className="text-green-50">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-grow px-6 py-3 rounded-full text-walnut focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
               />
               <button className="px-8 py-3 bg-walnut text-white font-bold rounded-full hover:bg-black transition-colors">
                 Subscribe
               </button>
             </div>
           </div>
           
           {/* Decor */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>
    </div>
  );
}