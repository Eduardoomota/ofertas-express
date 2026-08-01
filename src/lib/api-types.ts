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

/**
 * O cliente envia apenas os IDs: preço é responsabilidade do servidor, que
 * resolve os itens no catálogo e recalcula o total (anti price-tampering).
 */
export interface CheckoutPayload {
  itemIds: Array<Offer["id"]>;
  paymentMethod?: PaymentMethod;
  /** Somente em dev: força o handler do MSW a responder 500. */
  simulateError?: boolean;
}

export interface CheckoutResponse {
  orderId: string;
  status: "confirmed";
  /** Total autoritativo, recalculado pelo servidor a partir do catálogo. */
  totalAmount: number;
}
