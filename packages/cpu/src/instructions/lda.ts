import { Instruction } from "./instruction";

export const lda = {
  immediate: (): Instruction[] => [
    (state, memory) => state.aRegister = memory.readByte(state.programCounter++),
  ],
  absolute: (): Instruction[] => {
    let low: number;

    return [
      (state, memory) => low = memory.readByte(state.programCounter++),
      (state, memory) => state.aRegister = memory.readByte(low + (memory.readByte(state.programCounter++) << 8)),
    ];
  }
};
