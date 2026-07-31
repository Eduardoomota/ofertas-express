export interface Offer {
  id: string;
  title: string;
  debtAmount: number;
  offerAmount: number;
  discountPercentage?: number;
}

export interface FeatureFlags {
  checkoutV2: boolean;
}

export type PaymentMethod = "pix" | "boleto";

export type CheckoutItem = Pick<Offer, "id" | "title" | "offerAmount">;

export interface CheckoutPayload {
  items: CheckoutItem[];
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  /** Somente em dev: força o handler do MSW a responder 500. */
  simulateError?: boolean;
}

export interface CheckoutResponse {
  orderId: string;
  status: "confirmed";
}
