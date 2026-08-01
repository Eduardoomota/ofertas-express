import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, useCartStore } from "@/features/cart/cart-store";
import type { FeatureFlags } from "@/lib/api-types";
import { offersFixture } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { renderApp } from "./test-utils";

function seedCart(count: number) {
  useCartStore.setState({ items: offersFixture.slice(0, count) });
}

describe("Ofertas Express", () => {
  it("fluxo feliz: adiciona ofertas, vai ao checkout e confirma com sucesso", async () => {
    const user = userEvent.setup();
    renderApp("/");

    expect(
      await screen.findByRole("heading", { name: "Negocie agora" }),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 980,00")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Adicionar ao carrinho — Negocie agora",
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Adicionar ao carrinho — Acordo rápido",
      }),
    );
    expect(
      screen.getAllByRole("link", { name: "Carrinho, 2 itens" }).length,
    ).toBeGreaterThan(0);

    const [cartLink] = screen.getAllByRole("link", {
      name: "Carrinho, 2 itens",
    });
    await user.click(cartLink);
    expect(
      await screen.findByRole("heading", { name: "Seu carrinho" }),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 1.700,00")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Ir para o checkout" }));
    expect(
      await screen.findByRole("heading", { name: "Confirmar acordo" }),
    ).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    expect(
      await screen.findByRole("heading", { name: "Acordo confirmado!" }),
    ).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("feature flag: mostra Pix/boleto com a flag ligada e cai no fluxo curto quando a API da flag falha", async () => {
    server.use(
      http.get("/api/feature-flags", () =>
        HttpResponse.json<FeatureFlags>({ checkoutV2: true }),
      ),
    );
    seedCart(1);
    const { unmount } = renderApp("/checkout");

    expect(
      await screen.findByRole("group", { name: "Forma de pagamento" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /pix/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /boleto/i })).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "Confirmar pagamento" }),
    ).toBeInTheDocument();

    unmount();

    server.use(
      http.get("/api/feature-flags", () =>
        HttpResponse.json({ message: "down" }, { status: 500 }),
      ),
    );
    seedCart(1);
    renderApp("/checkout");
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));
    expect(
      await screen.findByRole("heading", { name: "Acordo confirmado!" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Forma de pagamento" }),
    ).not.toBeInTheDocument();
  });

  it("erro no checkout: API 500 exibe alerta acessível e preserva o carrinho", async () => {
    server.use(
      http.post("/api/checkout", () =>
        HttpResponse.json({ message: "internal error" }, { status: 500 }),
      ),
    );
    seedCart(2);
    const user = userEvent.setup();
    renderApp("/checkout");

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Não foi possível concluir o acordo");
    await waitFor(() => expect(alert).toHaveFocus());

    expect(
      screen.getByRole("heading", { name: "Confirmar acordo" }),
    ).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeEnabled();
  });

  it("persiste o carrinho entre visitas (hidratação do localStorage)", async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp("/");

    await user.click(
      await screen.findByRole("button", {
        name: "Adicionar ao carrinho — Negocie agora",
      }),
    );
    unmount();

    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    useCartStore.setState({ items: [] });
    if (stored) window.localStorage.setItem(CART_STORAGE_KEY, stored);

    renderApp("/carrinho");

    expect(await screen.findByText("Negocie agora")).toBeInTheDocument();
    expect(screen.getAllByText("R$ 980,00")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Remover Negocie agora do carrinho" }),
    ).toBeInTheDocument();
  });

  it("descarta itens inválidos do storage na reidratação (storage adulterado)", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        state: {
          items: [
            offersFixture[1],
            { ...offersFixture[0], offerAmount: "abc" },
            { title: "sem id", debtAmount: 10, offerAmount: 5 },
          ],
        },
        version: 1,
      }),
    );

    renderApp("/carrinho");

    expect(await screen.findByText("Acordo rápido")).toBeInTheDocument();
    expect(screen.queryByText("Negocie agora")).not.toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("ignora preço adulterado no cliente: o total confirmado vem do catálogo do servidor", async () => {
    useCartStore.setState({
      items: [{ ...offersFixture[0], offerAmount: 1 }],
    });
    const user = userEvent.setup();
    renderApp("/checkout");

    expect(await screen.findByText("R$ 1,00")).toBeInTheDocument();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));
    await screen.findByRole("heading", { name: "Acordo confirmado!" });

    expect(screen.getByText("R$ 980,00")).toBeInTheDocument();
    expect(screen.queryByText("R$ 1,00")).not.toBeInTheDocument();
  });
});
