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

  // Create Shipment Record if Shipping
  if (status === "SHIPPED" && trackingData) {
    await prisma.shipment.upsert({
      where: { orderId: orderId },
      update: {
        provider: trackingData.courier,
        trackingNumber: trackingData.trackingNumber,
      },
      create: {
        orderId: orderId,
        provider: trackingData.courier,
        trackingNumber: trackingData.trackingNumber,
      }
    });
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

export async function addShipmentEvent(shipmentId: string, eventData: { status: string, location: string, description: string }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.shipmentEvent.create({
    data: {
      shipmentId,
      status: eventData.status,
      location: eventData.location,
      description: eventData.description
    }
  });

  // Find the order ID to revalidate
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    select: { orderId: true }
  });

  if (shipment) {
    revalidatePath(`/admin/orders/${shipment.orderId}`);
    revalidatePath(`/profile/orders/${shipment.orderId}`);
  }
}

import { StorageFactory } from "@/lib/storage/factory";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "true";
  
  let imageUrl = formData.get("image") as string;
  const imageFile = formData.get("imageFile") as File;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await StorageFactory.getProvider().upload(imageFile);
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      image: imageUrl,
      featured,
      categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return product;
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "true";
  
  let imageUrl = formData.get("image") as string;
  const imageFile = formData.get("imageFile") as File;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await StorageFactory.getProvider().upload(imageFile);
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      image: imageUrl,
      featured,
      categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/shop/${id}`);
  revalidatePath("/shop");
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
