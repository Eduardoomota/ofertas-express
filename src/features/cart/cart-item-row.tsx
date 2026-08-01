"use client";

import { useEffect, useRef, useState } from "react";
import { FileIcon, TrashIcon } from "@/components/icons";
import type { Offer } from "@/lib/api-types";
import { formatBRL } from "@/lib/format";

interface CartItemRowProps {
  item: Offer;
  onRemove: (id: Offer["id"]) => void;
}

function allowsMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const EXIT_FALLBACK_MS = 250;

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const fallbackRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(fallbackRef.current), []);

  const handleRemove = () => {
    if (isLeaving) return;
    if (!allowsMotion()) {
      onRemove(item.id);
      return;
    }
    setIsLeaving(true);
    fallbackRef.current = window.setTimeout(
      () => onRemove(item.id),
      EXIT_FALLBACK_MS,
    );
  };

  return (
    <li
      onAnimationEnd={(event) => {
        if (isLeaving && event.animationName === "cart-out") {
          window.clearTimeout(fallbackRef.current);
          onRemove(item.id);
        }
      }}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
        isLeaving ? "animate-cart-out" : "motion-safe:animate-cart-in"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint/60 text-primary"
      >
        <FileIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">{item.title}</p>
        <p className="text-xs text-slate-500">Oferta</p>
        <p className="text-sm font-bold text-primary">
          {formatBRL(item.offerAmount)}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Remover ${item.title} do carrinho`}
        onClick={handleRemove}
        disabled={isLeaving}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 motion-reduce:transition-none"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </li>
  );
}
