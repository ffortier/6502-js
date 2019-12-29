import { State } from "../w65c02s";
import { Memory } from "../memory";

export const rts = {
  implied: (state: State, memory: Memory): void => {
    const hi = memory.readByte(++state.stack);
    const low = memory.readByte(++state.stack);

    state.programCounter = (hi << 8) | low;
  }
};
