import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-1">
        {backHref && (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="-ml-3 grid h-11 w-11 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-200/60 motion-reduce:transition-none"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>
        )}
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </header>
  );
}
