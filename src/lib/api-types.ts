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

export interface CheckoutPayload {
  itemIds: Array<Offer["id"]>;
  paymentMethod?: PaymentMethod;
  simulateError?: boolean;
}

export interface CheckoutResponse {
  orderId: string;
  status: "confirmed";
  totalAmount: number;
}
