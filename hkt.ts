export abstract class HKT {
  readonly arg?: unknown
  fn!: (...x: never[]) => unknown
}
export type Assume<T, U> = T extends U ? T : U
export type Apply<F extends HKT, arg> = ReturnType<
  (F & { readonly arg: arg })["fn"]
>

export type Compose<HKTs extends HKT[], X> =
  HKTs extends [] ? X
  : HKTs extends [infer Head, ...infer Tail] ?
    Apply<Assume<Head, HKT>, Compose<Assume<Tail, HKT[]>, X>>
  : never

export type Reverse<T extends unknown[]> =
  T extends [] ? []
  : T extends [infer U, ...infer Rest] ? [...Reverse<Rest>, U]
  : never

export interface Flow<HKTs extends HKT[]> extends HKT {
  fn: (x: this["arg"]) => Compose<Reverse<HKTs>, this["arg"]>
}
