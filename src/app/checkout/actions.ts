"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

import { PaymentFactory } from "@/lib/payment/factory";

import { OrderStatus } from "@prisma/client";

import { checkoutSchema } from "@/lib/schemas";

import { checkRateLimit } from "@/lib/rate-limit";

import { finalizeOrderPayment } from "@/lib/orders";

export async function createOrder(formData: { address: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to place an order.");
  }

  // Rate Limiting: Max 5 attempts per minute per user for creating orders
  const isAllowed = await checkRateLimit(`create_order_${session.user.id}`);
  if (!isAllowed) {
    throw new Error("Too many order attempts. Please try again later.");
  }

  // Validate Input
  const validatedFields = checkoutSchema.safeParse(formData);
  if (!validatedFields.success) {
    const formatted = validatedFields.error.format();
    throw new Error(formatted.address?._errors[0] || "Invalid address provided.");
  }

  const { address } = validatedFields.data;

  // 1. Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  // 2. Calculate total
  const total = cart.items.reduce((acc, item) => {
    return acc + Number(item.product.price) * item.quantity;
  }, 0);

  // 3. Create Order in DB (Transaction)
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id!,
        total: total,
        status: OrderStatus.PENDING,
        shippingAddress: address,
        paymentProvider: PaymentFactory.getProvider().getProviderName(),
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  // 4. Initialize Payment with Provider
  const paymentProvider = PaymentFactory.getProvider();
  const paymentOrder = await paymentProvider.createPaymentOrder({
    amount: total,
    currency: "INR", // Default to INR for Kashmir-based shop
    orderId: order.id,
    customer: {
      name: `${session.user.name}`,
      email: session.user.email!,
    },
  });

  return {
    orderId: order.id,
    paymentOrder,
  };
}

export async function verifyOrderPayment(data: {
  orderId: string;
  paymentId: string;
  providerOrderId?: string;
  signature?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const paymentProvider = PaymentFactory.getProvider();
  const isValid = await paymentProvider.verifyPayment({
    orderId: data.orderId,
    paymentId: data.paymentId,
    providerOrderId: data.providerOrderId,
    signature: data.signature,
  });

  if (isValid) {
    const result = await finalizeOrderPayment(data.orderId, data.paymentId);
    return { success: result.success };
  }

  return { success: false };
}