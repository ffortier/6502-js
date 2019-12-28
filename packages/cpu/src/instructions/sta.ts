import { Instruction } from "./instruction";

export const sta = {
  absolute: (): Instruction[] => {
    let low: number;

    return [
      (state, memory) => low = memory.readByte(state.programCounter++),
      (state, memory) => memory.writeByte(low + (memory.readByte(state.programCounter++) << 8), state.aRegister),
    ];
  }
};
