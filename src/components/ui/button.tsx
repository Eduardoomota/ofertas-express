import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "outline";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors motion-reduce:transition-none disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark disabled:bg-primary/60",
  outline:
    "border border-primary bg-white text-primary hover:bg-primary-tint/40 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 aria-disabled:border-slate-200 aria-disabled:bg-slate-50 aria-disabled:text-slate-500 aria-disabled:hover:bg-slate-50",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      isLoading = false,
      disabled,
      children,
      className = "",
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={buttonClasses(variant, className)}
        {...rest}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  },
);
