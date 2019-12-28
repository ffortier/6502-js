import { State } from "../w65c02s";
import { Memory } from "../memory";

export type Instruction<R = void> = (state: State, memory: Memory) => R
