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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-walnut">Edit Product</h1>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
