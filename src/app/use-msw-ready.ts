import { useEffect, useState } from "react";

let mswStart: Promise<unknown> | null = null;

function startMsw(): Promise<unknown> {
  mswStart ??= import("@/mocks/browser").then(({ worker }) =>
    worker.start({ onUnhandledRequest: "bypass" }),
  );
  return mswStart;
}

export function useMswReady(): boolean {
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
