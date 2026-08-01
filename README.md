# Ofertas Express

App de renegociação de dívidas: lista de ofertas, carrinho e checkout com fluxo controlado por feature flag (`checkoutV2`).

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript strict · React Query v5 · Zustand · MSW v2 · Tailwind · Vitest + Testing Library.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000 (MSW simula a API)
npm test           # 4 testes de comportamento + 3 de acessibilidade (axe)
npm run lint
npm run build
```

> Requer Node 18.17+.

### Feature flag em dev

Defina `NEXT_PUBLIC_CHECKOUT_V2` no `.env.local` (copie de `.env.example`) e reinicie o dev server:

| Valor   | Comportamento                                            |
| ------- | -------------------------------------------------------- |
| `true`  | Checkout V2: escolha de pagamento (Pix/boleto)           |
| `false` | Fluxo curto (padrão quando ausente)                      |
| `error` | API da flag responde 500 → cai no fluxo curto (fallback) |

Para ver o erro 500 do checkout, marque **"Simular falha da API"** na própria tela.

## Decisões (resumo)

- **Zustand no carrinho** — estado global _do cliente_: síncrono, sem cache/refetch. Selectors granulares evitam re-renders. **React Query nas ofertas, flag e checkout** — são _server state_: cache, loading/erro prontos, retry configurável e mutation com `isPending`.
- **Fallback seguro da flag** — `retry: false`, payload inválido normalizado para `false` e default OFF em qualquer erro: a tela nunca quebra, o fluxo antigo assume silenciosamente.
- **App Router** com páginas server finas delegando para features client; **Tailwind** para reproduzir o mockup com tokens teal; **MSW** com handlers únicos para dev (browser) e testes (node) — o checkout recebe só IDs e o "servidor" recalcula o total (anti price-tampering).
- **Acessibilidade nativa primeiro** — radios reais em `fieldset`, `<dialog>` no sucesso, `aria-live` no carrinho, erro com `role="alert"` + foco; validada com testes axe.
- **Carrinho persistido** — `zustand/persist` com `skipHydration` + reidratação pós-mount para não quebrar a hidratação SSR; o storage é validado ao reidratar (item fora do contrato é descartado).

## Estrutura

```
src/
  app/        # rotas (/, /cart, /checkout) + providers
  components/ # layout/ (AppShell, Sidebar…) e ui/ — 1 componente por arquivo; ícones via lucide-react
  features/   # offers/ · cart/ · checkout/ (componentes, hooks e store por domínio)
  lib/        # contrato da API, fetchers, formatação BRL
  mocks/      # handlers MSW compartilhados
  test/       # setup, harness de navegação e testes
```

## O que eu faria com mais tempo

- E2E com Playwright em navegador real (contraste e teclado de verdade).
- Sincronização do carrinho entre abas (evento `storage`).
- Quantidade por item e histórico real de acordos.
