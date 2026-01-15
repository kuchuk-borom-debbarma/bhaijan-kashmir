import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { NotificationFactory } from "@/lib/notifications/factory";
import { revalidatePath } from "next/cache";

/**
 * Safely marks an order as PAID and sends confirmation notifications.
 * Handles race conditions by ensuring the update only happens if status is PENDING.
 */
export async function finalizeOrderPayment(orderId: string, paymentId: string, paymentOrderId?: string, paymentMetadata?: any) {
  // 1. Atomically update only if status is PENDING
  const updateResult = await prisma.order.updateMany({
    where: { 
      id: orderId,
      status: OrderStatus.PENDING 
    },
    data: {
      status: OrderStatus.PAID,
      paymentId: paymentId,
      paymentOrderId: paymentOrderId,
      paymentMetadata: paymentMetadata,
    },
  });

  // 2. Only proceed with side effects if this specific call performed the update
  if (updateResult.count > 0) {
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (updatedOrder) {
      console.log(`[OrderService] Order ${orderId} finalized as PAID`);
      
      // Send Confirmation Notification
      try {
        await NotificationFactory.getProvider().send({
          to: updatedOrder.user.email,
          subject: `Order Confirmation #${updatedOrder.id.slice(-8)}`,
          body: `Thank you for your purchase! Your order of ₹${updatedOrder.total} has been confirmed.`,
          type: "ORDER_CONFIRMATION",
        });
      } catch (notifyError) {
        console.error(`[OrderService] Failed to send notification for order ${orderId}:`, notifyError);
      }

      // Revalidate paths if possible (might not work in webhook context but good for server actions)
      try {
        revalidatePath("/profile");
        revalidatePath("/admin/orders");
      } catch {
        // revalidatePath can throw in certain environments (like background jobs)
      }
      
      return { success: true, alreadyProcessed: false };
    }
  } else {
    // Check if it was already paid or if it doesn't exist
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (existingOrder && existingOrder.status !== OrderStatus.PENDING) {
        return { success: true, alreadyProcessed: true };
    }
  }

  return { success: false, alreadyProcessed: false };
}
