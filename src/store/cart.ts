import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, action: 'increment' | 'decrement') => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed helpers (though usually done in components, we can expose simple getters if needed, 
  // but Zustand selectors are better for reactive updates)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === newItem.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true, // Open cart when adding item
          });
        } else {
          set({
            items: [...items, { ...newItem, quantity: 1 }],
            isOpen: true, // Open cart when adding item
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, action) => {
        const items = get().items;
        set({
          items: items.map((item) => {
            if (item.id === id) {
              if (action === 'increment') return { ...item, quantity: item.quantity + 1 };
              if (action === 'decrement') return { ...item, quantity: Math.max(1, item.quantity - 1) };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'bhaijan-cart-storage', // name of the item in localStorage
    }
  )
);
