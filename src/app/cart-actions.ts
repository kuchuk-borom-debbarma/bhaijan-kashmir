'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCartAction() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  if (!cart) return null;

  return cart.items.map(item => ({
    id: item.productId,
    name: item.product.name,
    price: Number(item.product.price),
    image: item.product.image,
    quantity: item.quantity,
    category: item.product.category.name
  }));
}

export async function syncCartAction(items: { id: string, quantity: number }[]) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Not authenticated' };

  try {
    await prisma.$transaction(async (tx) => {
      // Get or create cart
      let cart = await tx.cart.findUnique({
        where: { userId: session.user.id }
      });

      if (!cart) {
        if (!session.user?.id) throw new Error("User ID is missing");
        cart = await tx.cart.create({
          data: { userId: session.user.id }
        });
      }

      // First, get current items to know what to delete if needed
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      if (items.length > 0) {
        await tx.cartItem.createMany({
          data: items.map(item => ({
            cartId: cart!.id,
            productId: item.id,
            quantity: item.quantity
          }))
        });
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to sync cart:', error);
    return { success: false, message: 'Failed to sync cart' };
  }
}
