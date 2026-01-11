"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NotificationFactory } from "@/lib/notifications/factory";

export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingData?: { courier: string, trackingNumber: string }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...(trackingData ? {
        courier: trackingData.courier,
        trackingNumber: trackingData.trackingNumber
      } : {})
    },
    include: { user: true }
  });

  // Send Notifications
  if (status === "SHIPPED") {
    await NotificationFactory.getProvider().send({
      to: order.user.email,
      subject: `Your Order #${order.id.slice(-8)} has been Shipped!`,
      body: `Good news! Your order has been shipped via ${order.courier}. Tracking Number: ${order.trackingNumber}`,
      type: "ORDER_SHIPPED"
    });
  } else if (status === "DELIVERED") {
    await NotificationFactory.getProvider().send({
      to: order.user.email,
      subject: `Order #${order.id.slice(-8)} Delivered`,
      body: `Your order has been delivered. We hope you enjoy your authentic Kashmiri products!`,
      type: "ORDER_DELIVERED"
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
