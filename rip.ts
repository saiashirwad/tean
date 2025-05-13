class Zero {
  readonly __tag = "Zero"
}
class Succ<N> {
  readonly __tag = "Succ"
  constructor(public prev: N) {}
}

type Add<A, B> =
  A extends Zero ? B
  : A extends Succ<infer N> ? Succ<Add<N, B>>
  : never

type One = Succ<Zero>
type Two = Succ<One>
type Three = Succ<Two>
type Four = Succ<Three>
type Five = Succ<Four>

type result = Add<Two, Three>
