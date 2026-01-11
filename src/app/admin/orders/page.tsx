import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "lucide-react"; // Using lucide icon as mock badge or just styled span

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "DELIVERED": return "bg-purple-100 text-purple-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-walnut mb-8">Order Management</h1>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm text-gray-500 uppercase">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm">{order.id.slice(-8)}</td>
                <td className="p-4">
                  <div className="font-medium">{order.user.firstName} {order.user.lastName}</div>
                  <div className="text-xs text-gray-500">{order.user.email}</div>
                </td>
                <td className="p-4 font-bold">₹{Number(order.total).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-walnut font-medium hover:underline text-sm"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
