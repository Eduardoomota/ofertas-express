import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/cart-store";
import { postCheckout } from "@/lib/api";

export function useCheckout() {
  const clear = useCartStore((state) => state.clear);

  return useMutation({
    mutationFn: postCheckout,
    onSuccess: () => clear(),
  });
}
