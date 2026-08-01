import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { buttonClasses } from "@/components/ui/button";

export function CheckoutEmpty() {
  return (
    <div>
      <PageHeader
        title="Confirmar acordo"
        backHref="/cart"
        backLabel="Voltar para o carrinho"
      />
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="font-bold text-slate-900">
          Não há ofertas para confirmar
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Adicione ofertas ao carrinho antes de fechar o acordo.
        </p>
        <Link href="/" className={buttonClasses("outline", "mt-4")}>
          Ver ofertas disponíveis
        </Link>
      </div>
    </div>
  );
}
