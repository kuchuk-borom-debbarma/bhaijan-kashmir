"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { createOrder, verifyOrderPayment } from "./actions";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!address) return setErrorMessage("Please enter a shipping address");
    
    setIsLoading(true);
    try {
      const { orderId, paymentOrder } = await createOrder({ address });
      
      const result = await verifyOrderPayment({
        orderId: orderId,
        paymentId: paymentOrder.id,
      });

      if (result.success) {
        clearCart();
        router.push(`/checkout/success?orderId=${orderId}`);
      } else {
        setErrorMessage("Payment verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An error occurred during checkout");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <button 
          onClick={() => router.push("/shop")} 
          className="mt-4 px-6 py-2 bg-walnut text-white rounded-md hover:bg-opacity-90"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-walnut">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <textarea
                required
                className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-kashmir-red outline-none"
                placeholder="Street, City, State, ZIP Code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
              <p>Payment Method: <strong>Mock Payment</strong></p>
              <p>This is a simulated transaction for testing purposes.</p>
            </div>
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-kashmir-red text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${total.toLocaleString()}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}