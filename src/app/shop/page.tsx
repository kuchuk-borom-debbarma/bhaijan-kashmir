import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  
  const categories = await prisma.category.findMany();
  
  const where = categorySlug ? { category: { slug: categorySlug } } : {};
  
  const products = await prisma.product.findMany({
    where,
    include: { category: true }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-walnut mb-4">Our Collection</h1>
        <p className="text-stone-500 max-w-2xl">Explore our handpicked selection of premium Kashmiri products.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 sticky top-24">
            <h3 className="font-bold text-walnut mb-4 text-lg">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/shop" 
                  className={`block w-full text-left py-1 hover:text-kashmir-red transition-colors ${!categorySlug ? 'text-kashmir-red font-medium' : 'text-stone-600'}`}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/shop?category=${cat.slug}`}
                    className={`block w-full text-left py-1 hover:text-kashmir-red transition-colors ${categorySlug === cat.slug ? 'text-kashmir-red font-medium' : 'text-stone-600'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="font-bold text-walnut mt-8 mb-4 text-lg">Price Range</h3>
             {/* Simple visual slider placeholder */}
            <div className="h-1 bg-stone-200 rounded-full mb-4">
               <div className="w-1/2 h-full bg-kashmir-green rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
               <span>₹100</span>
               <span>₹20000+</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.map(product => (
               <ProductCard 
                 key={product.id} 
                 id={product.id}
                 name={product.name}
                 price={Number(product.price)}
                 image={product.image}
                 category={product.category.name}
               />
             ))}
             
             {products.length === 0 && (
               <div className="col-span-full text-center py-12 text-stone-500">
                 No products found in this category.
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}