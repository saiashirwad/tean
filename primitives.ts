import { _, never } from "./utils"

export type assert<T extends true> = T
export function assert<T extends true>(value: T): T {
  return value
}

export type NaturalTuple = 0[]

export class Natural<const tup extends NaturalTuple = any> {
  readonly __tag = "natural"
  constructor(public readonly tup: tup) {}
}

export type succ<value extends Natural> =
  value extends Natural<infer tup> ? Natural<[...tup, 0]> : never
export const succ = <const value extends Natural>(value: value): succ<value> =>
  value instanceof Natural ? _(new Natural([...value.tup, 0])) : never()

export type prev<value extends Natural> =
  value extends Natural<[...infer head extends NaturalTuple, 0]> ? Natural<head>
  : never
export const prev = <const value extends Natural>(value: value): prev<value> =>
  value instanceof Natural ?
    _(new Natural(value.tup.slice(0, value.tup.length - 1)))
  : never()

export const zero = new Natural([])
export type zero = typeof zero

export const one = succ(zero)
export type one = typeof one

export const two = succ(one)
export type two = typeof two

export const three = succ(two)
export type three = typeof three

export const four = succ(three)
export type four = typeof four

export const five = succ(four)
export type five = typeof five

export const six = succ(five)
export type six = typeof six
