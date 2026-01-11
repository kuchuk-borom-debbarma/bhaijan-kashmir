"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-walnut text-white font-medium rounded-lg hover:bg-walnut/90 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
