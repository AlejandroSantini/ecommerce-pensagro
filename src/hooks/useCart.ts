// useCart.ts
// Zustand store para el carrito de compras

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, 'quantity'>,
    quantity?: number
  ) => void;
  removeItem: (id: number, variantId?: string) => void;
  updateQuantity: (id: number, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotal: () => number;
}

const getItemKey = (id: number, variantId?: string) => `${id}-${variantId ?? '0'}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const itemKey = getItemKey(item.id, item.variantId);
        const existingItem = items.find((i) => getItemKey(i.id, i.variantId) === itemKey);

        if (existingItem) {
          set({
            items: items.map((i) =>
              getItemKey(i.id, i.variantId) === itemKey
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          const newItem: CartItem = {
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            imagen: item.imagen,
            quantity: quantity,
            variantId: item.variantId,
            variantName: item.variantName,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id, variantId) => {
        const itemKey = getItemKey(id, variantId);
        set({ items: get().items.filter((item) => getItemKey(item.id, item.variantId) !== itemKey) });
      },

      updateQuantity: (id, variantId, quantity) => {
        const itemKey = getItemKey(id, variantId);
        set({
          items: get().items.map((item) =>
            getItemKey(item.id, item.variantId) === itemKey ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },
    }),
    {
      name: 'pensagro-cart',
    }
  )
);
