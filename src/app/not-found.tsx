import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <AlertCircle className="w-20 h-20 text-walnut/50 mb-6" />
      <h2 className="text-3xl font-bold text-walnut mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-kashmir-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
