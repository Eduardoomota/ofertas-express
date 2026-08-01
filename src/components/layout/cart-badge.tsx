export function CartBadge({ totalItems }: { totalItems: number }) {
  if (totalItems === 0) return null;
  return (
    <span
      aria-hidden="true"
      className="grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-white"
    >
      {totalItems}
    </span>
  );
}
