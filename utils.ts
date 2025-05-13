export function Never(): never {
  throw new Error("what")
}

export function _<T>(t: T): any {
  return t
}
