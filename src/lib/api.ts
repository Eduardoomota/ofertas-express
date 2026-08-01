import type {
  CheckoutPayload,
  CheckoutResponse,
  FeatureFlags,
  Offer,
} from "./api-types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const response = await fetch(new URL(path, base), init);

  if (!response.ok) {
    throw new ApiError(response.status, `${path} respondeu ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getOffers(): Promise<Offer[]> {
  return request<Offer[]>("/api/offers");
}

export function normalizeFeatureFlags(data: unknown): FeatureFlags {
  if (typeof data === "object" && data !== null && "checkoutV2" in data) {
    const value = (data as Record<string, unknown>).checkoutV2;
    if (typeof value === "boolean") {
      return { checkoutV2: value };
    }
  }
  return { checkoutV2: false };
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const data = await request<unknown>("/api/feature-flags");
  return normalizeFeatureFlags(data);
}

export function postCheckout(
  payload: CheckoutPayload,
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
