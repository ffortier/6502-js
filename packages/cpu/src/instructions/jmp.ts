import { Instruction } from "./instruction";

export const jmp = {
  absolute: (): Instruction[] => {
    let low: number;

    return [
      (state, memory) => low = memory.readByte(state.programCounter++),
      (state, memory) => state.programCounter = low + (memory.readByte(state.programCounter) << 8),
    ];
  }
};
