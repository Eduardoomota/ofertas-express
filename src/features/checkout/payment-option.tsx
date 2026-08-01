import type { ComponentType, SVGProps } from "react";
import type { PaymentMethod } from "@/lib/api-types";

interface PaymentOptionProps {
  value: PaymentMethod;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  checked: boolean;
  onChange: () => void;
}

export function PaymentOption({
  value,
  title,
  description,
  icon: Icon,
  checked,
  onChange,
}: PaymentOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-tint/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary motion-reduce:transition-none">
      <input
        type="radio"
        name="payment-method"
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint/60 text-primary"
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300 peer-checked:border-[6px] peer-checked:border-primary"
      />
    </label>
  );
}
