"use client";

import { OfferCard } from "./offer-card";
import { OffersEmpty } from "./offers-empty";
import { OffersError } from "./offers-error";
import { OffersSkeleton } from "./offers-skeleton";
import { useOffers } from "./use-offers";

export function OffersList() {
  const { data, isPending, isError, refetch, isRefetching } = useOffers();

  if (isPending) return <OffersSkeleton />;

  if (isError) {
    return <OffersError onRetry={() => refetch()} retrying={isRefetching} />;
  }

  if (data.length === 0) return <OffersEmpty />;

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
