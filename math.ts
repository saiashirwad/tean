import { succ, natural, zero, prev, two, three } from "./primitives"
import { _, never } from "./utils"

export type eq<a extends natural, b extends natural> =
  a extends zero ?
    b extends zero ?
      true
    : false
  : a extends natural ?
    b extends natural ?
      eq<prev<a>, prev<b>>
    : false
  : never

export const eq = <a extends natural, b extends natural>(a: a, b: b): eq<a, b> =>
  a === zero ?
    b === zero ?
      _(true)
    : _(false)
  : a instanceof natural ?
    b instanceof natural ?
      _(eq(prev(a), prev(b)))
    : _(false)
  : never()

export type add<a extends natural, b extends natural> = natural<[...a["tup"], ...b["tup"]]>

export const add = <a extends natural, b extends natural>(a: a, b: b): add<a, b> =>
  _(new natural([...a["tup"], ...b["tup"]]))

export type toInt<val extends natural> = val["tup"]["length"]

export const toInt = <const val extends natural>(val: val): toInt<val> => val["tup"]["length"]
