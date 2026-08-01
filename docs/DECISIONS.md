# Decisões técnicas — aprofundamento

Complemento do [README](../README.md): o **porquê** de cada decisão, os detalhes de implementação não óbvios e os trade-offs assumidos.

## 1. Divisão de estado

- **Server state (React Query):** ofertas, feature flag e o POST do checkout têm o servidor como fonte de verdade. O que precisam — cache com `staleTime`, deduplicação, estados de loading/erro, retry configurável, `isPending` de mutation — é o que React Query dá pronto e seria reimplementado mal com `useEffect + useState`.
- **Client state global (Zustand):** o carrinho é síncrono e mutável pelo usuário, sem refetch/invalidation. Context puro re-renderizaria a árvore toda a cada item; a store expõe **selectors granulares** (`useTotalItems`, `useIsInCart(id)`, `useTotalAmount`) e cada componente assina só a fatia que consome — o card do item X não re-renderiza quando o item Y entra.
- **Estado local (`useState`):** o que não interessa a mais ninguém fica no componente — forma de pagamento, checkbox de simular erro, estado "leaving" da animação.

## 2. Camada de dados e contrato

`lib/api-types.ts` é o único lugar que descreve o contrato (Offer, FeatureFlags, CheckoutPayload/Response) — handlers do MSW, fetchers, componentes e testes importam daqui; mudou o contrato, o TypeScript aponta os pontos de quebra. O `request<T>()` em `lib/api.ts` lança `ApiError` tipado com status e constrói URL absoluta sobre `window.location.origin` (o fetch do Node, usado nos testes, rejeita URL relativa).

## 3. Fallback seguro da feature flag (em camadas)

1. **`retry: false`** — flag de UI não merece retry agressivo; ou responde rápido ou assume o default.
2. **Normalização defensiva** (`normalizeFeatureFlags`): qualquer payload que não seja literalmente `{ checkoutV2: boolean }` — 200 corrompido, campo faltando, tipo errado — normaliza para `{ checkoutV2: false }`. "Falhar" não é só HTTP 500.
3. **Default no consumo:** `data?.checkoutV2 ?? false` — erro de rede/500 deixa `data` undefined e resolve OFF. Silencioso de propósito: o usuário não tem ação possível sobre "serviço de flag fora do ar".
4. **Skeleton na área de ação enquanto carrega** — sem ele, a tela renderizaria "Confirmar" e ~300ms depois trocaria o rótulo e empurraria a seção Pix/boleto (layout shift). Os cards de resumo não são skeletonizados porque não dependem da flag.

Reprodução: `NEXT_PUBLIC_CHECKOUT_V2=error` em dev, ou o teste que completa o checkout curto com o handler da flag respondendo 500.

## 4. Checkout: mutation, erro e sucesso

- O carrinho é limpo **no `onSuccess` da mutation — nunca no erro**: o requisito "não limpar em erro" vale por construção.
- **Erro 500:** `role="alert"` + foco movido programaticamente para o alerta (`tabIndex={-1}` + `focus()`); estado preservado, retry habilitado.
- **Sucesso:** `<dialog>` nativo com `showModal()` — focus trap, `Esc` e `aria-modal` de graça. Renderizado condicionalmente para simplificar o ciclo de vida e evitar falso-positivo em teste (dialog fechado no jsdom é "visível" para queries).
- **Payload leva só IDs** (`{ itemIds, paymentMethod }`); o servidor resolve os itens no catálogo e devolve `totalAmount` recalculado. Após o sucesso, a contagem vem de `mutation.variables.itemIds` e o total exibido é o **autoritativo do response** — o carrinho já foi limpo e mostraria zeros.

## 5. Persistência do carrinho

```ts
persist(creator, {
  name: "ofertas-express-cart",
  version: 1,
  partialize: (s) => ({ items: s.items }),
  migrate: () => ({ items: [] }),
  skipHydration: true,
});
```

- **`skipHydration` + reidratação pós-mount** (`useRehydrateCart`, consumido pelo AppShell): sem isso, o persist reidrata na criação da store, o primeiro render do cliente vem com itens e o HTML do servidor veio vazio → hydration mismatch. Com isso, servidor e cliente renderizam iguais e o badge atualiza um frame depois.
- **`version` + `migrate`** desde o dia 1: storage de formato desconhecido é descartado (perder um carrinho é barato; crashar não é).
- **`partialize`** mantém o `announcement` do aria-live fora do storage — persistir "X removido" e re-anunciar no próximo pageload seria um bug de a11y.
- **`merge` sanitiza toda reidratação** (`normalizeCartItems`): o localStorage é input externo tanto quanto uma API — item adulterado/corrompido (preço não numérico, sem `id`) é descartado; os válidos sobrevivem. `migrate` não basta: só roda em mismatch de versão.
- Fora de escopo consciente: sync multi-tab via evento `storage`.

## 6. MSW

`mocks/handlers.ts` é compartilhado entre `setupWorker` (dev) e `setupServer` (testes) — o mock do navegador é o mesmo dos testes. Cenários controláveis: flag via `NEXT_PUBLIC_CHECKOUT_V2` (`true`/`false`/`error`), erro do checkout via `simulateError` no payload (checkbox só em dev) e `server.use()` por teste. Detalhe de dev: o StrictMode monta efeitos duas vezes e o segundo `worker.start()` estoura invariant — resolvido com singleton de promise em escopo de módulo; o provider segura o render até o worker ativar para nenhuma query escapar do mock.

