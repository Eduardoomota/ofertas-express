"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

// Promise única no módulo: o StrictMode monta os efeitos duas vezes em dev
// e o MSW não aceita um segundo worker.start().
let mswStart: Promise<unknown> | null = null;

function startMsw(): Promise<unknown> {
  mswStart ??= import("@/mocks/browser").then(({ worker }) =>
    worker.start({ onUnhandledRequest: "bypass" }),
  );
  return mswStart;
}

/**
 * Em desenvolvimento, segura a renderização até o service worker do MSW
 * estar ativo — evita que as primeiras queries escapem do mock.
 */
function useMswReady(): boolean {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (ready) return;
    let active = true;

    startMsw().then(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
    };
  }, [ready]);

  return ready;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  const mswReady = useMswReady();

  if (!mswReady) return null;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
