import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "PAID": return <Package className="w-5 h-5 text-blue-500" />;
      case "SHIPPED": return <Truck className="w-5 h-5 text-purple-500" />;
      case "DELIVERED": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-walnut">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600">No orders yet</h2>
          <Link href="/shop" className="text-kashmir-red hover:underline mt-2 inline-block">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 sm:p-6 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Order Placed</p>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Total</p>
                    <p className="text-sm font-medium">₹{Number(order.total).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Order #</p>
                    <p className="text-sm font-medium uppercase">{order.id.slice(-8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border text-sm font-medium">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status.toLowerCase()}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-start gap-3">
                    <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Tracking Information</p>
                      <p className="text-sm text-blue-800">
                        {order.courier}: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
