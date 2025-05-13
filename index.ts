// https://code.lol/post/programming/hkt-tacit/
// https://code.lol/post/programming/variadic-hkt-composition/

import * as Math from "./math"
import { one, two, three, four, five, six, zero } from "./primitives"
import { check } from "./utils"

// check(Math.eq(Math.add(six, zero), Math.add(one, five)))
// check(Math.eq(one, Math.add(one, four)))
// check(Math.eq(six, Math.add(one, five)))
// check(Math.isEven(Math.add(one, three)))
// check(Math.isOdd(Math.add(one, three)))
