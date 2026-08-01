import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";
import { useCartStore } from "@/features/cart/cart-store";
import { server } from "@/mocks/server";

expect.extend(axeMatchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
  useCartStore.setState({ items: [], announcement: "" });
  window.localStorage.clear();
});

afterAll(() => server.close());
