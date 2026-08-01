"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheckIcon, CoinsIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCartItems, useTotalAmount } from "@/features/cart/cart-store";
import type { PaymentMethod } from "@/lib/api-types";
import { formatBRL } from "@/lib/format";
import { ActionAreaSkeleton } from "./action-area-skeleton";
import { CheckoutEmpty } from "./checkout-empty";
import { CheckoutErrorAlert } from "./checkout-error-alert";
import { PaymentMethodSelector } from "./payment-method-selector";
import { SuccessDialog } from "./success-dialog";
import { SummaryRow } from "./summary-row";
import { useCheckout } from "./use-checkout";
import { useCheckoutFlag } from "./use-checkout-flag";

const isDev = process.env.NODE_ENV === "development";

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

  const summaryCount = checkout.isSuccess
    ? checkout.variables.itemIds.length
    : items.length;
  const summaryTotal = checkout.isSuccess
    ? checkout.data.totalAmount
    : totalAmount;

  if (items.length === 0 && !checkout.isSuccess) {
    return <CheckoutEmpty />;
  }

  const handleConfirm = () => {
    checkout.mutate({
      itemIds: items.map((item) => item.id),
      ...(checkoutV2 ? { paymentMethod } : {}),
      ...(simulateError ? { simulateError: true } : {}),
    });
  };

  return (
    <div>
      <PageHeader
        title="Confirmar acordo"
        subtitle="Revise os detalhes e confirme para seguir."
        backHref="/cart"
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

          {checkout.isError && <CheckoutErrorAlert ref={errorRef} />}

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
