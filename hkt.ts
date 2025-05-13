type GenericFunction = (...x: never[]) => unknown

export abstract class HKT {
  readonly arg?: unknown
  new!: GenericFunction
}

export type assume<t, u> = t extends u ? t : u

type instanceOf<T> = T extends new (...args: unknown[]) => infer R ? R : never

export type apply<f extends HKT, arg> = ReturnType<
  (f & { readonly arg: arg })["new"]
>

export declare function apply<h extends typeof HKT>(
  h: h
): <x>(
  x: InferredType | assume<x, InferredType> | [...assume<x, InferredTuple>]
) => apply<assume<instanceOf<h>, HKT>, x>

declare function build<const H extends typeof HKT>(
  hkt: H
): H & {
  <X>(
    x: assume<X, InferredType> | [...assume<X, InferredTuple>]
  ): apply<assume<instanceOf<H>, HKT>, X>
}

type mapInstanceOf<t> = {
  [key in keyof t]: instanceOf<t[key]>
}

const flow = <hkts extends (typeof HKT)[]>(...hkts: hkts) =>
  build(
    class extends HKT {
      new = (x: this["arg"]) =>
        x as unknown as apply<flow<mapInstanceOf<hkts>>, typeof x>
    }
  )

type split<s extends string, delimiter extends string = ""> =
  s extends `${infer head}${delimiter}${infer tail}` ?
    [head, ...split<tail, delimiter>]
  : s extends delimiter ? []
  : [s]

const split = <D extends string>(d: D) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], string>) => x.split(d) as split<typeof x, D>
    }
  )

type join<t extends string[], d extends string> =
  t extends [] ? ""
  : t extends [infer head, ...infer tail] ?
    `${assume<head, string>}${tail extends [] ? "" : d}${join<
      assume<tail, string[]>,
      d
    >}`
  : never

const join = <const J extends string>(j: J) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], string[]>) => x.join(j) as join<typeof x, J>
    }
  )

type includes<t extends readonly unknown[], x> =
  x extends t[number] ? true : false

const includes = <t extends InferredTuple>(array: readonly [...t]) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], InferredType>) =>
        array.includes(x) as includes<t, typeof x>
    }
  )

export type reverse<t extends unknown[]> =
  t extends [] ? []
  : t extends [infer u, ...infer rest] ? [...reverse<rest>, u]
  : never

export type reduce<hkts extends HKT[], x> =
  hkts extends [] ? x
  : hkts extends [infer head, ...infer tail] ?
    apply<assume<head, HKT>, reduce<assume<tail, HKT[]>, x>>
  : never

type compose<hkts extends HKT[], x> =
  hkts extends [] ? x
  : hkts extends [infer head, ...infer tail] ?
    apply<assume<head, HKT>, compose<assume<tail, HKT[]>, x>>
  : never

export interface flow<hkts extends HKT[]> extends HKT {
  new: (x: this["arg"]) => compose<reverse<hkts>, this["arg"]>
}

type InferredType =
  | string
  | number
  | boolean
  | undefined
  | null
  | GenericFunction
  | InferredType[]
  | ReadonlyArray<InferredType>
  | {
      [key: string]: InferredType
    }

type InferredTuple = InferredType[] | ReadonlyArray<InferredType>

type mapTuple<x extends readonly unknown[], f extends HKT> = {
  [k in keyof x]: apply<f, x[k]>
}

const map = <H extends typeof HKT>(hkt: H) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], InferredTuple>) =>
        x.map(v => apply(hkt)(v)) as mapTuple<
          typeof x,
          assume<instanceOf<H>, HKT>
        >
    }
  )

type filterTuple<x extends readonly unknown[], f extends HKT> =
  x extends [] ? []
  : x extends [infer head, ...infer tail] ?
    [
      ...(apply<f, head> extends true ? [head] : []),
      ...filterTuple<assume<tail, readonly unknown[]>, f>
    ]
  : never

const filter = <H extends typeof HKT>(hkt: H) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], InferredTuple>) =>
        x.filter(v => apply(hkt)(v)) as filterTuple<
          typeof x,
          assume<instanceOf<H>, HKT>
        >
    }
  )

type everyTuple<x extends readonly unknown[], f extends HKT> =
  x extends [] ? true
  : x extends [infer head, ...infer tail] ?
    apply<f, head> extends true ?
      everyTuple<tail, f>
    : false
  : never

const every = <H extends typeof HKT>(hkt: H) =>
  build(
    class extends HKT {
      new = (x: assume<this["arg"], InferredTuple>) =>
        x.every(v => apply(hkt)(v)) as everyTuple<
          typeof x,
          assume<instanceOf<H>, HKT>
        >
    }
  )

const isLowercaseWord = flow(
  split(""),
  every(
    includes(
      flow(split(","))("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z")
    )
  )
)

const extractWords = flow(filter(isLowercaseWord), join(",  "))

const result = extractWords(["foo", "bar", "NOPE", "qux"])