## 7. Acessibilidade: plataforma antes de ARIA

| Necessidade            | Solução                                                                                   | O que veio de graça                 |
| ---------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| Radio group Pix/boleto | radios nativos (sr-only) em `fieldset/legend`, estilo via `has-[:checked]`/`peer-checked` | setas do teclado, semântica, estado |
| Modal de sucesso       | `<dialog>` + `showModal()`                                                                | focus trap, `Esc`, `aria-modal`     |
| Feedback do carrinho   | região `aria-live="polite"` alimentada pela store                                         | anúncio sem roubar foco             |
| Botão "Adicionado"     | `aria-disabled` + guarda no onClick                                                       | continua focável e anunciável       |

Mais: um `h1` por página (na home é `sr-only`); skip link; `focus-visible` global; alvos ≥ 44px; nomes com contexto ("Remover Negocie agora do carrinho", "Carrinho, 2 itens" — o sufixo `sr-only` nos botões de adicionar mantém a regra label-in-name); itens decorativos da sidebar são `<span>` não interativos; `prefers-reduced-motion` global e por utilitário (`motion-safe:`). Ícones do lucide-react importados diretamente nos componentes (tree-shaking por ícone, sem camada de indireção), com `aria-hidden="true"` aplicado em cada uso decorativo — os testes de axe cobrem a regressão. Pix é custom (`features/checkout/pix-icon.tsx`): marca do Banco Central, não existe em libs genéricas.

## 8. Animações do carrinho

Keyframes CSS puros (entrar/sair ~180ms) — framer-motion seria custo de bundle sem retorno. A saída exige o item no DOM após a remoção lógica: estado local `isLeaving` aplica a classe de saída e a remoção real acontece no `onAnimationEnd` (filtrando `animationName`) com fallback de `setTimeout` (animationend não é garantido). **Guarda de race:** durante a saída o botão fica `disabled` e cliques repetidos são ignorados. Reduced motion (ou ausência de `matchMedia`, caso do jsdom) remove imediatamente.

## 9. Estratégia de testes

Comportamento, não implementação: queries por role/label, `userEvent`. O harness de navegação provê os **contextos reais do App Router** (`AppRouterContext`/`PathnameContext`) com um router fake cujo `push` troca a view — os testes clicam nos `<Link>` reais da UI. Acoplado a caminhos internos do Next (custo aceito e documentado) em troca de fidelidade que `vi.mock` não dá.

- **Fluxo feliz** completo até o dialog de sucesso e carrinho limpo.
- **Flag:** ON mostra Pix/boleto (Pix pré-checado); handler respondendo 500 → o fluxo curto **funciona até o sucesso** (asserção comportamental do fallback).
- **Checkout 500:** alerta com foco (`toHaveFocus`), usuário na tela, carrinho preservado.
- **Hidratação:** adiciona via UI → desmonta → zera a store em memória (proxy de pageload; jsdom não recarrega módulos) com snapshot/restore do localStorage (o `setState` também passa pelo persist) → re-renderiza → o item volta.
- **axe nas três telas**, com honestidade sobre o alcance: no jsdom o axe não computa CSS/contraste (`color-contrast` off; contraste do teal ≈ 5.9:1 validado à mão) — smoke test complementar, não auditoria.

## 10. Trade-offs assumidos

| Decisão                            | Alternativa rejeitada        | Por quê                                                               |
| ---------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| Pix pré-selecionado                | Botão travado até escolher   | Menos passos; botão desabilitado sem explicação é anti-padrão de a11y |
| Erro da flag silencioso            | Toast/banner                 | Usuário não tem ação possível; aviso é ruído                          |
| Dialog nativo                      | Radix/Headless UI            | Dependência a menos; o nativo cobre o caso                            |
| Harness com contextos do Next      | `vi.mock("next/navigation")` | Navegação real nos testes                                             |
| `migrate` descarta carrinho antigo | Migração de schema           | Carrinho é estado barato; migração não se paga                        |
| Itens decorativos não interativos  | Links `href="#"`             | Link morto engana teclado e leitor de tela                            |
| Carrinho client-side               | "Carrinho no MSW"            | MSW roda no mesmo realm do cliente — não é fronteira de segurança     |

## 11. Fronteira de confiança (carrinho × localStorage × MSW)

Por que o carrinho vive no cliente e isso não é vulnerabilidade de dados:

- **Confidencialidade:** o storage guarda só a seleção de itens do **catálogo público** (os mesmos que `GET /api/offers` entrega a qualquer um) — zero PII, token ou segredo. Carrinho de convidado em storage local é o padrão da indústria na ausência de login (que o desafio exclui).
- **MSW não é servidor.** É um service worker no mesmo navegador, mesmo processo e mesmo realm JS do usuário — um "carrinho no MSW" seria igualmente manipulável pelo DevTools, com persistência pior (memória de módulo morre no reload). Movê-lo para lá seria teatro de segurança.
- **A ameaça real é de integridade, e a defesa fica onde deve:** todo dado do cliente é controlável pelo usuário. Por isso (a) a reidratação **valida o shape** do storage (`normalizeCartItems` — seção 5) e (b) o checkout envia **só IDs** e o servidor recalcula preços do catálogo, ignorando qualquer valor do cliente (anti price-tampering — seção 4). Dois testes cobrem exatamente esses cenários: storage adulterado degradando sem crash, e preço adulterado sendo substituído pelo total autoritativo do servidor no acordo confirmado.
