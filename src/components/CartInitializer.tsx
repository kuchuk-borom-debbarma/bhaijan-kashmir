'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { getCartAction } from '@/app/cart-actions';

interface CartInitializerProps {
  userId?: string;
}

export default function CartInitializer({ userId }: CartInitializerProps) {
  const { setUserId, setItems, userId: storedUserId } = useCartStore();

  useEffect(() => {
    setUserId(userId || null);
    
    // If user just logged in (or we have a userId and it changed)
    if (userId && userId !== storedUserId) {
        const initCart = async () => {
            const dbItems = await getCartAction();
            if (dbItems && dbItems.length > 0) {
                setItems(dbItems);
            }
        };
        initCart();
    }
  }, [userId, setUserId, setItems, storedUserId]);

  return null;
}
