"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, createCategory } from "../actions";
import { Loader2, Save, X, Upload, Plus } from "lucide-react";
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

  const [file, setFile] = useState<File | null>(null);
  
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    setLoading(true);
    try {
      const slug = newCategoryName.toLowerCase().replace(/ /g, "-");
      const newCat = await createCategory(newCategoryName, slug);
      setFormData({ ...formData, categoryId: newCat.id });
      setIsCreatingCategory(false);
      setNewCategoryName("");
      // Force refresh to get new category in list? 
      // Ideally we'd update local state 'categories' but props are immutable. 
      // We rely on router.refresh() but that might be slow.
      // Better: reload page or optimistically append to list if we could.
      router.refresh(); 
    } catch (err: unknown) {
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("image", formData.image); // URL fallback
      data.append("categoryId", formData.categoryId);
      data.append("featured", String(formData.featured));
      
      if (file) {
        data.append("imageFile", file);
      }

      if (initialData) {
        await updateProduct(initialData.id, data);
      } else {
        await createProduct(data);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save product";
      setError(message);
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
          {isCreatingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button 
                type="button"
                onClick={handleCreateCategory}
                disabled={loading}
                className="bg-kashmir-green text-white px-4 rounded-lg hover:bg-green-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
              <button 
                type="button"
                onClick={() => setIsCreatingCategory(false)}
                className="bg-stone-100 text-stone-600 px-4 rounded-lg hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                required
                className="flex-1 p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none bg-white"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button 
                type="button"
                onClick={() => setIsCreatingCategory(true)}
                className="bg-stone-100 text-walnut px-4 rounded-lg hover:bg-stone-200 flex items-center justify-center"
                title="Create New Category"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
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
           <label className="text-sm font-bold text-walnut">Product Image</label>
           <div className="flex gap-2 items-center">
             <input
               type="text"
               className="flex-1 p-3 rounded-lg border border-stone-200 text-sm"
               value={formData.image}
               onChange={(e) => setFormData({ ...formData, image: e.target.value })}
               placeholder="Enter URL or upload file..."
             />
             <div className="relative">
               <input 
                 type="file" 
                 accept="image/*"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        // Preview hack
                        setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) });
                    }
                 }}
               />
               <button type="button" className="p-3 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors">
                  <Upload className="w-5 h-5 text-stone-600" />
               </button>
             </div>
           </div>
           {file && <p className="text-xs text-green-600">File selected: {file.name}</p>}
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
