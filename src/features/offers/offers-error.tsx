import { Button } from "@/components/ui/button";

interface OffersErrorProps {
  onRetry: () => void;
  retrying: boolean;
}

export function OffersError({ onRetry, retrying }: OffersErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <h2 className="font-bold text-red-800">
        Não foi possível carregar as ofertas
      </h2>
      <p className="mt-1 text-sm text-red-700">
        Verifique sua conexão e tente novamente.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        isLoading={retrying}
        onClick={onRetry}
      >
        Tentar novamente
      </Button>
    </div>
  );
}
