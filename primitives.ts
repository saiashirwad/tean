export type assert<T extends true> = T
export function assert<T extends true>(value: T): T {
  return value
}

export class succ<n> {
  readonly __tag = "succ"
  constructor(public prev: n) {}
}

export const zero = 0 as const
export type zero = typeof zero

export const one = new succ(zero)
export type one = typeof one

export const two = new succ(one)
export type two = typeof two

export const three = new succ(two)
export type three = typeof three

export const four = new succ(three)
export type four = typeof four

export const five = new succ(four)
export type five = typeof five

export const six = new succ(five)
export type six = typeof six
