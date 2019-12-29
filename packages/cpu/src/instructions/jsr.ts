import { Instruction } from "./instruction";

export const jsr = {
  absolute: (): Instruction[] => {
    let low: number;

    return [
      (state, memory) => low = memory.readByte(state.programCounter++),
      (state, memory) => {
        const pc = low + (memory.readByte(state.programCounter++) << 8);

        memory.writeByte(state.stack--, state.programCounter & 0xff);
        memory.writeByte(state.stack--, (state.programCounter >> 8) & 0xff);

        state.programCounter = pc;
      },
    ];
  }
};
