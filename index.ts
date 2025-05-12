type True = "T";
type False = "F";
type AssertTrue<T extends True> = T;

type Zero = { type: "zero" };
type Succ<N> = { type: "succ"; prev: N };
type One = Succ<Zero>;
type Two = Succ<One>;
type Three = Succ<Two>;
type Four = Succ<Three>;
type Five = Succ<Four>;
type Six = Succ<Five>;

type Add<A, B> = A extends Zero
  ? B
  : A extends Succ<infer N>
    ? Succ<Add<N, B>>
    : never;

type Eq<A, B> = A extends Zero
  ? B extends Zero
    ? True
    : False
  : B extends Zero
    ? False
    : A extends Succ<infer NA>
      ? B extends Succ<infer NB>
        ? Eq<NA, NB>
        : False
      : False;

abstract class HKT {
  readonly arg?: unknown;
  fn!: (...x: never[]) => unknown;
}

type Apply<F extends HKT, arg> = ReturnType<(F & { readonly arg: arg })["fn"]>;
type Assume<T, U> = T extends U ? T : U;

type Compose<HKTs extends HKT[], X> = HKTs extends []
  ? X
  : HKTs extends [infer Head, ...infer Tail]
    ? Apply<Assume<Head, HKT>, Compose<Assume<Tail, HKT[]>, X>>
    : never;

type Reverse<T extends unknown[]> = T extends []
  ? []
  : T extends [infer U, ...infer Rest]
    ? [...Reverse<Rest>, U]
    : never;

interface Flow<HKTs extends HKT[]> extends HKT {
  fn: (x: this["arg"]) => Compose<Reverse<HKTs>, this["arg"]>;
}

// ==========
// Parity
// ==========
type Even<N> = N extends Zero
  ? True
  : N extends Succ<infer NN>
    ? Odd<NN>
    : False;

type Odd<N> = N extends Zero
  ? False
  : N extends Succ<infer NN>
    ? Even<NN>
    : False;

interface AddZero extends HKT {
  fn: (n: Assume<this["arg"], any>) => Eq<Add<typeof n, Zero>, typeof n>;
}

// n + m = m + n (commutativity, for fixed m)
interface AddCommHKT<M> extends HKT {
  fn: (n: Assume<this["arg"], any>) => Eq<Add<typeof n, M>, Add<M, typeof n>>;
}

// (a + b) + c = a + (b + c) (associativity, for fixed b, c)
interface AddAssocHKT<B, C> extends HKT {
  fn: (
    a: Assume<this["arg"], any>,
  ) => Eq<Add<Add<typeof a, B>, C>, Add<typeof a, Add<B, C>>>;
}

// n is even
interface EvenHKT extends HKT {
  fn: (n: Assume<this["arg"], any>) => Even<typeof n>;
}

// n is odd
interface OddHKT extends HKT {
  fn: (n: Assume<this["arg"], any>) => Odd<typeof n>;
}

// n + n is even
interface DoubleEvenHKT extends HKT {
  fn: (n: Assume<this["arg"], any>) => Even<Add<typeof n, typeof n>>;
}

// ==========
// Universal Quantification (Forall) for Peano Numbers up to N
// ==========
type ForallPeanoUpTo<N, P extends HKT, Cur = Zero> = Cur extends N
  ? Apply<P, Cur> extends True
    ? True
    : False
  : Apply<P, Cur> extends True
    ? ForallPeanoUpTo<N, P, Succ<Cur>>
    : False;

// ==========
// Existential Quantification (Exists) for Peano Numbers up to N
// ==========
type ExistsPeanoUpTo<N, P extends HKT, Cur = Zero> = Cur extends N
  ? Apply<P, Cur> extends True
    ? True
    : False
  : Apply<P, Cur> extends True
    ? True
    : ExistsPeanoUpTo<N, P, Succ<Cur>>;

// ==========
// Induction Simulation as HKT
// ==========
// InductionHKT: Given a base case and a step HKT, prove up to N
interface InductionHKT<
  Base extends True | False,
  Step extends HKT,
  N,
  Cur = Zero,
> extends HKT {
  fn: (
    x: Assume<this["arg"], any>,
  ) => Cur extends N
    ? Base extends True
      ? True
      : False
    : Apply<Step, Cur> extends True
      ? Apply<InductionHKT<Base, Step, N, Succ<Cur>>, unknown>
      : False;
}

// ==========
// Proof Objects
// ==========
type ProofObject<N, P extends HKT> = { n: N; proof: Apply<P, N> };

// ==========
// Example Usage
// ==========

// 1. Forall n in [0,1,2,3,4,5], n + 0 = n
type ForallAddZeroUpTo5 = ForallPeanoUpTo<Six, AddZero>;
type ProofAddZero = AssertTrue<ForallAddZeroUpTo5>;

// 2. Forall n in [0,1,2,3,4,5], n + 2 = 2 + n (commutativity for m=Two)
type ForallAddComm2UpTo5 = ForallPeanoUpTo<Six, AddCommHKT<Two>>;
type ProofAddComm2 = AssertTrue<ForallAddComm2UpTo5>;

// 3. Forall a in [0,1,2,3,4,5], (a + 2) + 3 = a + (2 + 3) (associativity)
type ForallAddAssoc23UpTo5 = ForallPeanoUpTo<Six, AddAssocHKT<Two, Three>>;
type ProofAddAssoc23 = AssertTrue<ForallAddAssoc23UpTo5>;

// 4. Forall n in [0,1,2,3,4,5], n is even or odd
interface EvenOrOddHKT extends HKT {
  fn: (
    n: Assume<this["arg"], any>,
  ) => Even<typeof n> extends True ? True : Odd<typeof n>;
}
type ForallEvenOrOdd = ForallPeanoUpTo<Six, EvenOrOddHKT>;
type ProofEvenOrOdd = AssertTrue<ForallEvenOrOdd>;

// 5. Exists n in [0,1,2,3,4,5], n + n = Two
interface DoubleIsTwoHKT extends HKT {
  fn: (n: Assume<this["arg"], any>) => Eq<Add<typeof n, typeof n>, Two>;
}
type ExistsDoubleIsTwo = ExistsPeanoUpTo<Six, DoubleIsTwoHKT>;
type ProofExistsDoubleIsTwo = AssertTrue<ExistsDoubleIsTwo>;

// 6. Forall n in [0,1,2,3,4,5], n + n is even
type ForallDoubleEven = ForallPeanoUpTo<Six, DoubleEvenHKT>;
type ProofDoubleEven = AssertTrue<ForallDoubleEven>;

// 7. Proof object: n = Three, proof that n + 0 = n
type ProofForThree = ProofObject<Three, AddZero>; // { n: Three, proof: "T" }

// 8. Compose HKTs: DoubleString then AppendInner<"foo">
interface DoubleString extends HKT {
  fn: (x: Assume<this["arg"], string>) => `${typeof x}${typeof x}`;
}
interface AppendInner<Suffix extends string> extends HKT {
  fn: (x: Assume<this["arg"], string>) => `${Suffix}${typeof x}`;
}
type ComposeExample = Apply<Flow<[AppendInner<"foo">, DoubleString]>, "bar">; // "foobarbar"

interface AddZeroBaseHKT extends HKT {
  fn: (n: Assume<this["arg"], Zero>) => Eq<Add<typeof n, Zero>, typeof n>;
}
