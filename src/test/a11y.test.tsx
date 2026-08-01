import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { useCartStore } from "@/features/cart/cart-store";
import type { FeatureFlags } from "@/lib/api-types";
import { offersFixture } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { renderApp } from "./test-utils";

const AXE_OPTIONS = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

describe("acessibilidade (axe)", () => {
  it("lista de ofertas não tem violações", async () => {
    const { container } = renderApp("/");
    await screen.findByRole("heading", { name: "Negocie agora" });

    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("carrinho com itens não tem violações", async () => {
    useCartStore.setState({ items: offersFixture.slice(0, 2) });
    const { container } = renderApp("/cart");
    await screen.findByRole("heading", { name: "Seu carrinho" });

    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("checkout com a flag ligada não tem violações", async () => {
    server.use(
      http.get("/api/feature-flags", () =>
        HttpResponse.json<FeatureFlags>({ checkoutV2: true }),
      ),
    );
    useCartStore.setState({ items: offersFixture.slice(0, 2) });
    const { container } = renderApp("/checkout");
    await screen.findByRole("group", { name: "Forma de pagamento" });

    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });
});
