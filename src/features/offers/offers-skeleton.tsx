export function OffersSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Carregando ofertas…
      </p>
      <div aria-hidden="true" className="flex flex-col gap-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm motion-safe:animate-pulse"
          >
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-8 rounded bg-slate-100" />
              <div className="h-8 rounded bg-slate-100" />
            </div>
            <div className="mt-4 h-11 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
