import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "@/lib/api";

/**
 * Fallback seguro: sem retry agressivo e, em qualquer falha (rede, 500,
 * payload inválido), o checkout segue silenciosamente com a flag desligada.
 * Enquanto a flag carrega também tratamos como OFF para não piscar o fluxo V2.
 */
export function useCheckoutFlag(): { checkoutV2: boolean; isLoading: boolean } {
  const { data, isPending } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: getFeatureFlags,
    retry: false,
    staleTime: 5 * 60_000,
  });

  // isPending vira false também no erro (retry off), liberando o fluxo curto.
  return { checkoutV2: data?.checkoutV2 ?? false, isLoading: isPending };
}
