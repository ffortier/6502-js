import { State } from "../w65c02s";
import { Memory } from "../memory";

export const pha = {
  implied: (state: State, memory: Memory): void => {
    memory.writeByte(state.stack--, state.aRegister);
  }
};
