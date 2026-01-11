import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import UpdateOrderForm from "./UpdateOrderForm";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-walnut flex items-center gap-1 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-walnut">Order #{order.id.slice(-8)}</h1>
          <span className="px-3 py-1 bg-gray-100 rounded-full font-bold text-sm">
            {order.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                     <img src={item.product.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{Number(item.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-walnut">₹{Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Contact</p>
                <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                <p>{order.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Shipping Address</p>
                <p className="whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-1">
          <UpdateOrderForm order={order} />
        </div>
      </div>
    </div>
  );
}
