"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { CalendarCheckIcon, CoinsIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { useCartItems, useTotalAmount } from "@/features/cart/cart-store";
import type { PaymentMethod } from "@/lib/api-types";
import { formatBRL } from "@/lib/format";
import { PaymentMethodSelector } from "./payment-method-selector";
import { SuccessDialog } from "./success-dialog";
import { useCheckout } from "./use-checkout";
import { useCheckoutFlag } from "./use-checkout-flag";

interface SummaryRowProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

function SummaryRow({ icon: Icon, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint/60 text-primary"
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-sm text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

const isDev = process.env.NODE_ENV === "development";

/**
 * Enquanto a flag carrega, a área de ação vira skeleton — evita o botão
 * trocar de rótulo ("Confirmar" → "Confirmar pagamento") e a seção de
 * pagamento "pular" na tela quando a flag resolve.
 */
function ActionAreaSkeleton() {
  return (
    <div className="mt-6">
      <p role="status" className="sr-only">
        Carregando opções de pagamento…
      </p>
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 motion-safe:animate-pulse"
      >
        <div className="h-[72px] rounded-xl bg-slate-200/80" />
        <div className="h-[72px] rounded-xl bg-slate-200/80" />
        <div className="mt-3 h-11 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export function CheckoutView() {
  const items = useCartItems();
  const totalAmount = useTotalAmount();
  const { checkoutV2, isLoading: flagLoading } = useCheckoutFlag();
  const checkout = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [simulateError, setSimulateError] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (checkout.isError) errorRef.current?.focus();
  }, [checkout.isError]);

  // Após o sucesso o carrinho é limpo; o resumo passa a vir do payload enviado.
  const submitted = checkout.isSuccess ? checkout.variables : null;
  const summaryCount = submitted ? submitted.items.length : items.length;
  const summaryTotal = submitted ? submitted.totalAmount : totalAmount;

  if (items.length === 0 && !checkout.isSuccess) {
    return (
      <div>
        <PageHeader
          title="Confirmar acordo"
          backHref="/carrinho"
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

  const handleConfirm = () => {
    checkout.mutate({
      items: items.map(({ id, title, offerAmount }) => ({
        id,
        title,
        offerAmount,
      })),
      totalAmount,
      ...(checkoutV2 ? { paymentMethod } : {}),
      ...(simulateError ? { simulateError: true } : {}),
    });
  };

  return (
    <div>
      <PageHeader
        title="Confirmar acordo"
        subtitle="Revise os detalhes e confirme para seguir."
        backHref="/carrinho"
        backLabel="Voltar para o carrinho"
      />

      <div className="flex flex-col gap-3">
        <SummaryRow
          icon={CalendarCheckIcon}
          label="Ofertas selecionadas"
          value={String(summaryCount)}
        />
        <SummaryRow
          icon={CoinsIcon}
          label="Total do acordo"
          value={formatBRL(summaryTotal)}
        />
      </div>

      {flagLoading ? (
        <ActionAreaSkeleton />
      ) : (
        <>
          {checkoutV2 && (
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          )}

          {checkout.isError && (
            <div
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="font-semibold text-red-800">
                Não foi possível concluir o acordo
              </p>
              <p className="mt-0.5 text-sm text-red-700">
                Nossos servidores estão instáveis. Suas ofertas continuam aqui —
                tente novamente em instantes.
              </p>
            </div>
          )}

          {isDev && (
            <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-500">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(event) => setSimulateError(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Simular falha da API (apenas em dev)
            </label>
          )}

          <Button
            className="mt-6 w-full"
            isLoading={checkout.isPending}
            onClick={handleConfirm}
          >
            {checkout.isPending
              ? "Enviando…"
              : checkoutV2
                ? "Confirmar pagamento"
                : "Confirmar"}
          </Button>

          <p className="mt-4 text-center text-xs text-slate-400">
            checkoutV2 = {String(checkoutV2)}
          </p>
        </>
      )}

      {checkout.isSuccess && <SuccessDialog orderId={checkout.data.orderId} />}
    </div>
  );
}
