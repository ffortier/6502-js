import { State } from "../w65c02s";
import { Memory } from "../memory";

export const pla = {
  implied: (state: State, memory: Memory): void => {
    state.aRegister = memory.readByte(++state.stack);
  }
};
