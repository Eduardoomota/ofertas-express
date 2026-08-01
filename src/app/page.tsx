import { OffersList } from "@/features/offers/offers-list";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Ofertas disponíveis</h1>
      <OffersList />
    </>
  );
}
