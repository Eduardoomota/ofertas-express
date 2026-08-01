export function cartLabel(totalItems: number): string {
  return `Carrinho, ${totalItems} ${totalItems === 1 ? "item" : "itens"}`;
}
