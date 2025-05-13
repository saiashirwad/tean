import { False, Succ, True, Zero } from "./primitives"
import { _, Never } from "./utils"

export type Add<A, B> =
  A extends Zero ? B
  : A extends Succ<infer N> ? Succ<Add<N, B>>
  : never

export type Eq<A, B> =
  A extends Zero ?
    B extends Zero ?
      True
    : False
  : B extends Zero ? False
  : A extends Succ<infer NA> ?
    B extends Succ<infer NB> ?
      Eq<NA, NB>
    : False
  : False

export const Add = <A, B>(a: A, b: B): Add<A, B> =>
  a instanceof Zero ? _(b)
  : a instanceof Succ ? _(new Succ(Add(a.prev, b)))
  : Never()

export const Eq = <A, B>(A: A, B: B): Eq<A, B> =>
  A instanceof Zero ?
    B instanceof Zero ?
      _(new True())
    : _(new False())
  : A instanceof Succ ?
    B instanceof Succ ?
      _(Eq(A.prev, B.prev))
    : _(new False())
  : Never()

type ToInt<N> =
  N extends Zero ? 0
  : N extends Succ<infer Prev> ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][ToInt<Prev>]
  : never

const ToInt = <N>(n: N): ToInt<N> =>
  n instanceof Zero ? _(0 as any)
  : n instanceof Succ ? _((ToInt(n.prev) + 1) as any)
  : Never()
