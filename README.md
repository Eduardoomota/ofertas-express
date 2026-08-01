# Ofertas Express

App de renegociação de dívidas: lista de ofertas, carrinho e checkout com fluxo controlado por feature flag (`checkoutV2`). Construído com **Next.js 14 (App Router) + React 18 + TypeScript (strict)**, **React Query v5**, **Zustand** e **MSW v2** (API simulada em dev e nos testes).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000 (MSW intercepta as chamadas de API)
npm test           # Vitest + Testing Library + MSW (4 testes de comportamento + 3 de a11y)
npm run lint       # ESLint
npm run build      # build de produção (inclui type-check)
```

> Requer Node 18.17+.

### Alternando a feature flag em dev

A flag é lida pelo handler do MSW a partir de `NEXT_PUBLIC_CHECKOUT_V2` (crie um `.env.local` a partir de `.env.example` e reinicie o dev server):

| Valor   | Comportamento                                                       |
| ------- | ------------------------------------------------------------------- |
| `true`  | Checkout V2: escolha de pagamento (Pix/boleto)                      |
| `false` | Fluxo curto (padrão quando a variável não existe)                   |
| `error` | API da flag responde 500 → app cai no fluxo curto (fallback seguro) |

O rodapé do checkout exibe `checkoutV2 = true/false` para conferência. Para demonstrar o erro 500 do checkout em dev, marque **"Simular falha da API"** na própria tela (o MSW responde 500).

## Decisões técnicas

- **Zustand no carrinho** — o carrinho é estado global _do cliente_: síncrono, sem cache, refetch ou invalidação. React Query aqui seria a ferramenta errada (é para server state). A store expõe actions (`addItem`, `removeItem`, `clear`) e selectors derivados (`useTotalItems`, `useTotalAmount`, `useIsInCart`), então cada componente re-renderiza só quando a fatia que assina muda.
- **Carrinho persistido** — `zustand/middleware` persist no localStorage (chave `ofertas-express-cart`, `version: 1` com `migrate` que descarta estado de versão desconhecida). `skipHydration: true` + reidratação pós-mount (`useRehydrateCart`) evitam mismatch de hidratação com o SSR, que renderiza o carrinho vazio. Sincronização multi-tab (evento `storage`) ficou fora de escopo. Para limpar: `localStorage.removeItem("ofertas-express-cart")`.
- **React Query nas ofertas, flag e checkout** — são dados de servidor: ganho imediato de cache (`staleTime`), estados de loading/erro prontos, retry configurável e `useMutation` com `isPending`/`isError` para o POST do checkout.
- **App Router** — modelo atual do Next.js; páginas são Server Components finos que delegam para componentes de feature (`"use client"`), mantendo a interatividade isolada.
- **Fallback seguro da flag** — `retry: false` (sem retry agressivo numa API de flag), normalização defensiva do payload (`checkoutV2` precisa ser `boolean`, senão vira `false`) e, em qualquer erro, o hook resolve `{ checkoutV2: false }` silenciosamente. Enquanto a flag carrega o fluxo também é tratado como OFF, evitando "piscar" o V2.
- **Pix pré-selecionado** — menos passos até confirmar e espelha o mockup; o botão nunca fica bloqueado por falta de seleção, e boleto está a um clique (ou uma seta) de distância.
- **Tailwind CSS** — velocidade para reproduzir o mockup (tokens de cor teal no `tailwind.config.ts`) e responsividade declarativa (`lg:` para a sidebar desktop); variantes `has-[:checked]`/`peer-checked` estilizam os radios nativos sem JavaScript extra.
- **Ícones com lucide-react** — mesmo estilo de traço do mockup (stroke 2px, cantos arredondados), tree-shakeable e com `optimizePackageImports` nativo no Next 14. Todos passam por uma camada em `components/icons.tsx` que aplica `aria-hidden` por padrão (são decorativos). Exceção: o ícone do Pix é custom, porque é marca do Banco Central e não existe em bibliotecas genéricas.
- **Acessibilidade** — HTML semântico (um `h1` por página, listas reais, `button`/`link` de verdade), radios nativos em `fieldset/legend` (setas do teclado grátis), `<dialog>` nativo no sucesso (focus trap + `Esc`), erro do checkout em `role="alert"` com foco movido para ele, badge do carrinho anunciado em região `aria-live="polite"`, `focus-visible` visível em tudo, alvos de toque ≥ 44px e `prefers-reduced-motion` respeitado. Itens decorativos do mockup (Histórico, Perfil, Sair) são texto não interativo — não enganam teclado nem leitor de tela.
- **Testes de comportamento** — um harness de navegação fake (contextos do App Router) permite testar o fluxo real clicando nos links da UI, com MSW respondendo às chamadas: (1) fluxo feliz completo, (2) flag ON mostra Pix/boleto e flag com erro cai no fluxo curto, (3) checkout 500 mostra alerta acessível e preserva o carrinho, (4) carrinho persiste entre visitas via localStorage.
- **Testes de acessibilidade (vitest-axe)** — smoke tests com axe nas três telas (lista, carrinho com itens, checkout com flag ON). Importante ser honesto sobre o alcance: o axe no jsdom não computa CSS real nem contraste (regra `color-contrast` desabilitada; o contraste do tema foi validado à mão) — é cobertura complementar, não substituta de auditoria manual/E2E.
- **Micro-animações no carrinho** — entrada/saída dos itens com keyframes CSS (Tailwind), sem biblioteca de animação: `motion-safe:` garante que quem usa `prefers-reduced-motion` tem remoção imediata, e durante a animação de saída o botão de remover fica desabilitado para evitar clique duplo.
- **Skeleton na área de ação do checkout** — enquanto a flag carrega, a região do botão/pagamento vira skeleton em vez de renderizar o fluxo curto e trocar depois: o rótulo do botão não muda debaixo do cursor e a seção Pix/boleto não "pula" na tela.

## Estrutura

```
src/
  app/                 # rotas (/, /carrinho, /checkout) + providers
  components/          # AppShell (header mobile/sidebar desktop), UI básica, ícones
  features/
    offers/            # lista, card, skeleton, useOffers
    cart/              # store Zustand + página do carrinho
    checkout/          # resumo, pagamento, sucesso, useCheckoutFlag, useCheckout
  lib/                 # contrato da API (types), fetchers, formatação BRL
  mocks/               # handlers MSW compartilhados (browser em dev, node nos testes)
  test/                # setup, harness de navegação e testes
```

## O que eu faria com mais tempo

- E2E com Playwright em navegador real (cobrindo contraste e navegação por teclado de verdade).
- Sincronização do carrinho entre abas (evento `storage`).
- Quantidade por item no carrinho e um histórico real de acordos.
