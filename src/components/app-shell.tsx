"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  useCartAnnouncement,
  useRehydrateCart,
  useTotalItems,
} from "@/features/cart/cart-store";
import { CartIcon, ClockIcon, LogOutIcon, TagIcon, UserIcon } from "./icons";

function cartLabel(totalItems: number): string {
  return `Carrinho, ${totalItems} ${totalItems === 1 ? "item" : "itens"}`;
}

function Brand() {
  return (
    <div>
      <p className="text-lg font-bold leading-tight text-slate-900">
        Ofertas Express
      </p>
      <p className="text-xs text-slate-500">Renegocie com desconto</p>
    </div>
  );
}

function CartBadge({ totalItems }: { totalItems: number }) {
  if (totalItems === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-white"
    >
      {totalItems}
    </span>
  );
}

function MobileHeader({ totalItems }: { totalItems: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white lg:hidden">
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-4 py-3">
        <Brand />
        <Link
          href="/carrinho"
          aria-label={cartLabel(totalItems)}
          className="relative grid h-11 w-11 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 motion-reduce:transition-none"
        >
          <CartIcon className="h-6 w-6" />
          <span className="absolute right-0.5 top-0.5">
            <CartBadge totalItems={totalItems} />
          </span>
        </Link>
      </div>
    </header>
  );
}

function Sidebar({ totalItems }: { totalItems: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Ofertas", icon: TagIcon, badge: false },
    { href: "/carrinho", label: "Carrinho", icon: CartIcon, badge: true },
  ];

  // Itens ilustrativos do mockup, sem destino real — renderizados como texto
  // não interativo para não enganar teclado e leitores de tela.
  const placeholders = [
    { label: "Histórico", icon: ClockIcon },
    { label: "Perfil", icon: UserIcon },
  ];

  return (
    <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col">
      <div className="px-6 py-6">
        <Brand />
      </div>
      <nav aria-label="Navegação principal" className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={badge ? cartLabel(totalItems) : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none ${
                    isActive
                      ? "bg-primary-tint/50 text-primary"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{label}</span>
                  {badge && <CartBadge totalItems={totalItems} />}
                </Link>
              </li>
            );
          })}
          {placeholders.map(({ label, icon: Icon }) => (
            <li key={label}>
              <span className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400">
                <Icon className="h-5 w-5" />
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-200 px-6 py-4">
        <span className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <LogOutIcon className="h-5 w-5" />
          Sair
        </span>
      </div>
    </aside>
  );
}

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
