import { create } from "zustand";
import type { Offer } from "@/lib/api-types";

interface CartState {
  items: Offer[];
  /** Última mudança no carrinho, anunciada em região aria-live no AppShell. */
  announcement: string;
  addItem: (offer: Offer) => void;
  removeItem: (id: Offer["id"]) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  announcement: "",

  addItem: (offer) =>
    set((state) => {
      if (state.items.some((item) => item.id === offer.id)) return state;
      return {
        items: [...state.items, offer],
        announcement: `${offer.title} adicionado ao carrinho`,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const removed = state.items.find((item) => item.id === id);
      if (!removed) return state;
      return {
        items: state.items.filter((item) => item.id !== id),
        announcement: `${removed.title} removido do carrinho`,
      };
    }),

  clear: () => set({ items: [], announcement: "" }),
}));

// Selectors: cada componente assina só a fatia que usa, evitando re-renders.
export const useCartItems = () => useCartStore((state) => state.items);

export const useTotalItems = () => useCartStore((state) => state.items.length);

export const useTotalAmount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.offerAmount, 0),
  );

export const useIsInCart = (id: Offer["id"]) =>
  useCartStore((state) => state.items.some((item) => item.id === id));

export const useCartAnnouncement = () =>
  useCartStore((state) => state.announcement);
