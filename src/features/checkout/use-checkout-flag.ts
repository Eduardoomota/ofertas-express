import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "@/lib/api";

/**
 * Fallback seguro: sem retry agressivo e, em qualquer falha (rede, 500,
 * payload inválido), o checkout segue silenciosamente com a flag desligada.
 * Enquanto a flag carrega também tratamos como OFF para não piscar o fluxo V2.
 */
export function useCheckoutFlag(): { checkoutV2: boolean } {
  const { data } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: getFeatureFlags,
    retry: false,
    staleTime: 5 * 60_000,
  });

  return { checkoutV2: data?.checkoutV2 ?? false };
}
