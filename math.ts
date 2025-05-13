import { succ, Natural, zero, prev, two, three } from "./primitives"
import { _, never } from "./utils"

export type eq<a extends Natural, b extends Natural> =
  a extends zero ?
    b extends zero ?
      true
    : false
  : a extends Natural ?
    b extends Natural ?
      eq<prev<a>, prev<b>>
    : false
  : never

export const eq = <a extends Natural, b extends Natural>(
  a: a,
  b: b
): eq<a, b> =>
  a === zero ?
    b === zero ?
      _(true)
    : _(false)
  : a instanceof Natural ?
    b instanceof Natural ?
      _(eq(prev(a), prev(b)))
    : _(false)
  : never()

export type add<a extends Natural, b extends Natural> = Natural<
  [...a["tup"], ...b["tup"]]
>

export const add = <a extends Natural, b extends Natural>(
  a: a,
  b: b
): add<a, b> => _(new Natural([...a["tup"], ...b["tup"]]))

export type toInt<val extends Natural> = val["tup"]["length"]

export const toInt = <const val extends Natural>(val: val): toInt<val> =>
  val["tup"]["length"]

export type isEven<value extends Natural> =
  value extends zero ? true : isOdd<prev<value>>

export const isEven = <value extends Natural>(value: value): isEven<value> =>
  value === zero ? _(true) : _(isOdd(prev(value)))

export type isOdd<value extends Natural> =
  value extends zero ? false : isEven<prev<value>>

export const isOdd = <value extends Natural>(value: value): isOdd<value> =>
  value === zero ? _(false) : _(isEven(prev(value)))
