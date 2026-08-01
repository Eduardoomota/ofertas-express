import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { Brand } from "./brand";
import { CartBadge } from "./cart-badge";
import { cartLabel } from "./cart-label";

export function MobileHeader({ totalItems }: { totalItems: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white lg:hidden">
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-4 py-3">
        <Brand />
        <Link
          href="/cart"
          aria-label={cartLabel(totalItems)}
          className="relative grid h-11 w-11 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 motion-reduce:transition-none"
        >
          <CartIcon className="h-6 w-6" />
          <span className="absolute right-0.5 top-0.5">
            <CartBadge totalItems={totalItems} />
          </span>
        </Link>
      </div>
    </header>
  );
}
