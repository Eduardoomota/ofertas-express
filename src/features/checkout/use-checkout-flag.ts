import { useQuery } from "@tanstack/react-query";
import { getFeatureFlags } from "@/lib/api";

export function useCheckoutFlag(): { checkoutV2: boolean; isLoading: boolean } {
  const { data, isPending } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: getFeatureFlags,
    retry: false,
    staleTime: 5 * 60_000,
  });

  return { checkoutV2: data?.checkoutV2 ?? false, isLoading: isPending };
}
