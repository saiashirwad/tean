export abstract class hkt {
  readonly arg?: unknown
  fn!: (...x: never[]) => unknown
}

export type assume<T, U> = T extends U ? T : U
export type apply<F extends hkt, arg> = ReturnType<
  (F & { readonly arg: arg })["fn"]
>

export type reverse<T extends unknown[]> =
  T extends [] ? []
  : T extends [infer U, ...infer Rest] ? [...reverse<Rest>, U]
  : never

export type reduce<HKTs extends hkt[], X> =
  HKTs extends [] ? X
  : HKTs extends [infer Head, ...infer Tail] ?
    apply<assume<Head, hkt>, reduce<assume<Tail, hkt[]>, X>>
  : never

export interface compose<HKTs extends hkt[]> extends hkt {
  fn: (x: this["arg"]) => reduce<HKTs, this["arg"]>
}

interface doubleString extends hkt {
  fn: (x: assume<this["arg"], string>) => `${typeof x}${typeof x}`
}

interface append<S extends string> extends hkt {
  fn: (x: assume<this["arg"], string>) => `${typeof x}${S}`
}

type sd = apply<doubleString, "hi"> // "hihi"
