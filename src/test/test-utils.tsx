import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useMemo, useState, type ReactElement } from "react";
import { AppShell } from "@/components/app-shell";
import { CartView } from "@/features/cart/cart-view";
import { CheckoutView } from "@/features/checkout/checkout-view";
import { OffersList } from "@/features/offers/offers-list";

function screenFor(route: string): ReactElement {
  if (route.startsWith("/carrinho")) return <CartView />;
  if (route.startsWith("/checkout")) return <CheckoutView />;
  return <OffersList />;
}

/**
 * Harness de navegação: fornece um App Router fake em que push/replace
 * trocam a tela renderizada, permitindo testar fluxos entre páginas
 * clicando nos links reais da UI.
 */
function TestApp({ initialRoute }: { initialRoute: string }) {
  const [route, setRoute] = useState(initialRoute);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      }),
  );

  const router = useMemo<AppRouterInstance>(
    () => ({
      push: (href: string) => setRoute(href),
      replace: (href: string) => setRoute(href),
      back: () => {},
      forward: () => {},
      refresh: () => {},
      prefetch: () => {},
    }),
    [],
  );

  return (
    <AppRouterContext.Provider value={router}>
      <PathnameContext.Provider value={route}>
        <QueryClientProvider client={queryClient}>
          <AppShell>{screenFor(route)}</AppShell>
        </QueryClientProvider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  );
}

export function renderApp(initialRoute = "/") {
  return render(<TestApp initialRoute={initialRoute} />);
}
