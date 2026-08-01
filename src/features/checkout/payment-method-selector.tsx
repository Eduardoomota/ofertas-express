"use client";

import { BoletoIcon, PixIcon } from "@/components/icons";
import type { PaymentMethod } from "@/lib/api-types";
import { PaymentOption } from "./payment-option";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-3 text-sm font-bold text-slate-900">
        Forma de pagamento
      </legend>
      <div className="flex flex-col gap-3">
        <PaymentOption
          value="pix"
          title="Pix"
          description="Pagamento instantâneo"
          icon={PixIcon}
          checked={value === "pix"}
          onChange={() => onChange("pix")}
        />
        <PaymentOption
          value="boleto"
          title="Boleto"
          description="Vencimento em 3 dias úteis"
          icon={BoletoIcon}
          checked={value === "boleto"}
          onChange={() => onChange("boleto")}
        />
      </div>
    </fieldset>
  );
}
