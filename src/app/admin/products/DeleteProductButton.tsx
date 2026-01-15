"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "../actions";

export default function DeleteProductButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete Product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
