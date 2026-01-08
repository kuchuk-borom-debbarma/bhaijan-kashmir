'use client';

import { useEffect, useState } from 'react';
import { useCartStore, syncWithDb, CartItem } from '@/store/cart';
import { getCartAction } from '@/app/cart-actions';

interface CartInitializerProps {
  userId?: string;
}

export default function CartInitializer({ userId }: CartInitializerProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if Zustand persist has finished rehydrating
    const unsubFinishHydration = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useCartStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const initialize = async () => {
      const state = useCartStore.getState();
      const localUserId = state.userId;
      const localItems = state.items;

      if (!userId) {
        // User logged out
        if (localUserId) {
             useCartStore.setState({ userId: null });
        }
        return;
      }

      // Case 1: Already synced user (Refresh) -> Fetch fresh from DB (Source of Truth)
      if (localUserId === userId) {
        const dbItems = await getCartAction();
        if (dbItems) {
            useCartStore.setState({ items: dbItems });
        }
        return;
      }

      // Case 2: Guest -> Login (Merge)
      if (!localUserId) {
        const dbItems = await getCartAction() || [];
        
        if (localItems.length === 0) {
            useCartStore.setState({ items: dbItems, userId });
            return;
        }

        // Merge Logic
        const mergedItemsMap = new Map<string, CartItem>();

        dbItems.forEach(item => mergedItemsMap.set(item.id, item));

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
        
        // Update Store & DB
        useCartStore.setState({ items: mergedItems, userId });
        await syncWithDb(mergedItems, userId);
        return;
      }

      // Case 3: Different User (Switch Account without logout?) -> Reset
      if (localUserId !== userId) {
          const dbItems = await getCartAction();
          useCartStore.setState({ items: dbItems || [], userId });
      }
    };

    initialize();
  }, [userId, hydrated]);

  return null;
}
