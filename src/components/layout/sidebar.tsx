"use client";

import { Clock, LogOut, ShoppingCart, Tag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { CartBadge } from "./cart-badge";
import { cartLabel } from "./cart-label";

export function Sidebar({ totalItems }: { totalItems: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Ofertas", icon: Tag, badge: false },
    { href: "/cart", label: "Carrinho", icon: ShoppingCart, badge: true },
  ];

  const placeholders = [
    { label: "Histórico", icon: Clock },
    { label: "Perfil", icon: User },
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
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span className="flex-1">{label}</span>
                  {badge && <CartBadge totalItems={totalItems} />}
                </Link>
              </li>
            );
          })}
          {placeholders.map(({ label, icon: Icon }) => (
            <li key={label}>
              <span className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400">
                <Icon aria-hidden="true" className="h-5 w-5" />
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-200 px-6 py-4">
        <span className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <LogOut aria-hidden="true" className="h-5 w-5" />
          Sair
        </span>
      </div>
    </aside>
  );
}
