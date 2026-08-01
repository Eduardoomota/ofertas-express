import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";

export function CartEmpty() {
  return (
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
  );
}
