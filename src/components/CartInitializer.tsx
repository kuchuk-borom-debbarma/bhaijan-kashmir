'use client';

import { useEffect, useRef } from 'react';
import { useCartStore, syncWithDb, CartItem } from '@/store/cart';
import { getCartAction } from '@/app/cart-actions';

interface CartInitializerProps {
  userId?: string;
}

export default function CartInitializer({ userId }: CartInitializerProps) {
  const { setUserId, setItems, userId: storedUserId } = useCartStore();
  // use a ref to track if we've already initialized for this user to avoid double-merge in strict mode
  const initializedUser = useRef<string | null>(null);

  useEffect(() => {
    setUserId(userId || null);
    
    // If user just logged in (or we have a userId and it changed)
    if (userId && userId !== storedUserId && initializedUser.current !== userId) {
        initializedUser.current = userId;
        const initCart = async () => {
            const dbItems = await getCartAction() || [];
            // Get current local items (guest cart)
            const localItems = useCartStore.getState().items;

            if (localItems.length === 0 && dbItems.length === 0) {
                return;
            }

            // Merge Logic
            const mergedItemsMap = new Map<string, CartItem>();

            // Add DB items first
            dbItems.forEach(item => {
                mergedItemsMap.set(item.id, item);
            });

            // Merge local items
            localItems.forEach(localItem => {
                if (mergedItemsMap.has(localItem.id)) {
                    const existing = mergedItemsMap.get(localItem.id)!;
                    mergedItemsMap.set(localItem.id, {
                        ...existing,
                        quantity: existing.quantity + localItem.quantity
                    });
                } else {
                    mergedItemsMap.set(localItem.id, localItem);
                }
            });

            const mergedItems = Array.from(mergedItemsMap.values());

            // Update Store
            setItems(mergedItems);

            // Sync back to DB immediately so the DB reflects the merge
            await syncWithDb(mergedItems, userId);
        };
        initCart();
    }
  }, [userId, setUserId, setItems, storedUserId]);

  return null;
}
