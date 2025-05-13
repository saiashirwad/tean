export function never(): never {
  throw new Error("what")
}

export function _<T>(t: T): any {
  return t
}

export function check<T extends true>(t: T) {
  if (t !== true) throw new Error("what")
}
