import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Truck, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb / Back */}
      <div className="mb-8">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-stone-500 hover:text-kashmir-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Product Image */}
        <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-sm">
           {product.image ? (
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover"
             /> 
           ) : (
             <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-6xl">
               🏔️
             </div>
           )}
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-kashmir-green/10 text-kashmir-green text-sm font-bold rounded-full mb-4">
              {product.category.name}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-walnut mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-walnut">
              ₹{Number(product.price)}
            </p>
          </div>

          <div className="prose prose-stone text-stone-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="pt-6 border-t border-stone-100 space-y-6">
            <div className="flex items-center gap-6">
              {/* Reuse the AddToCartButton component but we might want to style it differently or just wrap it */}
              <div className="flex-1">
                 {/* Passing props compatible with what AddToCartButton expects */}
                <div className="flex gap-4">
                  <AddToCartButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      category: product.category.name,
                      image: product.image
                    }} 
                    variant="full"
                  />
                </div>
                <p className="mt-4 text-sm text-green-600 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> In Stock & Ready to Ship
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-stone-500">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Truck className="w-5 h-5 text-kashmir-red" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-kashmir-red" />
                <span>Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 pt-16">
          <h2 className="font-serif text-3xl font-bold text-walnut mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="group">
                <Link href={`/shop/${p.id}`}>
                  <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden mb-4 relative">
                     {p.image ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-2xl">
                         🏔️
                       </div>
                     )}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-walnut group-hover:text-kashmir-red transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-stone-500">₹{Number(p.price)}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
