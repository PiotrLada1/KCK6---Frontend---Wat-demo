// cartStore.js - globalny stan koszyka (Zustand)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => set(state => {
        const existing = state.items.find(i => i.id === product.id)
        if (existing) {
          return { items: state.items.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )}
        }
        return { items: [...state.items, { ...product, qty: 1 }] }
      }),

      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),

      updateQuantity: (id, qty) => set(s => ({items: qty <= 0 ? s.items.filter(i => i.id !== id) : s.items.map(i => i.id === id ? { ...i, qty } : i)
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'wat-cart-storage' }
  )
)