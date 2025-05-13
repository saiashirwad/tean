export class True {
  readonly __tag = "True"
}

export class False {
  readonly __tag = "False"
}

export type AssertTrue<T extends True> = T
export function AssertTrue<T extends True>(value: T): T {
  return value
}

export class Zero {
  readonly __tag = "Zero"
}

export class Succ<N> {
  readonly __tag = "Succ"
  constructor(public prev: N) {}
}

export const One = new Succ(new Zero())
export type One = typeof One

export const Two = new Succ(One)
export type Two = typeof Two

export const Three = new Succ(Two)
export type Three = typeof Three

export const Four = new Succ(Three)
export type Four = typeof Four

export const Five = new Succ(Four)
export type Five = typeof Five

export const Six = new Succ(Five)
export type Six = typeof Six
