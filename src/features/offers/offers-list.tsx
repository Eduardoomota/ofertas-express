"use client";

import { Button } from "@/components/ui/button";
import { OfferCard } from "./offer-card";
import { OffersSkeleton } from "./offers-skeleton";
import { useOffers } from "./use-offers";

export function OffersList() {
  const { data, isPending, isError, refetch, isRefetching } = useOffers();

  if (isPending) return <OffersSkeleton />;

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <h2 className="font-bold text-red-800">
          Não foi possível carregar as ofertas
        </h2>
        <p className="mt-1 text-sm text-red-700">
          Verifique sua conexão e tente novamente.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          isLoading={isRefetching}
          onClick={() => refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="font-bold text-slate-900">Nenhuma oferta disponível</h2>
        <p className="mt-1 text-sm text-slate-500">
          Volte mais tarde para conferir novas oportunidades de negociação.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {data.map((offer) => (
        <li key={offer.id}>
          <OfferCard offer={offer} />
        </li>
      ))}
    </ul>
  );
}
