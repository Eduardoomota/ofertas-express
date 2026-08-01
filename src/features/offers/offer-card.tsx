"use client";

import { Button } from "@/components/ui/button";
import { useCartStore, useIsInCart } from "@/features/cart/cart-store";
import type { Offer } from "@/lib/api-types";
import { formatBRL } from "@/lib/format";

export function OfferCard({ offer }: { offer: Offer }) {
  const addItem = useCartStore((state) => state.addItem);
  const isInCart = useIsInCart(offer.id);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-bold text-slate-900">{offer.title}</h2>
        {offer.discountPercentage !== undefined && (
          <span className="shrink-0 rounded-full bg-primary-tint px-2.5 py-1 text-xs font-bold text-primary-dark">
            {offer.discountPercentage}% off
          </span>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <dt className="text-xs text-slate-500">Dívida</dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-500">
            {formatBRL(offer.debtAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Oferta</dt>
          <dd className="mt-0.5 text-base font-bold text-primary">
            {formatBRL(offer.offerAmount)}
          </dd>
        </div>
      </dl>

      <Button
        variant="outline"
        className="mt-4 w-full"
        aria-disabled={isInCart}
        onClick={() => {
          if (!isInCart) addItem(offer);
        }}
      >
        {isInCart ? "Adicionado" : "Adicionar ao carrinho"}
        <span className="sr-only"> — {offer.title}</span>
      </Button>
    </article>
  );
}
