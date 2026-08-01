"use client";

import type { ReactNode } from "react";
import {
  useCartAnnouncement,
  useRehydrateCart,
  useTotalItems,
} from "@/features/cart/cart-store";
import { MobileHeader } from "./mobile-header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const totalItems = useTotalItems();
  const announcement = useCartAnnouncement();
  useRehydrateCart();

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>
      <Sidebar totalItems={totalItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader totalItems={totalItems} />
        <main
          id="conteudo"
          className="mx-auto w-full max-w-[680px] flex-1 px-4 py-6 lg:px-8 lg:py-10"
        >
          {children}
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </main>
      </div>
    </div>
  );
}
