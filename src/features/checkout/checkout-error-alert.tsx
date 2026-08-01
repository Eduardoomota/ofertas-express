import { forwardRef } from "react";

export const CheckoutErrorAlert = forwardRef<HTMLDivElement>(
  function CheckoutErrorAlert(_props, ref) {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="alert"
        className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <p className="font-semibold text-red-800">
          Não foi possível concluir o acordo
        </p>
        <p className="mt-0.5 text-sm text-red-700">
          Estamos enfrentando uma instabilidade temporária. Suas ofertas estão
          seguras. Tente novamente em alguns instantes.
        </p>
      </div>
    );
  },
);
