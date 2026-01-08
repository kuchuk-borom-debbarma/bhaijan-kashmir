import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncCartAction } from '@/app/cart-actions';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  userId: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, action: 'increment' | 'decrement') => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  setUserId: (userId: string | null) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const syncWithDb = async (items: CartItem[], userId: string | null) => {
  if (!userId) return;
  await syncCartAction(items.map(item => ({ id: item.id, quantity: item.quantity })));
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      userId: null,

      setUserId: (userId) => set({ userId }),

      setItems: (items) => set({ items }),

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === newItem.id);
        let newItems;

        if (existingItem) {
          newItems = items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, { ...newItem, quantity: 1 }];
        }

        set({
          items: newItems,
          isOpen: true,
        });
        
        syncWithDb(newItems, get().userId);
      },

      removeItem: (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({ items: newItems });
        syncWithDb(newItems, get().userId);
      },

      updateQuantity: (id, action) => {
        const items = get().items;
        const newItems = items.map((item) => {
          if (item.id === id) {
            if (action === 'increment') return { ...item, quantity: item.quantity + 1 };
            if (action === 'decrement') return { ...item, quantity: Math.max(1, item.quantity - 1) };
          }
          return item;
        });
        set({ items: newItems });
        syncWithDb(newItems, get().userId);
      },

      clearCart: () => {
        set({ items: [] });
        syncWithDb([], get().userId);
      },
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'bhaijan-cart-storage',
    }
  )
);
