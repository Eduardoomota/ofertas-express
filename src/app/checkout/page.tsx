import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Confirmar acordo",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
