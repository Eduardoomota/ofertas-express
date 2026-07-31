import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/lib/api";

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    staleTime: 60_000,
  });
}
