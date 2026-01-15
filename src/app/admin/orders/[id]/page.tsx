import { notFound } from "next/navigation";
import UpdateOrderForm from "./UpdateOrderForm";
import ShipmentTimelineManager from "./ShipmentTimelineManager";
import { prisma } from "@/lib/prisma";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
      shipment: {
        include: {
          events: { orderBy: { timestamp: "desc" } }
        }
      }
    }
  });

  if (!order) notFound();

  // Serialize Prisma Decimal to number/string for Client Component
  const serializedOrder = {
    ...order,
    total: Number(order.total),
    items: order.items.map(item => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price)
      }
    }))
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ... Header ... */}
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-walnut">Order Management</h1>
        <span className="bg-stone-100 px-3 py-1 rounded text-sm font-mono text-stone-600">ID: {order.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg border-b pb-2 mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                   <div className="w-12 h-12 bg-gray-100 rounded">
                     {/* Img placeholder */}
                   </div>
                   <div className="flex-1">
                     <p className="font-medium">{item.product.name}</p>
                     <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                   </div>
                   <p className="font-medium">₹{Number(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
               <span>Total</span>
               <span>₹{Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg border-b pb-2 mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-sm text-gray-500">Name</p>
                 <p>{order.user.firstName} {order.user.lastName}</p>
               </div>
               <div>
                 <p className="text-sm text-gray-500">Email</p>
                 <p>{order.user.email}</p>
               </div>
               <div className="col-span-2">
                 <p className="text-sm text-gray-500">Shipping Address</p>
                 <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
               </div>
            </div>
          </div>

          {/* Tracking Timeline (Manual) */}
          {order.shipment && (
             <ShipmentTimelineManager shipment={order.shipment} />
          )}
        </div>

        <div>
          {/* @ts-expect-error Serialized types mismatch with Prisma types but needed for Client Component */}
          <UpdateOrderForm order={serializedOrder} />
        </div>
      </div>
    </div>
  );
}
