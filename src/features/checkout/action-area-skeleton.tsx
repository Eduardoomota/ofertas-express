export function ActionAreaSkeleton() {
  return (
    <div className="mt-6">
      <p role="status" className="sr-only">
        Carregando opções de pagamento…
      </p>
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 motion-safe:animate-pulse"
      >
        <div className="h-[72px] rounded-xl bg-slate-200/80" />
        <div className="h-[72px] rounded-xl bg-slate-200/80" />
        <div className="mt-3 h-11 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
