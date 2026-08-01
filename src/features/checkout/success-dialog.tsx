"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessDialogProps {
  orderId: string;
}

export function SuccessDialog({ orderId }: SuccessDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-success-title"
      onClose={() => router.push("/")}
      className="w-[calc(100%-2rem)] max-w-sm rounded-2xl p-0 shadow-xl backdrop:bg-slate-900/50"
    >
      <div className="p-6 text-center">
        <CircleCheck
          aria-hidden="true"
          className="mx-auto h-12 w-12 text-primary"
        />
        <h2
          id="checkout-success-title"
          className="mt-3 text-lg font-bold text-slate-900"
        >
          Acordo confirmado!
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pedido <span className="font-semibold">{orderId}</span>. Você receberá
          as instruções de pagamento em breve.
        </p>
        <Button
          className="mt-5 w-full"
          onClick={() => dialogRef.current?.close()}
        >
          Voltar para as ofertas
        </Button>
      </div>
    </dialog>
  );
}
