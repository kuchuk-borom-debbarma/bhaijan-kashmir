import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Package, CreditCard, Truck, AlertCircle } from "lucide-react";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

async function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  
  // Fetch key stats
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const paidOrders = await prisma.order.count({ where: { status: "PAID" } });
  const shippedOrders = await prisma.order.count({ where: { status: "SHIPPED" } });
  
  // Calculate revenue (Rough estimate from PAID/SHIPPED/DELIVERED)
  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }
  });
  const revenue = revenueResult._sum.total || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-walnut mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${Number(revenue).toLocaleString()}`} 
          icon={CreditCard} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Needs Shipping" 
          value={paidOrders} 
          icon={Package} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Shipped" 
          value={shippedOrders} 
          icon={Truck} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Pending Payment" 
          value={pendingOrders} 
          icon={AlertCircle} 
          color="bg-yellow-500" 
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
          Chart functionality coming soon...
        </div>
      </div>
    </div>
  );
}
