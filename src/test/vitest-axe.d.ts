/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any --
   Augmentação de módulo: a assinatura das interfaces precisa ser idêntica à
   original do Vitest (incluindo o type parameter `T = any`) para o merge. */
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  export interface Assertion<T = any> extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
