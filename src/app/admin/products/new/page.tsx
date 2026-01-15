import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-walnut">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
