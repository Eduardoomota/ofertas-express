"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { buttonClasses } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { CartEmpty } from "./cart-empty";
import { CartItemRow } from "./cart-item-row";
import { useCartItems, useCartStore, useTotalAmount } from "./cart-store";

export function CartView() {
  const items = useCartItems();
  const removeItem = useCartStore((state) => state.removeItem);
  const totalAmount = useTotalAmount();

  return (
    <div>
      <PageHeader
        title="Seu carrinho"
        subtitle="Confira suas ofertas selecionadas."
        backHref="/"
        backLabel="Voltar para as ofertas"
      />

      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} onRemove={removeItem} />
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">
              {formatBRL(totalAmount)}
            </span>
          </div>

          <Link
            href="/checkout"
            className={buttonClasses("primary", "mt-6 w-full")}
          >
            Ir para o checkout
          </Link>
        </>
      )}
    </div>
  );
}
