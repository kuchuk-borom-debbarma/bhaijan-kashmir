import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your order <strong>#{searchParams.orderId}</strong> has been placed successfully.
        We will start preparing your authentic Kashmiri products for shipping.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/profile/orders" 
          className="px-6 py-3 bg-walnut text-white rounded-md font-medium hover:bg-opacity-90 transition"
        >
          Track My Order
        </Link>
        <Link 
          href="/shop" 
          className="px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
