"use client";

import { useState } from "react";
import { updateOrderStatus } from "../../actions";
import { Loader2 } from "lucide-react";

import { Order } from "@prisma/client";

export default function UpdateOrderForm({ order }: { order: Order & { trackingNumber?: string | null; courier?: string | null } }) {
  const [loading, setLoading] = useState(false);
  const [courier, setCourier] = useState(order.courier || "");
  const [tracking, setTracking] = useState(order.trackingNumber || "");

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courier || !tracking) return alert("Please enter courier and tracking info");
    
    setLoading(true);
    try {
      await updateOrderStatus(order.id, "SHIPPED", { courier, trackingNumber: tracking });
    } catch (err) {
      alert("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async () => {
    if (!confirm("Confirm order marked as DELIVERED?")) return;
    setLoading(true);
    try {
      await updateOrderStatus(order.id, "DELIVERED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">Fulfillment</h3>
      
      {order.status === "PAID" && (
        <form onSubmit={handleShip} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Courier Name</label>
            <input 
              type="text" 
              placeholder="e.g. BlueDart, Delhivery"
              className="w-full p-2 border rounded"
              value={courier}
              onChange={e => setCourier(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tracking Number</label>
            <input 
              type="text" 
              placeholder="Tracking ID"
              className="w-full p-2 border rounded"
              value={tracking}
              onChange={e => setTracking(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Mark as SHIPPED"}
          </button>
        </form>
      )}

      {order.status === "SHIPPED" && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
            <p><strong>Tracking:</strong> {order.trackingNumber}</p>
            <p><strong>Courier:</strong> {order.courier}</p>
          </div>
          <button 
            onClick={markDelivered}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex justify-center items-center"
          >
             {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Mark as DELIVERED"}
          </button>
        </div>
      )}

      {order.status === "PENDING" && (
         <div className="text-yellow-600 bg-yellow-50 p-4 rounded text-center text-sm">
            Payment not yet confirmed. Wait for payment before shipping.
         </div>
      )}

      {order.status === "DELIVERED" && (
         <div className="text-green-600 bg-green-50 p-4 rounded text-center text-sm font-bold">
            Order Complete
         </div>
      )}
    </div>
  );
}
