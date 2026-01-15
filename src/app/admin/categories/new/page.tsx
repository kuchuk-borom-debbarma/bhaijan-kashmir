"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "../../actions";
import { Loader2, Save, X } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    try {
      const slug = name.toLowerCase().replace(/ /g, "-");
      await createCategory(name, slug);
      router.push("/admin/categories");
    } catch (err) {
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-walnut mb-8">Add New Category</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-walnut">Category Name</label>
          <input
            required
            type="text"
            className="w-full p-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-red outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Honey"
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-kashmir-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Create Category</>}
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
    </div>
  );
}
