"use client";

import Link from "next/link";
import { FileIcon, TrashIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
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
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <h2 className="font-bold text-slate-900">Seu carrinho está vazio</h2>
          <p className="mt-1 text-sm text-slate-500">
            Adicione ofertas para começar a negociar.
          </p>
          <Link href="/" className={buttonClasses("outline", "mt-4")}>
            Ver ofertas disponíveis
          </Link>
          <div className="mt-6">
            <Button className="w-full" disabled>
              Ir para o checkout
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint/60 text-primary"
                >
                  <FileIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">Oferta</p>
                  <p className="text-sm font-bold text-primary">
                    {formatBRL(item.offerAmount)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${item.title} do carrinho`}
                  onClick={() => removeItem(item.id)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 motion-reduce:transition-none"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
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
