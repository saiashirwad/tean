import { succ } from "./primitives"
import { _, never } from "./utils"

export type eq<a, b> =
  a extends 0 ?
    b extends 0 ?
      true
    : false
  : a extends succ<infer APrev> ?
    b extends succ<infer BPrev> ?
      eq<APrev, BPrev>
    : false
  : never

export const eq = <a, b>(a: a, b: b): eq<a, b> =>
  a === 0 ?
    b === 0 ?
      _(true)
    : _(false)
  : a instanceof succ ?
    b instanceof succ ?
      _(eq(a.prev, b.prev))
    : _(false)
  : never()

export type add<a, b> =
  a extends 0 ? b
  : a extends succ<infer aPrev> ? succ<add<aPrev, b>>
  : never

export const add = <a, b>(a: a, b: b): add<a, b> =>
  a === 0 ? _(b)
  : a instanceof succ ? _(new succ(add(a.prev, b)))
  : never()

export type toInt<n, acc extends 0[] = []> =
  n extends 0 ? acc["length"]
  : n extends succ<infer nPrev> ? toInt<nPrev, [...acc, 0]>
  : never

export const toInt = <n>(n: n, acc: 0[] = []): toInt<n> =>
  n === 0 ? _(acc["length"])
  : n instanceof succ ? _(toInt(n.prev, [...acc, 0]))
  : never()
