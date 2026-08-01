import type { ComponentType, SVGProps } from "react";

interface SummaryRowProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

export function SummaryRow({ icon: Icon, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint/60 text-primary"
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-sm text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
