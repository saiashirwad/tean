export abstract class HKT {
  readonly arg?: unknown
  fn!: (...x: never[]) => unknown
}

export type assume<t, u> = t extends u ? t : u
export type apply<f extends HKT, arg> = ReturnType<
  (f & { readonly arg: arg })["fn"]
>

export type reverse<t extends unknown[]> =
  t extends [] ? []
  : t extends [infer u, ...infer rest] ? [...reverse<rest>, u]
  : never

export type reduce<hkts extends HKT[], x> =
  hkts extends [] ? x
  : hkts extends [infer head, ...infer tail] ?
    apply<assume<head, HKT>, reduce<assume<tail, HKT[]>, x>>
  : never

export interface compose<hkts extends HKT[]> extends HKT {
  fn: (x: this["arg"]) => reduce<hkts, this["arg"]>
}

interface doubleString extends HKT {
  fn: (x: assume<this["arg"], string>) => `${typeof x}${typeof x}`
}

interface append<str extends string> extends HKT {
  fn: (x: assume<this["arg"], string>) => `${typeof x}${str}`
}

type sd = apply<doubleString, "hi">
