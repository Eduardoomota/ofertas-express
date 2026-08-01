import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Offer } from "@/lib/api-types";

export const CART_STORAGE_KEY = "ofertas-express-cart";

interface CartState {
  items: Offer[];
  /** Última mudança no carrinho, anunciada em região aria-live no AppShell. */
  announcement: string;
  addItem: (offer: Offer) => void;
  removeItem: (id: Offer["id"]) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Só os itens vão para o storage; announcement é efêmero.
      partialize: (state) => ({ items: state.items }),
      // Estado de versão desconhecida é descartado em vez de quebrar o app.
      migrate: () => ({ items: [] }),
      // O server renderiza o carrinho vazio; reidratar só após montar
      // (useRehydrateCart) evita mismatch de hidratação no SSR.
      skipHydration: true,
    },
  ),
);

/**
 * Reidrata o carrinho do localStorage após a montagem no cliente.
 * Consumido pelo AppShell — o layout não conhece detalhes de persistência.
 */
export function useRehydrateCart(): void {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
}

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
