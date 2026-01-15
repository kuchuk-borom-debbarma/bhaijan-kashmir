import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany()
  ]);

  if (!product) notFound();

  // Serialize Prisma Decimal to number/string for Client Component
  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-walnut">Edit Product</h1>
      {/* @ts-expect-error Server Component passing serialized data matching interface but TS complains about exact Decimal type mismatch */}
      <ProductForm categories={categories} initialData={serializedProduct} />
    </div>
  );
}
