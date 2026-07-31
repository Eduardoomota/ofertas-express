import { OffersList } from "@/features/offers/offers-list";

export default function HomePage() {
  return (
    <>
      {/* No mobile o header já exibe a marca; o h1 fica só para leitores de tela. */}
      <h1 className="sr-only">Ofertas disponíveis</h1>
      <OffersList />
    </>
  );
}
