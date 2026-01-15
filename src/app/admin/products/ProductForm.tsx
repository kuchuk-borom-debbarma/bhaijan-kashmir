"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "../actions";
import { Loader2, Save, X } from "lucide-react";
import { Category, Product } from "@prisma/client";

interface ProductFormProps {
  categories: Category[];
  initialData?: Product;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ? Number(initialData.price).toString() : "",
    image: initialData?.image || "",
    featured: initialData?.featured || false,
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        featured: formData.featured,
        categoryId: formData.categoryId,
      };

      if (initialData) {
        await updateProduct(initialData.id, submissionData);
      } else {
        await createProduct(submissionData);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-walnut">Product Name</label>
          <input
            required
            type="text"
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Saffron Mongra"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-walnut">Category</label>
          <select
            required
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none bg-white"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-walnut">Price (₹)</label>
          <input
            required
            type="number"
            step="0.01"
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-walnut">Image URL</label>
          <input
            required
            type="url"
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-walnut">Description</label>
        <textarea
          required
          rows={4}
          className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed product description..."
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          className="w-4 h-4 text-kashmir-red rounded focus:ring-kashmir-red border-stone-300"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
        />
        <label htmlFor="featured" className="text-sm font-medium text-stone-700">
          Featured Product (Show on homepage)
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-kashmir-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {initialData ? "Update Product" : "Create Product"}</>}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-stone-100 text-stone-600 rounded-lg font-bold hover:bg-stone-200 transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5" /> Cancel
        </button>
      </div>
    </form>
  );
}
