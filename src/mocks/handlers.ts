import { delay, http, HttpResponse } from "msw";
import type {
  CheckoutPayload,
  CheckoutResponse,
  FeatureFlags,
  Offer,
} from "@/lib/api-types";

export const offersFixture: Offer[] = [
  {
    id: "negocie-agora",
    title: "Negocie agora",
    debtAmount: 2450,
    offerAmount: 980,
    discountPercentage: 60,
  },
  {
    id: "acordo-rapido",
    title: "Acordo rápido",
    debtAmount: 1200,
    offerAmount: 720,
  },
  {
    id: "parcelado-leve",
    title: "Parcelado leve",
    debtAmount: 3100,
    offerAmount: 1550,
  },
];

const isDev = process.env.NODE_ENV === "development";

// Em dev, a flag é controlada por NEXT_PUBLIC_CHECKOUT_V2 (.env.local):
// "true" liga o checkout V2, "error" simula a API da flag fora do ar.
const flagEnv = process.env.NEXT_PUBLIC_CHECKOUT_V2;

export const handlers = [
  http.get("/api/offers", async () => {
    if (isDev) await delay(600);
    return HttpResponse.json(offersFixture);
  }),

  http.get("/api/feature-flags", async () => {
    if (isDev) await delay(300);
    if (flagEnv === "error") {
      return HttpResponse.json(
        { message: "flag service down" },
        { status: 500 },
      );
    }
    return HttpResponse.json<FeatureFlags>({ checkoutV2: flagEnv === "true" });
  }),

  http.post("/api/checkout", async ({ request }) => {
    if (isDev) await delay(800);
    const payload = (await request.json()) as CheckoutPayload;

    if (payload.simulateError) {
      return HttpResponse.json({ message: "internal error" }, { status: 500 });
    }

    return HttpResponse.json<CheckoutResponse>({
      orderId: `ACD-${payload.items.length}-${payload.totalAmount}`,
      status: "confirmed",
    });
  }),
];
